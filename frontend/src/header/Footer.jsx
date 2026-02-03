import { Typography } from "@mui/material";
import GoogleMap from "./GoogleMap";
import SocialIconsBar from "./SocialIconsBar";
import { Link } from "react-router";

const Footer = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#e8eaed",
        paddingTop: 30,
      }}
    >
      <Link to="/">
        <img
          alt="Footer Logo"
          src="/img/HeaderLogoBW.png"
          style={{ height: "40px" }}
        />
      </Link>
      <Typography>Based ON the OLD Truth</Typography>
      <Typography>Moving ON to the NEW Calling</Typography>
      <Typography>온 맘 다해 하나님을 사랑하고</Typography>
      <Typography>온 힘 다해 이웃을 사랑하는 교회</Typography>

      <div style={{ marginTop: 10, marginBottom: 30 }}>
        <SocialIconsBar />
      </div>

      <GoogleMap />
    </div>
  );
};

export default Footer;
