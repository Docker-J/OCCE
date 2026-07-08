import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import useModals from "../../util/useModal";
import useSnackbar from "../../util/useSnackbar";
import { forgotPassword } from "../../api/user";
import ResetPasswordConfirmModal from "./ResetPasswordConfirmModal";
import CustomModal from "../../common/CustomModal";
import { PatternFormat } from "react-number-format";

const ResetPasswordRequestModal = ({ isOpen, onClose }) => {
  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();
  const [phone, setPhone] = useState("");

  const handleRequestReset = () => {
    forgotPassword(phone, requestSuccess, requestFail);
  };

  const requestSuccess = () => {
    openSnackbar("success", "인증번호가 전송되었습니다.");
    openModal(ResetPasswordConfirmModal, { phone: phone });
    handleClose();
  };

  const requestFail = (error) => {
    let message = "인증 요청에 실패했습니다.";
    if (error === "UserNotFoundException") {
      message = "등록되지 않은 번호입니다. 회원가입을 먼저 진행해주세요.";
    } else if (error === "LimitExceededException") {
      message = "인증번호 전송 요청 제한을 초과했습니다. 잠시 후 다시 시도해주세요.";
    }
    openSnackbar("error", message);
  };

  const handleClose = () => {
    setPhone("");
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} maxWidth="400px">
      <h1 style={{ marginTop: 0, marginBottom: "0.2em" }}>비밀번호 재설정</h1>
      <Typography style={{ color: "#666", marginBottom: "1em", textAlign: "center" }}>
        가입 시 등록한 전화번호를 입력하시면<br />비밀번호 재설정 인증번호를 전송해 드립니다.
      </Typography>

      <PatternFormat
        sx={{ width: "90%", mt: "1em" }}
        label="전화번호"
        type="tel"
        format="(###) ###-####"
        mask="_"
        allowEmptyFormatting={true}
        customInput={TextField}
        value={phone}
        onValueChange={(values) => {
          setPhone(values.value);
        }}
        required
      />

      <Button
        sx={{ width: "90%", mt: "2em", mb: "1em" }}
        variant="outlined"
        onClick={handleRequestReset}
        disabled={phone.length !== 10}
      >
        인증번호 전송
      </Button>
    </CustomModal>
  );
};

export default ResetPasswordRequestModal;
