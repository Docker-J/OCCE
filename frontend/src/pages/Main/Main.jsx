import { Link } from "react-router";

import { Button } from "@mui/material";

import ButtonBases from "../../components/Main/MainButtonBanner";
import "./Main.css";

// import CustomChatBot from "../../components/Main/CustomChatBot";
import MainAnimation from "../../components/Main/MainAnimation";

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

        <MainImage backgroundImage={"url(/img/Main/img1.jpg)"} />
        <MainImage backgroundImage={"url(/img/Main/img2.webp)"} />
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
