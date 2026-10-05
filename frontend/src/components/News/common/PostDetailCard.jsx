import { Box, Chip, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PushPinIcon from "@mui/icons-material/PushPin";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import FontSizeController from "./FontSizeController";

const PostDetailCard = ({
  title,
  body,
  timestamp,
  isPinned = false,
  fontSize,
  onIncreaseFont,
  onDecreaseFont,
  onResetFont,
  themeColor = "#FF6B00",
  children,
}) => {
  const formattedDate = timestamp
    ? format(new Date(timestamp), "yyyy년 M월 d일")
    : "";

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        boxShadow: `0 10px 40px ${themeColor}0d, 0 2px 10px rgba(0, 0, 0, 0.02)`,
        border: `1px solid ${themeColor}1a`,
        p: { xs: 2.5, sm: 4, md: 5 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Pin Badge if Pinned */}
      {isPinned && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Chip
            icon={<PushPinIcon style={{ color: themeColor, fontSize: 16 }} />}
            label="고정 공지"
            sx={{
              backgroundColor: `${themeColor}14`,
              color: themeColor,
              fontWeight: 700,
              fontSize: "13px",
              borderRadius: "8px",
            }}
          />
        </Box>
      )}

      {/* Post Title */}
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 800,
          color: "#2b2b2b",
          fontSize: { xs: "22px", sm: "28px", md: "32px" },
          lineHeight: 1.35,
          mb: 2.5,
          wordBreak: "break-word",
        }}
      >
        {title}
      </Typography>

      {/* Metadata Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#757575",
          fontSize: "14px",
          pb: 2.5,
          mb: 3.5,
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarTodayIcon sx={{ fontSize: 16, color: themeColor }} />
          <Typography
            variant="body2"
            sx={{ color: "#666", fontWeight: 500 }}
          >
            {formattedDate}
          </Typography>
        </Box>

        {/* Font Size Adjuster Controls */}
        <FontSizeController
          fontSize={fontSize}
          onIncrease={onIncreaseFont}
          onDecrease={onDecreaseFont}
          onReset={onResetFont}
        />
      </Box>

      {/* CKEditor Body Content */}
      <div
        className="ck-content"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(body || "", {
            ADD_TAGS: ["iframe"],
            ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
          }),
        }}
        style={{
          wordBreak: "break-word",
          fontSize: `${fontSize}px`,
          lineHeight: 1.85,
          color: "#333333",
          transition: "font-size 0.2s ease",
        }}
      />

      {children}
    </Box>
  );
};

export default PostDetailCard;
