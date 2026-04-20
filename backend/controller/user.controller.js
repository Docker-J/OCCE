import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { google } from "googleapis";
import path from "path";
import * as XLSX from "xlsx";

const KEY_PATH = path.join(process.cwd(), "church-4385c-ceedf27e8d20.json");

const AWS_COGNITO_CLIENT_ID = process.env.AWS_COGNITO_CLIENT_ID;

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const signInController = async (req, res) => {
  const auth = new Buffer.from(
    req.header("Authorization").split(" ")[1],
    "base64",
  )
    .toString()
    .split(":");
  const phone = auth[0];
  const password = auth[1];

  console.log("PHONE: ", phone);

  console.log("Sign In requested");
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

    res.send({
      accessToken: accessToken,
      refreshToken: refreshToken,
      group: group,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
};

export const refreshSignInController = async (req, res) => {
  console.log("Sign In requested");

  const params = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: AWS_COGNITO_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: req.params.refreshToken,
    },
  };

  const command = new InitiateAuthCommand(params);

  try {
    const response = await cognitoClient.send(command);
    const accessToken = response.AuthenticationResult.AccessToken;
    const newRefreshToken = response.AuthenticationResult.RefreshToken;
    const group = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64"))[
      "cognito:groups"
    ][0];

    res.send({
      accessToken: accessToken,
      refreshToken: newRefreshToken,
      group: group,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
};

let sheetCache = {
  rows: null,
  lastFetch: 0,
};
const CACHE_TTL = 3600 * 1000; // 1 hour

const checkUserInSheet = async (name, phone) => {
  let rows;
  const now = Date.now();

  if (sheetCache.rows && now - sheetCache.lastFetch < CACHE_TTL) {
    rows = sheetCache.rows;
  } else {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_PATH,
      // Note: We switch the scope to drive.readonly
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    // Use the drive client instead of sheets
    const drive = google.drive({ version: "v3", auth });
    const fileId = "1Uk154FmBfVHIcv8xU5V_CuTBte4QXn6D";

    try {
      // 1. Download the file as a buffer (binary data)
      const response = await drive.files.get(
        { fileId, alt: "media" },
        { responseType: "arraybuffer" },
      );

      // 2. Parse the buffer
      const workbook = XLSX.read(response.data, { type: "buffer" });

      // 3. Get the first sheet's data as an array of arrays (like your original rows)
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // 'header: 1' makes it return an array of arrays (index 0 = A, 1 = B, etc.)
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

  // 4. Use your existing logic to find a match
  const matchFound = rows.some((row) => {
    // 1. Get raw values from the row (adjust indices if columns changed)
    const rowNameRaw = row[1]; // Column A
    const rowPhoneRaw = row[9]; // Column B (e.g., "111-111-1111")
    const statusRaw = row[3];

    // 2. Normalize the Excel Data
    // Convert to string, trim whitespace, and lowercase for name
    const rowName = rowNameRaw?.toString().trim();
    // Remove hyphens and all other non-digits from the Excel phone number
    const rowPhoneClean = rowPhoneRaw?.toString().replace(/\D/g, "");
    const status = statusRaw?.toString().trim();

    // 3. Normalize the Input Data (from req.body)
    const inputName = name.trim();
    const inputPhoneClean = phone.replace(/\D/g, "");

    // 4. Compare
    const isNameMatch = rowName === inputName;
    const isPhoneMatch = rowPhoneClean === inputPhoneClean;
    const isNotRemoved = status !== "제적";

    return isNameMatch && isPhoneMatch && isNotRemoved;
  });

  return matchFound;
};

export const signUpController = async (req, res) => {
  //Check if the requested user is a member of the church
  try {
    const member = await checkUserInSheet(req.body.name, req.body.phone);

    if (!member) {
      return res.status(403).json({
        error: "NonMemberException",
      });
    }

    // Only if the member exists will the code reach here (the Cognito logic)
    console.log("Member verified, proceeding to Cognito...");
  } catch (err) {
    console.error("Authorization check failed:", err);
    return res.status(500).json({ error: "InternalServerError" });
  }

  const params = {
    ClientId: AWS_COGNITO_CLIENT_ID,
    Username: "+1" + req.body.phone,
    Password: req.body.password,
    UserAttributes: [
      {
        Name: "name",
        Value: req.body.name,
      },
    ],
  };

  const command = new SignUpCommand(params);
  try {
    const response = await cognitoClient.send(command);
    console.log(response);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(error.$metadata?.httpStatusCode || 400).json({
      error: error.name,
      message: error.message,
    });
  }
};

export const confimrSignUpController = async (req, res) => {
  const input = {
    ClientId: AWS_COGNITO_CLIENT_ID,
    Username: "+1" + req.body.phone, // required
    ConfirmationCode: req.body.confirmCode, // required
  };
  const command = new ConfirmSignUpCommand(input);

  try {
    const response = await cognitoClient.send(command);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(error.$metadata?.httpStatusCode || 400).json({
      error: error.name,
      message: error.message,
    });
  }
};

export const requestConfirmController = async (req, res) => {
  console.log(req.query.phone);
  const input = {
    // ResendConfirmationCodeRequest
    ClientId: AWS_COGNITO_CLIENT_ID,
    Username: "+1" + req.query.phone, // required
  };
  const command = new ResendConfirmationCodeCommand(input);

  try {
    const response = await cognitoClient.send(command);
    console.log(response);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(error.$metadata?.httpStatusCode || 400).json({
      error: error.name,
      message: error.message,
    });
  }
};

export const signOutController = async (req, res) => {
  const command = new GlobalSignOutCommand({
    AccessToken: req.header("Authorization").split(" ")[1],
  });

  try {
    await cognitoClient.send(command);
    res.sendStatus(200);
  } catch (error) {
    // res.sendStatus(401);
    console.log(error);
    res.send(error);
  }
};
