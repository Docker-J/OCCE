import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import CustomCard from "../../common/CustomCard";

/**
 * DepartmentClosingCard refactored to use CustomCard compound components.
 * Retains full visual styling, scripture references, and animation support.
 */
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
  actions,
  sx = {},
  className = "animate-fade",
}) => {
  return (
    <CustomCard
      variant="flat"
      className={className}
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
      {/* Header Slot with Title and Subtitle */}
      {(title || subtitle) && (
        <CustomCard.Header
          sx={{
            p: 0,
            pb: reference || children ? 1.5 : 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
          title={
            title && (
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
            )
          }
          subtitle={
            subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: subtitleColor,
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  wordBreak: "keep-all",
                }}
              >
                {subtitle}
              </Typography>
            )
          }
        />
      )}

      {/* Body Slot with Scripture Reference and Children */}
      {(reference || children) && (
        <CustomCard.Body noPadding sx={{ textAlign: "center" }}>
          {reference && (
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: referenceColor || subtitleColor,
                letterSpacing: "1px",
                mt: title || subtitle ? 2 : 0,
                mb: children ? 2 : 0,
              }}
            >
              {reference}
            </Typography>
          )}
          {children}
        </CustomCard.Body>
      )}

      {/* Actions Slot */}
      {actions && (
        <CustomCard.Actions align="center" sx={{ p: 0, pt: 2 }}>
          {actions}
        </CustomCard.Actions>
      )}
    </CustomCard>
  );
};

DepartmentClosingCard.propTypes = {
  bgColor: PropTypes.string,
  borderColor: PropTypes.string,
  title: PropTypes.node,
  titleColor: PropTypes.string,
  titleVariant: PropTypes.string,
  subtitle: PropTypes.node,
  subtitleColor: PropTypes.string,
  reference: PropTypes.node,
  referenceColor: PropTypes.string,
  children: PropTypes.node,
  actions: PropTypes.node,
  sx: PropTypes.object,
  className: PropTypes.string,
};

// Subcomponent attachments for compound usage
DepartmentClosingCard.Header = CustomCard.Header;
DepartmentClosingCard.Body = CustomCard.Body;
DepartmentClosingCard.Actions = CustomCard.Actions;

export default DepartmentClosingCard;
