import axios from "axios";

/**
 * Fetch all registered users from Cognito
 */
export const getAdminUsers = async (paginationToken) => {
  const params = paginationToken ? { paginationToken } : {};
  const res = await axios.get("/api/admin/users", { params });
  return res.data;
};

/**
 * Assign, update gardens, or remove the 'GardenKeeper' role for a user
 * @param {string} username
 * @param {'assign' | 'update_gardens' | 'remove'} action
 * @param {string[] | string} [gardens]
 */
export const updateUserRole = async (username, action, gardens) => {
  const res = await axios.post(
    `/api/admin/users/${encodeURIComponent(username)}/role`,
    { action, gardens },
  );
  return res.data;
};

/**
 * Enable or disable a user account
 * @param {string} username
 * @param {boolean} enabled
 */
export const updateUserStatus = async (username, enabled) => {
  const res = await axios.post(
    `/api/admin/users/${encodeURIComponent(username)}/status`,
    { enabled },
  );
  return res.data;
};

/**
 * Delete a user account from Cognito User Pool
 * @param {string} username
 */
export const deleteUser = async (username) => {
  const res = await axios.delete(
    `/api/admin/users/${encodeURIComponent(username)}`,
  );
  return res.data;
};

/**
 * Fetch weekly attendance summaries and historical trends
 */
export const getAdminAttendanceStats = async () => {
  const res = await axios.get("/api/admin/attendance/summary");
  return res.data;
};

/**
 * Fetch detailed attendance list (attendees, absentees, notes) for a specific garden
 * @param {string} gardenName
 * @param {string} date - YYYY-MM-DD
 */
export const getAdminGardenAttendanceDetail = async (gardenName, date) => {
  const res = await axios.get(
    `/api/admin/attendance/gardens/${encodeURIComponent(gardenName)}/${encodeURIComponent(date)}`,
  );
  return res.data;
};
