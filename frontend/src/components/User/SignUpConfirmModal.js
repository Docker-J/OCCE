import React, { useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import useModals from "../../util/useModal";
import useSnackbar from "../../util/useSnackbar";
import { confirmSignUp, resendSignUpConfirm } from "../../api/user";

import VerificationInput from "react-verification-input";
import SignUpFinishedModal from "./SignUpFinishedModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  maxWidth: "400px",
  bgcolor: "#ffffff",
  boxShadow: 24,
  borderRadius: "0.5em",
  p: 1,
  py: 5,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const SignUpConfirmModal = ({ email, isOpen, onClose }) => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();

  const [confirmCode, setConfirmCode] = useState("");

  const onSubmit = () => {
    if (confirmCode.length === 6) {
      confirmSignUp(email, confirmCode, confirmSuccess, confirmFail);
    }
  };

  const confirmSuccess = () => {
    openModal(SignUpFinishedModal, {});
    handleClose();
  };

  const confirmFail = () => {};

  const handleClose = () => {
    onClose();
  };

  const resendSuccess = () => {
    openSnackbar();
  };

  const resendFail = () => {
    openSnackbar();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style} bgcolor="white">
        <h1 style={{ marginBottom: 0 }}>이메일 인증</h1>
        <p>{email}로 발송된 인증번호를 입력해주세요.</p>

        <Button
          sx={{ width: "90%", mt: "1em" }}
          variant="outlined"
          onClick={() => resendSignUpConfirm(email, resendSuccess, resendFail)}
        >
          인증번호 재발송
        </Button>

        <VerificationInput autoFocus placeholder="" onChange={setConfirmCode} />

        <Button
          sx={{ width: "90%", mt: "1em" }}
          variant="outlined"
          onClick={onSubmit}
        >
          Confirm
        </Button>
      </Box>
    </Modal>
  );
};

export default SignUpConfirmModal;
