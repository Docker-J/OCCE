/**
 * @file adminCourse.controller.js
 * @description Controllers for Course and Cohort Management (온교회 양육 및 교육과정 기수 관리)
 */

/**
 * GET /api/admin/courses
 * Lists all courses with cohort counts and total enrolled student statistics
 */
export const listCoursesController = async (c) => {
  try {
    const env = c.env;
    const { results } = await env.DB.prepare(`
      SELECT 
        c.id,
        c.name,
        c.category,
        c.description,
        c.order_num as orderNum,
        c.is_active as isActive,
        COUNT(DISTINCT ch.id) as cohortCount,
        COUNT(DISTINCT CASE WHEN mc.status = 'IN_PROGRESS' THEN mc.member_id END) as inProgressCount,
        COUNT(DISTINCT CASE WHEN mc.status = 'COMPLETED' THEN mc.member_id END) as completedCount
      FROM courses c
      LEFT JOIN course_cohorts ch ON c.id = ch.course_id
      LEFT JOIN member_courses mc ON ch.id = mc.cohort_id
      GROUP BY c.id
      ORDER BY c.order_num ASC, c.id DESC
    `).all();

    return c.json({ courses: results || [] });
  } catch (error) {
    console.error("listCoursesController error:", error);
    return c.json({ error: "FetchCoursesError", message: error.message }, 500);
  }
};

/**
 * POST /api/admin/courses
 * Creates a new training course
 */
export const createCourseController = async (c) => {
  try {
    const env = c.env;
    const { name, category, description, orderNum } = await c.req.json();

    if (!name || !name.trim()) {
      return c.json({ error: "InvalidRequest", message: "과정명(name)은 필수입니다." }, 400);
    }

    const trimmedName = name.trim();
    const res = await env.DB.prepare(`
      INSERT INTO courses (name, category, description, order_num, is_active)
      VALUES (?, ?, ?, ?, 1)
    `).bind(
      trimmedName,
      category ? category.trim() : null,
      description ? description.trim() : null,
      typeof orderNum === "number" ? orderNum : 0
    ).run();

    return c.json({
      success: true,
      message: "새로운 교육과정이 개설되었습니다.",
      course: {
        id: res.meta.last_row_id,
        name: trimmedName,
        category: category || null,
        description: description || null,
        orderNum: typeof orderNum === "number" ? orderNum : 0,
        isActive: 1,
        cohortCount: 0,
        inProgressCount: 0,
        completedCount: 0,
      },
    }, 201);
  } catch (error) {
    console.error("createCourseController error:", error);
    if (error.message?.includes("UNIQUE constraint failed: courses.name")) {
      return c.json({ error: "DuplicateCourse", message: "이미 동일한 이름의 교육과정이 존재합니다." }, 409);
    }
    return c.json({ error: "CreateCourseError", message: error.message }, 500);
  }
};

/**
 * PUT /api/admin/courses/:id
 * Updates an existing course
 */
export const updateCourseController = async (c) => {
  try {
    const env = c.env;
    const id = parseInt(c.req.param("id"), 10);
    const { name, category, description, orderNum, isActive } = await c.req.json();

    if (isNaN(id) || !name || !name.trim()) {
      return c.json({ error: "InvalidRequest", message: "유효하지 않은 요청 데이터입니다." }, 400);
    }

    await env.DB.prepare(`
      UPDATE courses SET
        name = ?,
        category = ?,
        description = ?,
        order_num = ?,
        is_active = ?
      WHERE id = ?
    `).bind(
      name.trim(),
      category ? category.trim() : null,
      description ? description.trim() : null,
      typeof orderNum === "number" ? orderNum : 0,
      isActive === false || isActive === 0 ? 0 : 1,
      id
    ).run();

    return c.json({ success: true, message: "과정 정보가 수정되었습니다." });
  } catch (error) {
    console.error("updateCourseController error:", error);
    if (error.message?.includes("UNIQUE constraint failed: courses.name")) {
      return c.json({ error: "DuplicateCourse", message: "이미 동일한 이름의 교육과정이 존재합니다." }, 409);
    }
    return c.json({ error: "UpdateCourseError", message: error.message }, 500);
  }
};

/**
 * DELETE /api/admin/courses/:id
 * Deletes a course and cascades cohorts
 */
export const deleteCourseController = async (c) => {
  try {
    const env = c.env;
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "InvalidRequest", message: "유효하지 않은 과정 ID입니다." }, 400);
    }

    await env.DB.prepare("DELETE FROM courses WHERE id = ?").bind(id).run();
    return c.json({ success: true, message: "교육과정이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("deleteCourseController error:", error);
    return c.json({ error: "DeleteCourseError", message: error.message }, 500);
  }
};

