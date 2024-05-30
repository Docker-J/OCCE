import { Typography } from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CustomModal from "../../common/CustomModal";

const SignUpFinishedModal = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} maxWidth="400px">
      <CheckCircleOutlineIcon sx={{ fontSize: 50 }} />

      <Typography>
        회원가입 요청이 완료되었습니다. 관리자의 승인을 기다려주세요.
        감사합니다.
      </Typography>
    </CustomModal>
  );
};

export default SignUpFinishedModal;
