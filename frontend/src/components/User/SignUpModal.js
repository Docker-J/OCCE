import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { signUp } from "../../api/user";
import useModals from "../../util/useModal";
import useSnackbar from "../../util/useSnackbar";
import SignUpConfirmModal from "./SignUpConfirmModal";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SignUpRequestConfirmModal from "./SignUpRequestConfirmModal";

import { useForm, SubmitHandler } from "react-hook-form";

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

const SignUpModal = ({ isOpen, onClose }) => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();

  const { register, getValues, handleSubmit, resetField, watch } = useForm();

  const handleSignUp = () => {
    signUp(
      getValues("lastName") + getValues("firstName"),
      getValues("email"),
      getValues("password"),
      successSignUp,
      failSignUp
    );
  };

  const successSignUp = () => {
    handleClose();
    openModal(SignUpConfirmModal, { email: getValues("email") });
  };

  const failSignUp = () => {};

  const handleClose = () => {
    resetField("lastName");
    resetField("firstName");
    resetField("email");
    resetField("password");
    resetField("confirmPassword");
    onClose();
  };
  // useEffect(() => {
  //   if (confirmPassword.trim() !== "") {
  //     setConfirmPasswordError(!(password === confirmPassword));
  //   } else {
  //     setConfirmPasswordError(false);
  //   }
  // }, [password, confirmPassword]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style} bgcolor="white">
        <h1>회원가입 요청</h1>
        <form style={{ width: "90%" }} onSubmit={handleSubmit(handleSignUp)}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <TextField
              sx={{ width: "48%" }}
              label="Last Name"
              type="name"
              {...register("lastName", { required: true })}
            />
            <TextField
              sx={{ width: "48%" }}
              label="First Name"
              type="name"
              {...register("firstName", { required: true })}
            />
          </div>
          <TextField
            sx={{ width: "100%", mt: "1em" }}
            label="Email"
            type="email"
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            })}
          />
          <TextField
            sx={{ width: "100%", mt: "1em" }}
            label="Password"
            type="password"
            {...register("password", {
              required: true,
              minLength: 8,
              maxLength: 24,
              pattern: /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]/,
            })}
          />
          <TextField
            sx={{ width: "100%", mt: "1em" }}
            label="Confirm Password"
            type="password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) => value === watch("password"),
            })}
          />

          <Button
            sx={{ width: "100%", mt: "1em" }}
            variant="outlined"
            type="submit"
          >
            회원가입
          </Button>
        </form>

        <Stack
          onClick={() => {
            handleClose();
            openModal(SignUpRequestConfirmModal, {});
          }}
          direction="row"
        >
          <Typography>이메일 인증하기</Typography>
          <OpenInNewIcon />
        </Stack>
      </Box>
    </Modal>
  );
};

export default SignUpModal;
