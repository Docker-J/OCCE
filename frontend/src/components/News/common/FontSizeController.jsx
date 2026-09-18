import { Box, Button, Typography } from "@mui/material";

const FontSizeController = ({
  fontSize,
  onIncrease,
  onDecrease,
  onReset,
  minSize = 13,
  maxSize = 25,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        backgroundColor: "rgba(0, 0, 0, 0.03)",
        borderRadius: "20px",
        px: 1.5,
        py: 0.5,
        border: "1px solid rgba(0, 0, 0, 0.06)",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "#777",
          fontWeight: 600,
          mr: 0.5,
          fontSize: "12px",
        }}
      >
        글꼴 크기
      </Typography>
      <Button
        size="small"
        onClick={onDecrease}
        disabled={fontSize <= minSize}
        title="글자 줄이기"
        sx={{
          minWidth: "28px",
          height: "28px",
          p: 0,
          fontSize: "13px",
          fontWeight: 700,
          color: "#555",
          borderRadius: "6px",
        }}
      >
        가-
      </Button>
      <Typography
        variant="caption"
        onClick={onReset}
        title="기본 크기로 초기화"
        sx={{
          color: "rgba(0, 0, 0, 0.2)",
          fontWeight: 400,
          cursor: "pointer",
          px: 0.75,
          fontSize: "13px",
          userSelect: "none",
        }}
      >
        |
      </Typography>
      <Button
        size="small"
        onClick={onIncrease}
        disabled={fontSize >= maxSize}
        title="글자 키우기"
        sx={{
          minWidth: "28px",
          height: "28px",
          p: 0,
          fontSize: "13px",
          fontWeight: 700,
          color: "#555",
          borderRadius: "6px",
        }}
      >
        가+
      </Button>
    </Box>
  );
};

export default FontSizeController;
