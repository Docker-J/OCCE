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
import { getDriveClient } from "../api/googleClients.js";
import * as XLSX from "xlsx";

/**
 * Normalizes phone numbers to pure digits for matching (strips leading 1 for North American 11-digit numbers)
 */
function cleanPhone(rawPhone) {
  if (!rawPhone) return "";
  let digits = String(rawPhone).replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits;
}

function normalizeName(name) {
  if (!name) return "";
  return String(name).replace(/\s+/g, "").trim();
}

function makeNamePhoneKey(name, phone) {
  const n = normalizeName(name);
  const p = cleanPhone(phone);
  return n && p ? `${n}_${p}` : null;
}

/**
 * Standardizes postal code to Canadian '*** ***' format (e.g. 'T6W 1V9')
 */
function formatPostalCode(raw) {
  if (!raw) return "";
  const clean = String(raw).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (clean.length === 6) {
    return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  }
  return String(raw).trim().toUpperCase();
}

/**
 * Parses city and province separated by comma (e.g. 'Edmonton, AB')
 */
function parseCityProvince(raw) {
  if (!raw) return { city: "Edmonton", province: "AB" };
  const s = String(raw).trim();
  if (s.includes(",")) {
    const parts = s.split(",");
    const city = (parts[0] || "").trim() || "Edmonton";
    const province = (parts[1] || "").trim() || "AB";
    return { city, province };
  }
  return { city: s || "Edmonton", province: "AB" };
}

/**
 * GET /api/admin/users
 * Lists all church members from D1, annotated with Cognito account and FCM notification status
 */
