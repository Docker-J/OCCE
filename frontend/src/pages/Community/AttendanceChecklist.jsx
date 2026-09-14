import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Paper,
  Checkbox,
  Button,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";

const AttendanceChecklistItem = ({
  member,
  isChecked,
  checkingReport,
  themeColor,
  lightBgColor,
  borderColor,
  hoverBorderColor,
  hoverBgColor,
  onToggle,
}) => {
  return (
    <Grid size={{ xs: 6, sm: 4, md: 3 }}>
      <Paper
        variant="outlined"
        onClick={() => {
          if (!checkingReport) {
            onToggle?.(member);
          }
        }}
        sx={{
          p: 1.5,
          cursor: checkingReport ? "not-allowed" : "pointer",
          borderRadius: "8px",
          border: isChecked
            ? `1.2px solid ${borderColor}`
            : "1px solid #e0e0e0",
          backgroundColor: isChecked ? lightBgColor : "#fafafa",
          opacity: checkingReport ? 0.6 : 1,
          transition: "all 0.15s ease",
          "&:hover": {
            borderColor: checkingReport
              ? isChecked
                ? borderColor
                : "#e0e0e0"
              : isChecked
              ? hoverBorderColor
              : "#bdbdbd",
            backgroundColor: checkingReport
              ? isChecked
                ? lightBgColor
                : "#fafafa"
              : isChecked
              ? hoverBgColor
              : "#eeeeee",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: isChecked ? 600 : 400,
            color: isChecked ? themeColor : "#9e9e9e",
            textDecoration: isChecked ? "none" : "line-through",
          }}
        >
          {member}
        </Typography>
        <Checkbox
          size="small"
          checked={isChecked}
          disabled={checkingReport}
          onClick={(e) => e.stopPropagation()}
          onChange={() => onToggle?.(member)}
          sx={{
            color: "#bdbdbd",
            "&.Mui-checked": {
              color: themeColor,
            },
            p: 0,
          }}
        />
      </Paper>
    </Grid>
  );
};

const AttendanceChecklist = ({
  title = "출석체크",
  description = "💡 기본적으로 모든 정원 가족이 출석으로 되어있습니다. 결석하신 분만 체크를 해제해 주세요.",
  themeColor = "#dc2626",
  lightBgColor = "#fef2f2",
  borderColor = "#fca5a5",
  badgeBorderColor = "#fee2e2",
  hoverBorderColor = "#dc2626",
  hoverBgColor = "#fee2e2",
  attendeesCount = 0,
  absenteesCount = 0,
  membersList = [],
  checkedMembers = {},
  handleToggleMember,
  handleCheckAll,
  handleUncheckAll,
  checkingReport = false,
}) => {
  const isAllChecked = membersList.length > 0 && absenteesCount === 0;

  return (
    <Card
      sx={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
        p: 2,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: themeColor }}>
            {title}
          </Typography>
          {/* Status Badges */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Paper
              variant="outlined"
              sx={{
                px: 1.5,
                py: 0.5,
                backgroundColor: lightBgColor,
                borderColor: badgeBorderColor,
                borderRadius: "12px",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: themeColor, fontWeight: 700 }}
              >
                참석 {attendeesCount}명
              </Typography>
            </Paper>
            <Paper
              variant="outlined"
              sx={{
                px: 1.5,
                py: 0.5,
                backgroundColor: "#f5f5f5",
                borderColor: "#e0e0e0",
                borderRadius: "12px",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#666666", fontWeight: 700 }}
              >
                결석 {absenteesCount}명
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#666", flex: 1, minWidth: "220px" }}
          >
            {description}
          </Typography>

          {/* Single Smart Toggle Batch Action Button */}
          {(handleCheckAll || handleUncheckAll) && (
            <Button
              size="small"
              variant="text"
              startIcon={
                isAllChecked ? (
                  <RemoveDoneIcon sx={{ fontSize: 16 }} />
                ) : (
                  <DoneAllIcon sx={{ fontSize: 16 }} />
                )
              }
              disabled={checkingReport || membersList.length === 0}
              onClick={isAllChecked ? handleUncheckAll : handleCheckAll}
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: isAllChecked ? "#64748b" : themeColor,
                py: 0.4,
                px: 1.2,
                borderRadius: "8px",
                backgroundColor: isAllChecked ? "#f1f5f9" : lightBgColor,
                transition: "all 0.15s ease",
                "&:hover": {
                  backgroundColor: isAllChecked ? "#e2e8f0" : badgeBorderColor,
                },
              }}
            >
              {isAllChecked ? "전체 해제" : "전체 출석"}
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid
          container
          spacing={1}
          sx={{
            opacity: checkingReport ? 0.6 : 1,
            transition: "opacity 0.2s ease",
            pointerEvents: checkingReport ? "none" : "auto",
          }}
        >
          {membersList.map((member) => (
            <AttendanceChecklistItem
              key={member}
              member={member}
              isChecked={checkedMembers[member] !== false}
              checkingReport={checkingReport}
              themeColor={themeColor}
              lightBgColor={lightBgColor}
              borderColor={borderColor}
              hoverBorderColor={hoverBorderColor}
              hoverBgColor={hoverBgColor}
              onToggle={handleToggleMember}
            />
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AttendanceChecklist;
