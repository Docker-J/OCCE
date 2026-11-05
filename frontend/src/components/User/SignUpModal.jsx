import { Button, Stack, TextField, Typography } from "@mui/material";
import { signUp } from "../../api/user";
import useModals from "../../util/useModal";
import useSnackbar from "../../util/useSnackbar";
import SignUpConfirmModal from "./SignUpConfirmModal";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SignUpRequestConfirmModal from "./SignUpRequestConfirmModal";
import { useForm } from "react-hook-form";
import CustomModal from "../../common/CustomModal";
import { AuthPhoneField, AuthPasswordField } from "./AuthFormFields";

const SignUpModal = ({ isOpen, onClose }) => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
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

  const handleSignUp = async (data) => {
    try {
      await signUp(data.name, data.phone, data.password);
      successSignUp(data.phone);
    } catch (err) {
      failSignUp(err.message);
    }
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
      <form style={{ width: "100%" }} onSubmit={handleSubmit(handleSignUp)}>
        <TextField
          sx={{ width: "100%", mt: "1em" }}
          label="이름(한글)"
          autoComplete="name"
          slotProps={{
            htmlInput: {
              autoComplete: "name",
              enterKeyHint: "next",
            },
          }}
          required
          {...register("name", {
            required: "성명을 입력해주세요.",
            minLength: {
              value: 2,
              message: "2자 이상의 이름을 입력해주세요.",
            },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <AuthPhoneField
          control={control}
          name="phone"
          autoComplete="tel"
          enterKeyHint="next"
        />

        <AuthPasswordField
          label="비밀번호"
          autoComplete="new-password"
          enterKeyHint="next"
          error={!!errors.password}
          helperText={errors.password?.message}
          registration={register("password", {
            required: "비밀번호를 입력해주세요.",
            minLength: {
              value: 8,
              message: "최소 8자 이상 입력해주세요.",
            },
            maxLength: {
              value: 24,
              message: "최대 24자까지 입력 가능합니다.",
            },
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,24}$/,
              message:
                "8-24자, 숫자, 영문 대/소문자, 특수문자를 모두 포함해야 합니다.",
            },
            deps: ["confirmPassword"],
          })}
        />

        <AuthPasswordField
          label="비밀번호 확인"
          autoComplete="new-password"
          enterKeyHint="done"
          error={!!errors.confirmPassword}
          helperText={
            errors.confirmPassword?.message ||
            (isPasswordMatch ? "비밀번호가 일치합니다." : "")
          }
          showMatchIndicator={isPasswordMatch}
          registration={register("confirmPassword", {
            required: "비밀번호 확인을 입력해주세요.",
            validate: (value) =>
              value === watch("password") || "비밀번호가 일치하지 않습니다.",
          })}
        />

        <Button
          sx={{ width: "100%", mt: "1em", height: "3em" }}
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
          cursor: "pointer",
        }}
      >
        <Typography>전화번호 인증하기</Typography>
        <OpenInNewIcon fontSize="small" />
      </Stack>
    </CustomModal>
  );
};

export default SignUpModal;
