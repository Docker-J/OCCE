import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import useModals from "../../util/useModal";
import useSnackbar from "../../util/useSnackbar";
import { confirmForgotPassword, forgotPassword } from "../../api/user";
import VerificationInput from "react-verification-input";
import CustomModal from "../../common/CustomModal";
import { useForm } from "react-hook-form";
import SignInModal from "./SignInModal";

const ResetPasswordConfirmModal = ({ phone, isOpen, onClose }) => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();

  const [confirmCode, setConfirmCode] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

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

  const onResendRequest = () => {
    forgotPassword(phone, resendSuccess, resendFail);
  };

  const resendSuccess = () => {
    openSnackbar("success", "새로운 인증번호가 전송되었습니다.");
    setSeconds(60);
    setIsTimerActive(true);
  };

  const resendFail = () => {
    openSnackbar("error", "인증번호 재전송에 실패했습니다.");
  };

  const handleConfirmReset = (data) => {
    confirmForgotPassword(
      phone,
      confirmCode,
      data.password,
      confirmSuccess,
      confirmFail,
    );
  };

  const confirmSuccess = () => {
    openSnackbar("success", "비밀번호가 성공적으로 변경되었습니다.");
    openModal(SignInModal, {});
    handleClose();
  };

  const confirmFail = (error) => {
    let message = "비밀번호 변경에 실패했습니다.";
    switch (error) {
      case "CodeMismatchException":
        message = "잘못된 인증번호입니다. 다시 입력해주세요.";
        break;
      case "ExpiredCodeException":
        message = "만료된 인증번호입니다. 새 인증번호를 요청해주세요.";
        break;
      case "InvalidPasswordException":
        message = "비밀번호 조건을 충족하지 않습니다.";
        break;
      default:
        message = "오류가 발생하였습니다. 잠시 후 다시 시도해주세요.";
    }
    openSnackbar("error", message);
    setConfirmCode("");
  };

  const handleClose = () => {
    reset();
    setConfirmCode("");
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="400px">
      <h1 style={{ marginTop: 0, marginBottom: "0.2em" }}>비밀번호 재설정</h1>
      <p style={{ textAlign: "center", color: "#666" }}>
        {phone}로 전송된 인증번호와<br />새로운 비밀번호를 입력해주세요.
      </p>

      <Button
        disabled={seconds > 0}
        sx={{ width: "90%", mt: "1em", mb: "1.5em" }}
        variant="outlined"
        onClick={onResendRequest}
      >
        {seconds > 0 ? `인증번호 재전송 (${seconds}s)` : "인증번호 재전송"}
      </Button>

      <div style={{ marginBottom: "1.5em" }}>
        <VerificationInput autoFocus placeholder="" value={confirmCode} onChange={setConfirmCode} />
      </div>

      <form style={{ width: "90%" }} onSubmit={handleSubmit(handleConfirmReset)}>
        <TextField
          sx={{ width: "100%", mt: "1em" }}
          label="새 비밀번호"
          type="password"
          required
          {...register("password", {
            required: true,
            minLength: 8,
            maxLength: 24,
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,24}$/,
              message:
                "8-24자, 숫자, 소문자, 대문자, 특수문자를 모두 포함해주세요.",
            },
            deps: ["confirmPassword"],
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <TextField
          sx={{ width: "100%", mt: "1em" }}
          label="새 비밀번호 확인"
          type="password"
          required
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === watch("password"),
          })}
          error={!!errors.confirmPassword}
          helperText={
            errors.confirmPassword ? "비밀번호가 일치하지 않습니다." : ""
          }
        />

        <Button
          sx={{ width: "100%", mt: "2em", mb: "1em" }}
          variant="outlined"
          type="submit"
          disabled={!isValid || confirmCode.length !== 6}
        >
          비밀번호 변경
        </Button>
      </form>
    </CustomModal>
  );
};

export default ResetPasswordConfirmModal;
