import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

const Footer = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "25vh",
        backgroundColor: "#c4c4c4",
        position: "absolute",
        bottom: 0,
        transform: "translateY(-100%)",
      }}
    >
      <div style={{ maxWidth: "1536px" }}>
        <p>office@oncce.ca</p>
        <FacebookIcon />
        <InstagramIcon />
        <YouTubeIcon />
      </div>
    </div>
  );
};

export default Footer;
