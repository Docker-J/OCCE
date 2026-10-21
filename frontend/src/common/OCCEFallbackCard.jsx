import React from "react";
import PropTypes from "prop-types";
import { Box, Card, Typography, Button } from "@mui/material";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

/**
 * OCCE-themed fallback card for localized ErrorBoundaries.
 * Designed to recover state without full page refreshes.
 */
export default function OCCEFallbackCard({
  error,
  resetErrorBoundary,
  title = "모듈을 불러오는 중 오류가 발생했습니다",
  description = "일시적인 오류가 발생했습니다. 아래 버튼을 눌러 다시 시도해 주세요.",
  actionText = "다시 시도",
  compact = false,
  minHeight = 220,
  onReset,
  fallbackLink,
  extraAction,
}) {
  const handleReset = () => {
    if (resetErrorBoundary) {
      try {
        resetErrorBoundary();
      } catch (e) {
        console.error("Error during boundary reset callback:", e);
      }
    } else if (onReset) {
      try {
        onReset();
      } catch (e) {
        console.error("Error during boundary reset callback:", e);
      }
    }
  };

  const resolvedFallbackLink =
    typeof fallbackLink === "string"
      ? { label: "외부 링크로 보기", url: fallbackLink }
      : fallbackLink;

  return (
    <Card
      role="alert"
      aria-live="polite"
      sx={{
        width: "100%",
        minHeight: compact ? (minHeight === 220 ? 160 : minHeight) : minHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: compact ? 2 : 4,
        textAlign: "center",
        borderRadius: "16px",
        border: "1px solid rgba(255, 107, 0, 0.18)",
        background: "linear-gradient(180deg, #fffbf8 0%, #ffffff 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Box
        sx={{
          width: compact ? 40 : 54,
          height: compact ? 40 : 54,
          borderRadius: "50%",
          bgcolor: "rgba(255, 107, 0, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: compact ? 1 : 1.5,
          flexShrink: 0,
        }}
      >
        <WarningAmberRoundedIcon
          sx={{
            fontSize: compact ? "1.6rem" : "2.2rem",
            color: "#FF6B00",
          }}
        />
      </Box>

      <Typography
        variant={compact ? "subtitle2" : "h6"}
        sx={{
          fontWeight: 800,
          color: "#1e293b",
          fontFamily: "inherit",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            maxWidth: 440,
            mb: compact ? 1.5 : 2,
            lineHeight: 1.5,
            fontFamily: "inherit",
            fontSize: compact ? "0.8rem" : "0.875rem",
          }}
        >
          {description}
        </Typography>
      )}

      {/* Development / Debug Error Message Display */}
      {import.meta.env?.DEV && error?.message && (
        <Box
          sx={{
            maxWidth: "90%",
            bgcolor: "rgba(239, 68, 68, 0.06)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "8px",
            px: 1.5,
            py: 0.8,
            mb: 2,
            overflowX: "auto",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#dc2626",
              fontFamily: "monospace",
              fontSize: "0.75rem",
              wordBreak: "break-all",
            }}
          >
            {error.message}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
          mt: 0.5,
        }}
      >
        {resetErrorBoundary && (
          <Button
            variant="contained"
            startIcon={<ReplayRoundedIcon />}
            onClick={handleReset}
            size={compact ? "small" : "medium"}
            sx={{
              bgcolor: "#FF6B00",
              color: "#ffffff",
              fontWeight: 700,
              borderRadius: "12px",
              px: compact ? 2 : 3,
              py: compact ? 0.6 : 0.9,
              boxShadow: "0 4px 12px rgba(255, 107, 0, 0.25)",
              "&:hover": {
                bgcolor: "#e65100",
                boxShadow: "0 6px 16px rgba(255, 107, 0, 0.35)",
              },
            }}
          >
            {actionText}
          </Button>
        )}

        {resolvedFallbackLink && (
          <Button
            component="a"
            href={resolvedFallbackLink.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size={compact ? "small" : "medium"}
            endIcon={<OpenInNewRoundedIcon sx={{ fontSize: "1rem !important" }} />}
            sx={{
              borderRadius: "12px",
              borderColor: "rgba(255, 107, 0, 0.3)",
              color: "#FF6B00",
              fontWeight: 700,
              px: compact ? 2 : 2.5,
              py: compact ? 0.6 : 0.9,
              "&:hover": {
                borderColor: "#FF6B00",
                bgcolor: "rgba(255, 107, 0, 0.04)",
              },
            }}
          >
            {resolvedFallbackLink.label || "외부 링크로 보기"}
          </Button>
        )}

        {extraAction}
      </Box>
    </Card>
  );
}

OCCEFallbackCard.propTypes = {
  error: PropTypes.any,
  resetErrorBoundary: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  actionText: PropTypes.string,
  compact: PropTypes.bool,
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onReset: PropTypes.func,
  fallbackLink: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string.isRequired,
    }),
  ]),
  extraAction: PropTypes.node,
};
