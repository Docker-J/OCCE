import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import PersonIcon from "@mui/icons-material/Person";

import { getAdminGardenAttendanceDetail } from "../../api/admin";
import "../../common/CustomDialog.css";

const GardenAttendanceDetailModal = ({ open, onClose, gardenName, date }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !gardenName || !date) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    getAdminGardenAttendanceDetail(gardenName, date)
      .then((res) => {
        if (isMounted) {
          setDetail(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to fetch garden attendance detail:", err);
          setError(
            err.response?.data?.message ||
              "정원 출석 상세 데이터를 불러오지 못했습니다.",
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [open, gardenName, date]);

  const attendees = detail?.attendees || [];
  const absentees = detail?.absentees || [];
  const absenceReasons = detail?.absenceReasons || {};
  const allMembers = detail?.allMembers || [];
  const reported = detail?.reported ?? false;
  const total = detail?.total || 0;
  const rate = detail?.rate || 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1.5, pt: 2.5, px: { xs: 2.5, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
              {gardenName} 출석 상세
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, mt: 0.3 }}>
              {date} 주일
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Status Badge */}
            {detail && (
              <Chip
                icon={
                  reported ? (
                    <CheckCircleIcon sx={{ fontSize: "1rem !important", color: "#16a34a !important" }} />
                  ) : (
                    <ErrorOutlineIcon sx={{ fontSize: "1rem !important", color: "#ea580c !important" }} />
                  )
                }
                label={reported ? "보고 완료" : "미보고"}
                sx={{
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  backgroundColor: reported ? "rgba(22, 163, 74, 0.1)" : "rgba(234, 88, 12, 0.1)",
                  color: reported ? "#16a34a" : "#ea580c",
                  border: reported ? "1px solid rgba(22, 163, 74, 0.25)" : "1px solid rgba(234, 88, 12, 0.25)",
                }}
              />
            )}
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "#94a3b8",
                "&:hover": { color: "#334155", backgroundColor: "rgba(0, 0, 0, 0.06)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Summary Mini Bar */}
        {detail && reported && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: "12px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, display: "block" }}>
                총원
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b" }}>
                {total}명
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#16a34a", fontWeight: 600, display: "block" }}>
                출석
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#16a34a" }}>
                {attendees.length}명
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#dc2626", fontWeight: 600, display: "block" }}>
                결석
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#dc2626" }}>
                {absentees.length}명
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ textAlign: "center", minWidth: 70 }}>
              <Typography variant="caption" sx={{ color: "#ea580c", fontWeight: 600, display: "block" }}>
                출석률
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#ea580c" }}>
                {rate}%
              </Typography>
            </Box>
          </Box>
        )}
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5, px: { xs: 2.5, sm: 3 } }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6 }}>
            <CircularProgress sx={{ color: "#ea580c", mb: 2 }} />
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
              정원 출석 상세 데이터를 불러오고 있습니다...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error">
            {error}
          </Alert>
        ) : !reported ? (
          /* Unreported Garden View */
          <Box>
            <Alert severity="warning" sx={{ mb: 2.5 }}>
              해당 주일에는 아직 정원지기의 출석 보고가 완료되지 않았습니다.
            </Alert>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 1.5 }}>
              정원 소속 성도 명단 ({allMembers.length}명)
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {allMembers.map((m) => (
                <Chip
                  key={m}
                  label={m}
                  icon={<PersonIcon sx={{ fontSize: "1rem !important" }} />}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: "#f1f5f9",
                    color: "#334155",
                    borderRadius: "8px",
                  }}
                />
              ))}
            </Box>
          </Box>
        ) : (
          /* Reported Garden Detail View */
          <Stack spacing={3}>
            {/* 1. Attendees */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <CheckCircleIcon sx={{ color: "#16a34a", fontSize: "1.25rem" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#16a34a" }}>
                  출석 성도 ({attendees.length}명)
                </Typography>
              </Box>

              {attendees.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#94a3b8", fontStyle: "italic", pl: 0.5 }}>
                  출석한 성도가 없습니다.
                </Typography>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "14px",
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {attendees.map((name) => (
                    <Chip
                      key={name}
                      label={name}
                      size="medium"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        backgroundColor: "#ffffff",
                        color: "#15803d",
                        border: "1px solid #86efac",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                      }}
                    />
                  ))}
                </Paper>
              )}
            </Box>

            {/* 2. Absentees & Reasons */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <CancelIcon sx={{ color: "#dc2626", fontSize: "1.25rem" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#dc2626" }}>
                  결석 성도 & 사유 ({absentees.length}명)
                </Typography>
              </Box>

              {absentees.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "14px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#15803d", fontWeight: 700 }}>
                    🎉 전원 출석했습니다!
                  </Typography>
                </Paper>
              ) : (
                <Stack spacing={1.2}>
                  {absentees.map((name) => {
                    const reason = absenceReasons[name];

                    return (
                      <Paper
                        key={name}
                        elevation={0}
                        sx={{
                          p: 1.6,
                          borderRadius: "12px",
                          backgroundColor: "#fef2f2",
                          border: "1px solid #fecaca",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 700, color: "#991b1b" }}>
                          {name}
                        </Typography>

                        {reason ? (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.6,
                              backgroundColor: "#fff",
                              border: "1px solid #fca5a5",
                              borderRadius: "8px",
                              px: 1.2,
                              py: 0.5,
                              maxWidth: "80%",
                            }}
                          >
                            <ChatBubbleOutlineIcon sx={{ fontSize: "0.95rem", color: "#ea580c" }} />
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#7f1d1d",
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                wordBreak: "break-word",
                              }}
                            >
                              {reason}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>
                            (사유 미기재)
                          </Typography>
                        )}
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, px: { xs: 2.5, sm: 3 }, pt: 1.5 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#475569",
            "&:hover": { backgroundColor: "#334155" },
            borderRadius: "10px",
            px: 3,
            fontWeight: 700,
          }}
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GardenAttendanceDetailModal;
