import { Box, Skeleton, Stack } from "@mui/material";

// OCCE weekly update bulletins use a mobile-optimized 9:16 aspect ratio across all pages
const PDF_ASPECT_RATIO = 9 / 16; // 0.5625

const getSkeletonDimensions = (documentDimension, scale = 1) => {
  if (documentDimension?.width) {
    const w = Math.round(documentDimension.width * scale);
    const h = Math.round(w / PDF_ASPECT_RATIO); // w * (16 / 9)
    return { width: `${w}px`, height: `${h}px` };
  }

  if (documentDimension?.height) {
    const h = Math.round(documentDimension.height * scale);
    const w = Math.round(h * PDF_ASPECT_RATIO); // h * (9 / 16)
    return { width: `${w}px`, height: `${h}px` };
  }

  return { width: "100%", maxWidth: "480px", aspectRatio: "9 / 16" };
};

const BulletinSkeleton = ({ documentDimension, scale = 1, sx = {} }) => {
  const dimensions = getSkeletonDimensions(documentDimension, scale);

  return (
    <Box
      sx={{
        ...dimensions,
        maxWidth: "100%",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        borderRadius: "1em", // Matches .react-pdf__Page__canvas border-radius
        boxShadow:
          "0 10px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        mx: "auto",
        ...sx,
      }}
    >
      {/* 1. Header: Slogans, Church Title, Worship info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: { xs: 1.5, sm: 2 },
        }}
      >
        <Skeleton
          variant="text"
          width="70%"
          height={12}
          animation="wave"
          sx={{ mb: 0.3, bgcolor: "rgba(0, 0, 0, 0.05)" }}
        />
        <Skeleton
          variant="text"
          width="55%"
          height={12}
          animation="wave"
          sx={{ mb: 1, bgcolor: "rgba(0, 0, 0, 0.05)" }}
        />
        {/* Main Church Title */}
        <Skeleton
          variant="rounded"
          width="52%"
          height={24}
          animation="wave"
          sx={{ borderRadius: "6px", mb: 0.8, bgcolor: "rgba(0, 0, 0, 0.09)" }}
        />
        {/* Worship Title */}
        <Skeleton
          variant="text"
          width="32%"
          height={18}
          animation="wave"
          sx={{ mb: 0.2, bgcolor: "rgba(0, 0, 0, 0.08)" }}
        />
        <Skeleton
          variant="text"
          width="25%"
          height={12}
          animation="wave"
          sx={{ mb: 0.8, bgcolor: "rgba(0, 0, 0, 0.05)" }}
        />
        {/* Date / Edition Badge */}
        <Skeleton
          variant="rounded"
          width="75%"
          height={13}
          animation="wave"
          sx={{ borderRadius: "3px", bgcolor: "rgba(0, 0, 0, 0.05)" }}
        />
      </Box>

      {/* 2. Top Green Accent Bar (Call to Worship / Time Header) */}
      <Skeleton
        variant="rounded"
        width="100%"
        height={22}
        animation="wave"
        sx={{ borderRadius: "4px", mb: 1.5, bgcolor: "rgba(100, 140, 60, 0.18)" }}
      />

      {/* 3. Worship Order Table (10 Rows) */}
      <Stack spacing={1.2} sx={{ flex: 1, minHeight: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="32%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.07)" }} />
          <Skeleton variant="text" width="28%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.07)" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="28%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
          <Skeleton variant="text" width="18%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="35%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.07)" }} />
          <Skeleton variant="text" width="34%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="25%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
          <Skeleton variant="text" width="28%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="30%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.07)" }} />
          <Skeleton variant="text" width="45%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="22%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
          <Skeleton variant="text" width="35%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="27%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.07)" }} />
          <Skeleton variant="text" width="36%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="25%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.07)" }} />
          <Skeleton variant="text" width="50%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="32%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
          <Skeleton variant="text" width="42%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="22%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
          <Skeleton variant="text" width="24%" height={15} animation="wave" sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }} />
        </Box>
      </Stack>

      {/* 4. Pre-footer Accent Banner (Online 새벽 QT) */}
      <Skeleton
        variant="rounded"
        width="100%"
        height={22}
        animation="wave"
        sx={{ borderRadius: "4px", mt: 1.5, mb: 1, bgcolor: "rgba(100, 140, 60, 0.18)" }}
      />

      {/* 5. Footer Banner (Church Logo & Address) */}
      <Box
        sx={{
          mt: "auto",
          pt: 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "rgba(100, 140, 60, 0.12)",
          borderRadius: "6px",
          px: 1.5,
          py: 1,
        }}
      >
        <Skeleton variant="rounded" width={50} height={26} animation="wave" sx={{ borderRadius: "4px" }} />
        <Box sx={{ width: "65%", display: "flex", flexDirection: "column", gap: 0.4 }}>
          <Skeleton variant="text" width="90%" height={11} animation="wave" />
          <Skeleton variant="text" width="70%" height={11} animation="wave" />
        </Box>
      </Box>
    </Box>
  );
};

export default BulletinSkeleton;
