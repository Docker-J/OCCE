/**
 * @file ReportTypeTabs.jsx
 * @description 주일 출석 보고 / 정원 모임 보고 전환 탭 컴포넌트
 * React 19 ViewTransition 슬라이딩 인디케이터(.tab-underline) 적용
 */

import { ViewTransition } from "react";
import PropTypes from "prop-types";
import { Box, Button } from "@mui/material";
import { useSmallGroupReportContext } from "../SmallGroupReportContext";

const ReportTypeTabs = ({
  reportType: reportTypeProp,
  onReportTypeChange: onReportTypeChangeProp,
}) => {
  const ctx = useSmallGroupReportContext();
  const reportType = reportTypeProp ?? ctx?.state?.reportType;
  const onReportTypeChange =
    onReportTypeChangeProp ?? ctx?.actions?.handleReportTypeChange;

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
          position: "relative",
          fontWeight: 700,
          fontSize: "1.05em",
          color: reportType === "sunday" ? "#dc2626" : "#666",
          borderRadius: 0,
          backgroundColor:
            reportType === "sunday"
              ? "rgba(220, 38, 38, 0.05)"
              : "transparent",
          "&:hover": { backgroundColor: "rgba(220, 38, 38, 0.08)" },
        }}
      >
        주일 출석 보고
        {reportType === "sunday" && (
          <ViewTransition
            name="report-tab-indicator"
            share="tab-underline"
            default="none"
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "4px",
                backgroundColor: "#dc2626",
              }}
            />
          </ViewTransition>
        )}
      </Button>
      <Button
        onClick={() => onReportTypeChange("gathering")}
        sx={{
          flex: 1,
          py: 1.8,
          position: "relative",
          fontWeight: 700,
          fontSize: "1.05em",
          color: reportType === "gathering" ? "#ea580c" : "#666",
          borderRadius: 0,
          backgroundColor:
            reportType === "gathering"
              ? "rgba(234, 88, 12, 0.05)"
              : "transparent",
          "&:hover": { backgroundColor: "rgba(234, 88, 12, 0.08)" },
        }}
      >
        정원 모임 보고
        {reportType === "gathering" && (
          <ViewTransition
            name="report-tab-indicator"
            share="tab-underline"
            default="none"
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "4px",
                backgroundColor: "#ea580c",
              }}
            />
          </ViewTransition>
        )}
      </Button>
    </Box>
  );
};

ReportTypeTabs.propTypes = {
  reportType: PropTypes.oneOf(["sunday", "gathering"]),
  onReportTypeChange: PropTypes.func,
};

export default ReportTypeTabs;
