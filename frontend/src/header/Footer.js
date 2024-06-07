import { Typography } from "@mui/material";
import GoogleMap from "./GoogleMap";
import SocialIconsBar from "./SocialIconsBar";

const Footer = () => {
  return (
    <div
      style={{
        width: "100%",
        displaY: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#e8eaed",
        bottom: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "98%",
          height: "100%",
          maxWidth: "1536px",
          paddingTop: 30,
          paddingBottom: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <img
            alt="Footer Logo"
            src={"/img/HeaderLogoBW.png"}
            style={{ height: "40px" }}
          />
          <Typography>Based ON the OLD Truth</Typography>
          <Typography>Moving ON to the NEW Calling</Typography>
          <Typography>온 맘 다해 하나님을 사랑하고</Typography>
          <Typography>온 힘 다해 이웃을 사랑하는 교회</Typography>
        </div>
      </div>

      <div style={{ paddingBottom: 30 }}>
        <SocialIconsBar />
      </div>

      <GoogleMap />
    </div>
  );
};

export default Footer;
