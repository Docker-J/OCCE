import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
} from "@mui/material";
import { formatDateString, formatDateLabel } from "./SmallGroupReportUtils.js";
import GardenSelector from "./GardenSelector";
import AttendanceChecklist from "./AttendanceChecklist";
import ReportStatusBanner from "./ReportStatusBanner";
import ReportSubmitButton from "./ReportSubmitButton";

const SundayForm = ({
  gardens,
  selectedGarden,
  handleGardenChange,
  recentSundays,
  selectedDate,
  setSelectedDate,
  checkingReport,
  isReported,
  attendees,
  absentees,
  checkedMembers,
  handleToggleMember,
  absenceReasons,
  handleAbsenceReasonChange,
  handleFormSubmit,
  submitting,
  membersList,
}) => {
  return (
    <>
      {/* Form Settings Card */}
      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
          p: 2,
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            {/* Date Picker */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="select-date-label">보고주일</InputLabel>
                <Select
                  labelId="select-date-label"
                  value={selectedDate}
                  label="보고주일"
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  {recentSundays.map((date) => {
                    const val = formatDateString(date);
                    return (
                      <MenuItem key={val} value={val}>
                        {formatDateLabel(date)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            {/* Garden Selection */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <GardenSelector
                gardens={gardens}
                selectedGarden={selectedGarden}
                handleGardenChange={handleGardenChange}
                color="#dc2626"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Report Status Banner */}
      <ReportStatusBanner
        checkingReport={checkingReport}
        isReported={isReported}
        color="#dc2626"
        title="이미 제출된 출석 보고서가 있습니다"
        message="기존에 제출하신 출석/결석 및 사유를 불러왔습니다. 변경이 필요한 부분만 수정한 후 다시 제출하시면 업데이트됩니다."
      />

      {/* Members Attendance Checklist Card */}
      <AttendanceChecklist
        title="출석체크"
        description="💡 기본적으로 모든 정원 가족이 출석으로 되어있습니다. 결석하신 분만 체크를 해제해 주세요."
        themeColor="#dc2626"
        lightBgColor="#fef2f2"
        borderColor="#fca5a5"
        badgeBorderColor="#fee2e2"
        hoverBorderColor="#dc2626"
        hoverBgColor="#fee2e2"
        attendeesCount={attendees.length}
        absenteesCount={absentees.length}
        membersList={gardens[selectedGarden] || []}
        checkedMembers={checkedMembers}
        handleToggleMember={handleToggleMember}
        checkingReport={checkingReport}
      />

      {/* Absentees Reasons Card */}
      {absentees.length > 0 && (
        <Card
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
            p: 2,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#dc2626", mb: 2 }}
            >
              결석 사유 입력 (선택사항)
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
              결석한 교인별로 사유(예: 개인 여행, 감기 몸살, 출장 등)를
              적어주시면 구글 시트에 메모로 기록됩니다.
            </Typography>
            <Grid container spacing={2}>
              {absentees.map((name) => (
                <Grid
                  size={{ xs: 12, sm: 6 }}
                  key={name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      minWidth: "70px",
                      color: "#dc2626",
                    }}
                  >
                    {name}
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    disabled={checkingReport}
                    placeholder="예: 개인 여행, 감기 몸살 등"
                    value={absenceReasons[name] || ""}
                    onChange={(e) =>
                      handleAbsenceReasonChange(name, e.target.value)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <ReportSubmitButton
        submitting={submitting}
        checkingReport={checkingReport}
        disabled={membersList.length === 0}
        isReported={isReported}
        onClick={handleFormSubmit}
        themeColor="#dc2626"
        hoverColor="#b91c1c"
        shadowColor="rgba(220, 38, 38, 0.3)"
        submitText="주일 출석 보고 제출하기"
        updateText="주일 출석 보고 수정(업데이트)하기"
      />
    </>
  );
};

export default SundayForm;
