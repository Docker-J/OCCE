import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import {
  Card as MuiCard,
  CardContent,
  CardActions as MuiCardActions,
  Box,
  Typography,
  Divider,
} from "@mui/material";

// 1. Internal Context for Theme & Styling Cascading
const CardContext = createContext({
  themeColor: "#FF6B00",
  variant: "elevated",
  interactive: false,
  density: "standard",
});

export const useCardContext = () => useContext(CardContext);

// 2. Subcomponent: CustomCard.Header
const Header = ({
  title,
  subtitle,
  action,
  avatar,
  icon,
  iconBg,
  iconColor,
  divider = false,
  className = "",
  sx = {},
  children,
  ...props
}) => {
  const { themeColor } = useCardContext();

  const leadingGraphic = avatar || (icon && (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        backgroundColor: iconBg || `${themeColor}14`,
        color: iconColor || themeColor,
      }}
    >
      {icon}
    </Box>
  ));

  return (
    <>
      <Box
        className={className}
        sx={{
          p: { xs: 2.5, sm: 3 },
          pb: divider ? 2 : 1.5,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          ...sx,
        }}
        {...props}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1, minWidth: 0 }}>
          {leadingGraphic}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {title && (
              typeof title === "string" ? (
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#1e293b",
                    lineHeight: 1.3,
                    fontFamily: "inherit",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {title}
                </Typography>
              ) : (
                title
              )
            )}
            {subtitle && (
              typeof subtitle === "string" ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontWeight: 500,
                    mt: 0.5,
                    fontFamily: "inherit",
                  }}
                >
                  {subtitle}
                </Typography>
              ) : (
                subtitle
              )
            )}
          </Box>
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
        {children}
      </Box>
      {divider && <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.06)" }} />}
    </>
  );
};

Header.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  action: PropTypes.node,
  avatar: PropTypes.node,
  icon: PropTypes.node,
  iconBg: PropTypes.string,
  iconColor: PropTypes.string,
  divider: PropTypes.bool,
  className: PropTypes.string,
  sx: PropTypes.object,
  children: PropTypes.node,
};

