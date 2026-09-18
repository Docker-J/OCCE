import { Box, Typography } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const DepartmentQuote = ({
  quote,
  subQuote,
  reference,
  themeColor,
  iconColor,
  variant = "h5",
}) => {
  return (
    <Box
      className="animate-fade"
      sx={{ textAlign: "center", mb: 10, animationDelay: "0.1s" }}
    >
      <FormatQuoteIcon
        sx={{
          fontSize: "4rem",
          color: iconColor || `${themeColor}2e`,
          mb: -2,
        }}
      />
      <Typography
        variant={variant}
        sx={{
          fontWeight: 800,
          color: "#2b2b2b",
          lineHeight: 1.6,
          wordBreak: "keep-all",
          mb: 3,
        }}
      >
        {quote}
      </Typography>
      {subQuote && (
        <Typography
          variant="body1"
          sx={{
            color: "#777",
            fontStyle: "italic",
            mb: 4,
            lineHeight: 1.8,
            wordBreak: "keep-all",
          }}
        >
          {subQuote}
        </Typography>
      )}
      {reference && (
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 800, color: themeColor, letterSpacing: "2px" }}
        >
          {reference}
        </Typography>
      )}
    </Box>
  );
};

export default DepartmentQuote;
