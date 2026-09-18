/**
 * @file DeleteConfirmModal.jsx
 * @description 교인 계정 삭제 확인 다이얼로그
 */

import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { formatPhoneNumber } from "../utils/memberUtils";

const DeleteConfirmModal = ({ open, user, deleting, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    slotProps={{
      paper: {
        sx: { borderRadius: "16px", p: 1, maxWidth: "460px", width: "100%" },
      },
    }}
  >
    <DialogTitle sx={{ fontWeight: 700, color: "#dc2626" }}>교인 계정 삭제 확인</DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ color: "#444", mb: 2, lineHeight: 1.6 }}>
        정말로 <strong>{user?.name || "선택한 교인"}</strong>({formatPhoneNumber(user?.phone)})의
        온교회 계정을 완전히 삭제하시겠습니까?
      </DialogContentText>
      <Box
        sx={{
          p: 2,
          backgroundColor: "rgba(220, 38, 38, 0.06)",
          borderRadius: "12px",
          border: "1px solid rgba(220, 38, 38, 0.2)",
        }}
      >
        <Typography variant="caption" sx={{ color: "#b91c1c", display: "block", fontWeight: 600 }}>
          ⚠️ 주의: 계정을 삭제하면 해당 교인은 온교회 서비스를 이용할 수 없으며, 정원지기 권한도
          모두 영구 삭제됩니다. 복구가 불가능합니다.
        </Typography>
      </Box>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2.5 }}>
      <Button onClick={onClose} disabled={deleting} sx={{ color: "#666", fontWeight: 600 }}>
        취소
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        disabled={deleting}
        startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : <DeleteOutlineIcon />}
        sx={{
          backgroundColor: "#dc2626",
          "&:hover": { backgroundColor: "#b91c1c" },
          borderRadius: "20px",
          px: 2.5,
          fontWeight: 700,
        }}
      >
        {deleting ? "삭제 중..." : "영구 삭제"}
      </Button>
    </DialogActions>
  </Dialog>
);

DeleteConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.object,
  deleting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteConfirmModal;
