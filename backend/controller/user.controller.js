import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
  AdminGetUserCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { google } from "googleapis";
import * as XLSX from "xlsx";
import { getGoogleAuth } from "../api/googleAuth.js";

// Helper to get Cognito Client dynamically
const getCognitoClient = (env) => {
  return new CognitoIdentityProviderClient({
    region: env.AWS_REGION || "us-west-2",
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
};

export const signInController = async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.text("Unauthorized", 401);
  }

  const auth = new Buffer.from(
    authHeader.split(" ")[1],
    "base64",
  )
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

    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64"),
    );
    const group = payload["cognito:groups"]?.[0] || null;

    return c.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      group: group,
    });
  } catch (error) {
    console.log(error);
    return c.body(null, 403);
  }
};

export const refreshSignInController = async (c) => {
  console.log("Sign In requested");
  const body = await c.req.json();

  const env = c.env;
  const AWS_COGNITO_CLIENT_ID = env.AWS_COGNITO_CLIENT_ID;
  const cognitoClient = getCognitoClient(env);

  const params = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: AWS_COGNITO_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: body.refreshToken,
    },
  };

  const command = new InitiateAuthCommand(params);

  try {
    const response = await cognitoClient.send(command);
    const accessToken = response.AuthenticationResult.AccessToken;
    const newRefreshToken = response.AuthenticationResult.RefreshToken;
    const group =
      JSON.parse(Buffer.from(accessToken.split(".")[1], "base64"))[
        "cognito:groups"
      ]?.[0] || null;

    return c.json({
      accessToken: accessToken,
      refreshToken: newRefreshToken,
      group: group,
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
      const auth = getGoogleAuth(env, ["https://www.googleapis.com/auth/drive.readonly"]);
      const drive = google.drive({ version: "v3", auth });
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
      error.$metadata?.httpStatusCode || 400
    );
  }
};

export const confimrSignUpController = async (c) => {
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
      error.$metadata?.httpStatusCode || 400
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
        400
      );
    }
  } catch (error) {
    if (error.name === "UserNotFoundException") {
      return c.json(
        {
          error: "UserNotFoundException",
          message: "등록되지 않은 회원입니다.",
        },
        404
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
      error.$metadata?.httpStatusCode || 400
    );
  }
};

export const signOutController = async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.body(null, 401);
  }

  const env = c.env;
  const cognitoClient = getCognitoClient(env);

  const command = new GlobalSignOutCommand({
    AccessToken: authHeader.split(" ")[1],
  });

  try {
    await cognitoClient.send(command);
    return c.body(null, 200);
  } catch (error) {
    console.log(error);
    return c.json(error);
  }
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
      error.$metadata?.httpStatusCode || 400
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
      error.$metadata?.httpStatusCode || 400
    );
  }
};