// 3. Subcomponent: CustomCard.Body
const Body = ({
  children,
  noPadding = false,
  className = "",
  sx = {},
  ...props
}) => {
  return (
    <CardContent
      className={className}
      sx={{
        flexGrow: 1,
        p: noPadding ? 0 : { xs: 2.5, sm: 3 },
        "&:last-child": {
          pb: noPadding ? 0 : { xs: 2.5, sm: 3 },
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </CardContent>
  );
};

Body.propTypes = {
  children: PropTypes.node,
  noPadding: PropTypes.bool,
  className: PropTypes.string,
  sx: PropTypes.object,
};

// 4. Subcomponent: CustomCard.Actions
const Actions = ({
  children,
  align = "right", // "left" | "right" | "between" | "center"
  divider = false,
  className = "",
  sx = {},
  ...props
}) => {
  const getJustifyContent = () => {
    switch (align) {
      case "left":
        return "flex-start";
      case "center":
        return "center";
      case "between":
      case "space-between":
        return "space-between";
      case "right":
      default:
        return "flex-end";
    }
  };

  return (
    <>
      {divider && <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.06)" }} />}
      <MuiCardActions
        className={className}
        sx={{
          p: { xs: 2, sm: 2.5 },
          pt: divider ? 2 : 1.5,
          display: "flex",
          justifyContent: getJustifyContent(),
          alignItems: "center",
          gap: 1.5,
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiCardActions>
    </>
  );
};

Actions.propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf(["left", "right", "between", "space-between", "center"]),
  divider: PropTypes.bool,
  className: PropTypes.string,
  sx: PropTypes.object,
};

// 5. Subcomponent: CustomCard.Media
const Media = ({
  src,
  alt = "",
  height = 220,
  className = "",
  sx = {},
  children,
  ...props
}) => {
  return (
    <Box
      className={className}
      sx={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        backgroundColor: "#f3f4f6",
        ...sx,
      }}
      {...props}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
      {children}
    </Box>
  );
};

Media.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  sx: PropTypes.object,
  children: PropTypes.node,
};

// 6. Subcomponent: CustomCard.Badge
const Badge = ({
  children,
  label,
  icon,
  variant = "subtle", // "subtle" | "solid" | "outlined"
  color,
  className = "",
  sx = {},
  ...props
}) => {
  const { themeColor } = useCardContext();
  const effectiveColor = color || themeColor;

  const getVariantStyles = () => {
    switch (variant) {
      case "solid":
        return {
          backgroundColor: effectiveColor,
          color: "#ffffff",
        };
      case "outlined":
        return {
          backgroundColor: "transparent",
          border: `1px solid ${effectiveColor}`,
          color: effectiveColor,
        };
      case "subtle":
      default:
        return {
          backgroundColor: `${effectiveColor}14`,
          color: effectiveColor,
        };
    }
  };

  return (
    <Box
      className={className}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.8,
        px: 1.5,
        py: 0.5,
        borderRadius: "8px",
        fontSize: "0.78rem",
        fontWeight: 700,
        fontFamily: "inherit",
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {icon}
      <span>{label || children}</span>
    </Box>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
  icon: PropTypes.node,
  variant: PropTypes.oneOf(["subtle", "solid", "outlined"]),
  color: PropTypes.string,
  className: PropTypes.string,
  sx: PropTypes.object,
};

// 7. Root Component: CustomCard
export const CustomCard = ({
  children,
  variant = "elevated", // "elevated" | "outlined" | "flat" | "gradient" | "default"
  density = "standard", // "compact" | "standard" | "comfortable"
  interactive = false,
  hoverable = false,
  themeColor = "#FF6B00",
  elevation = 0,
  className = "",
  onClick,
  sx = {},
  // Legacy backward-compatibility props
  title,
  subtitle,
  action,
  actions,
  avatar,
  icon,
  body,
  media,
  ...props
}) => {
  const isInteractive = interactive || hoverable || Boolean(onClick);

  const getVariantStyles = () => {
    switch (variant) {
      case "outlined":
        return {
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          boxShadow: "none",
        };
      case "flat":
        return {
          backgroundColor: "#f9fafb",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: "none",
        };
      case "gradient":
        return {
          background: `linear-gradient(135deg, #ffffff 0%, ${themeColor}0d 100%)`,
          border: `1px solid ${themeColor}26`,
          boxShadow: `0 8px 30px ${themeColor}14`,
        };
      case "elevated":
      case "default":
      default:
        return {
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        };
    }
  };

  const cardBaseStyles = {
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    ...(isInteractive && {
      cursor: onClick ? "pointer" : "default",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: `0 14px 36px ${themeColor}1f, 0 4px 12px rgba(0, 0, 0, 0.06)`,
      },
    }),
    ...getVariantStyles(),
    ...sx,
  };

  const contextValue = {
    themeColor,
    variant,
    interactive: isInteractive,
  };
  Object.defineProperty(contextValue, "density", {
    value: density,
    writable: true,
    enumerable: false,
    configurable: true,
  });

  // Backward-compatibility: if legacy props are provided, render structured slots automatically
  const hasLegacyProps = Boolean(
    title || subtitle || action || actions || avatar || icon || body || media
  );

  return (
    <CardContext.Provider value={contextValue}>
      <MuiCard
        elevation={elevation}
        onClick={onClick}
        className={className}
        sx={cardBaseStyles}
        {...props}
      >
        {hasLegacyProps ? (
          <>
            {media && (typeof media === "string" ? <Media src={media} /> : media)}
            {(title || subtitle || action || avatar || icon) && (
              <Header
                title={title}
                subtitle={subtitle}
                action={action}
                avatar={avatar}
                icon={icon}
              />
            )}
            {(body || children) && <Body>{body || children}</Body>}
            {actions && <Actions>{actions}</Actions>}
          </>
        ) : (
          children
        )}
      </MuiCard>
    </CardContext.Provider>
  );
};

CustomCard.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["elevated", "outlined", "flat", "gradient", "default"]),
  density: PropTypes.oneOf(["compact", "standard", "comfortable"]),
  interactive: PropTypes.bool,
  hoverable: PropTypes.bool,
  themeColor: PropTypes.string,
  elevation: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
  sx: PropTypes.object,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  action: PropTypes.node,
  actions: PropTypes.node,
  avatar: PropTypes.node,
  icon: PropTypes.node,
  body: PropTypes.node,
  media: PropTypes.node,
};

// Attach compound subcomponents directly to CustomCard
CustomCard.Header = Header;
CustomCard.Body = Body;
CustomCard.Actions = Actions;
CustomCard.Media = Media;
CustomCard.Badge = Badge;

export default CustomCard;
export {
  Header as CardHeader,
  Body as CardBody,
  Actions as CardActions,
  Media as CardMedia,
  Badge as CardBadge,
  CardContext,
};
