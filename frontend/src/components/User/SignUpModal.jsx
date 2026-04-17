import { Button, Stack, TextField, Typography } from "@mui/material";
import { signUp } from "../../api/user";
import useModals from "../../util/useModal";
import useSnackbar from "../../util/useSnackbar";
import SignUpConfirmModal from "./SignUpConfirmModal";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SignUpRequestConfirmModal from "./SignUpRequestConfirmModal";

import { useForm, Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import CustomModal from "../../common/CustomModal";

const SignUpModal = ({ isOpen, onClose }) => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    // 1. Extract isValid from formState
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange", // Necessary for isValid to update in real-time
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUp = (data) => {
    signUp(
      data.name,
      data.phone,
      data.password,
      () => successSignUp(data.phone),
      failSignUp,
    );
  };

  const successSignUp = (phoneValue) => {
    openModal(SignUpConfirmModal, { phone: phoneValue });
    handleClose();
  };

  const failSignUp = (error) => {
    let message;
    switch (error) {
      case "UsernameExistsException":
        message =
          "이미 가입하신 교인입니다. 로그인이 되지 않으시면 하단의 전화번호 인증하기 링크를 통해 번호 인증을 완료해주세요.";
        break;
      case "NonMemberException":
        message = "등록된 교인이 아닙니다.";
        break;
      default:
        message = "오류가 발생하였습니다.";
    }
    openSnackbar("error", message);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="400px">
      <h1 style={{ marginTop: 0, marginBottom: 0 }}>회원가입</h1>
      <Typography style={{ marginBottom: "1em" }}>
        교적과 동일한 정보를 입력해주세요.
      </Typography>
      <form style={{ width: "90%" }} onSubmit={handleSubmit(handleSignUp)}>
        <TextField
          sx={{ width: "100%", mt: "1em" }}
          label="이름(한글)"
          required
          {...register("name", { required: true })}
          error={!!errors.name}
        />

        <Controller
          name="phone"
          control={control}
          rules={{
            required: "전화번호를 입력해주세요.",
            pattern: {
              value: /^\d{10}$/,
              message: "전화번호 10자리를 모두 입력해주세요.",
            },
          }}
          render={({ field: { onChange, name, value } }) => (
            <PatternFormat
              name={name}
              value={value}
              format="(###) ###-####"
              mask="_"
              allowEmptyFormatting={true}
              customInput={TextField}
              label="전화번호"
              type="tel"
              fullWidth
              sx={{ mt: "1em" }}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              onValueChange={(values) => {
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
          label="비밀번호 확인"
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
          sx={{ width: "100%", mt: "1em" }}
          variant="outlined"
          type="submit"
          disabled={!isValid}
        >
          회원가입
        </Button>
      </form>
      <Typography sx={{ mt: "1em" }}>이미 회원가입을 진행하셨나요?</Typography>
      <Stack
        onClick={() => {
          handleClose();
          openModal(SignUpRequestConfirmModal, {});
        }}
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          cursor: "pointer"
        }}>
        <Typography>전화번호 인증하기</Typography>
        <OpenInNewIcon fontSize="small" />
      </Stack>
    </CustomModal>
  );
};

export default SignUpModal;
