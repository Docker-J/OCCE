import axios from "axios";

/**
 * Fetch all registered users / church members from D1 & Cognito
 */
export const getAdminUsers = async (paginationToken) => {
  const params = paginationToken ? { paginationToken } : {};
  const res = await axios.get("/api/admin/users", { params });
  return res.data;
};

/**
 * Create a new church member (and optionally a new household with address)
 */
export const createMember = async (memberData) => {
  const res = await axios.post("/api/admin/members", memberData);
  return res.data;
};

/**
 * Update an existing church member and/or household
 */
export const updateMember = async (id, memberData) => {
  const res = await axios.put(`/api/admin/members/${id}`, memberData);
  return res.data;
};

/**
 * Bulk save household and multiple members (batch operation)
 */
export const bulkSaveHousehold = async (data) => {
  const res = await axios.post("/api/admin/households/bulk-save", data);
  return res.data;
};

/**
 * Update member status ('ACTIVE', 'INACTIVE', 'REMOVED' 제적)
 */
export const updateMemberStatus = async (id, status, options = {}) => {
  const { cascadeHousehold = false, successorMemberId = null } = options;
  const res = await axios.patch(`/api/admin/members/${id}/status`, {
    status,
    cascadeHousehold,
    successorMemberId,
  });
  return res.data;
};

/**
 * Permanently delete a church member
 */
export const deleteMember = async (id, options = {}) => {
  const { successorMemberId = null } = options;
  const res = await axios.delete(`/api/admin/members/${id}`, {
    data: { successorMemberId },
  });
  return res.data;
};

/**
 * One-time bootstrap import of Google Drive roster Excel into D1
 */
export const importRosterFromDrive = async () => {
  const res = await axios.post("/api/admin/members/import-drive");
  return res.data;
};

/**
 * Fetch active gardens list
 */
export const getAdminGardens = async () => {
  const res = await axios.get("/api/admin/gardens");
  return res.data;
};

/**
 * Fetch all gardens with member/household statistics and leader info
 */
export const getAdminGardensWithStats = async () => {
  const res = await axios.get("/api/admin/gardens/manage");
  return res.data;
};

/**
 * Create a new garden
 */
export const createGarden = async (gardenData) => {
  const res = await axios.post("/api/admin/gardens", gardenData);
  return res.data;
};

/**
 * Update an existing garden
 */
export const updateGarden = async (id, gardenData) => {
  const res = await axios.put(`/api/admin/gardens/${id}`, gardenData);
  return res.data;
};

/**
 * Delete a garden
 */
export const deleteGarden = async (id) => {
  const res = await axios.delete(`/api/admin/gardens/${id}`);
  return res.data;
};

/**
 * Reorder gardens by array of garden IDs
 * @param {number[]} orderedIds
 */
export const reorderGardens = async (orderedIds) => {
  const res = await axios.put("/api/admin/gardens/reorder", { orderedIds });
  return res.data;
};

/**
 * Fetch households list
 */
export const getAdminHouseholds = async () => {
  const res = await axios.get("/api/admin/households");
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
 * @param {boolean} [refresh=false] - When true, forces a manual refresh
 */
export const getAdminAttendanceStats = async (refresh = false) => {
  const res = await axios.get("/api/admin/attendance/summary", {
    params: refresh ? { refresh: "true" } : {},
  });
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

// ==========================================
// 양육 및 교육과정 (Courses) & 기수 (Cohorts) APIs
// ==========================================

export const getCourses = async () => {
  const res = await axios.get("/api/admin/courses");
  return res.data;
};

export const createCourse = async (courseData) => {
  const res = await axios.post("/api/admin/courses", courseData);
  return res.data;
};

export const updateCourse = async (id, courseData) => {
  const res = await axios.put(`/api/admin/courses/${id}`, courseData);
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await axios.delete(`/api/admin/courses/${id}`);
  return res.data;
};

export const getCourseCohorts = async (courseId) => {
  const res = await axios.get(`/api/admin/courses/${courseId}/cohorts`);
  return res.data;
};

export const getCourseAllMembers = async (courseId) => {
  const res = await axios.get(`/api/admin/courses/${courseId}/all-members`);
  return res.data;
};

export const createCohort = async (courseId, cohortData) => {
  const res = await axios.post(`/api/admin/courses/${courseId}/cohorts`, cohortData);
  return res.data;
};

export const updateCohort = async (cohortId, cohortData) => {
  const res = await axios.put(`/api/admin/cohorts/${cohortId}`, cohortData);
  return res.data;
};

export const deleteCohort = async (cohortId) => {
  const res = await axios.delete(`/api/admin/cohorts/${cohortId}`);
  return res.data;
};

export const getCohortMembers = async (cohortId) => {
  const res = await axios.get(`/api/admin/cohorts/${cohortId}/members`);
  return res.data;
};

export const enrollCohortMember = async (cohortId, enrollmentData) => {
  const res = await axios.post(`/api/admin/cohorts/${cohortId}/members`, enrollmentData);
  return res.data;
};

export const updateEnrollmentStatus = async (cohortId, memberId, updateData) => {
  const res = await axios.patch(`/api/admin/cohorts/${cohortId}/members/${memberId}`, updateData);
  return res.data;
};

export const completeAllCohortMembers = async (cohortId, completionDate) => {
  const res = await axios.post(`/api/admin/cohorts/${cohortId}/complete-all`, { completionDate });
  return res.data;
};

export const removeCohortMember = async (cohortId, memberId) => {
  const res = await axios.delete(`/api/admin/cohorts/${cohortId}/members/${memberId}`);
  return res.data;
};

export const getMemberCourses = async (memberId) => {
  const res = await axios.get(`/api/admin/members/${memberId}/courses`);
  return res.data;
};

