import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { signIn } from "../../api/user";
import useAuthStore from "../../store/useAuthStore";
import useSnackbar from "../../util/useSnackbar";
import { useForm, Controller } from "react-hook-form"; // Added Controller
import { PatternFormat } from "react-number-format"; // Added PatternFormat
import CustomModal from "../../common/CustomModal";
import useModals from "../../util/useModal";
import ResetPasswordRequestModal from "./ResetPasswordRequestModal";
import SignUpConfirmModal from "./SignUpConfirmModal";

const SignInModal = ({ isOpen, onClose }) => {
  const setToken = useAuthStore((state) => state.setToken);
  const { openModal } = useModals();

  // We use control and handleSubmit for the third-party input integration
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      phoneNumber: "",
      password: "",
      remember: false,
    },
  });

  const { openSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const signInSuccess = (result) => {
    const data = {
      accessToken: result.accessToken,
      idToken: result.idToken,
      groups: [result.group],
      remember: result.remember ?? getValues("remember") ?? false,
    };

    setToken(data);

    // Clean up legacy tokens from Web Storage since we now use secure HttpOnly cookies
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("remember");

    openSnackbar("success", "Signed In Successfully!");
    handleClose();
  };

  const handleSignIn = async (data) => {
    setIsLoading(true);
    try {
      const result = await signIn(
        data.phoneNumber,
        data.password,
        getValues("remember")
      );
      signInSuccess(result);
    } catch (err) {
      const errName = err.response?.data?.error;
      const errMsg = err.response?.data?.message || err.message;

      if (errName === "UserNotConfirmedException") {
        openSnackbar(
          "warning",
          "전화번호 인증이 완료되지 않았습니다. 인증번호 입력창으로 이동합니다."
        );
        handleClose();
        openModal(SignUpConfirmModal, { phone: data.phoneNumber });
      } else if (
        errName === "NotAuthorizedException" ||
        errName === "UserNotFoundException"
      ) {
        openSnackbar("error", "전화번호 또는 비밀번호가 일치하지 않습니다.");
      } else {
        openSnackbar("error", errMsg || "로그인에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="400px">
      <h1 style={{ marginTop: 0 }}>로그인</h1>
      <form onSubmit={handleSubmit(handleSignIn)}>
        <Controller
          name="phoneNumber"
          control={control}
          rules={{
            required: "전화번호를 입력해주세요",
            validate: (value) =>
              value?.length === 10 || "올바른 전화번호 10자리를 입력해주세요",
          }}
          render={({
            field: { onChange, name, value },
            fieldState: { error },
          }) => (
            <PatternFormat
              name={name}
              value={value}
              format="(###) ###-####"
              mask="_"
              allowEmptyFormatting
              customInput={TextField}
              required
              label="전화번호"
              type="tel"
              fullWidth
              sx={{ mt: "1.5em" }}
              error={!!error}
              helperText={error?.message}
              disabled={isLoading}
              onValueChange={(values) => {
                // .value provides just digits (1234567890)
                // .formattedValue provides the string ((123) 456-7890)
                onChange(values.value);
              }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: "비밀번호를 입력해주세요.",
            minLength: {
              value: 8,
              message: "비밀번호는 최소 8자 이상이어야 합니다.",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              sx={{ width: "100%", mt: "1em" }}
              label="비밀번호"
              type="password"
              required
              disabled={isLoading}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <FormControlLabel
          sx={{ mt: "1em", marginLeft: "auto", mr: "1.4em" }}
          control={
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  disabled={isLoading}
                />
              )}
            />
          }
          label="로그인 유지"
        />

        <Button
          sx={{ width: "100%", mt: "1em", height: "3em" }}
          variant="outlined"
          type="submit"
          disabled={isLoading || !isValid}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "로그인"
          )}
        </Button>

        <Typography
          onClick={() => {
            handleClose();
            openModal(ResetPasswordRequestModal, {});
          }}
          sx={{
            mt: "1.5em",
            textAlign: "center",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "0.9rem",
            color: "primary.main",
          }}
        >
          비밀번호를 잊으셨나요?
        </Typography>
      </form>
    </CustomModal>
  );
};

export default SignInModal;
