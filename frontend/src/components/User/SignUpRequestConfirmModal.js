import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import useModals from "../../util/useModal";
import useSnackbar from "../../util/useSnackbar";
import { resendSignUpConfirm } from "../../api/user";
import SignUpConfirmModal from "./SignUpConfirmModal";
import CustomModal from "../../common/CustomModal";

const SignUpRequestConfirmModal = ({ isOpen, onClose }) => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();

  const [email, setEmail] = useState("");

  const handleSignUp = () => {
    resendSignUpConfirm(email, confirmSuccess, confirmFail);
  };

  const confirmSuccess = () => {
    handleClose();
    openModal(SignUpConfirmModal, { email: email });
  };

  const confirmFail = () => {};

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} maxWidth="400px">
      <h1 style={{ marginTop: 0 }}>이메일 인증</h1>
      <TextField
        sx={{ width: "90%", mt: "1em" }}
        label="이메일"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Button
        sx={{ width: "90%", mt: "1em" }}
        variant="outlined"
        onClick={handleSignUp}
      >
        Send
      </Button>
    </CustomModal>
  );
};

export default SignUpRequestConfirmModal;
