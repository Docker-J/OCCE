import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import useModals from "../../util/useModal";
import useSnackbar from "../../util/useSnackbar";
import { confirmSignUp, resendSignUpConfirm } from "../../api/user";

import VerificationInput from "react-verification-input";
import SignUpFinishedModal from "./SignUpFinishedModal";
import CustomModal from "../../common/CustomModal";

const SignUpConfirmModal = ({ phone, isOpen, onClose }) => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();

  const [confirmCode, setConfirmCode] = useState("");

  const [seconds, setSeconds] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // 1. The Countdown Logic
  useEffect(() => {
    let interval = null;
    if (isTimerActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, seconds]);

  const onSubmit = () => {
    confirmSignUp(phone, confirmCode, confirmSuccess, confirmFail);
  };

  const onResendRequest = () => {
    resendSignUpConfirm(phone, resendSuccess, resendFail);
  };

  const confirmSuccess = () => {
    openModal(SignUpFinishedModal, {});
    handleClose();
  };

  const confirmFail = () => {
    let message;
    switch (error) {
      case "CodeMismatchException":
        message = "잘못된 인증번호입니다. 다시 입력해주세요.";
        break;
      case "ExpiredCodeException":
        message = "만료된 인증번호입니다. 새 인증번호를 요청해주세요.";
        break;
      default:
        message = "오류가 발생하였습니다. 관리자에게 연락해주세요.";
    }

    openSnackbar("error", message);
    setConfirmCode("");
  };

  const handleClose = () => {
    onClose();
  };

  const resendSuccess = () => {
    openSnackbar("success", "새로운 인증번호가 전송되었습니다.");
    setSeconds(60); // Reset back to 60
    setIsTimerActive(true); // Restart the countdown
  };

  const resendFail = () => {
    openSnackbar();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="400px">
      <h1 style={{ marginTop: 0 }}>전화번호 인증</h1>
      <p>{phone}로 전송된 인증번호를 입력해주세요.</p>

      <Button
        disabled={seconds > 0}
        sx={{ width: "90%" }}
        variant="outlined"
        onClick={onResendRequest}
      >
        {seconds > 0 ? `인증번호 재전송 (${seconds}s)` : "인증번호 재전송"}
      </Button>

      <div style={{ margin: "1.5em" }}>
        <VerificationInput autoFocus placeholder="" onChange={setConfirmCode} />
      </div>

      <Button
        sx={{ width: "90%" }}
        variant="outlined"
        onClick={onSubmit}
        disabled={confirmCode.length !== 6}
      >
        Confirm
      </Button>
    </CustomModal>
  );
};

export default SignUpConfirmModal;
