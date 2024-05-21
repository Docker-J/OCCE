import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import useModals from "../../util/useModal";
import useSnackbar from "../../util/useSnackbar";
import { confirmSignUp, resendSignUpConfirm } from "../../api/user";
import SignUpConfirmModal from "./SignUpConfirmModal";

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
  py: 5,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

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
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style} bgcolor="white">
        <h1 style={{ marginBottom: 0 }}>이메일 인증</h1>
        <h5>{email}</h5>
        <TextField
          sx={{ width: "90%", mt: "1em" }}
          label="Email"
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
      </Box>
    </Modal>
  );
};

export default SignUpRequestConfirmModal;
