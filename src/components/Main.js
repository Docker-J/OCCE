import {
  Button,
  Card,
  Typography,
  Box,
  CardContent,
  CardActions,
  Divider,
  Fab,
} from "@mui/material";

import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";

import { Link as RouterLink } from "react-router-dom";

import "./Main.css";
import { minHeight, textAlign } from "@mui/system";

const Main = () => {
  return (
    <div>
      <div className="churchName">
        <img className="horizontalLogo" src="img/ONLogo.svg" />

        <div className="nameExplanationContainer">
          <div className="nameExplanation" style={{ display: "flex" }}>
            <Typography
              className="old"
              variant="h5"
              fontWeight="530"
              fontSize={"1.7vmax"}
              style={{ color: "#f1cdb0" }}
            >
              예부터 주신 말씀을 따라
            </Typography>
            <Typography
              className="new"
              variant="h5"
              fontWeight="530"
              fontSize={"1.7vmax"}
              color="white"
            >
              &nbsp;새 시대의 사명을 행하는 교회
            </Typography>
          </div>

          <div className="nameExplanation2">
            <Typography
              variant="h5"
              fontWeight="530"
              fontSize={"1.4vmax"}
              style={{ color: "#f1cdb0" }}
            >
              온 맘 다해 하나님을 사랑하고
            </Typography>
            <Typography
              className="new"
              variant="h5"
              fontWeight="530"
              fontSize={"1.4vmax"}
              color="white"
            >
              &nbsp;온 힘 다해 이웃을 사랑하는 교회
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
          component={RouterLink}
          to="/aboutus#churchname"
          variant="contained"
          sx={{ backgroundColor: "transparent" }}
        >
          더 알아보기
        </Button>
      </div>

      <div className="cards">
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <PlaceOutlinedIcon fontSize="large" />

            <Typography variant="h5" component="div">
              장소
            </Typography>

            <Divider sx={{ my: 1 }} variant="middle" />

            <Typography variant="h5">Central Baptist Church</Typography>

            <Typography variant="h6">9419 95 St</Typography>
          </CardContent>
          <CardActions>
            <Button
              href="https://goo.gl/maps/gqpiA88gJSvbjfDD9"
              target="_blank"
              size="small"
              style={{ margin: "auto" }}
            >
              Learn More
            </Button>
          </CardActions>
        </Card>

        <Card component="card" sx={{ minWidth: 275 }}>
          <CardContent>
            <ScheduleIcon fontSize="large" />

            <Typography variant="h5" component="div">
              주일 예배 시간
            </Typography>

            <Divider sx={{ my: 1 }} variant="middle" />

            <Typography variant="h5">2:30 PM</Typography>

            <Typography variant="h6">
              {" "}
              <br />
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" style={{ margin: "auto" }}>
              Learn More
            </Button>
          </CardActions>
        </Card>

        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <FeedOutlinedIcon fontSize="large" />

            <Typography variant="h5" component="div">
              최신 주보
            </Typography>

            <Divider sx={{ my: 1 }} variant="middle" />

            <Typography variant="h5">
              {" "}
              <br />
            </Typography>

            <Typography variant="h6">
              {" "}
              <br />
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={RouterLink}
              size="small"
              style={{ margin: "auto" }}
              to="/announcement"
            >
              Learn More
            </Button>{" "}
          </CardActions>
        </Card>

        <Card component="card" sx={{ minWidth: 275 }}>
          <CardContent>
            <YouTubeIcon fontSize="large" />

            <Typography variant="h5" component="div">
              교회 유튜브
            </Typography>

            <Divider sx={{ my: 1 }} variant="middle" />

            <Typography variant="h5">
              {" "}
              <br />
            </Typography>

            <Typography variant="h6">
              {" "}
              <br />
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              href="https://www.youtube.com/channel/UCkr5XutOkqIxYJaJgYlQshQ/featured"
              target="_blank"
              size="small"
              style={{ margin: "auto" }}
            >
              Learn More
            </Button>
          </CardActions>
        </Card>

        <Card component="card" sx={{ minWidth: 275 }}>
          <CardContent>
            <HowToRegOutlinedIcon fontSize="large" />

            <Typography variant="h5" component="div">
              교인 등록
            </Typography>

            <Divider sx={{ my: 1 }} variant="middle" />

            <Typography variant="h5">
              {" "}
              <br />
            </Typography>

            <Typography variant="h6">
              {" "}
              <br />
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              href="https://docs.google.com/forms/d/e/1FAIpQLSfYN9EECPuQ0e4TrPfok4UhMH3zKnvjUckKwGfe3SkQM-0O-A/viewform"
              target="_blank"
              size="small"
              style={{ margin: "auto" }}
            >
              Learn More
            </Button>
          </CardActions>
        </Card>

        <Card component="card" sx={{ minWidth: 275 }}>
          <CardContent>
            <VolunteerActivismOutlinedIcon fontSize="large" />

            <Typography variant="h5" component="div">
              헌금 안내
            </Typography>

            <Divider sx={{ my: 1 }} variant="middle" />

            <Typography variant="h5">
              {" "}
              <br />
            </Typography>

            <Typography variant="h6">
              {" "}
              <br />
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              // href="https://docs.google.com/forms/d/e/1FAIpQLSfYN9EECPuQ0e4TrPfok4UhMH3zKnvjUckKwGfe3SkQM-0O-A/viewform"
              // target="_blank"
              size="small"
              style={{ margin: "auto" }}
            >
              Learn More
            </Button>
          </CardActions>
        </Card>
      </div>

      <Fab
        variant="primary"
        style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
      >
        <QuestionAnswerOutlinedIcon />
      </Fab>
    </div>
  );
};

export default Main;
