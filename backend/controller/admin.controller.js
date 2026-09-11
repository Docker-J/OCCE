import {
  ListUsersCommand,
  ListUsersInGroupCommand,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminEnableUserCommand,
  AdminDisableUserCommand,
  AdminDeleteUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminDeleteUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getCognitoClient } from "../api/cognito.js";
import { getDocClient } from "../api/dynamodb.js";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

/**
 * GET /api/admin/users
 * Lists all registered users and annotates GardenKeeper status
 */
export const listUsersController = async (c) => {
  try {
    const env = c.env;
    const userPoolId = env.AWS_COGNITO_USER_POOL_ID;

    if (!userPoolId) {
      return c.json(
        { error: "ConfigError", message: "AWS_COGNITO_USER_POOL_ID is not configured." },
        500,
      );
    }

    const client = getCognitoClient(env);

    // Fetch all Cognito users across all pages (Cognito returns max 60 per request)
    const fetchAllUsers = async () => {
      const all = [];
      let token = undefined;
      do {
        const res = await client.send(
          new ListUsersCommand({
            UserPoolId: userPoolId,
            Limit: 60,
            PaginationToken: token,
          }),
        );
        if (res.Users && res.Users.length > 0) {
          all.push(...res.Users);
        }
        token = res.PaginationToken;
      } while (token);
      return all;
    };

    // Fetch all group members across all pages for a given group
    const fetchAllGroupUsers = async (groupName) => {
      const all = [];
      let token = undefined;
      do {
        try {
          const res = await client.send(
            new ListUsersInGroupCommand({
              UserPoolId: userPoolId,
              GroupName: groupName,
              Limit: 60,
              NextToken: token,
            }),
          );
          if (res.Users && res.Users.length > 0) {
            all.push(...res.Users);
          }
          token = res.NextToken;
        } catch (err) {
          console.warn(`Could not list ${groupName} group members:`, err.message);
          break;
        }
      } while (token);
      return all;
    };

    // Fetch active notification subscriptions from DynamoDB FCMToken table
    const fetchActiveNotificationSubs = async () => {
      try {
        const docClient = getDocClient(env);
        const res = await docClient.send(
          new ScanCommand({
            TableName: "FCMToken",
            ProjectionExpression: "#sub",
            ExpressionAttributeNames: { "#sub": "sub" },
          }),
        );
        return new Set(
          (res.Items || [])
            .map((item) => (item.sub?.S ? item.sub.S : item.sub))
            .filter(Boolean),
        );
      } catch (err) {
        console.warn("Could not scan FCM tokens for user notification status:", err.message);
        return new Set();
      }
    };

    // Run user list, group lists (GardenKeeper & Staff), and active FCM tokens fetch in parallel
    const [allCognitoUsers, allKeeperUsers, allStaffUsers, activeNotificationSubs] =
      await Promise.all([
        fetchAllUsers(),
        fetchAllGroupUsers("GardenKeeper"),
        fetchAllGroupUsers("Staff"),
        fetchActiveNotificationSubs(),
      ]);

    const keeperUsernames = new Set(allKeeperUsers.map((u) => u.Username));
    const staffUsernames = new Set(allStaffUsers.map((u) => u.Username));

    const users = allCognitoUsers.map((u) => {
      const attrs = {};
      (u.Attributes || []).forEach((attr) => {
        attrs[attr.Name] = attr.Value;
      });

      return {
        username: u.Username,
        name: attrs.name || "",
        phone: attrs.phone_number || u.Username,
        phoneVerified: attrs.phone_number_verified === "true",
        email: attrs.email || "",
        emailVerified: attrs.email_verified === "true",
        sub: attrs.sub || "",
        isStaff: staffUsernames.has(u.Username),
        isGardenKeeper: keeperUsernames.has(u.Username),
        hasNotification: activeNotificationSubs.has(attrs.sub),
        garden: attrs["custom:garden"] || "",
        enabled: u.Enabled ?? true,
        status: u.UserStatus,
        createdAt: u.UserCreateDate,
        modifiedAt: u.UserLastModifiedDate,
      };
    });

    // Default sorting: newer users first, then by name
    users.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return c.json({
      total: users.length,
      staffCount: staffUsernames.size,
      keepers: keeperUsernames.size,
      users,
    });
  } catch (error) {
    console.error("listUsersController error:", error);
    return c.json(
      { error: "FetchUsersError", message: "교인 목록을 불러오는 중 오류가 발생했습니다: " + error.message },
      500,
    );
  }
};

/**
 * POST /api/admin/users/:username/role
 * Assigns, updates gardens, or removes the 'GardenKeeper' role for a user
 */
