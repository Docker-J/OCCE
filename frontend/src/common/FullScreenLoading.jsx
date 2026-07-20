import { CircularProgress } from "@mui/material";

const FullScreenLoading = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "rgba(252, 251, 249, 0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress sx={{ color: "#964b00" }} />
    </div>
  );
};

export default FullScreenLoading;
