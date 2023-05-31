import React, { useRef, useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";

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

const SignUpModal = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");

  const handleSignUp = () => {
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
        <h1>Sign Up</h1>
        <TextField
          sx={{ width: "35%" }}
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <TextField
          sx={{ width: "35%" }}
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
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
        <TextField
          sx={{ width: "70%" }}
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <p>
          <Button onClick={handleSignUp}>Sign Up</Button>
          <Button onClick={handleClose}>Close</Button>
        </p>
      </Box>
    </Modal>
  );
};

export default SignUpModal;