export const listUsersController = async (c) => {
  try {
    const env = c.env;
    const userPoolId = env.AWS_COGNITO_USER_POOL_ID;

    // 1. Fetch church members joined with households and gardens from D1
    const membersPromise = env.DB.prepare(`
      SELECT 
        m.id,
        m.household_id as householdId,
        m.is_head as isHead,
        m.relationship,
        m.name,
        m.name_en as nameEn,
        m.birth_date as birthDate,
        m.gender,
        m.phone,
        m.phone_clean as phoneClean,
        m.baptism_status as baptismStatus,
        m.position,
        m.department,
        m.custom_garden_id as customGardenId,
        m.registration_date as registrationDate,
        m.status,
        m.is_registered as isRegistered,
        m.cognito_sub as cognitoSub,
        h.household_name as householdName,
        h.garden_id as householdGardenId,
        h.address,
        h.address_detail as addressDetail,
        h.city,
        h.province,
        h.postal_code as postalCode,
        h.notes as householdNotes,
        COALESCE(cg.name, g.name, '미배정') as gardenName,
        COALESCE(cg.id, g.id, 1) as gardenId,
        COALESCE(
          (SELECT hh.name FROM church_members hh WHERE hh.household_id = m.household_id AND hh.is_head = 1 AND hh.status != 'REMOVED' LIMIT 1),
          h.household_name,
          m.name
        ) as headName
      FROM church_members m
      JOIN households h ON m.household_id = h.id
      LEFT JOIN gardens g ON h.garden_id = g.id
      LEFT JOIN gardens cg ON m.custom_garden_id = cg.id
      ORDER BY headName COLLATE NOCASE ASC, m.household_id ASC, m.is_head DESC, m.id ASC
    `).all();

    // 2. Fetch active notification recipient member_ids from D1
    const activeFcmSubsPromise = env.DB.prepare(`
      SELECT DISTINCT member_id 
      FROM fcm_tokens 
      WHERE expires_at > unixepoch() AND member_id IS NOT NULL
    `).all();

    // 3. Fetch Cognito users & groups if configured
    const fetchCognitoData = async () => {
      if (!userPoolId) return { cognitoUsers: [], keeperUsernames: new Set(), staffUsernames: new Set() };
      const client = getCognitoClient(env);

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

      const [cognitoUsers, keeperUsers, staffUsers] = await Promise.all([
        fetchAllUsers(),
        fetchAllGroupUsers("GardenKeeper"),
        fetchAllGroupUsers("Staff"),
      ]);

      return {
        cognitoUsers,
        keeperUsernames: new Set(keeperUsers.map((u) => u.Username)),
        staffUsernames: new Set(staffUsers.map((u) => u.Username)),
      };
    };

    const [membersResult, fcmSubsResult, cognitoData] = await Promise.all([
      membersPromise,
      activeFcmSubsPromise,
      fetchCognitoData(),
    ]);

    const activeMemberIdSet = new Set((fcmSubsResult.results || []).map((r) => r.member_id));
    const { cognitoUsers, keeperUsernames, staffUsernames } = cognitoData;

    // Index Cognito users by (name + phone) compound key, and sub
    const cognitoUserBySub = new Map();
    const cognitoUserByNameAndPhone = new Map();
    const cognitoUserList = [];

    for (const u of cognitoUsers) {
      const attrs = {};
      (u.Attributes || []).forEach((a) => {
        attrs[a.Name] = a.Value;
      });

      const phoneRaw = attrs.phone_number || u.Username || "";
      const phoneDigits = cleanPhone(phoneRaw);
      const sub = attrs.sub || "";
      const uName = (attrs.name || "").trim();

      const uObj = {
        username: u.Username,
        name: uName,
        phone: phoneRaw,
        phoneClean: phoneDigits,
        phoneVerified: attrs.phone_number_verified === "true",
        email: attrs.email || "",
        emailVerified: attrs.email_verified === "true",
        sub,
        isStaff: staffUsernames.has(u.Username),
        isGardenKeeper: keeperUsernames.has(u.Username),
        garden: attrs["custom:garden"] || "",
        enabled: u.Enabled ?? true,
        status: u.UserStatus,
        createdAt: u.UserCreateDate,
        modifiedAt: u.UserLastModifiedDate,
      };

      cognitoUserList.push(uObj);

      if (sub) {
        cognitoUserBySub.set(sub, uObj);
      }

      const key = makeNamePhoneKey(uName, phoneDigits);
      if (key) {
        cognitoUserByNameAndPhone.set(key, uObj);
      }
    }

    const membersRaw = membersResult.results || [];
    const matchedCognitoUsernames = new Set();
    const pendingD1LinkUpdates = [];

    const members = membersRaw.map((m) => {
      const phoneDigits = m.phoneClean || cleanPhone(m.phone);
      let matchedCognito = null;

      // 1. Primary rule: Strict compound matching by BOTH Name AND Phone together
      const memberKey = makeNamePhoneKey(m.name, phoneDigits);
      if (memberKey && cognitoUserByNameAndPhone.has(memberKey)) {
        matchedCognito = cognitoUserByNameAndPhone.get(memberKey);
      }

      // 2. Secondary rule: If sub was already recorded in D1, verify that the Cognito account's name matches
      if (!matchedCognito && m.cognitoSub && cognitoUserBySub.has(m.cognitoSub)) {
        const candidate = cognitoUserBySub.get(m.cognitoSub);
        if (normalizeName(candidate.name) === normalizeName(m.name)) {
          matchedCognito = candidate;
        }
      }

      // Detect incorrect/stale links: If member had a cognitoSub linked in D1, but it belongs to someone with a different name
      let shouldUnlink = false;
      if (cognitoUsers.length > 0 && m.cognitoSub) {
        const linkedCognitoUser = cognitoUserBySub.get(m.cognitoSub);
        if (linkedCognitoUser && normalizeName(linkedCognitoUser.name) !== normalizeName(m.name)) {
          shouldUnlink = true;
        }
      }

      // Determine web registration status:
      // Only true if matched with a valid Cognito account that shares BOTH name and phone.
      // If Cognito API was temporarily unreachable (0 users fetched), fall back to existing D1 status.
      const isRegistered = cognitoUsers.length > 0
        ? Boolean(matchedCognito)
        : Boolean(m.isRegistered);

      const hasNotification = activeMemberIdSet.has(m.id);

      // Lazily link sub in D1 if not yet linked
      if (matchedCognito && (!m.cognitoSub || !m.isRegistered)) {
        pendingD1LinkUpdates.push(
          env.DB.prepare(
            "UPDATE church_members SET is_registered = 1, cognito_sub = ? WHERE id = ?"
          ).bind(matchedCognito.sub, m.id)
        );
      } else if (shouldUnlink) {
        pendingD1LinkUpdates.push(
          env.DB.prepare(
            "UPDATE church_members SET is_registered = 0, cognito_sub = NULL WHERE id = ?"
          ).bind(m.id)
        );
      }

      if (matchedCognito) {
        matchedCognitoUsernames.add(matchedCognito.username);
      }

      return {
        id: m.id,
        householdId: m.householdId,
        householdName: m.householdName,
        isHead: !!m.isHead,
        headName: m.headName || m.name,
        relationship: m.relationship,
        name: m.name,
        nameEn: m.nameEn || "",
        birthDate: m.birthDate,
        gender: m.gender,
        phone: m.phone,
        phoneClean: phoneDigits,
        baptismStatus: m.baptismStatus,
        position: m.position,
        department: m.department,
        gardenId: m.gardenId,
        gardenName: m.gardenName,
        address: m.address || "",
        addressDetail: m.addressDetail || "",
        city: m.city || "Edmonton",
        province: m.province || "AB",
        postalCode: m.postalCode || "",
        householdNotes: m.householdNotes || "",
        registrationDate: m.registrationDate,
        status: m.status,
        isRegistered,
        hasNotification,
        // Cognito linked properties
        username: matchedCognito?.username || (m.phone ? `+1${phoneDigits}` : ""),
        email: matchedCognito?.email || "",
        phoneVerified: matchedCognito?.phoneVerified ?? false,
        isStaff: matchedCognito?.isStaff ?? false,
        isGardenKeeper: matchedCognito?.isGardenKeeper ?? false,
        enabled: matchedCognito?.enabled ?? true,
      };
    });

    // Execute any pending async link updates in background
    if (pendingD1LinkUpdates.length > 0) {
      c.executionCtx?.waitUntil?.(
        Promise.all(pendingD1LinkUpdates.map((p) => p.run())).catch((err) =>
          console.warn("Async cognito_sub link update failed:", err.message)
        )
      );
    }

    // Build fallback/legacy users array for backward compatibility
    const users = members.map((m) => ({
      id: m.id,
      username: m.username || `member_${m.id}`,
      name: m.name,
      phone: m.phone,
      phoneClean: m.phoneClean,
      phoneVerified: m.phoneVerified,
      email: m.email,
      sub: m.cognitoSub || "",
      isStaff: m.isStaff,
      isGardenKeeper: m.isGardenKeeper,
      hasNotification: m.hasNotification,
      garden: m.gardenName,
      enabled: m.enabled,
      status: m.status,
      householdId: m.householdId,
      householdName: m.householdName,
      isHead: m.isHead,
      relationship: m.relationship,
      position: m.position,
      baptismStatus: m.baptismStatus,
      department: m.department,
      address: m.address,
      addressDetail: m.addressDetail,
      city: m.city,
      province: m.province,
      postalCode: m.postalCode,
      isRegistered: m.isRegistered,
    }));

    // Include any Cognito users not yet matched in church_members (e.g. pending roster sync)
    for (const uObj of cognitoUserList) {
      if (!matchedCognitoUsernames.has(uObj.username)) {
        users.push({
          ...uObj,
          id: `cognito_${uObj.username}`,
          householdName: "미등록 세대",
          isHead: false,
          relationship: "HEAD",
          position: "성도",
          baptismStatus: "NONE",
          department: "장년부",
          address: "",
          addressDetail: "",
          city: "Edmonton",
          province: "AB",
          postalCode: "",
          isRegistered: true,
          hasNotification: false,
        });
      }
    }

    const activeMembers = members.filter((m) => m.status !== "REMOVED");
    const activeHouseholds = new Set(activeMembers.map((m) => m.householdId).filter(Boolean));
    const removedCount = members.filter((m) => m.status === "REMOVED").length;

    const metrics = {
      total: activeMembers.length,
      householdCount: activeHouseholds.size,
      registeredCount: activeMembers.filter((m) => m.isRegistered).length,
      notificationEnabled: activeMembers.filter((m) => m.hasNotification).length,
      staffCount: staffUsernames.size,
      keepers: keeperUsernames.size,
      clergyCount: activeMembers.filter((m) => m.position === "교역자").length,
      removedCount,
    };

    return c.json({
      ...metrics,
      members,
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
 * POST /api/admin/members
 * Registers a new church member, optionally creating a new household with address details
 */
export const createMemberController = async (c) => {
  try {
    const env = c.env;
    const body = await c.req.json();
    const {
      name,
      nameEn = null,
      relationship = "HEAD",
      isHead = false,
      phone = "",
      birthDate = null,
      gender = null,
      baptismStatus = "NONE",
      position = "성도",
      department = "장년부",
      customGardenId = null,
      registrationDate = null,
      status = "ACTIVE",
      // Household info
      isNewHousehold = false,
      householdId = null,
      householdName = "",
      gardenId = 1,
      address = "",
      addressDetail = "",
      city = "Edmonton",
      province = "AB",
      postalCode = "",
      householdNotes = "",
    } = body;

    if (!name || !name.trim()) {
      return c.json({ error: "ValidationError", message: "교인 성명은 필수 항목입니다." }, 400);
    }

    let targetHouseholdId = householdId;

    if (isNewHousehold || !targetHouseholdId) {
      const hName = householdName ? householdName.trim() : null;
      const hRes = await env.DB.prepare(`
        INSERT INTO households (household_name, garden_id, address, address_detail, city, province, postal_code, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        hName,
        gardenId || 1,
        (address || "").trim(),
        (addressDetail || "").trim(),
        (city || "Edmonton").trim(),
        (province || "AB").trim(),
        formatPostalCode(postalCode),
        (householdNotes || "").trim(),
      ).run();

      targetHouseholdId = hRes.meta.last_row_id;
    }

    const phoneCleanVal = cleanPhone(phone);

    // Insert church member
    const memberRes = await env.DB.prepare(`
      INSERT INTO church_members (
        household_id, is_head, relationship, name, name_en, birth_date, gender,
        phone, phone_clean, baptism_status, position, department,
        custom_garden_id, registration_date, status, is_registered
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).bind(
      targetHouseholdId,
      isHead ? 1 : 0,
      relationship,
      name.trim(),
      nameEn ? nameEn.trim() : null,
      birthDate || null,
      gender || null,
      (phone || "").trim(),
      phoneCleanVal,
      baptismStatus || "NONE",
      (position || "성도").trim(),
      (department || "장년부").trim(),
      customGardenId || null,
      registrationDate || null,
      status || "ACTIVE",
    ).run();

    const newMemberId = memberRes.meta.last_row_id;

    return c.json({
      success: true,
      message: "새 교인이 성공적으로 등록되었습니다.",
      id: newMemberId,
      householdId: targetHouseholdId,
    }, 201);
  } catch (error) {
    console.error("createMemberController error:", error);
    return c.json(
      { error: "CreateMemberError", message: "교인 등록 중 오류가 발생했습니다: " + error.message },
      500,
    );
  }
};

/**
 * PUT /api/admin/members/:id
 * Updates member details and/or household address information
 */
export const updateMemberController = async (c) => {
  try {
    const env = c.env;
    const memberId = parseInt(c.req.param("id"), 10);
    const body = await c.req.json();

    if (!memberId || isNaN(memberId)) {
      return c.json({ error: "InvalidRequest", message: "유효한 교인 ID가 필요합니다." }, 400);
    }

    const {
      name,
      nameEn,
      relationship,
      isHead,
      phone,
      birthDate,
      gender,
      baptismStatus,
      position,
      department,
      customGardenId,
      registrationDate,
      status,
      // Household updates & separation / transfer
      isSeparateHousehold,
      isTransferHousehold,
      targetHouseholdId: transferTargetHouseholdId,
      successorMemberId,
      householdId,
      householdName,
      gardenId,
      address,
      addressDetail,
      city,
      province,
      postalCode,
      householdNotes,
    } = body;

    const currentMember = await env.DB.prepare(
      "SELECT * FROM church_members WHERE id = ?"
    ).bind(memberId).first();

    if (!currentMember) {
      return c.json({ error: "NotFound", message: "해당 교인을 찾을 수 없습니다." }, 404);
    }

    const phoneCleanVal = phone !== undefined ? cleanPhone(phone) : currentMember.phone_clean;
    let targetHouseholdId = householdId || currentMember.household_id;
    let targetIsHead = isHead !== undefined ? (isHead ? 1 : 0) : currentMember.is_head;
    let targetRelationship = relationship || currentMember.relationship;

    // 세대 편입(합가/결혼 등으로 기존 세대로 이동) 처리
    if (isTransferHousehold) {
      const destHouseholdId = transferTargetHouseholdId || householdId;
      if (!destHouseholdId) {
        return c.json({ error: "ValidationError", message: "편입할 대상 세대를 지정해야 합니다." }, 400);
      }

      const oldHouseholdId = currentMember.household_id;

      // 1. 기존 세대의 세대주였던 경우 새 세대주 지정 또는 승격
      if (currentMember.is_head && oldHouseholdId) {
        if (successorMemberId) {
          await env.DB.prepare(
            "UPDATE church_members SET is_head = 1, relationship = 'HEAD' WHERE id = ? AND household_id = ?"
          ).bind(successorMemberId, oldHouseholdId).run();
        } else {
          const nextHead = await env.DB.prepare(
            "SELECT id FROM church_members WHERE household_id = ? AND id != ? AND status != 'REMOVED' ORDER BY id ASC LIMIT 1"
          ).bind(oldHouseholdId, memberId).first();
          if (nextHead) {
            await env.DB.prepare(
              "UPDATE church_members SET is_head = 1, relationship = 'HEAD' WHERE id = ?"
            ).bind(nextHead.id).run();
          }
        }
      }

      // 2. 대상 세대로 편입 (is_head = 0, relationship = relationship || 'SPOUSE')
      const targetRel = relationship || "SPOUSE";
      await env.DB.prepare(
        "UPDATE church_members SET household_id = ?, is_head = 0, relationship = ? WHERE id = ?"
      ).bind(destHouseholdId, targetRel, memberId).run();

      // 3. 기존 세대에 남은 구성원(제적 제외) 확인하여 없으면 빈 세대(orphan household) 자동 정리
      if (oldHouseholdId && String(oldHouseholdId) !== String(destHouseholdId)) {
        const remaining = await env.DB.prepare(
          "SELECT COUNT(*) as count FROM church_members WHERE household_id = ? AND status != 'REMOVED'"
        ).bind(oldHouseholdId).first();

        if (remaining && remaining.count === 0) {
          await env.DB.prepare("DELETE FROM households WHERE id = ?").bind(oldHouseholdId).run();
        }
      }

      return c.json({
        success: true,
        message: "성공적으로 세대 편입 처리가 완료되었습니다.",
      });
    }

    // 세대 독립(분가) 처리: 신규 세대 생성 후 해당 세대의 세대주(HEAD)로 설정
    if (isSeparateHousehold) {
      const oldHouseholdId = currentMember.household_id;
      const newHName = householdName ? householdName.trim() : null;
      const newHRes = await env.DB.prepare(`
        INSERT INTO households (household_name, garden_id, address, address_detail, city, province, postal_code, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newHName,
        gardenId || 1,
        (address || "").trim(),
        (addressDetail || "").trim(),
        (city || "Edmonton").trim(),
        (province || "AB").trim(),
        formatPostalCode(postalCode),
        (householdNotes || "").trim(),
      ).run();

      targetHouseholdId = newHRes.meta.last_row_id;
      targetIsHead = 1;
      targetRelationship = "HEAD";

      // 기존 세대에 남은 구성원(제적 제외) 확인하여 없으면 빈 세대 정리
      if (oldHouseholdId && String(oldHouseholdId) !== String(targetHouseholdId)) {
        const remaining = await env.DB.prepare(
          "SELECT COUNT(*) as count FROM church_members WHERE household_id = ? AND status != 'REMOVED'"
        ).bind(oldHouseholdId).first();

        if (remaining && remaining.count === 0) {
          await env.DB.prepare("DELETE FROM households WHERE id = ?").bind(oldHouseholdId).run();
        }
      }
    }

    // 1. Update member fields
    await env.DB.prepare(`
      UPDATE church_members SET
        household_id = ?,
        is_head = ?,
        relationship = ?,
        name = ?,
        name_en = ?,
        birth_date = ?,
        gender = ?,
        phone = ?,
        phone_clean = ?,
        baptism_status = ?,
        position = ?,
        department = ?,
        custom_garden_id = ?,
        registration_date = ?,
        status = ?
      WHERE id = ?
    `).bind(
      targetHouseholdId,
      targetIsHead,
      targetRelationship,
      name !== undefined ? name.trim() : currentMember.name,
      nameEn !== undefined ? (nameEn ? nameEn.trim() : null) : currentMember.name_en,
      birthDate !== undefined ? (birthDate || null) : currentMember.birth_date,
      gender !== undefined ? (gender || null) : currentMember.gender,
      phone !== undefined ? (phone || "").trim() : currentMember.phone,
      phoneCleanVal,
      baptismStatus || currentMember.baptism_status,
      position !== undefined ? position.trim() : currentMember.position,
      department !== undefined ? department.trim() : currentMember.department,
      customGardenId !== undefined ? (customGardenId || null) : currentMember.custom_garden_id,
      registrationDate !== undefined ? (registrationDate || null) : currentMember.registration_date,
      status || currentMember.status,
      memberId,
    ).run();

    // 2. If household info was passed, update household
    if (
      householdName !== undefined ||
      gardenId !== undefined ||
      address !== undefined ||
      addressDetail !== undefined ||
      city !== undefined ||
      province !== undefined ||
      postalCode !== undefined ||
      householdNotes !== undefined
    ) {
      const curH = await env.DB.prepare(
        "SELECT * FROM households WHERE id = ?"
      ).bind(targetHouseholdId).first();

      if (curH) {
        await env.DB.prepare(`
          UPDATE households SET
            household_name = ?,
            garden_id = ?,
            address = ?,
            address_detail = ?,
            city = ?,
            province = ?,
            postal_code = ?,
            notes = ?
          WHERE id = ?
        `).bind(
          householdName !== undefined ? householdName.trim() : curH.household_name,
          gardenId !== undefined ? (gardenId || 1) : curH.garden_id,
          address !== undefined ? (address || "").trim() : curH.address,
          addressDetail !== undefined ? (addressDetail || "").trim() : curH.address_detail,
          city !== undefined ? (city || "Edmonton").trim() : (curH.city || "Edmonton"),
          province !== undefined ? (province || "AB").trim() : (curH.province || "AB"),
          postalCode !== undefined ? formatPostalCode(postalCode) : curH.postal_code,
          householdNotes !== undefined ? (householdNotes || "").trim() : curH.notes,
          targetHouseholdId,
        ).run();
      }
    }

    return c.json({ success: true, message: "교인 정보가 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("updateMemberController error:", error);
    return c.json(
      { error: "UpdateMemberError", message: "교인 정보 수정 중 오류가 발생했습니다: " + error.message },
      500,
    );
  }
};

/**
 * PATCH /api/admin/members/:id/status
 * Updates church member status ('ACTIVE', 'INACTIVE', 'REMOVED' 제적)
 */
export const updateMemberStatusController = async (c) => {
  try {
    const env = c.env;
    const memberId = parseInt(c.req.param("id"), 10);
    const { status, cascadeHousehold = false, successorMemberId = null } = await c.req.json();

    if (!memberId || !["ACTIVE", "INACTIVE", "REMOVED"].includes(status)) {
      return c.json({ error: "InvalidRequest", message: "유효하지 않은 상태 값입니다." }, 400);
    }

    const currentMember = await env.DB.prepare(
      "SELECT id, household_id, is_head FROM church_members WHERE id = ?"
    ).bind(memberId).first();

    if (!currentMember) {
      return c.json({ error: "NotFound", message: "해당 교인을 찾을 수 없습니다." }, 404);
    }

    // 1. 세대 전체 일괄 제적 처리
    if (status === "REMOVED" && cascadeHousehold && currentMember.household_id) {
      await env.DB.prepare(
        "UPDATE church_members SET status = 'REMOVED', is_head = 0 WHERE household_id = ? AND status != 'REMOVED'"
      ).bind(currentMember.household_id).run();

      return c.json({
        success: true,
        message: "세대 구성원 전체가 성공적으로 제적 처리되었습니다.",
      });
    }

    // 2. 세대주 승계 후 현재 교인 제적
    if (status === "REMOVED" && successorMemberId && currentMember.household_id) {
      // 새 세대주 승격
      await env.DB.prepare(
        "UPDATE church_members SET is_head = 1, relationship = 'HEAD' WHERE id = ? AND household_id = ?"
      ).bind(successorMemberId, currentMember.household_id).run();

      // 기존 세대주 제적 및 is_head 해제
      await env.DB.prepare(
        "UPDATE church_members SET status = 'REMOVED', is_head = 0 WHERE id = ?"
      ).bind(memberId).run();

      return c.json({
        success: true,
        message: "새 세대주 승계 및 제적 처리가 완료되었습니다.",
      });
    }

    // 3. 단일 교인 상태 변경
    const isHeadVal = status === "REMOVED" ? 0 : currentMember.is_head;
    await env.DB.prepare(
      "UPDATE church_members SET status = ?, is_head = ? WHERE id = ?"
    ).bind(status, isHeadVal, memberId).run();

    return c.json({
      success: true,
      message: status === "REMOVED" ? "성공적으로 제적 처리되었습니다." : `상태가 ${status}(으)로 변경되었습니다.`,
    });
  } catch (error) {
    console.error("updateMemberStatusController error:", error);
    return c.json(
      { error: "UpdateStatusError", message: "교적 상태 변경 중 오류가 발생했습니다: " + error.message },
      500,
    );
  }
};

/**
 * DELETE /api/admin/members/:id
 * Permanently deletes a church member and cleans up orphan household if needed
 */
export const deleteMemberController = async (c) => {
  try {
    const env = c.env;
    const memberId = parseInt(c.req.param("id"), 10);
    let successorMemberId = null;
    try {
      const body = await c.req.json();
      successorMemberId = body?.successorMemberId;
    } catch {
      // body can be omitted for DELETE
    }

    if (!memberId || isNaN(memberId)) {
      return c.json({ error: "InvalidRequest", message: "유효한 교인 ID가 필요합니다." }, 400);
    }

    const member = await env.DB.prepare(
      "SELECT id, household_id, is_head FROM church_members WHERE id = ?"
    ).bind(memberId).first();

    if (!member) {
      return c.json({ error: "NotFound", message: "삭제할 교인을 찾을 수 없습니다." }, 404);
    }

    const householdId = member.household_id;

    // 만약 세대주 삭제 시 승계 대상자가 지정되었다면 새 세대주로 승격
    if (successorMemberId && householdId) {
      await env.DB.prepare(
        "UPDATE church_members SET is_head = 1, relationship = 'HEAD' WHERE id = ? AND household_id = ?"
      ).bind(successorMemberId, householdId).run();
    }

    // Delete member (cascades to fcm_tokens)
    await env.DB.prepare("DELETE FROM church_members WHERE id = ?").bind(memberId).run();

    // Check if household has any remaining members
    const remaining = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM church_members WHERE household_id = ?"
    ).bind(householdId).first();

    if (remaining && remaining.count === 0) {
      await env.DB.prepare("DELETE FROM households WHERE id = ?").bind(householdId).run();
    }

    return c.json({ success: true, message: "교인이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("deleteMemberController error:", error);
    return c.json(
      { error: "DeleteMemberError", message: "교인 삭제 중 오류가 발생했습니다: " + error.message },
      500,
    );
  }
};

/**
 * POST /api/admin/members/import-drive
 * Initial one-time bootstrap import of the Google Drive roster Excel file into D1
 */
export const importRosterFromDriveController = async (c) => {
  try {
    const env = c.env;
    const drive = getDriveClient(env, ["https://www.googleapis.com/auth/drive.readonly"]);
    const fileId = "1Uk154FmBfVHIcv8xU5V_CuTBte4QXn6D";

    console.log("[Roster Import] Fetching roster Excel from Google Drive...");
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "arraybuffer" },
    );

    const workbook = XLSX.read(response.data, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!rows || rows.length <= 1) {
      return c.json({ error: "EmptySheet", message: "엑셀 파일에 데이터 행이 없습니다." }, 400);
    }

    // 1. Locate header row dynamically (usually row 0 or 1, contains "이름")
    let headerRowIndex = 0;
    for (let r = 0; r < Math.min(10, rows.length); r++) {
      const row = rows[r];
      if (Array.isArray(row) && row.some((cell) => cell && String(cell).trim() === "이름")) {
        headerRowIndex = r;
        break;
      }
    }

    const headerRow = (rows[headerRowIndex] || []).map((cell) =>
      cell ? String(cell).trim() : ""
    );
    console.log("[Roster Import] Header row found at index", headerRowIndex, ":", JSON.stringify(headerRow));

    const findCol = (patterns, fallback) => {
      const idx = headerRow.findIndex((h) => patterns.some((p) => h.includes(p)));
      return idx !== -1 ? idx : fallback;
    };

    // Columns per exact schema:
    // 0: 세대번호, 1: 이름, 2: 영문이름, 3: 제적/정원, 4: 세례, 5: 주소(도로명+세부주소), 6: 도시,주, 7: 우편번호, 8: 생년월일, 9: 휴대전화, 10: 성별, 11: 관계
    const col = {
      familyNo: findCol(["세대번호", "가족번호", "연번", "세대"], 0),
      name: findCol(["이름", "성명", "교인명"], 1),
      nameEn: findCol(["영문", "english", "en"], 2),
      statusAndGarden: findCol(["소속", "교적", "정원", "목장", "상태", "구분"], 3),
      churchSchool: findCol(["교회학교", "부서", "학교"], 4),
      address: findCol(["주소", "자택주소", "도로명"], 5),
      cityProvince: findCol(["도시", "지역", "city", "province"], 6),
      postalCode: findCol(["우편번호", "postal", "zip"], 7),
      birth: findCol(["생년월일", "생일"], 8),
      phone: findCol(["휴대전화", "핸드폰", "연락처", "cell"], 9),
      gender: findCol(["성별"], 10),
      relationship: findCol(["세대주와", "관계", "세대관계"], 11),
      position: findCol(["직분", "직책", "직급"], 12),
      baptism: findCol(["신급", "세례"], 13),
    };

    console.log("[Roster Import] Column mapping:", JSON.stringify(col));

    // Cache gardens by clean name -> id
    const { results: existingGardens } = await env.DB.prepare("SELECT id, name FROM gardens").all();
    const gardenMap = new Map((existingGardens || []).map((g) => [g.name.trim(), g.id]));

    // Cache households with an active head to guarantee idx_unique_head_per_household
    const { results: existingHeads } = await env.DB.prepare(
      "SELECT household_id FROM church_members WHERE is_head = 1 AND status != 'REMOVED'"
    ).all();
    const householdHeadsSet = new Set((existingHeads || []).map((r) => r.household_id));

    // State for sequential household grouping
    let currentHouseholdId = null;
    let currentHouseholdGardenId = 1;
    let currentHouseholdGardenName = "";

    let importedMembers = 0;
    let createdHouseholds = 0;
    const importErrors = [];

    const parseExcelDate = (val) => {
      if (!val) return null;
      if (typeof val === "number") {
        const jsDate = new Date(Math.round((val - 25569) * 86400 * 1000));
        if (!isNaN(jsDate.getTime())) {
          return jsDate.toISOString().split("T")[0];
        }
      }
      const s = String(val).trim();
      if (/^\d{4}[-./]\d{1,2}[-./]\d{1,2}$/.test(s)) {
        return s.replace(/[./]/g, "-");
      }
      return s;
    };

    const parseGender = (val) => {
      if (!val) return null;
      const s = String(val).trim().toUpperCase();
      if (s === "남" || s === "남성" || s === "M" || s === "MALE") return "M";
      if (s === "여" || s === "여성" || s === "F" || s === "FEMALE") return "F";
      return null;
    };

    // 정원명 정제 함수: "장년 - ", "청년 - ", "정원", 띄어쓰기 등 제거
    const parseStatusAndGarden = (rawVal) => {
      if (!rawVal) return { status: "ACTIVE", gardenName: "" };
      const rawStr = String(rawVal).trim();
      const isRemoved = rawStr.includes("제적");
      const status = isRemoved ? "REMOVED" : "ACTIVE";

      let g = rawStr;
      g = g.replace(/제적/g, "").trim();
      g = g.replace(/^(장년|청년)\s*[-–—:]?\s*/g, "").trim();
      g = g.replace(/정원\s*$/g, "").trim();
      g = g.replace(/\s+/g, ""); // 띄어쓰기 제거
      g = g.replace(/[()\-–—]/g, "").trim();

      if (!g || g === "미배정" || g === "교인" || g === "성도" || /^\d+$/.test(g)) {
        g = "";
      }
      return { status, gardenName: g };
    };

    // Iterate starting immediately after the header row
    for (let i = headerRowIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;

      const name = col.name !== -1 && row[col.name] ? String(row[col.name]).trim() : "";
      if (!name || name === "이름") continue;

      const rawFamilyNo = col.familyNo !== -1 && row[col.familyNo] !== undefined && row[col.familyNo] !== null
        ? String(row[col.familyNo]).trim()
        : "";
      const rawNameEn = col.nameEn !== -1 && row[col.nameEn] ? String(row[col.nameEn]).trim() : "";
      const rawStatusGarden = col.statusAndGarden !== -1 && row[col.statusAndGarden] !== undefined ? row[col.statusAndGarden] : "";
      const rawChurchSchool = col.churchSchool !== -1 && row[col.churchSchool] !== undefined ? String(row[col.churchSchool]).trim() : "";
      const rawAddress = col.address !== -1 && row[col.address] ? String(row[col.address]).trim() : "";
      const rawCityProvince = col.cityProvince !== -1 && row[col.cityProvince] ? String(row[col.cityProvince]).trim() : "";
      const rawPostalCode = col.postalCode !== -1 && row[col.postalCode] ? String(row[col.postalCode]).trim() : "";
      const rawBirth = col.birth !== -1 && row[col.birth] !== undefined ? row[col.birth] : null;
      const rawPhone = col.phone !== -1 && row[col.phone] ? String(row[col.phone]).trim() : "";
      const rawGender = col.gender !== -1 && row[col.gender] !== undefined ? row[col.gender] : null;
      const rawRelationship = col.relationship !== -1 && row[col.relationship] ? String(row[col.relationship]).trim() : "";
      const rawPosition = col.position !== -1 && row[col.position] ? String(row[col.position]).trim() : "성도";
      const rawBaptism = col.baptism !== -1 && row[col.baptism] !== undefined ? String(row[col.baptism]).trim() : "";

      const { status: statusVal, gardenName: cleanGarden } = parseStatusAndGarden(rawStatusGarden);
      const phoneCleanVal = cleanPhone(rawPhone);
      const birthDateVal = parseExcelDate(rawBirth);
      const genderVal = parseGender(rawGender);

      // 1) 5번째 열(교회학교)을 통한 교회학교 부서 판별 (유아유치부, 유초등부, 중고등부)
      let departmentVal = "장년부";
      if (rawChurchSchool.includes("유치") || rawChurchSchool.includes("유아")) {
        departmentVal = "유아유치부";
      } else if (
        rawChurchSchool.includes("유초등") ||
        rawChurchSchool.includes("초등") ||
        rawChurchSchool.includes("유년")
      ) {
        departmentVal = "유초등부";
      } else if (
        rawChurchSchool.includes("중고등") ||
        rawChurchSchool.includes("중등") ||
        rawChurchSchool.includes("고등")
      ) {
        departmentVal = "중고등부";
      }

      // 2) 14번째 열(신급)을 통한 세례 신분 판별
      let baptismVal = "NONE";
      if (rawBaptism.includes("유아")) {
        baptismVal = "INFANT";
      } else if (rawBaptism.includes("입교")) {
        baptismVal = "CONFIRMATION";
      } else if (rawBaptism.includes("세례")) {
        baptismVal = "BAPTIZED";
      }

      // 1번째 컬럼(세대 번호)이 채워져 있거나, 아직 시작된 세대가 없으면 새로운 세대 시작!
      const isNewHousehold = Boolean(rawFamilyNo) || !currentHouseholdId;

      let targetHouseholdId = null;
      let isHeadVal = 0;
      let relationshipVal = "OTHER";

      if (isNewHousehold) {
        // 새 세대의 기본 정원 결정
        let householdGardenId = 1;
        if (cleanGarden) {
          if (gardenMap.has(cleanGarden)) {
            householdGardenId = gardenMap.get(cleanGarden);
          } else {
            const newGRes = await env.DB.prepare(
              "INSERT INTO gardens (name, order_num, is_active) VALUES (?, 0, 1)"
            ).bind(cleanGarden).run();
            householdGardenId = newGRes.meta.last_row_id;
            gardenMap.set(cleanGarden, householdGardenId);
          }
        }

        const { city: cleanCity, province: cleanProvince } = parseCityProvince(rawCityProvince);
        const cleanPostalCode = formatPostalCode(rawPostalCode);

        const householdName = `${name} 성도 가정`;
        const hRes = await env.DB.prepare(`
          INSERT INTO households (household_name, garden_id, address, address_detail, city, province, postal_code, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          householdName,
          householdGardenId,
          rawAddress || null,
          null, // 6번째 컬럼에 도로명과 세부주소가 함께 보관되어 있으므로 상세주소 분리 없이 전체 주소로 보관
          cleanCity,
          cleanProvince,
          cleanPostalCode || null,
          rawFamilyNo ? `엑셀 세대번호: ${rawFamilyNo}` : "구글 엑셀 초기 이전"
        ).run();

        currentHouseholdId = hRes.meta.last_row_id;
        currentHouseholdGardenId = householdGardenId;
        currentHouseholdGardenName = cleanGarden || "";
        createdHouseholds++;

        targetHouseholdId = currentHouseholdId;
        isHeadVal = statusVal !== "REMOVED" ? 1 : 0;
        relationshipVal = "HEAD";
        if (isHeadVal === 1) {
          householdHeadsSet.add(targetHouseholdId);
        }
      } else {
        // 기존 세대에 소속된 가족 구성원
        targetHouseholdId = currentHouseholdId;
        isHeadVal = 0;

        // 관계 파싱
        if (rawRelationship.includes("배우자") || rawRelationship.includes("처") || rawRelationship.includes("아내") || rawRelationship.includes("남편")) {
          relationshipVal = "SPOUSE";
        } else if (rawRelationship.includes("자녀") || rawRelationship.includes("자") || rawRelationship.includes("녀") || rawRelationship.includes("딸") || rawRelationship.includes("아들")) {
          relationshipVal = "CHILD";
        } else if (rawRelationship.includes("부모") || rawRelationship.includes("모") || rawRelationship.includes("부") || rawRelationship.includes("시부") || rawRelationship.includes("시모")) {
          relationshipVal = "PARENT";
        } else if (rawRelationship) {
          relationshipVal = "OTHER";
        } else {
          relationshipVal = "OTHER";
        }
      }

      // 개별 구성원 정원이 세대 정원과 다른 경우 (예: 청년부 독립 정원) custom_garden_id 배정
      let memberCustomGardenId = null;
      if (cleanGarden) {
        let gId = gardenMap.get(cleanGarden);
        if (!gId) {
          const newGRes = await env.DB.prepare(
            "INSERT INTO gardens (name, order_num, is_active) VALUES (?, 0, 1)"
          ).bind(cleanGarden).run();
          gId = newGRes.meta.last_row_id;
          gardenMap.set(cleanGarden, gId);
        }
        if (gId !== currentHouseholdGardenId) {
          memberCustomGardenId = gId;
        }
      }

      // 3) 청년은 정원(새벽, 나라)으로 구분
      const effectiveGarden = (cleanGarden || currentHouseholdGardenName || "").trim();
      const isYoungAdult =
        effectiveGarden === "새벽" ||
        effectiveGarden === "나라" ||
        effectiveGarden.includes("새벽") ||
        effectiveGarden.includes("나라") ||
        String(rawStatusGarden).includes("새벽") ||
        String(rawStatusGarden).includes("나라") ||
        String(rawStatusGarden).includes("청년") ||
        rawPosition.includes("청년");

      // 교회학교(유아유치부/유초등부/중고등부)가 아닌 경우, 정원이 새벽/나라면 청년부, 그 외는 장년부
      if (departmentVal === "장년부" && isYoungAdult) {
        departmentVal = "청년부";
      }

      // 중복 체크: (name, phone_clean) 또는 (name, household_id)
      let existing = null;
      if (phoneCleanVal) {
        existing = await env.DB.prepare(
          "SELECT id FROM church_members WHERE name = ? AND phone_clean = ? LIMIT 1"
        ).bind(name, phoneCleanVal).first();
      } else {
        existing = await env.DB.prepare(
          "SELECT id FROM church_members WHERE name = ? AND household_id = ? LIMIT 1"
        ).bind(name, targetHouseholdId).first();
      }

      if (!existing) {
        try {
          await env.DB.prepare(`
            INSERT INTO church_members (
              household_id, is_head, relationship, name, name_en, birth_date, gender,
              phone, phone_clean, baptism_status, position, department,
              custom_garden_id, status, is_registered
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
          `).bind(
            targetHouseholdId,
            isHeadVal,
            relationshipVal,
            name,
            rawNameEn || null,
            birthDateVal,
            genderVal,
            rawPhone,
            phoneCleanVal,
            baptismVal,
            rawPosition || "성도",
            departmentVal,
            memberCustomGardenId,
            statusVal,
          ).run();
          importedMembers++;
        } catch (memberErr) {
          console.error(`[Roster Import] Error row ${i + 1} (${name}):`, memberErr.message);
          importErrors.push({ row: i + 1, name, error: memberErr.message });
        }
      } else {
        try {
          await env.DB.prepare(`
            UPDATE church_members SET
              department = ?,
              baptism_status = ?,
              position = COALESCE(?, position),
              status = ?,
              name_en = COALESCE(?, name_en),
              custom_garden_id = COALESCE(?, custom_garden_id)
            WHERE id = ?
          `).bind(
            departmentVal,
            baptismVal,
            rawPosition || null,
            statusVal,
            rawNameEn || null,
            memberCustomGardenId,
            existing.id
          ).run();
          importedMembers++;
        } catch (updateErr) {
          console.error(`[Roster Import] Error updating existing member ${name}:`, updateErr.message);
        }
      }
    }

    return c.json({
      success: true,
      message: `성공적으로 교적을 이전했습니다. (세대: ${createdHouseholds}개, 교인: ${importedMembers}명${importErrors.length > 0 ? `, 오류/건너뜀: ${importErrors.length}건` : ""})`,
      createdHouseholds,
      importedMembers,
      errors: importErrors.length > 0 ? importErrors : undefined,
    });
  } catch (error) {
    console.error("importRosterFromDriveController error:", error);
    return c.json(
      { error: "ImportRosterError", message: "구글 드라이브 교적 이전 중 오류 발생: " + error.message },
      500,
    );
  }
};

/**
 * GET /api/admin/gardens
 * Lists all active gardens for dropdown selectors
 */
export const listGardensController = async (c) => {
  try {
    const env = c.env;
    const { results } = await env.DB.prepare(`
      SELECT id, name, leader_member_id as leaderMemberId, order_num as orderNum, is_active as isActive
      FROM gardens
      WHERE is_active = 1
      ORDER BY order_num ASC, name ASC
    `).all();

    return c.json({ gardens: results || [] });
  } catch (error) {
    console.error("listGardensController error:", error);
    return c.json({ error: "FetchGardensError", message: error.message }, 500);
  }
};

/**
 * GET /api/admin/households
 * Lists all households for family grouping selectors
 */
export const listHouseholdsController = async (c) => {
  try {
    const env = c.env;
    const { results } = await env.DB.prepare(`
      SELECT 
        h.id, 
        h.household_name as householdName, 
        (SELECT name FROM church_members WHERE household_id = h.id AND is_head = 1 AND status != 'REMOVED' LIMIT 1) as headName,
        h.garden_id as gardenId, 
        g.name as gardenName,
        h.address, 
        h.address_detail as addressDetail, 
        h.city,
        h.province,
        h.postal_code as postalCode
      FROM households h
      LEFT JOIN gardens g ON h.garden_id = g.id
      ORDER BY headName ASC, h.id ASC
    `).all();

    return c.json({ households: results || [] });
  } catch (error) {
    console.error("listHouseholdsController error:", error);
    return c.json({ error: "FetchHouseholdsError", message: error.message }, 500);
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
 * Enables or disables a user account in Cognito
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

/**
 * POST /api/admin/households/bulk-save
 * Creates or updates a household along with multiple church members (batch operation)
 */
export const bulkSaveHouseholdController = async (c) => {
  try {
    const env = c.env;
    const body = await c.req.json();
    const { householdId, household = {}, members = [] } = body;

    let targetHouseholdId = householdId;

    // 1. Create or Update household
    if (targetHouseholdId) {
      const curH = await env.DB.prepare("SELECT * FROM households WHERE id = ?").bind(targetHouseholdId).first();
      if (curH) {
        await env.DB.prepare(`
          UPDATE households SET
            household_name = ?,
            garden_id = ?,
            address = ?,
            address_detail = ?,
            city = ?,
            province = ?,
            postal_code = ?,
            notes = ?
          WHERE id = ?
        `).bind(
          household.householdName !== undefined ? (household.householdName ? household.householdName.trim() : null) : curH.household_name,
          household.gardenId !== undefined ? (household.gardenId || 1) : curH.garden_id,
          household.address !== undefined ? (household.address || "").trim() : curH.address,
          household.addressDetail !== undefined ? (household.addressDetail || "").trim() : curH.address_detail,
          household.city !== undefined ? (household.city || "Edmonton").trim() : curH.city,
          household.province !== undefined ? (household.province || "AB").trim() : curH.province,
          formatPostalCode(household.postalCode || curH.postal_code),
          household.householdNotes !== undefined ? (household.householdNotes || "").trim() : curH.notes,
          targetHouseholdId,
        ).run();
      }
    } else {
      // Create new household
      const hName = household.householdName ? household.householdName.trim() : null;
      const hRes = await env.DB.prepare(`
        INSERT INTO households (household_name, garden_id, address, address_detail, city, province, postal_code, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        hName,
        household.gardenId || 1,
        (household.address || "").trim(),
        (household.addressDetail || "").trim(),
        (household.city || "Edmonton").trim(),
        (household.province || "AB").trim(),
        formatPostalCode(household.postalCode),
        (household.householdNotes || "").trim(),
      ).run();

      targetHouseholdId = hRes.meta.last_row_id;
    }

    // 2. Process members
    for (const mem of members) {
      if (!mem.name || !mem.name.trim()) continue;

      const phoneCleanVal = cleanPhone(mem.phone || "");
      const isHeadVal = mem.isHead ? 1 : mem.relationship === "HEAD" ? 1 : 0;

      if (mem.id) {
        // Update existing member
        await env.DB.prepare(`
          UPDATE church_members SET
            household_id = ?,
            is_head = ?,
            relationship = ?,
            name = ?,
            name_en = ?,
            birth_date = ?,
            gender = ?,
            phone = ?,
            phone_clean = ?,
            baptism_status = ?,
            position = ?,
            department = ?,
            custom_garden_id = ?,
            registration_date = ?,
            status = ?
          WHERE id = ?
        `).bind(
          targetHouseholdId,
          isHeadVal,
          mem.relationship || "HEAD",
          mem.name.trim(),
          mem.nameEn ? mem.nameEn.trim() : null,
          mem.birthDate || null,
          mem.gender || null,
          (mem.phone || "").trim(),
          phoneCleanVal,
          mem.baptismStatus || "NONE",
          (mem.position || "성도").trim(),
          (mem.department || "장년부").trim(),
          mem.customGardenId || null,
          mem.registrationDate || null,
          mem.status === "REMOVED" ? "REMOVED" : "ACTIVE",
          mem.id,
        ).run();
      } else {
        // Insert new member
        await env.DB.prepare(`
          INSERT INTO church_members (
            household_id, is_head, relationship, name, name_en, birth_date, gender,
            phone, phone_clean, baptism_status, position, department,
            custom_garden_id, registration_date, status, is_registered
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `).bind(
          targetHouseholdId,
          isHeadVal,
          mem.relationship || "CHILD",
          mem.name.trim(),
          mem.nameEn ? mem.nameEn.trim() : null,
          mem.birthDate || null,
          mem.gender || null,
          (mem.phone || "").trim(),
          phoneCleanVal,
          mem.baptismStatus || "NONE",
          (mem.position || "성도").trim(),
          (mem.department || "장년부").trim(),
          mem.customGardenId || null,
          mem.registrationDate || null,
          mem.status === "REMOVED" ? "REMOVED" : "ACTIVE",
        ).run();
      }
    }

    return c.json({
      success: true,
      message: "세대 및 구성원 정보가 성공적으로 저장되었습니다.",
      householdId: targetHouseholdId,
    }, 200);
  } catch (error) {
    console.error("bulkSaveHouseholdController error:", error);
    return c.json(
      { error: "BulkSaveError", message: "세대 정보 일괄 저장 중 오류가 발생했습니다: " + error.message },
      500,
    );
  }
};

/**
 * GET /api/admin/gardens/manage
 * Lists all gardens with assigned household & member counts and leader info
 */
export const manageGardensController = async (c) => {
  try {
    const env = c.env;
    const { results } = await env.DB.prepare(`
      SELECT 
        g.id,
        g.name,
        g.leader_member_id as leaderMemberId,
        cm.name as leaderName,
        g.order_num as orderNum,
        g.is_active as isActive,
        (SELECT COUNT(*) FROM households h WHERE h.garden_id = g.id) as householdCount,
        (
          SELECT COUNT(*) 
          FROM church_members m
          LEFT JOIN households h ON m.household_id = h.id
          WHERE (m.custom_garden_id = g.id OR (m.custom_garden_id IS NULL AND (h.garden_id = g.id OR (h.garden_id IS NULL AND g.id = 1))))
            AND m.status != 'REMOVED'
        ) as memberCount
      FROM gardens g
      LEFT JOIN church_members cm ON g.leader_member_id = cm.id
      ORDER BY g.order_num ASC, g.name ASC
    `).all();

    return c.json({ gardens: results || [] });
  } catch (error) {
    console.error("manageGardensController error:", error);
    return c.json({ error: "ManageGardensError", message: error.message }, 500);
  }
};

/**
 * POST /api/admin/gardens
 * Creates a new garden
 */
export const createGardenController = async (c) => {
  try {
    const env = c.env;
    const body = await c.req.json();
    const name = (body.name || "").trim();
    const orderNum = Number.isInteger(body.orderNum) ? body.orderNum : 0;
    const leaderMemberId = body.leaderMemberId ? Number(body.leaderMemberId) : null;
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : 1;

    if (!name) {
      return c.json({ error: "ValidationError", message: "정원 이름을 입력해 주세요." }, 400);
    }

    const existing = await env.DB.prepare("SELECT id FROM gardens WHERE name = ?").bind(name).first();
    if (existing) {
      return c.json({ error: "DuplicateError", message: "이미 존재하는 정원 이름입니다." }, 409);
    }

    const res = await env.DB.prepare(`
      INSERT INTO gardens (name, leader_member_id, order_num, is_active)
      VALUES (?, ?, ?, ?)
    `).bind(name, leaderMemberId, orderNum, isActive).run();

    return c.json({
      success: true,
      message: `[${name}] 정원이 성공적으로 등록되었습니다.`,
      garden: {
        id: res.meta.last_row_id,
        name,
        leaderMemberId,
        orderNum,
        isActive,
      },
    }, 201);
  } catch (error) {
    console.error("createGardenController error:", error);
    return c.json({ error: "CreateGardenError", message: error.message }, 500);
  }
};

/**
 * PUT /api/admin/gardens/:id
 * Updates an existing garden
 */
export const updateGardenController = async (c) => {
  try {
    const env = c.env;
    const id = Number(c.req.param("id"));
    const body = await c.req.json();

    if (!id) {
      return c.json({ error: "ValidationError", message: "유효하지 않은 정원 ID입니다." }, 400);
    }

    const existing = await env.DB.prepare("SELECT * FROM gardens WHERE id = ?").bind(id).first();
    if (!existing) {
      return c.json({ error: "NotFound", message: "해당 정원을 찾을 수 없습니다." }, 404);
    }

    const name = body.name !== undefined ? body.name.trim() : existing.name;
    const orderNum = body.orderNum !== undefined ? Number(body.orderNum) : existing.order_num;
    const leaderMemberId = body.leaderMemberId !== undefined ? (body.leaderMemberId ? Number(body.leaderMemberId) : null) : existing.leader_member_id;
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : existing.is_active;

    if (!name) {
      return c.json({ error: "ValidationError", message: "정원 이름을 입력해 주세요." }, 400);
    }

    if (name !== existing.name) {
      const dup = await env.DB.prepare("SELECT id FROM gardens WHERE name = ? AND id != ?").bind(name, id).first();
      if (dup) {
        return c.json({ error: "DuplicateError", message: "이미 존재하는 다른 정원 이름입니다." }, 409);
      }
    }

    await env.DB.prepare(`
      UPDATE gardens SET
        name = ?,
        leader_member_id = ?,
        order_num = ?,
        is_active = ?
      WHERE id = ?
    `).bind(name, leaderMemberId, orderNum, isActive, id).run();

    return c.json({
      success: true,
      message: `[${name}] 정원 정보가 성공적으로 수정되었습니다.`,
      garden: {
        id,
        name,
        leaderMemberId,
        orderNum,
        isActive,
      },
    });
  } catch (error) {
    console.error("updateGardenController error:", error);
    return c.json({ error: "UpdateGardenError", message: error.message }, 500);
  }
};

/**
 * DELETE /api/admin/gardens/:id
 * Deletes a garden if no households are assigned
 */
export const deleteGardenController = async (c) => {
  try {
    const env = c.env;
    const id = Number(c.req.param("id"));

    if (!id) {
      return c.json({ error: "ValidationError", message: "유효하지 않은 정원 ID입니다." }, 400);
    }

    if (id === 1) {
      return c.json({ error: "ProtectedGarden", message: "'미배정' 기본 정원은 삭제할 수 없습니다." }, 400);
    }

    const existing = await env.DB.prepare("SELECT * FROM gardens WHERE id = ?").bind(id).first();
    if (!existing) {
      return c.json({ error: "NotFound", message: "해당 정원을 찾을 수 없습니다." }, 404);
    }

    const countRes = await env.DB.prepare("SELECT COUNT(*) as count FROM households WHERE garden_id = ?").bind(id).first();
    if (countRes && countRes.count > 0) {
      return c.json({
        error: "HasAssignedHouseholds",
        message: `현재 이 정원에 소속된 세대(${countRes.count}가구)가 있어 삭제할 수 없습니다. 소속 세대를 다른 정원으로 변경하거나 '비활성'으로 전환해 주세요.`,
        householdCount: countRes.count,
      }, 400);
    }

    await env.DB.prepare("DELETE FROM gardens WHERE id = ?").bind(id).run();

    return c.json({ success: true, message: `[${existing.name}] 정원이 성공적으로 삭제되었습니다.` });
  } catch (error) {
    console.error("deleteGardenController error:", error);
    return c.json({ error: "DeleteGardenError", message: error.message }, 500);
  }
};

/**
 * PUT /api/admin/gardens/reorder
 * Batch updates order_num for gardens
 * Body: { orderedIds: [id1, id2, ...] }
 */
export const reorderGardensController = async (c) => {
  try {
    const env = c.env;
    const body = await c.req.json();
    const orderedIds = body.orderedIds;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return c.json({ error: "ValidationError", message: "orderedIds 배열이 필요합니다." }, 400);
    }

    const stmt = env.DB.prepare("UPDATE gardens SET order_num = ? WHERE id = ?");
    const statements = orderedIds.map((id, index) => stmt.bind(index + 1, Number(id)));
    await env.DB.batch(statements);

    return c.json({
      success: true,
      message: "정원 순서가 성공적으로 저장되었습니다.",
      orderedIds,
    });
  } catch (error) {
    console.error("reorderGardensController error:", error);
    return c.json({ error: "ReorderGardensError", message: error.message }, 500);
  }
};


