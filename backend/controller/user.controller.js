import {
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
  AdminGetUserCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  RevokeTokenCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getCognitoClient } from "../api/cognito.js";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { getDriveClient } from "../api/googleClients.js";
import * as XLSX from "xlsx";

const getRefreshTokenCookieOptions = (remember = false) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
  };
  if (remember) {
    options.maxAge = 30 * 24 * 60 * 60; // 30 days
  }
  return options;
};

const getRememberCookieOptions = (remember = false) => {
  const options = {
    httpOnly: false,
    secure: true,
    sameSite: "Lax",
    path: "/",
  };
  if (remember) {
    options.maxAge = 30 * 24 * 60 * 60; // 30 days
  }
  return options;
};

export const signInController = async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.text("Unauthorized", 401);
  }

  let remember = false;
  try {
    const body = await c.req.json();
    remember = !!body.remember;
  } catch {
    // Body might be empty, ignore
  }

  const auth = new Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const phone = auth[0];
  const password = auth[1];

  console.log("PHONE: ", phone);
  console.log("Sign In requested");

  const env = c.env;
  const AWS_COGNITO_CLIENT_ID = env.AWS_COGNITO_CLIENT_ID;
  const cognitoClient = getCognitoClient(env);

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: AWS_COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: "+1" + phone,
      PASSWORD: password,
    },
  };

  const command = new InitiateAuthCommand(params);

  try {
    const response = await cognitoClient.send(command);
    const accessToken = response.AuthenticationResult.AccessToken;
    const refreshToken = response.AuthenticationResult.RefreshToken;
    const idToken = response.AuthenticationResult.IdToken;

    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64"),
    );
    const group = payload["cognito:groups"]?.[0] || null;

    if (refreshToken) {
      setCookie(
        c,
        "refreshToken",
        refreshToken,
        getRefreshTokenCookieOptions(remember),
      );
      if (remember) {
        setCookie(c, "remember", "true", getRememberCookieOptions(true));
      } else {
        deleteCookie(c, "remember", { path: "/" });
      }
    }

    return c.json({
      accessToken: accessToken,
      idToken: idToken,
      refreshToken: refreshToken,
      group: group,
      remember: !!remember,
    });
  } catch (error) {
    console.log(error);
    return c.body(null, 403);
  }
};

export const refreshSignInController = async (c) => {
  console.log("Refresh Sign In requested");
  const cookieRefreshToken = getCookie(c, "refreshToken");
  let bodyRefreshToken = null;

  try {
    const body = await c.req.json();
    bodyRefreshToken = body?.refreshToken;
  } catch {
    // Body might be empty, which is expected when using cookies
  }

  const tokenToUse = cookieRefreshToken || bodyRefreshToken;

  if (!tokenToUse) {
    return c.json({ error: "No refresh token provided" }, 401);
  }

  const env = c.env;
  const AWS_COGNITO_CLIENT_ID = env.AWS_COGNITO_CLIENT_ID;
  const cognitoClient = getCognitoClient(env);

  const params = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: AWS_COGNITO_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: tokenToUse,
    },
  };

  const command = new InitiateAuthCommand(params);

  try {
    const response = await cognitoClient.send(command);
    const accessToken = response.AuthenticationResult.AccessToken;
    const newRefreshToken = response.AuthenticationResult.RefreshToken;
    const idToken = response.AuthenticationResult.IdToken;
    const group =
      JSON.parse(Buffer.from(accessToken.split(".")[1], "base64"))[
        "cognito:groups"
      ]?.[0] || null;

    const isRemembered = getCookie(c, "remember") === "true";
    const tokenToPersist = newRefreshToken || tokenToUse;
    setCookie(
      c,
      "refreshToken",
      tokenToPersist,
      getRefreshTokenCookieOptions(isRemembered),
    );
    if (isRemembered) {
      setCookie(c, "remember", "true", getRememberCookieOptions(true));
    }

    return c.json({
      accessToken: accessToken,
      idToken: idToken,
      refreshToken: tokenToPersist,
      group: group,
      remember: isRemembered,
    });
  } catch (error) {
    console.log(error);
    return c.body(null, 403);
  }
};

let sheetCache = {
  rows: null,
  lastFetch: 0,
};
const CACHE_TTL = 3600 * 1000; // 1 hour

const checkUserInSheet = async (env, name, phone) => {
  let rows;
  const now = Date.now();

  if (sheetCache.rows && now - sheetCache.lastFetch < CACHE_TTL) {
    rows = sheetCache.rows;
  } else {
    try {
      const drive = getDriveClient(env, [
        "https://www.googleapis.com/auth/drive.readonly",
      ]);
      const fileId = "1Uk154FmBfVHIcv8xU5V_CuTBte4QXn6D";

      // 1. Download the file as a buffer (binary data)
      const response = await drive.files.get(
        { fileId, alt: "media" },
        { responseType: "arraybuffer" },
      );

      // 2. Parse the buffer
      const workbook = XLSX.read(response.data, { type: "buffer" });

      // 3. Get the first sheet's data as an array of arrays
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rows && rows.length > 0) {
        sheetCache.rows = rows;
        sheetCache.lastFetch = now;
      }
    } catch (error) {
      console.error("Drive/Excel API Error:", error);
      return false;
    }
  }

  if (!rows || rows.length === 0) {
    return false;
  }

  const matchFound = rows.some((row) => {
    const rowNameRaw = row[1]; // Column B
    const rowPhoneRaw = row[9]; // Column J
    const statusRaw = row[3];

    const rowName = rowNameRaw?.toString().trim();
    const rowPhoneClean = rowPhoneRaw?.toString().replace(/\D/g, "");
    const status = statusRaw?.toString().trim();

    const inputName = name.trim();
    const inputPhoneClean = phone.replace(/\D/g, "");

    const isNameMatch = rowName === inputName;
    const isPhoneMatch = rowPhoneClean === inputPhoneClean;
    const isNotRemoved = status !== "제적";

    return isNameMatch && isPhoneMatch && isNotRemoved;
  });

  return matchFound;
};