/**
 * GET /api/admin/courses/:courseId/cohorts
 * Lists all cohorts belonging to a specific course
 */
export const listCohortsController = async (c) => {
  try {
    const env = c.env;
    const courseId = parseInt(c.req.param("courseId"), 10);
    if (isNaN(courseId)) {
      return c.json({ error: "InvalidRequest", message: "유효하지 않은 과정 ID입니다." }, 400);
    }

    const { results } = await env.DB.prepare(`
      SELECT 
        ch.id,
        ch.course_id as courseId,
        ch.term_name as termName,
        ch.instructor,
        ch.start_date as startDate,
        ch.end_date as endDate,
        ch.status,
        ch.notes,
        COUNT(mc.id) as totalEnrolled,
        COUNT(CASE WHEN mc.status = 'IN_PROGRESS' THEN 1 END) as inProgressCount,
        COUNT(CASE WHEN mc.status = 'COMPLETED' THEN 1 END) as completedCount
      FROM course_cohorts ch
      LEFT JOIN member_courses mc ON ch.id = mc.cohort_id
      WHERE ch.course_id = ?
      GROUP BY ch.id
      ORDER BY ch.id DESC
    `).bind(courseId).all();

    return c.json({ cohorts: results || [] });
  } catch (error) {
    console.error("listCohortsController error:", error);
    return c.json({ error: "FetchCohortsError", message: error.message }, 500);
  }
};

/**
 * POST /api/admin/courses/:courseId/cohorts
 * Creates a new cohort for a course
 */
