import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  Alert,
  Divider,
} from "@mui/material";
import SmsIcon from "@mui/icons-material/Sms";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useState } from "react";
import useSnackbar from "../../util/useSnackbar";
import { broadcastNotification } from "../../api/notification";
import CustomModal from "../../common/CustomModal";

const BroadcastModal = ({ isOpen, onClose }) => {
  const { openSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pathname, setPathname] = useState("");

  // Broadcast channel options
  const [sendPush, setSendPush] = useState(true);
  const [sendSms, setSendSms] = useState(false);
  const [smsTarget, setSmsTarget] = useState("no_push_only"); // "no_push_only" | "all"

  const handleClose = () => {
    setTitle("");
    setBody("");
    setPathname("");
    setSendPush(true);
    setSendSms(false);
    setSmsTarget("no_push_only");
    onClose();
  };

  // Calculate character length and estimated SMS segments for Korean Unicode (70 chars per segment)
  const cleanPath = pathname.trim().replace(/^\/+/, "");
  const fullLink = cleanPath
    ? (cleanPath.startsWith("http") ? cleanPath : `https://oncce.ca/${cleanPath}`)
    : "";
  const smsPreview = `[OCCE 공지]\n${title.trim()}\n\n${body.trim()}${fullLink ? `\n\n${fullLink}` : ""}`;
  const charCount = smsPreview.trim().length;
  const smsSegments = charCount === 0 ? 0 : charCount <= 70 ? 1 : Math.ceil(charCount / 67);

  const onSubmit = async () => {
    if (!title.trim() || !body.trim() || (!sendPush && !sendSms)) return;

    setLoading(true);
    try {
      const res = await broadcastNotification(
        title.trim(),
        body.trim(),
        pathname.trim(),
        "all",
        {
          sendPush,
          sendSms,
          smsTarget,
        }
      );

      let successMsg = "알림이 발송되었습니다!";
      if (res?.smsResult) {
        const { sentCount, skippedPushCount } = res.smsResult;
        if (sendPush && skippedPushCount > 0) {
          successMsg = `푸시 알림 발송 및 문자 ${sentCount}건 발송 완료! (푸시 수신 ${skippedPushCount}명 절약)`;
        } else {
          successMsg = `알림 발송 완료! (문자 ${sentCount}건 발송)`;
        }
      }
      openSnackbar("success", successMsg);
      handleClose();
    } catch (error) {
      console.error(error);
      openSnackbar(
        "error",
        "알림 발송 중 오류가 발생했습니다. 관리자에게 문의하세요.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="540px">
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            py: 6,
          }}
        >
          <CircularProgress color="primary" />
          <Typography variant="body2" color="text.secondary">
            {sendSms ? "푸시 및 문자(SMS)를 발송하고 있습니다..." : "알림을 발송하고 있습니다..."}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            width: "92%",
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            pt: 1,
            pb: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold" }}
            textAlign="center"
          >
            전체 공지 발송
          </Typography>

          <TextField
            label="공지 제목"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            autoFocus
          />

          <TextField
            label="공지 내용"
            variant="outlined"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
          />

          <TextField
            label="링크 (선택)"
            variant="outlined"
            placeholder="예: /weeklyupdate 또는 https://..."
            value={pathname}
            onChange={(e) => setPathname(e.target.value)}
            fullWidth
          />

          <Divider sx={{ my: 0.5 }} />

          {/* 발송 채널 선택 */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#333" }}>
              발송 수단 선택
            </Typography>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendPush}
                    onChange={(e) => setSendPush(e.target.checked)}
                    sx={{ color: "#FF6B00", "&.Mui-checked": { color: "#FF6B00" } }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <NotificationsActiveIcon sx={{ fontSize: 18, color: "#FF6B00" }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      웹 푸시 (무료)
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendSms}
                    onChange={(e) => setSendSms(e.target.checked)}
                    sx={{ color: "#FF6B00", "&.Mui-checked": { color: "#FF6B00" } }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SmsIcon sx={{ fontSize: 18, color: sendSms ? "#FF6B00" : "#777" }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      전체 문자 발송 (SMS)
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Box>

          {/* SMS 세부 옵션 및 글자수 계산기 */}
          {sendSms && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#fff9f5",
                border: "1px solid #ffe0cc",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <FormControl component="fieldset">
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#d95b00" }}>
                  문자 수신 대상
                </Typography>
                <RadioGroup
                  value={smsTarget}
                  onChange={(e) => setSmsTarget(e.target.value)}
                  sx={{ mt: 0.5 }}
                >
                  <FormControlLabel
                    value="no_push_only"
                    control={<Radio size="small" sx={{ color: "#FF6B00", "&.Mui-checked": { color: "#FF6B00" } }} />}
                    label={
                      <Typography variant="body2" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                        푸시 알림 미등록 성도만 발송 (비용 절약 권장)
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="all"
                    control={<Radio size="small" sx={{ color: "#FF6B00", "&.Mui-checked": { color: "#FF6B00" } }} />}
                    label={
                      <Typography variant="body2" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                        등록된 모든 성도에게 발송 (중복 수신)
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  px: 1.5,
                  py: 0.8,
                  borderRadius: 1,
                  border: "1px solid #fed7aa",
                }}
              >
                <Typography variant="caption" sx={{ color: "#666" }}>
                  예상 문자 길이 (한글 기준 70자/건)
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: smsSegments > 1 ? "#d95b00" : "#2e7d32",
                  }}
                >
                  {charCount}자 ({smsSegments}건 분할 과금)
                </Typography>
              </Box>

              <Alert severity="warning" sx={{ py: 0.2, px: 1.5, fontSize: "0.75rem" }}>
                문자 발송 시 1건당 약 $0.01~$0.013 USD(AWS + 통신사 수수료)의 비용이 발생합니다.
              </Alert>
            </Box>
          )}

          <Button
            variant="contained"
            disabled={!title.trim() || !body.trim() || (!sendPush && !sendSms)}
            onClick={onSubmit}
            fullWidth
            sx={{
              py: 1.2,
              fontWeight: "bold",
              bgcolor: "#FF6B00",
              ":hover": { bgcolor: "#d95b00" },
              "&.Mui-disabled": {
                bgcolor: "#f5f5f5",
                color: "rgba(0, 0, 0, 0.26)",
              },
            }}
          >
            발송하기
          </Button>
        </Box>
      )}
    </CustomModal>
  );
};

export default BroadcastModal;
