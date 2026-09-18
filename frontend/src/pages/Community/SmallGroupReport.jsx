/**
 * @file SmallGroupReport.jsx
 * @description 온교회 주일 출석 보고서 및 정원 모임 보고서 페이지
 * 개별 컴포넌트 및 커스텀 훅 분리 구조 적용
 */

import { Typography, Box } from "@mui/material";
import axios from "axios";
import useModals from "../../util/useModal";

// 커스텀 훅
import { useSmallGroupReport } from "./hooks/useSmallGroupReport";

// 하위 컴포넌트들
import ReportStatusView from "./components/ReportStatusView";
import ReportTypeTabs from "./components/ReportTypeTabs";
import GatheringForm from "./GatheringForm";
import SundayForm from "./SundayForm";
import ConfirmSubmitDialog from "./ConfirmSubmitDialog";

const TITLE_BG_STYLE = {
  backgroundImage: 'url("/img/Community/SmallGroup.webp")',
  backgroundPositionY: "58%",
};

const SmallGroupReport = () => {
  const { openModal } = useModals();

  const { state, actions } = useSmallGroupReport();

  const {
    authInitialized,
    authenticated,
    isLeader,
    loading,
    error,
    gardens,
    selectedGarden,
    selectedDate,
    recentSundays,
    checkedMembers,
    absenceReasons,
    isReported,
    checkingReport,
    submitting,
    reportType,
    confirmOpen,
    gatheringDate,
    gatheringDateStr,
    gatheringTime,
    gatheringLocation,
    gatheringNotes,
    gatheringHistoryDates,
    membersList,
    attendees,
    absentees,
  } = state;

  const {
    fetchData,
    handleReportTypeChange,
    handleGardenChange,
    setSelectedDate,
    setGatheringDate,
    setGatheringTime,
    setGatheringLocation,
    setGatheringNotes,
    handleToggleMember,
    handleAbsenceReasonChange,
    handleCheckAll,
    handleUncheckAll,
    handleFormSubmit,
    handleConfirmSubmit,
    setConfirmOpen,
  } = actions;

  const handleLoginClick = async () => {
    const { default: SignInModal } = await import("../../components/User/SignInModal");
    openModal(SignInModal, {});
  };

  const isGuarded = !authInitialized || !authenticated || !isLeader || loading || error || submitting;

  return (
    <>
      <title>
        {reportType === "gathering" ? "정원 모임 보고 - OCCE" : "주일 출석 보고 - OCCE"}
      </title>

      {/* 헤더 배너 */}
      <div className="title-wrapper" style={TITLE_BG_STYLE}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              letterSpacing: "0.2em",
              pl: "0.2em",
              color: "white",
            }}
          >
            {reportType === "gathering" ? "정원 모임 보고" : "주일 출석 보고"}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.8)",
              mt: "8px",
            }}
          >
            {reportType === "gathering"
              ? "정원 모임을 가진 후, 모임 정보와 나눔 내용을 보고해주세요."
              : "주일에 교회에 출석한 정원 가족들을 보고해주세요."}
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div
          className="container"
          style={{
            maxWidth: "800px",
            width: "100%",
            margin: "0 auto",
            padding: "24px 16px",
          }}
        >
          {/* 상태 가드 뷰 (인증, 로딩, 에러, 제출 중) */}
          {isGuarded ? (
            <ReportStatusView
              authInitialized={authInitialized}
              authenticated={authenticated}
              isLeader={isLeader}
              loading={loading}
              error={error}
              submitting={submitting}
              reportType={reportType}
              onLoginClick={handleLoginClick}
              onRetry={fetchData}
            />
          ) : (
            /* 실제 폼 뷰 */
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* 탭 전환 버튼 */}
              <ReportTypeTabs
                reportType={reportType}
                onReportTypeChange={handleReportTypeChange}
              />

              {/* 탭별 폼 렌더링 */}
              {reportType === "gathering" ? (
                <GatheringForm
                  gardens={gardens}
                  selectedGarden={selectedGarden}
                  handleGardenChange={handleGardenChange}
                  gatheringDate={gatheringDate}
                  setGatheringDate={setGatheringDate}
                  gatheringTime={gatheringTime}
                  setGatheringTime={setGatheringTime}
                  gatheringLocation={gatheringLocation}
                  setGatheringLocation={setGatheringLocation}
                  gatheringNotes={gatheringNotes}
                  setGatheringNotes={setGatheringNotes}
                  gatheringHistoryDates={gatheringHistoryDates}
                  gatheringDateStr={gatheringDateStr}
                  checkingReport={checkingReport}
                  isReported={isReported}
                  attendees={attendees}
                  absentees={absentees}
                  checkedMembers={checkedMembers}
                  handleToggleMember={handleToggleMember}
                  handleCheckAll={handleCheckAll}
                  handleUncheckAll={handleUncheckAll}
                  handleFormSubmit={handleFormSubmit}
                  submitting={submitting}
                  membersList={membersList}
                />
              ) : (
                <SundayForm
                  gardens={gardens}
                  selectedGarden={selectedGarden}
                  handleGardenChange={handleGardenChange}
                  recentSundays={recentSundays}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  checkingReport={checkingReport}
                  isReported={isReported}
                  attendees={attendees}
                  absentees={absentees}
                  checkedMembers={checkedMembers}
                  handleToggleMember={handleToggleMember}
                  handleCheckAll={handleCheckAll}
                  handleUncheckAll={handleUncheckAll}
                  absenceReasons={absenceReasons}
                  handleAbsenceReasonChange={handleAbsenceReasonChange}
                  handleFormSubmit={handleFormSubmit}
                  submitting={submitting}
                  membersList={membersList}
                />
              )}
            </Box>
          )}
        </div>
      </div>

      {/* 제출 확인 다이얼로그 */}
      {confirmOpen && (
        <ConfirmSubmitDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmSubmit}
          reportType={reportType}
          isReported={isReported}
          selectedGarden={selectedGarden}
          selectedDate={selectedDate}
          gatheringDate={gatheringDate}
          gatheringTime={gatheringTime}
          gatheringLocation={gatheringLocation}
          attendees={attendees}
          absentees={absentees}
        />
      )}
    </>
  );
};

export default SmallGroupReport;

/**
 * React Router 제출 Action 핸들러
 */
export async function action({ request }) {
  try {
    const { reportType, payload } = await request.json();

    if (reportType === "gathering") {
      const res = await axios.post("/api/attendance/gathering-report", payload);
      return { success: true, reportType, message: res.data || "Success" };
    } else {
      const res = await axios.post("/api/attendance/report", payload);
      return { success: true, reportType, message: res.data || "Success" };
    }
  } catch (error) {
    console.error("Action error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "보고 제출에 실패했습니다.",
    };
  }
}
