import { Link } from "react-router-dom";

import { Button, Typography, Fab } from "@mui/material";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";

import ButtonBases from "../../components/Main/MainButtonBanner";
import "./Main.css";
import { useState } from "react";
import CustomChatBot from "../../components/Main/CustomChatBot";

const Main = () => {
  return (
    <>
      <div className="churchName">
        <div className="nameExplanationContainer">
          <img
            className="horizontalLogo"
            src="img/ONLogo.svg"
            alt="logo of ON Community Church of Edmonton"
          />

          <div className="nameExplanation">
            <Typography
              className="old"
              variant="h5"
              fontWeight="530"
              fontSize={"min(5vw, 36px)"}
              style={{ color: "#f1cdb0" }}
            >
              Based ON the OLD truth
            </Typography>
            <Typography
              className="new"
              variant="h5"
              fontWeight="530"
              fontSize={"min(5vw, 36px)"}
              color="white"
            >
              Moving ON to the NEW standard
            </Typography>
          </div>

          <div className="nameExplanation2">
            <Typography
              variant="h5"
              fontWeight="530"
              fontSize={"min(5vw, 36px)"}
              style={{ color: "#f1cdb0" }}
            >
              온 맘 다해 하나님을 사랑하고
            </Typography>
            <Typography
              variant="h5"
              fontWeight="530"
              fontSize={"min(5vw, 36px)"}
              color="white"
            >
              온 힘 다해 이웃을 사랑하는 교회
            </Typography>
          </div>
          <div className="nameExplanation3">
            <Typography
              className="edmonton"
              variant="h5"
              fontWeight="530"
              fontSize={"3.4vmax"}
              style={{ color: "#f1cdb0" }}
            >
              에드먼턴
            </Typography>

            <img
              className="verticalLogo"
              src="img/ONLogoVertical.svg"
              // style={{ maxWidth: "5vh" }}
            />

            <Typography
              className="church"
              variant="h5"
              fontWeight="530"
              fontSize={"3.4vmax"}
              color="white"
            >
              교회
            </Typography>
          </div>
        </div>

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

      <ButtonBases className="cards" />

      {/* <Fab
        variant="primary"
        style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
      >
        <QuestionAnswerOutlinedIcon />
      </Fab> */}

      <CustomChatBot />
    </>
  );
};

export default Main;
