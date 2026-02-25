import { useState } from "react";
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

  const confirmFail = () => {};

  const handleClose = () => {
    onClose();
  };

  const resendSuccess = () => {
    openSnackbar();
  };

  const resendFail = () => {
    openSnackbar();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="400px">
      <h1 style={{ marginTop: 0 }}>전화번호 인증</h1>
      <p>{phone}로 발송된 인증번호를 입력해주세요.</p>

      <Button
        sx={{ width: "90%" }}
        variant="outlined"
        onClick={onResendRequest}
      >
        인증번호 재발송
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
