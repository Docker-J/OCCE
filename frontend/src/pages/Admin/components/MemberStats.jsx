/**
 * @file MemberStats.jsx
 * @description 교인 및 교적 관리 대시보드 4대 핵심 요약 지표 카드 컴포넌트
 */

import PropTypes from "prop-types";
import { Box, Paper, Typography } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const MemberStats = ({ metrics }) => {
  const regPercent =
    metrics.total > 0
      ? Math.round((metrics.registeredCount / metrics.total) * 100)
      : 0;

  const cards = [
    {
      title: "등록 교인",
      value: `${metrics.total}명`,
      subValue: `${metrics.householdCount}세대`,
      subText: `총 ${metrics.householdCount}가구 · 교역자 ${metrics.clergyCount || 0}명${metrics.removedCount ? ` (제적 ${metrics.removedCount}명 제외)` : ""}`,
      icon: <PeopleAltOutlinedIcon fontSize="medium" />,
      bg: "rgba(234, 88, 12, 0.1)",
      color: "#111",
      iconColor: "#ea580c",
    },
    {
      title: "웹 가입 완료",
      value: `${metrics.registeredCount}명`,
      subText: `활동 가입률 ${regPercent}%`,
      icon: <HowToRegOutlinedIcon fontSize="medium" />,
      bg: "rgba(37, 99, 235, 0.1)",
      color: "#1d4ed8",
      iconColor: "#2563eb",
    },
    {
      title: "알림 수신 기기",
      value: `${metrics.notificationEnabled}대`,
      subText: "푸시 알림 활성화",
      icon: <NotificationsActiveIcon fontSize="medium" />,
      bg: "rgba(22, 163, 74, 0.1)",
      color: "#15803d",
      iconColor: "#16a34a",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
        gap: 2,
        mb: 3.5,
      }}
    >
      {cards.map((card) => (
        <Paper
          key={card.title}
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: "16px",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              minWidth: 50,
              borderRadius: "14px",
              backgroundColor: card.bg,
              color: card.iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {card.icon}
          </Box>
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="caption" sx={{ color: "#666", fontWeight: 600, display: "block" }}>
              {card.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.8, my: 0.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: card.color, lineHeight: 1.2 }}>
                {card.value}
              </Typography>
              {card.subValue && (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "#ea580c",
                    fontSize: "0.85rem",
                  }}
                >
                  ({card.subValue})
                </Typography>
              )}
            </Box>
            <Typography variant="caption" sx={{ color: "#888", fontSize: "0.72rem", fontWeight: 500 }}>
              {card.subText}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

MemberStats.propTypes = {
  metrics: PropTypes.shape({
    total: PropTypes.number.isRequired,
    householdCount: PropTypes.number.isRequired,
    registeredCount: PropTypes.number.isRequired,
    notificationEnabled: PropTypes.number.isRequired,
    staffCount: PropTypes.number,
    keepers: PropTypes.number,
    clergyCount: PropTypes.number,
    removedCount: PropTypes.number,
  }).isRequired,
};

export default MemberStats;
