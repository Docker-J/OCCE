import { useNavigation } from "react-router";
import { LinearProgress } from "@mui/material";

const GlobalLoader = () => {
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return (
      <LinearProgress
        sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}
        color="primary"
      />
    );
  }
  return null;
};

export default GlobalLoader;
