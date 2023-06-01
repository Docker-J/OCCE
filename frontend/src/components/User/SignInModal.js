import React, { useRef, useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { signIn } from "../../api/user";
import { useDispatch } from "react-redux";
import { SET_TOKEN } from "../../store/Auth";
import { setRefreshToken } from "../../storage/Cookie";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  maxWidth: "1500px",
  height: "50vh",
  bgcolor: "#ffffff",
  border: "1pt solid #f57c00",
  boxShadow: 24,
  borderRadius: "10pt",
  p: 2,
};

const SignInModal = (props) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInSuccess = (result) => {
    const data = {
      accessToken: result.getAccessToken().getJwtToken(),
      groups: result.getIdToken().payload["cognito:groups"],
    };

    dispatch(SET_TOKEN(data));
    setRefreshToken(result.getRefreshToken().getToken());
  };

  const handleSignIn = () => {
    signIn(email, password, signInSuccess);
    handleClose();
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    props.onClose();
  };

  return (
    <Modal open={props.open} onClose={handleClose}>
      <Box sx={style} bgcolor="white">
        <h1>Sign In</h1>
        <TextField
          sx={{ width: "70%" }}
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          sx={{ width: "70%" }}
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p>
          <Button onClick={handleSignIn}>Sign In</Button>
          <Button onClick={handleClose}>Close</Button>
        </p>
      </Box>
    </Modal>
  );
};

export default SignInModal;
