import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";

import "./About.css";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Arrow from "../../components/About/Arrow";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const serviceInfo = [
  {
    title: "주일예배",
    time: "오후 2시 30분",
    place: "본당",
  },
  {
    title: "새벽 QT",
    time: "월 - 토요일 오전 6시",
    place: "교회 Youtube 채널",
  },
  {
    title: "신년 특별 새벽기도회",
    time: "1월 첫주 월-토요일",
    place: "본당",
  },
  {
    title: "하반기 특별 새벽기도회",
    time: "8월 마지막주 월-토요일",
    place: "본당",
  },
  {
    title: "유아유치부 주일활동",
    time: "오후 4시",
    place: "Preschool Room",
  },
  {
    title: "유초등부 주일활동",
    time: "오후 4시",
    place: "Sunday School Room",
  },
  {
    title: "중고등부 주일활동",
    time: "오후 4시",
    place: "Sunday School Room",
  },
  {
    title: "청년부 주일 Brunch Club",
    time: "오전 11시 30분",
    place: "문의 : 안주영 목사",
  },
  {
    title: "중보기도 모임",
    time: "월 오전 10시, 금 저녁 7시",
    place: "문의 : 주미옥 장로",
  },
];

const About = () => (
  <ReactFullpage
    //fullpage options
    licenseKey={"YOUR_KEY_HERE"}
    scrollingSpeed={1000} /* Options here */
    anchors={["beginning", "name", "direction", "aboutus"]}
    // slidesNavigation={true}
    // slidesNavPosition="bottom"
    scrollHorizontally={true}
    interlockedSlides={true}
    verticalCentered={true}
    // navigation={true}
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
                      사명) 우리를 심으신 이땅에 대한 사랑과 섬김, 기도와 복음
                      전파를 잊지 말라는 하나님의 부르심
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
                      사명) 예부터 주신 진리의 말씀인 성경을 따라, 새로운 시대에
                      주어진 사명을 삶의 자리에서 살아내고 그리스도의 복음을
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
                      fontWeight="500"
                      sx={{ color: "white", ml: "15px" }}
                    >
                      내가 주인된 시대 속에서, 예배와 말씀을 통해 우리 삶의
                      창조자이며 참 주인되시며 인도자이신 성부 성자 성령
                      하나님의 사랑을 맛보고 나누며, 하나님을 향한 우리의 사랑을
                      온전히 올려드립니다. 온교회는 교회 성전 중심으로 모이는
                      것만 중요시하는 공동체가 아니라, 모일 때 힘써 모여
                      예배드리고 기도하지만 일상의 자리에서 하나님을 높이며 그의
                      나라와 의를 구하며 말씀대로 살아가는 삶의 예배를
                      중요시하는 공동체입니다.
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
                      fontWeight="500"
                      sx={{ color: "white", ml: "15px" }}
                    >
                      내가 중심된 세상에서 하나님께 받은 은혜와 부르신 사명에
                      따라 공동체와 이웃을 말씀대로 사랑하고 섬기며 살아갑니다.
                    </Typography>
                  </div>

                  {/* <div class="slide" data-anchor="wordscentered">
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
                  </div> */}
                </div>
              </div>
            </div>

            <Arrow onClick={() => fullpageApi.moveSectionDown()} />
          </div>

          <div className="section" id="section4">
            <div className="section4Title">
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
              <div className="section4Body">
                <div class="slide" data-anchor="time">
                  <TableContainer
                    className="table"
                    // component={Paper}
                    sx={{ color: "white" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            colspan="3"
                            align="center"
                            sx={{ color: "white" }}
                          >
                            예배 및 모임 안내
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {serviceInfo.map((service) => (
                          <TableRow>
                            <TableCell align="center" sx={{ color: "white" }}>
                              {service.title}
                            </TableCell>
                            <TableCell align="center" sx={{ color: "white" }}>
                              {service.time}
                            </TableCell>
                            <TableCell align="center" sx={{ color: "white" }}>
                              {service.place}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>

                <div class="slide" data-anchor="offering">
                  <Typography
                    style={{ textAlign: "center" }}
                    variant="subtitle1"
                    fontWeight="500"
                    sx={{ color: "white" }}
                  >
                    온라인 E-Transfer 헌금 안내 ▪ 이메일 : occeoffer@gmail.com |
                    비밀번호 설정 : occe0403
                    <br />
                    Cheque 헌금 Pay To : OCCE 또는 ON Community Church of
                    Edmonton
                    <br />
                    현장에서는 준비된 봉투를 사용하여 입구에서 헌금함에 헌금해
                    주시기 바랍니다. 헌금봉투 10개를 한 묶음으로 따로 준비해
                    놓았으니, 필요하신 분들은 한 묶음 씩 가져 가셔서 헌금 준비를
                    해주시기 바랍니다.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </ReactFullpage.Wrapper>
      );
    }}
  />
);

export default About;
