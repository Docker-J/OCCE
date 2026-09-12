import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Chip,
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isToday } from "date-fns";
import {
  GatheringCustomDay,
  GatheringDateButtonField,
  GatheringTimeButtonField,
} from "./GatheringPickerFields";
import GardenSelector from "./GardenSelector";
import AttendanceChecklist from "./AttendanceChecklist";
import ReportStatusBanner from "./ReportStatusBanner";
import ReportSubmitButton from "./ReportSubmitButton";

const GatheringForm = ({
  gardens,
  selectedGarden,
  handleGardenChange,
  gatheringDate,
  setGatheringDate,
  gatheringTime,
  setGatheringTime,
  gatheringLocation,
  setGatheringLocation,
  gatheringNotes,
  setGatheringNotes,
  gatheringHistoryDates = [],
  gatheringDateStr,
  checkingReport,
  isReported,
  attendees,
  absentees,
  checkedMembers,
  handleToggleMember,
  handleFormSubmit,
  submitting,
  membersList,
}) => {
  return (
    <>
      {/* Gathering Info Card */}
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
            sx={{ fontWeight: 700, color: "#ea580c", mb: 2 }}
          >
            모임 정보 입력
          </Typography>
          <Grid container spacing={2}>
            {/* Garden Selection */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <GardenSelector
                gardens={gardens}
                selectedGarden={selectedGarden}
                handleGardenChange={handleGardenChange}
                color="#ea580c"
              />
            </Grid>

            {/* Gathering Date */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={gatheringDate}
                  onChange={(newVal) => {
                    setGatheringDate(newVal);
                    if (newVal && isToday(newVal)) {
                      setGatheringTime((prevTime) => {
                        const now = new Date();
                        if (prevTime && prevTime > now) {
                          return now;
                        }
                        return prevTime;
                      });
                    }
                  }}
                  disabled={checkingReport}
                  maxDate={new Date()}
                  slots={{
                    field: GatheringDateButtonField,
                    day: GatheringCustomDay,
                  }}
                  slotProps={{
                    day: {
                      historyDates: gatheringHistoryDates,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Gathering Time */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  value={gatheringTime}
                  onChange={setGatheringTime}
                  disabled={checkingReport}
                  maxTime={
                    gatheringDate && isToday(gatheringDate)
                      ? new Date()
                      : undefined
                  }
                  slots={{
                    field: GatheringTimeButtonField,
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Gathering Location */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                disabled={checkingReport}
                label="모임 장소"
                placeholder="예: 정원지기 가정, 카페, 교회 등"
                value={gatheringLocation}
                onChange={(e) => setGatheringLocation(e.target.value)}
              />
            </Grid>

            {/* Past Gathering Dates Shortcut Chips */}
            {gatheringHistoryDates.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    pt: 1.5,
                    mt: 0.5,
                    borderTop: "1px dashed rgba(234, 88, 12, 0.2)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#c2410c",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    📅 이전 모임 보고 날짜 (클릭 시 해당 보고서 조회):
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.75,
                    }}
                  >
                    {gatheringHistoryDates.slice(0, 4).map((dateStr) => {
                      const isCurrent = dateStr === gatheringDateStr;
                      const d = new Date(dateStr + "T00:00:00");
                      const dayOfWeekNames = [
                        "일",
                        "월",
                        "화",
                        "수",
                        "목",
                        "금",
                        "토",
                      ];
                      const dayLabel = !isNaN(d.getTime())
                        ? `${format(d, "yyyy. MM. dd")} (${
                            dayOfWeekNames[d.getDay()]
                          })`
                        : dateStr;

                      return (
                        <Chip
                          key={dateStr}
                          label={dayLabel}
                          size="small"
                          onClick={() => {
                            const [y, m, day] = dateStr.split("-").map(Number);
                            setGatheringDate(new Date(y, m - 1, day));
                          }}
                          variant={isCurrent ? "filled" : "outlined"}
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: isCurrent ? 700 : 500,
                            borderColor: isCurrent
                              ? "#ea580c"
                              : "rgba(234, 88, 12, 0.4)",
                            backgroundColor: isCurrent
                              ? "#ea580c"
                              : "rgba(234, 88, 12, 0.04)",
                            color: isCurrent ? "#ffffff" : "#c2410c",
                            "&:hover": {
                              backgroundColor: isCurrent
                                ? "#c2410c"
                                : "rgba(234, 88, 12, 0.12)",
                            },
                            cursor: "pointer",
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Report Status Banner */}
      <ReportStatusBanner
        checkingReport={checkingReport}
        isReported={isReported}
        color="#ea580c"
        title="이미 제출된 정원 모임 보고서가 있습니다"
        message="기존에 제출하신 모임 일시, 장소, 참석 명단 및 나눔 내용을 불러왔습니다. 변경이 필요한 부분만 수정한 후 다시 제출하시면 업데이트됩니다."
      />

      {/* Members Attendance Checklist Card */}
      <AttendanceChecklist
        title="참석 여부 체크"
        description="💡 모임에 참석한 인원만 체크해 주세요. 기본적으로 모두 선택되어 있습니다."
        themeColor="#ea580c"
        lightBgColor="#fff7ed"
        borderColor="#fdba74"
        badgeBorderColor="#ffedd5"
        hoverBorderColor="#ea580c"
        hoverBgColor="#ffedd5"
        attendeesCount={attendees.length}
        absenteesCount={absentees.length}
        membersList={gardens[selectedGarden] || []}
        checkedMembers={checkedMembers}
        handleToggleMember={handleToggleMember}
        checkingReport={checkingReport}
      />

      {/* Gathering Notes Card */}
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
            sx={{ fontWeight: 700, color: "#ea580c", mb: 2 }}
          >
            모임 내용 및 나눔/기도제목
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            disabled={checkingReport}
            placeholder="모임의 주요 나눔 내용이나 함께 나누고 싶은 기도제목을 적어주세요."
            value={gatheringNotes}
            onChange={(e) => setGatheringNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <ReportSubmitButton
        submitting={submitting}
        checkingReport={checkingReport}
        disabled={membersList.length === 0}
        isReported={isReported}
        onClick={handleFormSubmit}
        themeColor="#ea580c"
        hoverColor="#c2410c"
        shadowColor="rgba(234, 88, 12, 0.3)"
        submitText="정원 모임 보고 제출하기"
        updateText="정원 모임 보고 수정(업데이트)하기"
      />
    </>
  );
};

export default GatheringForm;
