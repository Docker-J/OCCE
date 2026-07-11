import { useState } from "react";
import { Button, Checkbox, FormControlLabel, TextField, Typography, CircularProgress } from "@mui/material";
import { signIn } from "../../api/user";
import { useDispatch } from "react-redux";
import { SET_TOKEN } from "../../store/Auth";
import useSnackbar from "../../util/useSnackbar";
import { useForm, Controller } from "react-hook-form"; // Added Controller
import { PatternFormat } from "react-number-format"; // Added PatternFormat
import CustomModal from "../../common/CustomModal";
import useModals from "../../util/useModal";
import ResetPasswordRequestModal from "./ResetPasswordRequestModal";

const SignInModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { openModal } = useModals();

  // We use control and handleSubmit for the third-party input integration
  const { control, handleSubmit, reset, getValues } = useForm({
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
      groups: [result.group],
    };

    dispatch(SET_TOKEN(data));

    if (getValues("remember")) {
      localStorage.setItem("refreshToken", result.refreshToken);
      localStorage.setItem("remember", true);
    } else {
      sessionStorage.setItem("refreshToken", result.refreshToken);
    }
    openSnackbar("success", "Signed In Successfully!");
    handleClose();
  };

  const signInFail = () => {
    openSnackbar("error", "Wrong User Credentials");
  };

  const handleSignIn = (data) => {
    // data.phoneNumber will contain the formatted string "(123) 456-7890"
    const PASSWORD_REGEX = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]/;
    const isValid = data.password.length >= 8 && data.password.length <= 24 && PASSWORD_REGEX.test(data.password);

    if (!isValid) {
      signInFail();
      return;
    }

    setIsLoading(true);
    signIn(
      data.phoneNumber,
      data.password,
      (result) => {
        setIsLoading(false);
        signInSuccess(result);
      },
      () => {
        setIsLoading(false);
        signInFail();
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="400px">
      <h1 style={{ marginTop: 0 }}>로그인</h1>
      <form style={{ width: "90%" }} onSubmit={handleSubmit(handleSignIn)}>
        <Controller
          name="phoneNumber"
          control={control}
          rules={{
            required: "전화번호를 입력해주세요",
            validate: (value) => value?.length === 10 || "올바른 전화번호 10자리를 입력해주세요",
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

        <TextField
          sx={{ width: "100%", mt: "1em" }}
          label="비밀번호"
          type="password"
          required
          disabled={isLoading}
          {...control.register("password", {
            required: "비밀번호를 입력해주세요",
          })}
        />

        <FormControlLabel
          sx={{ mt: "1em", marginLeft: "auto", mr: "1.4em" }}
          control={
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={field.value} disabled={isLoading} />
              )}
            />
          }
          label="로그인 유지"
        />

        <Button
          sx={{ width: "100%", mt: "1em" }}
          variant="outlined"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "로그인"}
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
