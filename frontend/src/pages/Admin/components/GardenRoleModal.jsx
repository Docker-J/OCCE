/**
 * @file GardenRoleModal.jsx
 * @description 정원지기 임명/수정 및 담당 정원 배정 모달 다이얼로그 (상태 국소화 적용)
 */

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Typography,
  Chip,
  Stack,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import ForestIcon from "@mui/icons-material/Forest";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import { formatPhoneNumber } from "../utils/memberUtils";

const GardenRoleModal = ({
  open,
  user,
  availableGardens,
  updatingRole,
  onClose,
  onSave,
  onAddAvailableGarden,
}) => {
  const [selectedGardens, setSelectedGardens] = useState([]);
  const [customGardenInput, setCustomGardenInput] = useState("");

  // 모달 대상 유저가 바뀔 때 담당 정원 로컬 상태 동기화
  useEffect(() => {
    if (user) {
      const initial = user.garden
        ? user.garden.split(",").map((g) => g.trim()).filter(Boolean)
        : [];
      setSelectedGardens(initial);
      setCustomGardenInput("");
    }
  }, [user]);

  const handleToggleGarden = (gardenName) => {
    setSelectedGardens((prev) =>
      prev.includes(gardenName) ? prev.filter((g) => g !== gardenName) : [...prev, gardenName]
    );
  };

  const handleAddCustomGarden = () => {
    const trimmed = customGardenInput.trim();
    if (trimmed && !selectedGardens.includes(trimmed)) {
      setSelectedGardens((prev) => [...prev, trimmed]);
      onAddAvailableGarden?.(trimmed);
      setCustomGardenInput("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { borderRadius: "18px", p: 1, maxWidth: "500px", width: "100%" },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: user?.isGardenKeeper ? "#c2410c" : "#ea580c",
          pb: 1,
        }}
      >
        <ForestIcon sx={{ color: "#ea580c" }} />
        {user?.isGardenKeeper ? "정원지기 담당 정원 관리" : "정원지기 임명 및 정원 배정"}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <DialogContentText sx={{ color: "#333", mb: 2.5, lineHeight: 1.6, fontSize: "0.98rem" }}>
          <strong>{user?.name || "선택한 교인"}</strong>({formatPhoneNumber(user?.phone)})님의{" "}
          {user?.isGardenKeeper
            ? "담당 정원을 수정하거나 정원지기 역할을 해제할 수 있습니다."
            : "정원지기 역할을 부여하고 담당할 정원을 배정합니다."}
        </DialogContentText>

        {/* 정원 선택 영역 */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#444", mb: 1.2 }}>
            담당 정원 선택 (1인 다정원 가능):
          </Typography>

          {availableGardens.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
              {availableGardens.map((gardenName) => {
                const isSelected = selectedGardens.includes(gardenName);
                return (
                  <Chip
                    key={gardenName}
                    label={gardenName}
                    clickable
                    onClick={() => handleToggleGarden(gardenName)}
                    icon={
                      isSelected ? (
                        <CheckIcon sx={{ fontSize: "1rem !important", color: "#fff !important" }} />
                      ) : undefined
                    }
                    sx={{
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: "0.88rem",
                      height: 32,
                      borderRadius: "8px",
                      backgroundColor: isSelected ? "#ea580c" : "#f3f4f6",
                      color: isSelected ? "#fff" : "#4b5563",
                      border: isSelected ? "1px solid #c2410c" : "1px solid rgba(0,0,0,0.1)",
                      "&:hover": { backgroundColor: isSelected ? "#c2410c" : "#e5e7eb" },
                    }}
                  />
                );
              })}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: "#888", mb: 1.5 }}>
              정원 목록을 불러오는 중이거나 없습니다. 아래에서 직접 입력해 주세요.
            </Typography>
          )}

          {/* 직접 입력 텍스트 필드 */}
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <TextField
              size="small"
              placeholder="목록에 없는 정원 직접 입력"
              value={customGardenInput}
              onChange={(e) => setCustomGardenInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomGarden();
                }
              }}
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddCustomGarden}
              disabled={!customGardenInput.trim()}
              sx={{
                borderColor: "#ea580c",
                color: "#ea580c",
                fontWeight: 600,
                borderRadius: "8px",
                "&:hover": { borderColor: "#c2410c", backgroundColor: "rgba(234, 88, 12, 0.04)" },
              }}
            >
              추가
            </Button>
          </Stack>

          {/* 선택 정원 미리보기 */}
          <Box sx={{ mt: 1.5, minHeight: 24 }}>
            {selectedGardens.length > 0 ? (
              <Typography variant="caption" sx={{ color: "#ea580c", fontWeight: 700 }}>
                선택된 정원 ({selectedGardens.length}개): {selectedGardens.join(", ")}
              </Typography>
            ) : (
              <Typography variant="caption" sx={{ color: "#dc2626", fontWeight: 600 }}>
                ⚠️ 담당할 정원을 최소 1개 이상 선택해 주세요.
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            backgroundColor: "rgba(234, 88, 12, 0.06)",
            borderRadius: "12px",
            border: "1px solid rgba(234, 88, 12, 0.2)",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "#c2410c", display: "block", fontWeight: 600, lineHeight: 1.5 }}
          >
            💡 저장 시 해당 교인은 온교회 소그룹 출석 보고서를 제출할 수 있는 권한을 얻게 되며,
            매주 일요일 오후 4시 출석 리마인더 알림을 받게 됩니다.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: "space-between" }}>
        {user?.isGardenKeeper ? (
          <Button
            onClick={() => onSave("remove", [])}
            disabled={updatingRole}
            color="error"
            sx={{ fontWeight: 600 }}
          >
            정원지기 역할 해제
          </Button>
        ) : (
          <Box />
        )}

        <Stack direction="row" spacing={1}>
          <Button onClick={onClose} disabled={updatingRole} sx={{ color: "#666", fontWeight: 600 }}>
            취소
          </Button>
          <Button
            onClick={() =>
              onSave(user?.isGardenKeeper ? "update_gardens" : "assign", selectedGardens)
            }
            disabled={updatingRole || selectedGardens.length === 0}
            variant="contained"
            sx={{
              backgroundColor: "#FF6B00",
              fontWeight: 700,
              borderRadius: "20px",
              px: 2.5,
              "&:hover": { backgroundColor: "#e05e00" },
            }}
          >
            {updatingRole ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : user?.isGardenKeeper ? (
              "정원 저장"
            ) : (
              "임명하기"
            )}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

GardenRoleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.object,
  availableGardens: PropTypes.arrayOf(PropTypes.string).isRequired,
  updatingRole: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onAddAvailableGarden: PropTypes.func.isRequired,
};

export default GardenRoleModal;
