import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Avatar, Divider, Typography } from "@mui/material";
import GoogleMap from "./GoogleMap";

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
        // borderRadius: "1.5em 1.5em 0px 0px",
      }}
    >
      <div
        style={{
          width: "98%",
          height: "100%",
          maxWidth: "1536px",
          paddingTop: 30,
          paddingBottom: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <img
            alt="Header Logo"
            src={"/img/HeaderLogoBW.png"}
            style={{ height: "40px" }}
          />
          <Typography>Based ON the OLD truth</Typography>
          <Typography>Moving ON to the NEW standard</Typography>
          <Typography>온 맘 다해 하나님을 사랑하고</Typography>
          <Typography>온 힘 다해 이웃을 사랑하는 교회</Typography>
        </div>
      </div>
      <GoogleMap />

      <div
        style={{
          width: "98%",
          height: "100%",
          maxWidth: "1536px",
          paddingTop: 30,

          paddingBottom: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* <p>office@oncce.ca</p> */}
        <div style={{ width: "100%" }}></div>
        <div style={{ display: "flex" }}>
          <div>
            <Typography>Follow Us ON</Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Avatar sx={{ bgcolor: "black" }}>
                <YouTubeIcon />
              </Avatar>
              <Avatar sx={{ bgcolor: "black", mx: 1 }}>
                <FacebookIcon />
              </Avatar>
              <Avatar sx={{ bgcolor: "black" }}>
                <InstagramIcon />
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
