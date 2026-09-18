import { Card, CardContent, Grid, Box, Typography, Stack } from "@mui/material";

const DepartmentRibbon = ({
  badgeText = "모임 안내",
  themeColor,
  themeBgColor,
  borderColor,
  shadowColor,
  items = [],
}) => {
  const colSize =
    items.length <= 3
      ? { xs: 12, md: 4 }
      : { xs: 12, sm: 6, md: 3 };

  return (
    <Card
      className="animate-fade"
      sx={{
        borderRadius: "24px",
        mb: 10,
        border: borderColor || `1px solid rgba(0, 0, 0, 0.08)`,
        boxShadow: shadowColor || "0 12px 32px rgba(0, 0, 0, 0.06)",
        backgroundColor: "#ffffff",
        overflow: "visible",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-16px",
          left: { xs: "50%", md: "32px" },
          transform: { xs: "translateX(-50%)", md: "none" },
          backgroundColor: themeColor,
          color: "#ffffff",
          px: 2.5,
          py: 0.5,
          borderRadius: "16px",
          fontWeight: 800,
          fontSize: "0.9rem",
          letterSpacing: "1px",
          boxShadow: `0 4px 12px ${themeColor}4d`,
        }}
      >
        {badgeText}
      </Box>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: "center", alignItems: "center" }}
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Grid key={item.label || index} size={colSize}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: "center",
                    justifyContent: { xs: "flex-start", md: "center" },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      backgroundColor: themeBgColor,
                      color: themeColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#777",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: "#2b2b2b",
                        ...item.valueStyle,
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DepartmentRibbon;