export const createCohortController = async (c) => {
  try {
    const env = c.env;
    const courseId = parseInt(c.req.param("courseId"), 10);
    const { termName, instructor, startDate, endDate, status, notes } = await c.req.json();

    if (isNaN(courseId) || !termName || !termName.trim()) {
      return c.json({ error: "InvalidRequest", message: "기수명(termName)은 필수입니다." }, 400);
    }

    const trimmedTerm = termName.trim();
    const res = await env.DB.prepare(`
      INSERT INTO course_cohorts (course_id, term_name, instructor, start_date, end_date, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      courseId,
      trimmedTerm,
      instructor ? instructor.trim() : null,
      startDate || null,
      endDate || null,
      status || "IN_PROGRESS",
      notes ? notes.trim() : null
    ).run();

    return c.json({
      success: true,
      message: "새로운 기수가 개설되었습니다.",
      cohort: {
        id: res.meta.last_row_id,
        courseId,
        termName: trimmedTerm,
        instructor: instructor || null,
        startDate: startDate || null,
        endDate: endDate || null,
        status: status || "IN_PROGRESS",
        notes: notes || null,
        totalEnrolled: 0,
        inProgressCount: 0,
        completedCount: 0,
      },
    }, 201);
  } catch (error) {
    console.error("createCohortController error:", error);
    if (error.message?.includes("UNIQUE constraint failed: course_cohorts.course_id, course_cohorts.term_name")) {
      return c.json({ error: "DuplicateCohort", message: "해당 과정에 이미 동일한 기수명이 존재합니다." }, 409);
    }
    return c.json({ error: "CreateCohortError", message: error.message }, 500);
  }
};

/**
 * PUT /api/admin/cohorts/:cohortId
 * Updates cohort details or status
 */
export const updateCohortController = async (c) => {
  try {
    const env = c.env;
    const cohortId = parseInt(c.req.param("cohortId"), 10);
    const { termName, instructor, startDate, endDate, status, notes } = await c.req.json();

    if (isNaN(cohortId) || !termName || !termName.trim()) {
      return c.json({ error: "InvalidRequest", message: "유효하지 않은 기수 데이터입니다." }, 400);
    }

    await env.DB.prepare(`
      UPDATE course_cohorts SET
        term_name = ?,
        instructor = ?,
        start_date = ?,
        end_date = ?,
        status = ?,
        notes = ?
      WHERE id = ?
    `).bind(
      termName.trim(),
      instructor ? instructor.trim() : null,
      startDate || null,
      endDate || null,
      status || "IN_PROGRESS",
      notes ? notes.trim() : null,
      cohortId
    ).run();

    return c.json({ success: true, message: "기수 정보가 수정되었습니다." });
  } catch (error) {
    console.error("updateCohortController error:", error);
    if (error.message?.includes("UNIQUE constraint failed: course_cohorts.course_id, course_cohorts.term_name")) {
      return c.json({ error: "DuplicateCohort", message: "해당 과정에 이미 동일한 기수명이 존재합니다." }, 409);
    }
    return c.json({ error: "UpdateCohortError", message: error.message }, 500);
  }
};

/**
 * DELETE /api/admin/cohorts/:cohortId
 * Deletes a cohort
 */
export const deleteCohortController = async (c) => {
  try {
    const env = c.env;
    const cohortId = parseInt(c.req.param("cohortId"), 10);
    if (isNaN(cohortId)) {
      return c.json({ error: "InvalidRequest", message: "유효하지 않은 기수 ID입니다." }, 400);
    }

    await env.DB.prepare("DELETE FROM course_cohorts WHERE id = ?").bind(cohortId).run();
    return c.json({ success: true, message: "기수가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("deleteCohortController error:", error);
    return c.json({ error: "DeleteCohortError", message: error.message }, 500);
  }
};

/**
 * GET /api/admin/cohorts/:cohortId/members
 * Lists all members enrolled in a cohort
 */
export const listCohortMembersController = async (c) => {
  try {
    const env = c.env;
    const cohortId = parseInt(c.req.param("cohortId"), 10);
    if (isNaN(cohortId)) {
      return c.json({ error: "InvalidRequest", message: "유효하지 않은 기수 ID입니다." }, 400);
    }

    const { results } = await env.DB.prepare(`
      SELECT 
        mc.id as enrollmentId,
        mc.member_id as memberId,
        mc.cohort_id as cohortId,
        mc.status,
        mc.completion_date as completionDate,
        mc.notes,
        m.name,
        m.name_en as nameEn,
        m.phone,
        m.department,
        m.position,
        COALESCE(cg.name, g.name, '미배정') as gardenName
      FROM member_courses mc
      JOIN church_members m ON mc.member_id = m.id
      JOIN households h ON m.household_id = h.id
      LEFT JOIN gardens g ON h.garden_id = g.id
      LEFT JOIN gardens cg ON m.custom_garden_id = cg.id
      WHERE mc.cohort_id = ?
      ORDER BY mc.status ASC, m.name ASC
    `).bind(cohortId).all();

    return c.json({ members: results || [] });
  } catch (error) {
    console.error("listCohortMembersController error:", error);
    return c.json({ error: "FetchCohortMembersError", message: error.message }, 500);
  }
};

/**
 * POST /api/admin/cohorts/:cohortId/members
 * Enrolls a member into a cohort
 */
export const enrollCohortMemberController = async (c) => {
  try {
    const env = c.env;
    const cohortId = parseInt(c.req.param("cohortId"), 10);
    const { memberId, status, completionDate, notes } = await c.req.json();

    if (isNaN(cohortId) || !memberId) {
      return c.json({ error: "InvalidRequest", message: "기수 ID와 교인 ID(memberId)는 필수입니다." }, 400);
    }

    const enrollmentStatus = status || "IN_PROGRESS";
    const compDate = enrollmentStatus === "COMPLETED" ? (completionDate || new Date().toISOString().split("T")[0]) : null;

    const res = await env.DB.prepare(`
      INSERT INTO member_courses (member_id, cohort_id, status, completion_date, notes)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      memberId,
      cohortId,
      enrollmentStatus,
      compDate,
      notes ? notes.trim() : null
    ).run();

    return c.json({
      success: true,
      message: "수강생이 성공적으로 등록되었습니다.",
      enrollmentId: res.meta.last_row_id,
    }, 201);
  } catch (error) {
    console.error("enrollCohortMemberController error:", error);
    if (error.message?.includes("UNIQUE constraint failed: member_courses.member_id, member_courses.cohort_id")) {
      return c.json({ error: "DuplicateEnrollment", message: "해당 교인은 이미 본 기수에 등록되어 있습니다." }, 409);
    }
    return c.json({ error: "EnrollMemberError", message: error.message }, 500);
  }
};

/**
 * PATCH /api/admin/cohorts/:cohortId/members/:memberId
 * Updates enrollment status (e.g. mark completed)
 */
