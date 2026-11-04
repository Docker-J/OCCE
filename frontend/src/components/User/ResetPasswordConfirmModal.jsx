import { useEffect, useState } from "react";
import { Button, TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");
  const isPasswordMatch = Boolean(
    confirmPasswordValue &&
      passwordValue &&
      confirmPasswordValue === passwordValue &&
      !errors.password
  );

  // Stable countdown timer (only resets when active status changes)
  useEffect(() => {
    if (seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds > 0]);

  const resendSuccess = () => {
    openSnackbar("success", "새로운 인증번호가 전송되었습니다.");
    setSeconds(60);
  };

  const resendFail = () => {
    openSnackbar("error", "인증번호 재전송에 실패했습니다.");
  };

  const onResendRequest = async () => {
    try {
      await forgotPassword(phone);
      resendSuccess();
    } catch {
      resendFail();
    }
  };

  const handleConfirmReset = async (data) => {
    try {
      await confirmForgotPassword(phone, confirmCode, data.password);
      confirmSuccess();
    } catch (err) {
      confirmFail(err.message);
    }
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
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="400px">
      <h1 style={{ marginTop: 0, marginBottom: "0.2em" }}>비밀번호 재설정</h1>
      <p style={{ textAlign: "center", color: "#666" }}>
        {phone}로 전송된 인증번호와
        <br />
        새로운 비밀번호를 입력해주세요.
      </p>

      <Button
        disabled={seconds > 0}
        sx={{ width: "100%", mb: "1.5em" }}
        variant="outlined"
        onClick={onResendRequest}
      >
        {seconds > 0 ? `인증번호 재전송 (${seconds}s)` : "인증번호 재전송"}
      </Button>

      <div style={{ marginBottom: "1.5em" }}>
        <VerificationInput
          autoFocus
          placeholder=""
          value={confirmCode}
          onChange={setConfirmCode}
        />
      </div>

      <form
        style={{ width: "100%" }}
        onSubmit={handleSubmit(handleConfirmReset)}
      >
        <TextField
          sx={{ width: "100%", mt: "1em" }}
          label="새 비밀번호"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
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
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "새 비밀번호 숨기기" : "새 비밀번호 보기"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          sx={{ width: "100%", mt: "1em" }}
          label="새 비밀번호 확인"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === watch("password"),
          })}
          error={!!errors.confirmPassword}
          helperText={
            errors.confirmPassword
              ? "비밀번호가 일치하지 않습니다."
              : isPasswordMatch
              ? "비밀번호가 일치합니다."
              : ""
          }
          slotProps={{
            formHelperText: {
              sx: {
                color:
                  !errors.confirmPassword && isPasswordMatch
                    ? "#16a34a"
                    : undefined,
                fontWeight: isPasswordMatch ? 600 : undefined,
              },
            },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {isPasswordMatch && (
                    <CheckCircleIcon
                      fontSize="small"
                      sx={{ color: "#16a34a", mr: 0.5 }}
                    />
                  )}
                  <IconButton
                    aria-label={
                      showConfirmPassword
                        ? "새 비밀번호 확인 숨기기"
                        : "새 비밀번호 확인 보기"
                    }
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          sx={{ width: "100%", mt: "2em", height: "3em" }}
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
