/**
 * @file ReportTypeTabs.jsx
 * @description 주일 출석 보고 / 정원 모임 보고 전환 탭 컴포넌트
 */

import PropTypes from "prop-types";
import { Box, Button } from "@mui/material";

const ReportTypeTabs = ({ reportType, onReportTypeChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Button
        onClick={() => onReportTypeChange("sunday")}
        sx={{
          flex: 1,
          py: 1.8,
          fontWeight: 700,
          fontSize: "1.05em",
          color: reportType === "sunday" ? "#dc2626" : "#666",
          borderBottom: reportType === "sunday" ? "4px solid #dc2626" : "none",
          borderRadius: 0,
          backgroundColor:
            reportType === "sunday" ? "rgba(220, 38, 38, 0.05)" : "transparent",
          "&:hover": { backgroundColor: "rgba(220, 38, 38, 0.08)" },
        }}
      >
        주일 출석 보고
      </Button>
      <Button
        onClick={() => onReportTypeChange("gathering")}
        sx={{
          flex: 1,
          py: 1.8,
          fontWeight: 700,
          fontSize: "1.05em",
          color: reportType === "gathering" ? "#ea580c" : "#666",
          borderBottom: reportType === "gathering" ? "4px solid #ea580c" : "none",
          borderRadius: 0,
          backgroundColor:
            reportType === "gathering" ? "rgba(234, 88, 12, 0.05)" : "transparent",
          "&:hover": { backgroundColor: "rgba(234, 88, 12, 0.08)" },
        }}
      >
        정원 모임 보고
      </Button>
    </Box>
  );
};

ReportTypeTabs.propTypes = {
  reportType: PropTypes.oneOf(["sunday", "gathering"]).isRequired,
  onReportTypeChange: PropTypes.func.isRequired,
};

export default ReportTypeTabs;
