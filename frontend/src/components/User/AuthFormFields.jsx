/**
 * @file AuthFormFields.jsx
 * @description 인증 모달(로그인, 회원가입, 번호인증, 비밀번호 재설정)에서 공통으로 사용하는
 * 전화번호 포맷 입력 필드(AuthPhoneField) 및 비밀번호 토글 입력 필드(AuthPasswordField)
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";

/**
 * 북미 전화번호 포맷 ((###) ###-####) 입력 필드
 * - react-hook-form `control` + `name`이 주어지면 `<Controller>`로 감싸서 렌더링
 * - `control`이 없으면 제어 컴포넌트(`value`, `onValueChange`)로 렌더링
 */
export const AuthPhoneField = ({
  control,
  name = "phone",
  rules,
  value,
  onValueChange,
  label = "전화번호",
  autoComplete = "tel",
  enterKeyHint = "next",
  disabled = false,
  required = true,
  sx = { width: "100%", mt: "1em" },
}) => {
  const renderPatternInput = ({
    fieldName,
    fieldValue,
    onChange,
    error,
  }) => (
    <PatternFormat
      name={fieldName}
      value={fieldValue}
      format="(###) ###-####"
      mask="_"
      allowEmptyFormatting
      customInput={TextField}
      required={required}
      label={label}
      type="tel"
      autoComplete={autoComplete}
      inputMode="tel"
      fullWidth
      sx={sx}
      error={!!error}
      helperText={error?.message}
      disabled={disabled}
      slotProps={{
        htmlInput: {
          autoComplete,
          inputMode: "tel",
          enterKeyHint,
          spellCheck: false,
        },
      }}
      onValueChange={(values) => {
        onChange?.(values.value);
      }}
    />
  );

  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        rules={
          rules ?? {
            required: "전화번호를 입력해주세요.",
            validate: (val) =>
              val?.length === 10 || "전화번호 10자리를 모두 입력해주세요.",
          }
        }
        render={({
          field: { onChange, name: fieldName, value: fieldValue },
          fieldState: { error },
        }) =>
          renderPatternInput({
            fieldName,
            fieldValue,
            onChange,
            error,
          })
        }
      />
    );
  }

  return renderPatternInput({
    fieldName: name,
    fieldValue: value,
    onChange: onValueChange,
    error: null,
  });
};

AuthPhoneField.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  rules: PropTypes.object,
  value: PropTypes.string,
  onValueChange: PropTypes.func,
  label: PropTypes.string,
  autoComplete: PropTypes.string,
  enterKeyHint: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  sx: PropTypes.object,
};

/**
 * 비밀번호 표시/숨기기 토글 및 일치 체크 아이콘을 내장한 비밀번호 입력 필드
 */
export const AuthPasswordField = ({
  label = "비밀번호",
  autoComplete = "current-password",
  enterKeyHint = "done",
  disabled = false,
  required = true,
  error = false,
  helperText,
  showMatchIndicator = false,
  registration,
  sx = { width: "100%", mt: "1em" },
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      sx={sx}
      label={label}
      type={showPassword ? "text" : "password"}
      autoComplete={autoComplete}
      required={required}
      disabled={disabled}
      error={error}
      helperText={helperText}
      {...registration}
      {...rest}
      slotProps={{
        htmlInput: {
          enterKeyHint,
          spellCheck: false,
        },
        formHelperText: showMatchIndicator
          ? {
              sx: {
                color: !error ? "#16a34a" : undefined,
                fontWeight: !error ? 600 : undefined,
              },
            }
          : undefined,
        input: {
          endAdornment: (
            <InputAdornment position="end">
              {showMatchIndicator && !error && (
                <CheckCircleIcon
                  fontSize="small"
                  sx={{ color: "#16a34a", mr: 0.5 }}
                />
              )}
              <IconButton
                aria-label={
                  showPassword ? `${label} 숨기기` : `${label} 보기`
                }
                onClick={() => setShowPassword((prev) => !prev)}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
                size="small"
                disabled={disabled}
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
  );
};

AuthPasswordField.propTypes = {
  label: PropTypes.string,
  autoComplete: PropTypes.string,
  enterKeyHint: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.node,
  showMatchIndicator: PropTypes.bool,
  registration: PropTypes.object,
  sx: PropTypes.object,
};
