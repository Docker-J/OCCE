import { Box, Card, Stack, Skeleton } from "@mui/material";

const ForumPostBoardSkeleton = ({ count = 5 }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "850px",
      }}
    >
      {Array.from(new Array(count)).map((_, index) => (
        <div key={index} style={{ width: "100%" }}>
          <Card
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              bgcolor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              mb: 2.5,
              p: { xs: 2, sm: 2.5 },
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            {/* Top Row: Badge & Icons */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Skeleton variant="rounded" width={110} height={28} sx={{ borderRadius: "10px" }} />
              
              <Stack direction="row" spacing={1}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </Stack>
            </Stack>

            {/* Title */}
            <Skeleton variant="rounded" width="70%" height={26} sx={{ mb: 1, borderRadius: "6px" }} />

            {/* Preview Text */}
            <Skeleton variant="rounded" width="100%" height={16} sx={{ mb: 1, borderRadius: "4px" }} />
            <Skeleton variant="rounded" width="85%" height={16} sx={{ borderRadius: "4px" }} />
            
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ForumPostBoardSkeleton;
