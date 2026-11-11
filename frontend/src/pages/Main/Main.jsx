import { Link } from "react-router";
import { Button, Fab } from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";

import ButtonBases from "../../components/Main/MainButtonBanner";
import "./Main.css";

import MainAnimation from "../../components/Main/MainAnimation";

import carouselStyles from "./MainCarousel.module.css";
import CustomCarousel from "../../common/CustomCarousel";
import AdminComponent from "../../common/AdminComponent";
import useModals from "../../util/useModal";

const MainImage = ({
  src,
  backgroundImage,
  alt = "에드먼턴 온 교회",
  priority = false,
  width,
  height,
}) => {
  const imgSrc =
    src ||
    (backgroundImage
      ? backgroundImage.replace(/^url\(["']?|["']?\)$/g, "")
      : "");

  return (
    <div className="main-image-wrapper">
      <div
        className="main-ambient-glow"
        style={{ backgroundImage: `url(${imgSrc})` }}
      />
      <div className="main-ambient-scrim" />

      <div className="main-photo-frame">
        <img
          className="main-hero-image"
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          {...(priority ? { fetchPriority: "high" } : { fetchPriority: "low" })}
        />
      </div>

      <div className="main-hero-overlay" />
    </div>
  );
};

const Main = () => {
  const { openModal } = useModals();

  return (
    <>
      <title>에드먼턴 온 교회</title>
      <CustomCarousel
        className={carouselStyles.carousel}
        showArrows={false}
        fillHeight
      >
        <div className="churchName">
          <MainAnimation />

          <Button
            className="learnMoreAbtChurch"
            component={Link}
            to="/aboutus#beginning"
            variant="outlined"
            size="small"
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "20px",
              px: 2.5,
              py: 0.75,
              fontWeight: 600,
              fontSize: "0.875rem",
              letterSpacing: "0.5px",
              backdropFilter: "blur(6px)",
              bgcolor: "rgba(0, 0, 0, 0.25)",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              transition: "all 0.25s ease-in-out",
              ":hover": {
                borderColor: "#FF6B00",
                bgcolor: "#FF6B00",
                boxShadow: "0 4px 16px rgba(255, 107, 0, 0.45)",
                transform: "translateY(-1px)",
              },
            }}
          >
            온 교회 이야기
          </Button>
        </div>

        <MainImage
          backgroundImage={"url(/img/Main/img1.webp)"}
          priority={true}
          width={1244}
          height={700}
        />
        <MainImage
          backgroundImage={"url(/img/Main/img2.webp)"}
          width={1050}
          height={700}
        />
        <MainImage
          backgroundImage={"url(/img/Main/img3.webp)"}
          width={933}
          height={700}
        />
      </CustomCarousel>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#fcfbf9",
        }}
      >
        <ButtonBases />
      </div>

      <AdminComponent>
        <Fab
          color="primary"
          aria-label="교인 공지 발송"
          style={{
            position: "fixed",
            right: "2vw",
            bottom: "3vh",
            zIndex: 1000,
          }}
          onClick={async () => {
            const { default: BroadcastModal } = await import(
              "../../components/Main/BroadcastModal"
            );
            openModal(BroadcastModal, {});
          }}
        >
          <CampaignIcon style={{ color: "white" }} />
        </Fab>
      </AdminComponent>
    </>
  );
};

export default Main;
