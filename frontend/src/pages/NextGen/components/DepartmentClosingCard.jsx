import { Box, Typography } from "@mui/material";

const DepartmentClosingCard = ({
  bgColor,
  borderColor,
  title,
  titleColor,
  titleVariant = "h6",
  subtitle,
  subtitleColor,
  reference,
  referenceColor,
  children,
  sx = {},
}) => {
  return (
    <Box
      className="animate-fade"
      sx={{
        backgroundColor: bgColor,
        border: borderColor ? `1px solid ${borderColor}` : "none",
        borderRadius: "24px",
        p: { xs: 4, md: 5 },
        textAlign: "center",
        animationDelay: "0.5s",
        ...sx,
      }}
    >
      {title && (
        <Typography
          variant={titleVariant}
          sx={{
            color: titleColor,
            lineHeight: 1.8,
            wordBreak: "keep-all",
            fontWeight: 700,
            mb: subtitle ? 1 : 0,
          }}
        >
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            color: subtitleColor,
            fontStyle: "italic",
            mb: reference ? 2 : 0,
            lineHeight: 1.6,
            wordBreak: "keep-all",
          }}
        >
          {subtitle}
        </Typography>
      )}
      {reference && (
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            color: referenceColor || subtitleColor,
            letterSpacing: "1px",
          }}
        >
          {reference}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default DepartmentClosingCard;
