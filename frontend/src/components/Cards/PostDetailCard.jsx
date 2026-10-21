import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PushPinIcon from "@mui/icons-material/PushPin";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import CustomCard from "../../common/CustomCard";
import FontSizeController from "../News/common/FontSizeController";

/**
 * PostDetailCard refactored to use CustomCard compound components.
 * Retains full visual styling, chip badges, and action handlers.
 */
const PostDetailCard = ({
  title,
  body,
  timestamp,
  isPinned = false,
  fontSize = 16,
  onIncreaseFont,
  onDecreaseFont,
  onResetFont,
  themeColor = "#FF6B00",
  children,
  actions,
  className = "",
  sx = {},
}) => {
  const formattedDate = timestamp
    ? format(new Date(timestamp), "yyyy년 M월 d일")
    : "";

  const sanitizedBody = useMemo(
    () =>
      DOMPurify.sanitize(body || "", {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
      }),
    [body]
  );

  return (
    <CustomCard
      variant="elevated"
      themeColor={themeColor}
      className={className}
      sx={{
        borderRadius: "24px",
        boxShadow: `0 10px 40px ${themeColor}0d, 0 2px 10px rgba(0, 0, 0, 0.02)`,
        border: `1px solid ${themeColor}1a`,
        p: { xs: 2.5, sm: 4, md: 5 },
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      {/* Header Slot with Pin Badge, Title, and Metadata Bar */}
      <CustomCard.Header
        sx={{
          p: 0,
          pb: 2.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 0,
        }}
        action={
          isPinned && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, width: "100%" }}>
              <CustomCard.Badge
                variant="subtle"
                color={themeColor}
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
          )
        }
      >
        {/* Post Title */}
        {title && (
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
        )}

        {/* Metadata Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#757575",
            fontSize: "14px",
            pb: 2.5,
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            flexWrap: "wrap",
            gap: 1.5,
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: themeColor }} />
            <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
              {formattedDate}
            </Typography>
          </Box>

          {/* Font Size Adjuster Controls */}
          {(onIncreaseFont || onDecreaseFont || onResetFont) && (
            <FontSizeController
              fontSize={fontSize}
              onIncrease={onIncreaseFont}
              onDecrease={onDecreaseFont}
              onReset={onResetFont}
            />
          )}
        </Box>
      </CustomCard.Header>

      {/* Body Slot with CKEditor Content */}
      <CustomCard.Body noPadding sx={{ flexGrow: 1, my: 1 }}>
        <div
          className="ck-content"
          dangerouslySetInnerHTML={{
            __html: sanitizedBody,
          }}
          style={{
            wordBreak: "break-word",
            fontSize: `${fontSize}px`,
            lineHeight: 1.85,
            color: "#333333",
            transition: "font-size 0.2s ease",
          }}
        />
      </CustomCard.Body>

      {/* Actions Slot */}
      {(children || actions) && (
        <CustomCard.Actions align="right" sx={{ p: 0, pt: 2.5 }}>
          {actions || children}
        </CustomCard.Actions>
      )}
    </CustomCard>
  );
};

PostDetailCard.propTypes = {
  title: PropTypes.node,
  body: PropTypes.string,
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  isPinned: PropTypes.bool,
  fontSize: PropTypes.number,
  onIncreaseFont: PropTypes.func,
  onDecreaseFont: PropTypes.func,
  onResetFont: PropTypes.func,
  themeColor: PropTypes.string,
  children: PropTypes.node,
  actions: PropTypes.node,
  className: PropTypes.string,
  sx: PropTypes.object,
};

// Subcomponent attachments for compound usage
PostDetailCard.Header = CustomCard.Header;
PostDetailCard.Body = CustomCard.Body;
PostDetailCard.Actions = CustomCard.Actions;
PostDetailCard.Badge = CustomCard.Badge;

export default PostDetailCard;
