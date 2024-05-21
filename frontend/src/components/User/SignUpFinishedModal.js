import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import useSnackbar from "../../util/useSnackbar";
import { confirmSignUp } from "../../api/user";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

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

const SignUpFinishedModal = ({ email, isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style} bgcolor="white">
        <CheckCircleOutlineIcon sx={{ fontSize: 50 }} />

        <Typography>
          회원가입 요청이 완료되었습니다. 관리자의 승인을 기다려주세요.
          감사합니다.
        </Typography>
      </Box>
    </Modal>
  );
};

export default SignUpFinishedModal;
