import { Card, CardContent, Box, Typography } from "@mui/material";

const DepartmentFeatureCard = ({
  icon: Icon,
  iconColor,
  iconBgColor,
  title,
  animationDelay = "0.3s",
  headerMb = 3,
  children,
}) => {
  return (
    <Card
      className="animate-fade"
      sx={{
        height: "100%",
        borderRadius: "24px",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.05)",
        p: { xs: 2, md: 3 },
        animationDelay,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: headerMb }}>
          {Icon && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: "16px",
                backgroundColor: iconBgColor || "#f5f5f5",
                color: iconColor || "#2b2b2b",
                mr: 2,
                display: "flex",
              }}
            >
              <Icon />
            </Box>
          )}
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#2b2b2b" }}>
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

export default DepartmentFeatureCard;