export const updateUserRoleController = async (c) => {
  try {
    const env = c.env;
    const userPoolId = env.AWS_COGNITO_USER_POOL_ID;
    const username = decodeURIComponent(c.req.param("username"));
    const { action, gardens } = await c.req.json();

    if (!username || !["assign", "update_gardens", "remove"].includes(action)) {
      return c.json(
        { error: "InvalidRequest", message: "유효하지 않은 요청 파라미터입니다." },
        400,
      );
    }

    const client = getCognitoClient(env);
    const gardensStr = Array.isArray(gardens)
      ? gardens.map((g) => g.trim()).filter(Boolean).join(", ")
      : (gardens || "").trim();

    if (action === "assign") {
      await client.send(
        new AdminAddUserToGroupCommand({
          UserPoolId: userPoolId,
          Username: username,
          GroupName: "GardenKeeper",
        }),
      );

      if (gardensStr) {
        await client.send(
          new AdminUpdateUserAttributesCommand({
            UserPoolId: userPoolId,
            Username: username,
            UserAttributes: [
              {
                Name: "custom:garden",
                Value: gardensStr,
              },
            ],
          }),
        );
      }
    } else if (action === "update_gardens") {
      await client.send(
        new AdminUpdateUserAttributesCommand({
          UserPoolId: userPoolId,
          Username: username,
          UserAttributes: [
            {
              Name: "custom:garden",
              Value: gardensStr,
            },
          ],
        }),
      );
    } else if (action === "remove") {
      await client.send(
        new AdminRemoveUserFromGroupCommand({
          UserPoolId: userPoolId,
          Username: username,
          GroupName: "GardenKeeper",
        }),
      );

      try {
        await client.send(
          new AdminDeleteUserAttributesCommand({
            UserPoolId: userPoolId,
            Username: username,
            UserAttributeNames: ["custom:garden"],
          }),
        );
      } catch (delErr) {
        // Fallback: update attribute to empty string if delete is not supported
        try {
          await client.send(
            new AdminUpdateUserAttributesCommand({
              UserPoolId: userPoolId,
              Username: username,
              UserAttributes: [
                {
                  Name: "custom:garden",
                  Value: "",
                },
              ],
            }),
          );
        } catch (_) {}
      }
    }

    return c.json({
      success: true,
      isGardenKeeper: action !== "remove",
      garden: action === "remove" ? "" : gardensStr,
    });
  } catch (error) {
    console.error("updateUserRoleController error:", error);
    return c.json(
      { error: "UpdateRoleError", message: "역할 변경 중 오류가 발생했습니다: " + error.message },
      500,
    );
  }
};

/**
 * POST /api/admin/users/:username/status
 * Enables or disables a user account
 */
export const updateUserStatusController = async (c) => {
  try {
    const env = c.env;
    const userPoolId = env.AWS_COGNITO_USER_POOL_ID;
    const username = decodeURIComponent(c.req.param("username"));
    const { enabled } = await c.req.json();

    if (!username || typeof enabled !== "boolean") {
      return c.json(
        { error: "InvalidRequest", message: "유효하지 않은 요청 파라미터입니다." },
        400,
      );
    }

    const client = getCognitoClient(env);

    if (enabled) {
      await client.send(
        new AdminEnableUserCommand({
          UserPoolId: userPoolId,
          Username: username,
        }),
      );
    } else {
      await client.send(
        new AdminDisableUserCommand({
          UserPoolId: userPoolId,
          Username: username,
        }),
      );
    }

    return c.json({ success: true, enabled });
  } catch (error) {
    console.error("updateUserStatusController error:", error);
    return c.json(
      { error: "UpdateStatusError", message: "계정 상태 변경 중 오류가 발생했습니다: " + error.message },
      500,
    );
  }
};

/**
 * DELETE /api/admin/users/:username
 * Deletes a user account from Cognito User Pool
 */
export const deleteUserController = async (c) => {
  try {
    const env = c.env;
    const userPoolId = env.AWS_COGNITO_USER_POOL_ID;
    const username = decodeURIComponent(c.req.param("username"));
    const currentUser = c.get("user");

    if (!username) {
      return c.json(
        { error: "InvalidRequest", message: "삭제할 사용자명이 필요합니다." },
        400,
      );
    }

    // Safety guard: prevent deleting self
    const currentUsername = currentUser?.username || currentUser?.["cognito:username"] || "";
    if (currentUsername && currentUsername === username) {
      return c.json(
        { error: "SelfDeleteForbidden", message: "현재 로그인 중인 본인 계정은 삭제할 수 없습니다." },
        400,
      );
    }

    const client = getCognitoClient(env);
    await client.send(
      new AdminDeleteUserCommand({
        UserPoolId: userPoolId,
        Username: username,
      }),
    );

    return c.json({ success: true, message: "교인 계정이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("deleteUserController error:", error);
    return c.json(
      { error: "DeleteUserError", message: "교인 계정 삭제 중 오류가 발생했습니다: " + error.message },
      500,
    );
  }
};