export const signUpController = async (c) => {
  const body = await c.req.json();
  const env = c.env;

  try {
    const member = await checkUserInSheet(env, body.name, body.phone);

    if (!member) {
      return c.json({ error: "NonMemberException" }, 403);
    }

    console.log("Member verified, proceeding to Cognito...");
  } catch (err) {
    console.error("Authorization check failed:", err);
    return c.json({ error: "InternalServerError" }, 500);
  }

  const AWS_COGNITO_CLIENT_ID = env.AWS_COGNITO_CLIENT_ID;
  const cognitoClient = getCognitoClient(env);

  const params = {
    ClientId: AWS_COGNITO_CLIENT_ID,
    Username: "+1" + body.phone,
    Password: body.password,
    UserAttributes: [
      {
        Name: "name",
        Value: body.name,
      },
    ],
  };

  const command = new SignUpCommand(params);
  try {
    const response = await cognitoClient.send(command);
    console.log(response);
    return c.json(response);
  } catch (error) {
    console.log(error);
    return c.json(
      {
        error: error.name,
        message: error.message,
      },
      error.$metadata?.httpStatusCode || 400,
    );
  }
};

export const confirmSignUpController = async (c) => {
  const body = await c.req.json();
  const env = c.env;
  const AWS_COGNITO_CLIENT_ID = env.AWS_COGNITO_CLIENT_ID;
  const cognitoClient = getCognitoClient(env);

  const input = {
    ClientId: AWS_COGNITO_CLIENT_ID,
    Username: "+1" + body.phone,
    ConfirmationCode: body.confirmCode,
  };
  const command = new ConfirmSignUpCommand(input);

  try {
    const response = await cognitoClient.send(command);
    return c.json(response);
  } catch (error) {
    console.log(error);
    return c.json(
      {
        error: error.name,
        message: error.message,
      },
      error.$metadata?.httpStatusCode || 400,
    );
  }
};

export const requestConfirmController = async (c) => {
  const phone = c.req.query("phone");
  console.log(phone);
  const username = "+1" + phone;

  const env = c.env;
  const AWS_COGNITO_CLIENT_ID = env.AWS_COGNITO_CLIENT_ID;
  const cognitoClient = getCognitoClient(env);

  try {
    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
      Username: username,
    });
    const user = await cognitoClient.send(getUserCommand);

    if (user.UserStatus === "CONFIRMED") {
      return c.json(
        {
          error: "UserAlreadyConfirmedException",
          message: "이미 인증이 완료된 회원입니다.",
        },
        400,
      );
    }
  } catch (error) {
    if (error.name === "UserNotFoundException") {
      return c.json(
        {
          error: "UserNotFoundException",
          message: "등록되지 않은 회원입니다.",
        },
        404,
      );
    }
    console.error("Error checking user status:", error);
  }

  const input = {
    ClientId: AWS_COGNITO_CLIENT_ID,
    Username: username,
  };
  const command = new ResendConfirmationCodeCommand(input);

  try {
    const response = await cognitoClient.send(command);
    console.log(response);
    return c.json(response);
  } catch (error) {
    console.log(error);
    return c.json(
      {
        error: error.name,
        message: error.message,
      },
      error.$metadata?.httpStatusCode || 400,
    );
  }
};

export const signOutController = async (c) => {
  const env = c.env;
  const cognitoClient = getCognitoClient(env);
  const refreshToken = getCookie(c, "refreshToken");

  if (refreshToken) {
    try {
      const command = new RevokeTokenCommand({
        ClientId: env.AWS_COGNITO_CLIENT_ID,
        Token: refreshToken,
      });
      await cognitoClient.send(command);
    } catch (error) {
      console.warn("RevokeToken warning:", error.message);
    }
  }

  deleteCookie(c, "refreshToken", { path: "/" });
  deleteCookie(c, "remember", { path: "/" });

  return c.body(null, 200);
};

export const forgotPasswordController = async (c) => {
  const body = await c.req.json();
  const phone = body.phone;
  const username = "+1" + phone;

  const env = c.env;
  const AWS_COGNITO_CLIENT_ID = env.AWS_COGNITO_CLIENT_ID;
  const cognitoClient = getCognitoClient(env);

  const input = {
    ClientId: AWS_COGNITO_CLIENT_ID,
    Username: username,
  };
  const command = new ForgotPasswordCommand(input);

  try {
    const response = await cognitoClient.send(command);
    console.log(response);
    return c.json(response);
  } catch (error) {
    console.log(error);
    return c.json(
      {
        error: error.name,
        message: error.message,
      },
      error.$metadata?.httpStatusCode || 400,
    );
  }
};

export const confirmForgotPasswordController = async (c) => {
  const body = await c.req.json();
  const phone = body.phone;
  const username = "+1" + phone;
  const code = body.confirmCode;
  const password = body.password;

  const env = c.env;
  const AWS_COGNITO_CLIENT_ID = env.AWS_COGNITO_CLIENT_ID;
  const cognitoClient = getCognitoClient(env);

  const input = {
    ClientId: AWS_COGNITO_CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
    Password: password,
  };
  const command = new ConfirmForgotPasswordCommand(input);

  try {
    const response = await cognitoClient.send(command);
    console.log(response);
    return c.json(response);
  } catch (error) {
    console.log(error);
    return c.json(
      {
        error: error.name,
        message: error.message,
      },
      error.$metadata?.httpStatusCode || 400,
    );
  }
};
