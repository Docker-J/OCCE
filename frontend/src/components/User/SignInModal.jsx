import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { signIn } from "../../api/user";
import { useDispatch } from "react-redux";
import { SET_TOKEN } from "../../store/Auth";
import useSnackbar from "../../util/useSnackbar";
import { useForm } from "react-hook-form";
import CustomModal from "../../common/CustomModal";

const SignInModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { register, getValues, handleSubmit, reset } = useForm();
  const { openSnackbar } = useSnackbar();

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
    openSnackbar("success", "Signed In Succesfully!");
    handleClose();
  };

  const signInFail = () => {
    openSnackbar("error", "Wrong User Credentials");
  };

  const handleSignIn = () => {
    signIn(
      getValues("email"),
      getValues("password"),
      signInSuccess,
      signInFail
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="400px">
        <h1 style={{ marginTop: 0 }}>로그인</h1>

        <form style={{ width: "90%" }} onSubmit={handleSubmit(handleSignIn)}>
          <TextField
            sx={{ width: "100%", mt: "1.5em" }}
            label="이메일"
            type="email"
            required
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            })}
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
              pattern: /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]/,
            })}
          />
          <FormControlLabel
            sx={{ mt: "1em", marginLeft: "auto", mr: "1.4em" }}
            control={<Checkbox />}
            label="로그인 유지"
            {...register("remember")}
          />
          <Button
            sx={{ width: "100%", mt: "1em" }}
            variant="outlined"
            type="submit"
          >
            로그인
          </Button>
        </form>
      </CustomModal>
    </>
  );
};

export default SignInModal;
