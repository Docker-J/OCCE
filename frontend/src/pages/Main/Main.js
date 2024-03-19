import { Link } from "react-router-dom";

import { Button } from "@mui/material";
// import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";

import ButtonBases from "../../components/Main/MainButtonBanner";
import "./Main.css";
// import { useState } from "react";
import CustomChatBot from "../../components/Main/CustomChatBot";
import MainAnimation from "../../components/Main/MainAnimation";

import styles from "react-responsive-carousel/lib/styles/carousel.min.css";
import test from "./MainCarousel.module.css";
import CustomCarousel from "../../common/CustomCarousel";

const MainImage = ({ backgroundImage }) => {
  return (
    <div className="main-image-wrapper">
      <div className="blur-bg" style={{ backgroundImage: backgroundImage }} />
      <div className="image-bg" style={{ backgroundImage: backgroundImage }} />
    </div>
  );
};

const Main = () => {
  return (
    <>
      <CustomCarousel
        className={test.carousel}
        showThumbs={false}
        showStatus={false}
        showArrows={false}
        // showIndicators={false}
        infiniteLoop
        styles={styles}
      >
        <div className="churchName">
          <MainAnimation />

          <Button
            className="learnMoreAbtChurch"
            component={Link}
            to="/aboutus#churchname"
            variant="outlined"
            size="medium"
            sx={{
              color: "white",
              borderColor: "white",
              ":hover": { borderColor: "white", bgcolor: "#964B00" },
            }}
          >
            온 교회 이야기
          </Button>
        </div>

        <div className="churchName">
          <img
            src="/img/Main/1.jpg"
            style={{ height: "70%", maxWidth: "1000px", borderRadius: "2em" }}
          />
        </div>

        <MainImage backgroundImage={"url(/img/Main/1.jpg)"} />
        <MainImage backgroundImage={"url(/img/Main/img2.jpg)"} />
        <MainImage backgroundImage={"url(/img/Main/img3.jpg)"} />
      </CustomCarousel>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <ButtonBases className="cards" />
      </div>

      {/* <Fab
        variant="primary"
        style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
      >
        <QuestionAnswerOutlinedIcon />
      </Fab> */}

      {/* <CustomChatBot /> */}
    </>
  );
};

export default Main;
