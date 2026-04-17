import { Typography } from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import CustomModal from "../../common/CustomModal";

const SignUpFinishedModal = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} maxWidth="400px">
      <CheckCircleOutlineIcon sx={{ fontSize: 50 }} />

      <Typography>회원가입이 완료되었습니다.</Typography>
    </CustomModal>
  );
};

export default SignUpFinishedModal;