export const updateEnrollmentStatusController = async (c) => {
  try {
    const env = c.env;
    const cohortId = parseInt(c.req.param("cohortId"), 10);
    const memberId = parseInt(c.req.param("memberId"), 10);
    const { status, completionDate, notes } = await c.req.json();

    if (isNaN(cohortId) || isNaN(memberId) || !status) {
      return c.json({ error: "InvalidRequest", message: "유효하지 않은 요청 데이터입니다." }, 400);
    }

    const compDate = status === "COMPLETED" ? (completionDate || new Date().toISOString().split("T")[0]) : null;

    await env.DB.prepare(`
      UPDATE member_courses SET
        status = ?,
        completion_date = ?,
        notes = COALESCE(?, notes)
      WHERE cohort_id = ? AND member_id = ?
    `).bind(
      status,
      compDate,
      notes !== undefined ? (notes ? notes.trim() : null) : null,
      cohortId,
      memberId
    ).run();

    return c.json({ success: true, message: "수강 상태가 변경되었습니다." });
  } catch (error) {
    console.error("updateEnrollmentStatusController error:", error);
    return c.json({ error: "UpdateEnrollmentError", message: error.message }, 500);
  }
};

/**
 * POST /api/admin/cohorts/:cohortId/complete-all
 * Marks all in-progress students in a cohort as COMPLETED with a given completionDate
 */
export const completeAllCohortMembersController = async (c) => {
  try {
    const env = c.env;
    const cohortId = parseInt(c.req.param("cohortId"), 10);
    const { completionDate } = await c.req.json().catch(() => ({}));

    if (isNaN(cohortId)) {
      return c.json({ error: "InvalidRequest", message: "유효하지 않은 기수 ID입니다." }, 400);
    }

    const compDate = completionDate || new Date().toISOString().split("T")[0];

    const res = await env.DB.prepare(`
      UPDATE member_courses SET
        status = 'COMPLETED',
        completion_date = ?
      WHERE cohort_id = ? AND status != 'COMPLETED'
    `).bind(compDate, cohortId).run();

    // Optionally mark the cohort itself as COMPLETED
    await env.DB.prepare("UPDATE course_cohorts SET status = 'COMPLETED' WHERE id = ?").bind(cohortId).run();

    return c.json({
      success: true,
      message: `${res.meta.changes || 0}명의 수강생이 수료 처리되었습니다.`,
      completedCount: res.meta.changes || 0,
    });
  } catch (error) {
    console.error("completeAllCohortMembersController error:", error);
    return c.json({ error: "CompleteAllError", message: error.message }, 500);
  }
};

/**
 * DELETE /api/admin/cohorts/:cohortId/members/:memberId
 * Removes an enrollment
 */
export const removeCohortMemberController = async (c) => {
  try {
    const env = c.env;
    const cohortId = parseInt(c.req.param("cohortId"), 10);
    const memberId = parseInt(c.req.param("memberId"), 10);

    if (isNaN(cohortId) || isNaN(memberId)) {
      return c.json({ error: "InvalidRequest", message: "유효하지 않은 식별자입니다." }, 400);
    }

    await env.DB.prepare("DELETE FROM member_courses WHERE cohort_id = ? AND member_id = ?")
      .bind(cohortId, memberId)
      .run();

    return c.json({ success: true, message: "수강생 등록이 취소되었습니다." });
  } catch (error) {
    console.error("removeCohortMemberController error:", error);
    return c.json({ error: "RemoveEnrollmentError", message: error.message }, 500);
  }
};

/**
 * GET /api/admin/members/:memberId/courses
 * Fetches all courses and cohorts a member has taken or is currently taking
 */
export const getMemberCoursesController = async (c) => {
  try {
    const env = c.env;
    const memberId = parseInt(c.req.param("memberId"), 10);
    if (isNaN(memberId)) {
      return c.json({ error: "InvalidRequest", message: "유효하지 않은 교인 ID입니다." }, 400);
    }

    const { results } = await env.DB.prepare(`
      SELECT 
        mc.id as enrollmentId,
        mc.cohort_id as cohortId,
        mc.status,
        mc.completion_date as completionDate,
        mc.notes,
        ch.term_name as termName,
        ch.instructor,
        ch.start_date as startDate,
        ch.end_date as endDate,
        c.id as courseId,
        c.name as courseName,
        c.category as courseCategory
      FROM member_courses mc
      JOIN course_cohorts ch ON mc.cohort_id = ch.id
      JOIN courses c ON ch.course_id = c.id
      WHERE mc.member_id = ?
      ORDER BY mc.status ASC, mc.completion_date DESC, ch.id DESC
    `).bind(memberId).all();

    return c.json({ courses: results || [] });
  } catch (error) {
    console.error("getMemberCoursesController error:", error);
    return c.json({ error: "FetchMemberCoursesError", message: error.message }, 500);
  }
};
