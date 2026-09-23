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
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return c.json(
      { error: "Unauthorized", message: "Missing or invalid Basic Authorization header." },
      401
    );
  }

  let remember = false;
  try {
    const body = await c.req.json();
    remember = !!body.remember;
  } catch {
    // Body might be empty, ignore
  }

  const base64Credentials = authHeader.slice(6).trim();
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
  const colonIndex = credentials.indexOf(":");

  if (colonIndex === -1) {
    return c.json(
      { error: "InvalidCredentials", message: "Malformed credentials format." },
      400
    );
  }

  const phone = credentials.slice(0, colonIndex);
  const password = credentials.slice(colonIndex + 1);

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

    // Link cognito_sub and ensure is_registered = 1 in D1
    if (payload?.sub && phone) {
      try {
        const rawPhone = phone.replace(/\D/g, "");
        const clean10 = rawPhone.length === 11 && rawPhone.startsWith("1") ? rawPhone.slice(1) : rawPhone;
        const clean11 = "1" + clean10;

        let memberName = "";
        if (idToken) {
          try {
            const idPayload = JSON.parse(
              Buffer.from(idToken.split(".")[1], "base64").toString("utf-8")
            );
            memberName = (idPayload.name || "").trim();
          } catch (e) {
            console.warn("Could not parse idToken payload for name:", e);
          }
        }

        if (memberName) {
          c.executionCtx?.waitUntil?.(
            env.DB.prepare(
              `UPDATE church_members 
               SET is_registered = 1, cognito_sub = ? 
               WHERE name = ? AND (phone_clean = ? OR phone_clean = ?) AND status != 'REMOVED'`
            ).bind(payload.sub, memberName, clean10, clean11).run()
          );
        } else {
          // If name claim is absent, only update if phone uniquely belongs to a single member
          c.executionCtx?.waitUntil?.(
            (async () => {
              const matchedMembers = await env.DB.prepare(
                `SELECT id FROM church_members 
                 WHERE (phone_clean = ? OR phone_clean = ?) AND status != 'REMOVED'`
              ).bind(clean10, clean11).all();

              if (matchedMembers?.results?.length === 1) {
                await env.DB.prepare(
                  `UPDATE church_members 
                   SET is_registered = 1, cognito_sub = ? 
                   WHERE id = ?`
                ).bind(payload.sub, matchedMembers.results[0].id).run();
              }
            })()
          );
        }
      } catch (linkErr) {
        console.warn("Could not link member cognito_sub in D1:", linkErr.message);
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
    console.error("signInController error:", error);
    return c.json(
      {
        error: error.name || "AuthenticationFailed",
        message: error.message || "Sign in failed.",
      },
      error.$metadata?.httpStatusCode || 403
    );
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
    console.error("refreshSignInController error:", error);
    return c.json(
      {
        error: error.name || "RefreshFailed",
        message: error.message || "Failed to refresh authentication session.",
      },
      error.$metadata?.httpStatusCode || 403
    );
  }
};

export const verifyMemberInD1 = async (env, name, phone) => {
  const rawDigits = (phone || "").replace(/\D/g, "");
  const clean10 = rawDigits.length === 11 && rawDigits.startsWith("1") ? rawDigits.slice(1) : rawDigits;
  const clean11 = "1" + clean10;
  const trimmedName = (name || "").trim();

  if (!trimmedName || !clean10) return null;

  try {
    const member = await env.DB.prepare(
      `SELECT id, household_id, name, phone_clean, position, status 
       FROM church_members 
       WHERE name = ? AND (phone_clean = ? OR phone_clean = ?) AND status != 'REMOVED' 
       LIMIT 1`
    ).bind(trimmedName, clean10, clean11).first();

    return member || null;
  } catch (err) {
    console.error("D1 Member Verification Error:", err);
    throw err;
  }
};

export const signUpController = async (c) => {
  const body = await c.req.json();
  const env = c.env;

  try {
    const member = await verifyMemberInD1(env, body.name, body.phone);

    if (!member) {
      return c.json({ error: "NonMemberException" }, 403);
    }

    console.log("Member verified via D1, proceeding to Cognito...");
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

    // Mark member as registered in D1 upon confirmed sign up
    if (body.phone) {
      try {
        const rawDigits = body.phone.replace(/\D/g, "");
        const clean10 = rawDigits.length === 11 && rawDigits.startsWith("1") ? rawDigits.slice(1) : rawDigits;
        const clean11 = "1" + clean10;
        let memberName = (body.name || "").trim();

        c.executionCtx?.waitUntil?.(
          (async () => {
            if (!memberName) {
              try {
                const getUserCmd = new AdminGetUserCommand({
                  UserPoolId: env.AWS_COGNITO_USER_POOL_ID,
                  Username: "+1" + clean10,
                });
                const userData = await cognitoClient.send(getUserCmd);
                const nameAttr = userData.UserAttributes?.find((a) => a.Name === "name");
                if (nameAttr?.Value) {
                  memberName = nameAttr.Value.trim();
                }
              } catch (e) {
                console.warn("Could not fetch user name from Cognito during confirmSignUp:", e.message);
              }
            }

            if (memberName) {
              await env.DB.prepare(
                `UPDATE church_members 
                 SET is_registered = 1 
                 WHERE name = ? AND (phone_clean = ? OR phone_clean = ?) AND status != 'REMOVED'`
              ).bind(memberName, clean10, clean11).run();
            } else {
              const matched = await env.DB.prepare(
                `SELECT id FROM church_members 
                 WHERE (phone_clean = ? OR phone_clean = ?) AND status != 'REMOVED'`
              ).bind(clean10, clean11).all();
              if (matched?.results?.length === 1) {
                await env.DB.prepare(
                  `UPDATE church_members SET is_registered = 1 WHERE id = ?`
                ).bind(matched.results[0].id).run();
              }
            }
          })()
        );
      } catch (dbErr) {
        console.warn("Could not mark member as is_registered in D1:", dbErr.message);
      }
    }

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
