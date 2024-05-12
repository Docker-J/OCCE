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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  maxWidth: "400px",
  bgcolor: "#ffffff",
  // border: "1pt solid #f57c00",
  boxShadow: 24,
  borderRadius: "0.5em",
  p: 1,
  pt: 5,
  pb: 5,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const SignInModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { openSnackbar } = useSnackbar();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const signInSuccess = (result) => {
    const data = {
      accessToken: result.accessToken,
      groups: [result.group],
    };

    dispatch(SET_TOKEN(data));
    localStorage.setItem("refreshToken", result.refreshToken);
    remember && localStorage.setItem("remember", true);
    openSnackbar("success", "Signed In Succesfully!");
    handleClose();
  };

  const signInFail = () => {
    openSnackbar("error", "Wrong User Credentials");
  };

  const handleSignIn = () => {
    signIn(email, password, signInSuccess, signInFail);
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setRemember(false);
    onClose();
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={style} bgcolor="white">
          <h1 style={{ marginTop: 0 }}>Sign In</h1>
          <TextField
            sx={{ width: "90%", mt: "1.5em" }}
            label="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            sx={{ width: "90%", mt: "1em" }}
            label="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormControlLabel
            sx={{ mt: "1em", right: 0 }}
            onChange={setRemember}
            control={<Checkbox />}
            label="로그인 유지"
          />
          <Button
            sx={{ width: "90%", mt: "1.5em" }}
            variant="outlined"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default SignInModal;
