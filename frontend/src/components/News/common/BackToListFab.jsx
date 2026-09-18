import { Fab } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackToListFab = ({
  onClick,
  label = "목록으로",
  themeColor = "#FF6B00",
}) => {
  return (
    <Fab
      variant="extended"
      onClick={onClick}
      sx={{
        position: "fixed",
        bottom: { xs: 24, sm: 32 },
        left: { xs: 20, sm: 32 },
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(16px)",
        color: themeColor,
        fontWeight: 700,
        fontSize: "14.5px",
        px: 2.5,
        py: 1,
        borderRadius: "30px",
        border: `1px solid ${themeColor}40`,
        boxShadow: `0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px ${themeColor}26`,
        textTransform: "none",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          backgroundColor: themeColor,
          color: "#ffffff",
          transform: "translateY(-3px)",
          boxShadow: `0 12px 36px ${themeColor}59`,
          "& .MuiSvgIcon-root": {
            transform: "translateX(-4px)",
          },
        },
        "& .MuiSvgIcon-root": {
          transition: "transform 0.2s ease",
          mr: 0.8,
        },
      }}
    >
      <ArrowBackIcon sx={{ fontSize: 20 }} />
      {label}
    </Fab>
  );
};

export default BackToListFab;
