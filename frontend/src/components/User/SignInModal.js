import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  TextField,
} from "@mui/material";
import { signIn } from "../../api/user";
import { useDispatch } from "react-redux";
import { SET_TOKEN } from "../../store/Auth";
import useSnackbar from "../../util/useSnackbar";
import { useForm } from "react-hook-form";

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

const SignInModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { register, getValues, handleSubmit, resetField } = useForm();
  const { openSnackbar } = useSnackbar();

  const [remember, setRemember] = useState(false);

  const signInSuccess = (result) => {
    const data = {
      accessToken: result.accessToken,
      groups: [result.group],
    };

    dispatch(SET_TOKEN(data));

    if (remember) {
      localStorage.setItem("refreshToken", result.refreshToken);
      localStorage.setItem("remember", true);
    } else {
      sessionStorage.setItem("refreshToken", result.refreshToken);
    }
    openSnackbar("success", "Signed In Succesfully!");
    handleClose();
  };

  const signInFail = () => {
    openSnackbar("error", "Wrong User Credentials");
  };

  const handleSignIn = () => {
    signIn(
      getValues("email"),
      getValues("password"),
      signInSuccess,
      signInFail
    );
  };

  const handleClose = () => {
    resetField("email");
    resetField("password");
    setRemember(false);
    onClose();
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={style} bgcolor="white">
          <h1 style={{ marginTop: 0 }}>로그인</h1>

          <form style={{ width: "90%" }} onSubmit={handleSubmit(handleSignIn)}>
            <TextField
              sx={{ width: "100%", mt: "1.5em" }}
              label="이메일"
              type="email"
              {...register("email", {
                required: true,
                pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              })}
            />
            <TextField
              sx={{ width: "100%", mt: "1em" }}
              label="비밀번호"
              type="password"
              {...register("password", {
                required: true,
                // minLength: 8,
                // maxLength: 24,
                // pattern: /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]/,
              })}
            />
            <FormControlLabel
              sx={{ mt: "1em", marginLeft: "auto", mr: "1.4em" }}
              onChange={setRemember}
              control={<Checkbox />}
              label="로그인 유지"
            />
            <Button
              sx={{ width: "100%", mt: "1em" }}
              variant="outlined"
              type="submit"
            >
              로그인
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default SignInModal;
