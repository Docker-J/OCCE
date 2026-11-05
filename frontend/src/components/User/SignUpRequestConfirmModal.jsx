import { useState } from "react";
import { Button } from "@mui/material";
import useModals from "../../util/useModal";
import useSnackbar from "../../util/useSnackbar";
import { resendSignUpConfirm } from "../../api/user";
import SignUpConfirmModal from "./SignUpConfirmModal";
import CustomModal from "../../common/CustomModal";
import { AuthPhoneField } from "./AuthFormFields";

const SignUpRequestConfirmModal = ({ isOpen, onClose }) => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();
  const [phone, setPhone] = useState("");

  const handleSignUp = () => {
    resendSignUpConfirm(phone, confirmSuccess, confirmFail);
  };

  const confirmSuccess = () => {
    openModal(SignUpConfirmModal, { phone });
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
    setPhone("");
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="400px">
      <h1 style={{ marginTop: 0 }}>전화번호 인증</h1>

      <AuthPhoneField
        value={phone}
        onValueChange={setPhone}
        enterKeyHint="done"
      />

      <Button
        sx={{ width: "100%", mt: "2em", height: "3em" }}
        variant="outlined"
        onClick={handleSignUp}
        disabled={phone.length !== 10}
      >
        인증번호 전송
      </Button>
    </CustomModal>
  );
};

export default SignUpRequestConfirmModal;
