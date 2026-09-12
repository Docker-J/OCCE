import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, Typography, Button
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import { format } from "date-fns";

const ConfirmSubmitDialog = ({
  open, onClose, onConfirm, reportType, isReported, selectedGarden, selectedDate,
  gatheringDate, gatheringTime, gatheringLocation, attendees, absentees
}) => {
  return (
      <Dialog
        open={open}
        onClose={() => onClose()}
        slotProps={{ paper: { sx: { borderRadius: "16px" } } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: isReported
              ? "#2563eb"
              : reportType === "gathering"
              ? "#ea580c"
              : "#dc2626",
          }}
        >
          {reportType === "gathering"
            ? isReported
              ? "정원 모임 보고 수정(업데이트) 확인"
              : "정원 모임 보고 제출 확인"
            : isReported
            ? "출석 보고 수정(업데이트) 확인"
            : "출석 보고 제출 확인"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {reportType === "gathering"
              ? isReported
                ? "수정하신 내용으로 모임 보고서를 업데이트하시겠습니까? 구글 스프레드시트에 실시간 반영됩니다."
                : "작성하신 내용을 최종 제출하시겠습니까? 구글 스프레드시트에 실시간 기록됩니다."
              : isReported
              ? "수정하신 내용으로 출석 보고서를 업데이트하시겠습니까? 구글 스프레드시트의 해당 주차 시트에 실시간 반영됩니다."
              : "작성하신 내용을 최종 제출하시겠습니까? 구글 스프레드시트의 해당 주차 시트에 실시간 기록됩니다."}
          </DialogContentText>
          <Box sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: "8px" }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <b>보고 정원:</b> {selectedGarden}
            </Typography>
            {reportType === "gathering" ? (
              <>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <b>모임 일시:</b>{" "}
                  {gatheringDate ? format(gatheringDate, "yyyy-MM-dd") : ""}{" "}
                  {gatheringTime ? format(gatheringTime, "HH:mm") : ""}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <b>모임 장소:</b> {gatheringLocation || "미기입"}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>보고 주일:</b> {selectedDate}
              </Typography>
            )}
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <b>참석 인원:</b> {attendees.length}명 ({attendees.join(", ")})
            </Typography>
            {absentees.length > 0 && (
              <Typography variant="body2" sx={{ color: "#d32f2f", mb: 0.5 }}>
                <b>결석 인원:</b> {absentees.length}명 ({absentees.join(", ")})
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => onClose()}
            sx={{ color: "#555", fontWeight: 600 }}
          >
            취소
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            startIcon={isReported ? <EditNoteIcon /> : <CheckCircleOutlineIcon />}
            sx={{
              backgroundColor: isReported
                ? "#2563eb"
                : reportType === "gathering"
                ? "#ea580c"
                : "#dc2626",
              "&:hover": {
                backgroundColor: isReported
                  ? "#1d4ed8"
                  : reportType === "gathering"
                  ? "#c2410c"
                  : "#b91c1c",
              },
              borderRadius: "20px",
              px: 3,
              fontWeight: 600,
            }}
          >
            {isReported ? "수정 완료" : "제출 완료"}
          </Button>
        </DialogActions>
      </Dialog>

  );
};
export default ConfirmSubmitDialog;
