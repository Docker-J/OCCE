import { useState } from "react";
import { Button, TextField } from "@mui/material";
import useModals from "../../util/useModal";
import useSnackbar from "../../util/useSnackbar";
import { resendSignUpConfirm } from "../../api/user";
import SignUpConfirmModal from "./SignUpConfirmModal";
import CustomModal from "../../common/CustomModal";
import { PatternFormat } from "react-number-format"; // Added this

const SignUpRequestConfirmModal = ({ isOpen, onClose }) => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();

  // We will store the raw digits (e.g., "01012345678") in state
  const [phone, setPhone] = useState("");

  const handleSignUp = () => {
    // Passes the raw number to the API
    resendSignUpConfirm(phone, confirmSuccess, confirmFail);
  };

  const confirmSuccess = () => {
    // Fixed: changed 'email' to 'phone'
    openModal(SignUpConfirmModal, { phone: phone });
    handleClose();
  };

  const confirmFail = (error) => {
    let message = "인증 요청에 실패했습니다.";
    if (error === "UserAlreadyConfirmedException") {
      message = "이미 가입 및 번호 인증이 완료된 회원입니다. 로그인 해주세요.";
    } else if (error === "UserNotFoundException") {
      message = "등록되지 않은 번호입니다. 회원가입을 먼저 진행해주세요.";
    }
    openSnackbar("error", message);
  };

  const handleClose = () => {
    // Fixed: changed 'setEmail' to 'setPhone'
    setPhone("");
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="400px">
      <h1 style={{ marginTop: 0 }}>전화번호 인증</h1>

      <PatternFormat
        sx={{ width: "90%", mt: "1em" }}
        label="전화번호"
        type="tel"
        format="(###) ###-####"
        mask="_"
        allowEmptyFormatting={true}
        customInput={TextField}
        value={phone}
        onValueChange={(values) => {
          // values.value is the raw digit string (e.g. "1234567890")
          setPhone(values.value);
        }}
        required
      />

      <Button
        sx={{ width: "90%", mt: "2em" }}
        variant="outlined"
        onClick={handleSignUp}
        // Button only enables when exactly 10 digits are entered
        disabled={phone.length !== 10}
      >
        인증번호 전송
      </Button>
    </CustomModal>
  );
};

export default SignUpRequestConfirmModal;
