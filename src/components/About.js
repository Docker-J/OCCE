import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";

import "./About.css";
import { Button, Typography } from "@mui/material";
import Arrow from "./Arrow";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const About = () => (
  <ReactFullpage
    //fullpage options
    licenseKey={"YOUR_KEY_HERE"}
    scrollingSpeed={1000} /* Options here */
    anchors={["begninning", "name", "direction", "aboutus"]}
    // slidesNavigation={true}
    // slidesNavPosition="bottom"
    scrollHorizontally={true}
    interlockedSlides={true}
    verticalCentered={true}
    navigation={true}
    navigationPosition="right"
    controlArrows={false}
    render={({ state, fullpageApi }) => {
      return (
        <ReactFullpage.Wrapper>
          <div className="section" id="section1">
            <div className="section1Body">
              <div className="section1Text">
                <Typography
                  style={{ textAlign: "left" }}
                  variant="h1"
                  fontWeight="800"
                  sx={{ color: "white", mb: "30px", letterSpacing: "5px" }}
                >
                  첫걸음
                </Typography>
                <Typography
                  style={{ textAlign: "left" }}
                  variant="h5"
                  fontWeight="550"
                  sx={{ color: "white" }}
                >
                  에드먼턴 온 교회는 2022년 4월 3일,<br></br>교회의 세속화에
                  따른 위기와 포스트 코로나라는 시대의 도전 가운데<br></br>
                  하나님이 디자인하고 부르신 뜻대로 새롭게 태어난 교회
                  공동체입니다
                </Typography>
              </div>
              <Arrow onClick={() => fullpageApi.moveSectionDown()} />
            </div>
          </div>

          <div className="section" id="section2">
            <div className="test">
              <div className="section2Title">
                <Typography
                  style={{ textAlign: "left" }}
                  variant="h2"
                  fontWeight="750"
                  sx={{ color: "white", letterSpacing: "5px" }}
                >
                  이름,<br></br>부르심과 사명
                </Typography>

                <Button
                  size="large"
                  sx={{ color: "white" }}
                  onClick={() => fullpageApi.moveSlideLeft()}
                >
                  <NavigateBeforeIcon sx={{ height: "45px", width: "45px" }} />
                </Button>
                <Button
                  size="large"
                  sx={{ color: "white" }}
                  onClick={() => fullpageApi.moveSlideRight()}
                >
                  <NavigateNextIcon sx={{ height: "45px", width: "45px" }} />
                </Button>

                <div className="section2Body">
                  <div class="slide" data-anchor="edmonton">
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h4"
                      fontWeight="800"
                      sx={{ color: "white" }}
                    >
                      에드먼턴 Edmonton, Community
                    </Typography>
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h6"
                      fontWeight="550"
                      sx={{ color: "white" }}
                    >
                      의미) 우리의 삶의 자리
                      <br />
                      사명) 우리를 심으신 이 땅에 대한 사랑과 기도와 복음 전파를
                      잊지 말라는 하나님의 부르심
                    </Typography>
                  </div>

                  <div class="slide" data-anchor="all">
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h3"
                      fontWeight="700"
                      sx={{ color: "white" }}
                    >
                      온
                    </Typography>
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h6"
                      fontWeight="550"
                      sx={{ color: "white" }}
                    >
                      의미) 온 우리말의 ‘모든(All)’ 이라는 의미를 담고 있다.{" "}
                      <br />
                      사명) 온 마음을 다해 하나님을 사랑하고 온 힘을 다해 이웃을
                      사랑하라는 부르심
                    </Typography>
                  </div>

                  <div class="slide" data-anchor="on">
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h2"
                      fontWeight="600"
                      sx={{ color: "white" }}
                    >
                      ON
                    </Typography>
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h6"
                      fontWeight="550"
                      sx={{ color: "white" }}
                    >
                      의미) Old & New 의 약자 <br />
                      사명) 예부터 주신 진리의 말씀인 성경 말씀을 중심으로,
                      주어진 삶의 자리에서 삶과 입술로 복음따라 살아내고
                      증언하라는 부르심
                    </Typography>
                  </div>

                  <div class="slide" data-anchor="building">
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h2"
                      fontWeight="600"
                      sx={{ color: "white" }}
                    >
                      교회
                    </Typography>
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h6"
                      fontWeight="550"
                      sx={{ color: "white" }}
                    >
                      의미) 건물이 아니라 사람, 회중 <br />
                      사명) 하나님이 택하고 부르신 사람들이 하나의 신앙 고백과
                      사명 가운데 응답하며 합력하라는 부르심
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <Arrow onClick={() => fullpageApi.moveSectionDown()} />
          </div>

          <div className="section" id="section3">
            <div className="test">
              <div className="section3Title">
                <Typography
                  style={{ textAlign: "left" }}
                  variant="h2"
                  fontWeight="700"
                  sx={{ color: "white", letterSpacing: "5px" }}
                >
                  부르심에 따른<br></br>공동체의 발걸음
                </Typography>

                <Button
                  size="large"
                  sx={{ color: "white" }}
                  onClick={() => fullpageApi.moveSlideLeft()}
                >
                  <NavigateBeforeIcon sx={{ height: "45px", width: "45px" }} />
                </Button>
                <Button
                  size="large"
                  sx={{ color: "white" }}
                  onClick={() => fullpageApi.moveSlideRight()}
                >
                  <NavigateNextIcon sx={{ height: "45px", width: "45px" }} />
                </Button>

                <div className="section3Body">
                  <div class="slide" data-anchor="lovegod">
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h4"
                      fontWeight="800"
                      sx={{ color: "white" }}
                    >
                      온 맘 다해 하나님 사랑
                    </Typography>
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h6"
                      fontWeight="550"
                      sx={{ color: "white", ml: "15px" }}
                    >
                      가족 예배 <br />
                      -주일 -찬양
                      <br />
                      -특별 -가정별
                    </Typography>
                  </div>

                  <div class="slide" data-anchor="loveneighbor">
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h4"
                      fontWeight="800"
                      sx={{ color: "white" }}
                    >
                      온 힘 다해 이웃 사랑
                    </Typography>

                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h6"
                      fontWeight="550"
                      sx={{ color: "white", ml: "15px" }}
                    >
                      정원을 통한 실천과 나눔 <br />
                      -교회 내 -교회 밖
                      <br />
                      공동체의 실천과 나눔
                    </Typography>
                  </div>

                  <div class="slide" data-anchor="wordscentered">
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h4"
                      fontWeight="800"
                      sx={{ color: "white" }}
                    >
                      말씀 중심
                    </Typography>

                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h6"
                      fontWeight="550"
                      sx={{ color: "white", ml: "15px" }}
                    >
                      ON-line 묵상
                      <br />
                      말씀 교육 <br />
                      -다음세대: 교회학교 -장년: 단계별 훈련
                    </Typography>
                  </div>

                  <div class="slide" data-anchor="community">
                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h4"
                      fontWeight="800"
                      sx={{ color: "white" }}
                    >
                      공동체
                    </Typography>

                    <Typography
                      style={{ textAlign: "left" }}
                      variant="h6"
                      fontWeight="550"
                      sx={{ color: "white", ml: "15px" }}
                    >
                      성례(성찬과 세례)
                      <br />
                      정원모임
                      <br />
                      중보기도
                      <br />
                      -중보기도 모임 -기도 ON
                      <br />
                      주일 예배 후 교제(다과, 말씀과 삶 나눔)
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <Arrow onClick={() => fullpageApi.moveSectionDown()} />
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
