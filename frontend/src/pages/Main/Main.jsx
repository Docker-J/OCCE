import { Link } from "react-router";
import { useState } from "react";
import { Button, Fab } from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";

import ButtonBases from "../../components/Main/MainButtonBanner";
import "./Main.css";

import MainAnimation from "../../components/Main/MainAnimation";

import carouselStyles from "./MainCarousel.module.css";
import CustomCarousel from "../../common/CustomCarousel";
import AdminComponent from "../../common/AdminComponent";
import BroadcastModal from "../../components/Main/BroadcastModal";

const MainImage = ({ backgroundImage }) => {
  return (
    <div className="main-image-wrapper">
      <div className="blur-bg" style={{ backgroundImage: backgroundImage }} />
      <div className="image-bg" style={{ backgroundImage: backgroundImage }} />
    </div>
  );
};

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CustomCarousel
        className={carouselStyles.carousel}
        showThumbs={false}
        showStatus={false}
        showArrows={false}
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
              borderColor: "white",
              ":hover": { borderColor: "white", bgcolor: "#964B00" },
            }}
          >
            온 교회 이야기
          </Button>
        </div>

        <MainImage backgroundImage={"url(/img/Main/img1.webp)"} />
        <MainImage backgroundImage={"url(/img/Main/img2.webp)"} />
        <MainImage backgroundImage={"url(/img/Main/img3.webp)"} />
      </CustomCarousel>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <ButtonBases />
      </div>

      <AdminComponent>
        <Fab
          color="primary"
          style={{
            position: "fixed",
            right: "2vw",
            bottom: "3vh",
            zIndex: 1000,
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <CampaignIcon style={{ color: "white" }} />
        </Fab>
      </AdminComponent>

      <BroadcastModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Main;
