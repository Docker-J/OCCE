import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";

import "./About.css";
import { Typography } from "@mui/material";
import { color } from "@mui/system";
import Arrow from "./Arrow";

const About = () => (
  <ReactFullpage
    //fullpage options
    licenseKey={"YOUR_KEY_HERE"}
    scrollingSpeed={1000} /* Options here */
    anchors={["churchname", "whoserves", "slide3"]}
    // sectionsColor={['#f2aa31', '#f2aa31', 'f2aa31']}
    slidesNavigation={true}
    slidesNavPosition="bottom"
    scrollHorizontally={true}
    interlockedSlides={true}
    navigation={true}
    navigationPosition="right"
    render={({ state, fullpageApi }) => {
      return (
        <ReactFullpage.Wrapper>
          <div className="section" id="section1">
            <div className="section1Body">
              <Typography
                style={{ textAlign: "left" }}
                variant="h2"
                fontWeight="700"
                sx={{ color: "white", mt: "-20vh" }}
              >
                첫걸음
              </Typography>
              <Typography
                style={{ textAlign: "left" }}
                variant="h6"
                fontWeight="600"
                sx={{ color: "white", mt: "8vh" }}
              >
                에드먼턴 온 교회는 2022년 4월 3일, 교회의 세속화에 따른 위기와
                포스트 코로나라는 시대의 도전 가운데 하나님이 디자인하고 부르신
                뜻대로 새롭게 태어난 교회 공동체입니다
              </Typography>

              <Arrow onClick={() => fullpageApi.moveSectionDown()} />

              {/* <button onClick={() => fullpageApi.moveSectionDown()}>
              Click me to move down
            </button> */}
            </div>
          </div>

          <div className="section" id="section2">
            <div class="slide" data-anchor="pastorJhin">
              진성인 목사
            </div>
            <div class="slide" data-anchor="pastorAhn">
              안주영 목사
            </div>
            <div class="slide" data-anchor="pastorKim">
              김휘경 전도사
            </div>
          </div>

          <div className="section" id="section3">
            <p>Section 3</p>
          </div>

          <div className="section" id="section4">
            <p>About Us</p>
            <p>예배시간</p>
            <p>장소</p>
            <p>Contact | Email</p>
            <p>Facebook Instagram</p>
          </div>
        </ReactFullpage.Wrapper>
      );
    }}
  />
);

export default About;
