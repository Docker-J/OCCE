/**
 * @file MemberStats.jsx
 * @description 교인 관리 대시보드 4대 핵심 요약 지표 카드 컴포넌트
 */

import PropTypes from "prop-types";
import { Box, Paper, Typography } from "@mui/material";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ForestIcon from "@mui/icons-material/Forest";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const MemberStats = ({ metrics }) => {
  const cards = [
    {
      title: "총 등록 교인",
      value: `${metrics.total}명`,
      icon: <SupervisorAccountIcon fontSize="medium" />,
      bg: "rgba(107, 114, 128, 0.1)",
      color: "#111",
      iconColor: "#4b5563",
    },
    {
      title: "스태프 (교역자)",
      value: `${metrics.staffCount}명`,
      icon: <SupervisorAccountIcon fontSize="medium" />,
      bg: "rgba(37, 99, 235, 0.1)",
      color: "#2563eb",
      iconColor: "#2563eb",
    },
    {
      title: "정원지기",
      value: `${metrics.keepers}명`,
      icon: <ForestIcon fontSize="medium" />,
      bg: "rgba(234, 88, 12, 0.1)",
      color: "#ea580c",
      iconColor: "#ea580c",
    },
    {
      title: "알림 수신",
      value: `${metrics.notificationEnabled}명`,
      icon: <NotificationsActiveIcon fontSize="medium" />,
      bg: "rgba(22, 163, 74, 0.1)",
      color: "#16a34a",
      iconColor: "#16a34a",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
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
              width: 48,
              height: 48,
              borderRadius: "12px",
              backgroundColor: card.bg,
              color: card.iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {card.icon}
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
              {card.title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: card.color }}>
              {card.value}
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
    staffCount: PropTypes.number.isRequired,
    keepers: PropTypes.number.isRequired,
    notificationEnabled: PropTypes.number.isRequired,
  }).isRequired,
};

export default MemberStats;
