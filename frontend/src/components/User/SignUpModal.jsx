import { Button, Stack, TextField, Typography } from "@mui/material";
import { signUp } from "../../api/user";
import useModals from "../../util/useModal";
import useSnackbar from "../../util/useSnackbar";
import SignUpConfirmModal from "./SignUpConfirmModal";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SignUpRequestConfirmModal from "./SignUpRequestConfirmModal";

import { useForm } from "react-hook-form";
import CustomModal from "../../common/CustomModal";

const SignUpModal = ({ isOpen, onClose }) => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();

  const {
    register,
    getValues,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const handleSignUp = () => {
    successSignUp();
    // signUp(
    //   getValues("name"),
    //   getValues("email"),
    //   getValues("password"),
    //   successSignUp,
    //   failSignUp
    // );
  };

  const successSignUp = () => {
    openModal(SignUpConfirmModal, { email: getValues("email") });
    handleClose();
  };

  const failSignUp = () => {};

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="400px">
      <h1 style={{ marginTop: 0 }}>회원가입 요청</h1>

      <form style={{ width: "90%" }} onSubmit={handleSubmit(handleSignUp)}>
        <TextField
          sx={{ width: "100%", mt: "1em" }}
          label="이름(한글)"
          type="name"
          {...register("name", { required: true })}
        />
        <TextField
          sx={{ width: "100%", mt: "1.5em" }}
          label="이메일"
          type="email"
          {...register("email", {
            required: true,
            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          })}
        />
        <TextField
          sx={{ width: "100%", mt: "1em" }}
          label="이메일 확인"
          type="email"
          {...register("confirmEmail", {
            required: true,
            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            validate: (value) => value === watch("email"),
          })}
          error={errors.confirmEmail}
          helperText={errors.confirmEmail ? "이메일이 일치하지 않습니다." : ""}
        />
        <TextField
          sx={{ width: "100%", mt: "1em" }}
          label="비밀번호"
          type="password"
          {...register("password", {
            required: true,
            minLength: 8,
            maxLength: 24,
            pattern: {
              value: /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]/,
              message: "invalid password",
            },
          })}
        />
        <TextField
          sx={{ width: "100%", mt: "1em" }}
          label="비밀번호 확인"
          type="password"
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === watch("password"),
          })}
          error={errors.confirmPassword}
          helperText={
            errors.confirmPassword ? "비밀번호가 일치하지 않습니다." : ""
          }
        />

        <Button
          sx={{ width: "100%", mt: "1em" }}
          variant="outlined"
          type="submit"
        >
          회원가입
        </Button>
      </form>

      <Typography sx={{ mt: "1em" }}>이미 회원가입을 요청하셨나요?</Typography>
      <Stack
        onClick={() => {
          handleClose();
          openModal(SignUpRequestConfirmModal, {});
        }}
        sx={{ cursor: "pointer" }}
        direction="row"
      >
        <Typography>이메일 인증하기</Typography>
        <OpenInNewIcon />
      </Stack>
    </CustomModal>
  );
};

export default SignUpModal;
