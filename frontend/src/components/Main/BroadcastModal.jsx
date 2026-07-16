import { Button, CircularProgress, TextField, Typography, Box } from "@mui/material";
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

  const handleClose = () => {
    setTitle("");
    setBody("");
    setPathname("");
    onClose();
  };

  const onSubmit = async () => {
    if (!title.trim() || !body.trim()) return;

    setLoading(true);
    try {
      await broadcastNotification(title.trim(), body.trim(), pathname.trim());
      openSnackbar("success", "알림이 모든 사용자에게 발송되었습니다!");
      handleClose();
    } catch (error) {
      console.error(error);
      openSnackbar("error", "알림 발송 중 오류가 발생했습니다. 관리자에게 문의하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="500px">
      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 4 }}>
          <CircularProgress color="primary" />
          <Typography variant="body2" color="text.secondary">
            알림을 발송하고 있습니다...
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: "90%", display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
            전체 알림 발송 (FCM Broadcast)
          </Typography>

          <TextField
            label="알림 제목"
            variant="outlined"
            placeholder="예: 291일 성경 1독"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            autoFocus
          />

          <TextField
            label="알림 내용"
            variant="outlined"
            placeholder="예: 오늘의 1독 말씀은 '창세기 1-5장' 입니다."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
          />

          <TextField
            label="이동 링크 / 경로"
            variant="outlined"
            placeholder="예: /schedules 또는 유튜브 주소"
            value={pathname}
            onChange={(e) => setPathname(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            disabled={!title.trim() || !body.trim()}
            onClick={onSubmit}
            fullWidth
            sx={{
              py: 1.2,
              fontWeight: "bold",
              bgcolor: "#964B00",
              ":hover": { bgcolor: "#7e3f00" },
              "&.Mui-disabled": { bgcolor: "#f5f5f5", color: "rgba(0, 0, 0, 0.26)" }
            }}
          >
            발송하기 (Broadcast)
          </Button>
        </Box>
      )}
    </CustomModal>
  );
};

export default BroadcastModal;
