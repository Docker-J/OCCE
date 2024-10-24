import { IconButton, Typography } from "@mui/material";
import Styles from "./Card.module.css";
import React, { useState } from "react";
import { useSpring, animated } from "react-spring";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import "./MinisterCard.css";

const MinisterCard = ({ imagen, imageOffset, title, position, details }) => {
  const [show, setShown] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const props3 = useSpring({
    transform: show ? "scale(1.03)" : "scale(1)",
    boxShadow: show
      ? "0 20px 25px rgb(0 0 0 / 25%)"
      : "0 2px 10px rgb(0 0 0 / 8%)",
  });

  console.log(showDetails);

  return (
    <div className="box-wrapper flip-card">
      <animated.div
        className={`flip-card-inner ${showDetails ? "flip-card-active" : ""}`}
        // style={props3}
        // onMouseEnter={() => setShown(true)}
        // onMouseLeave={() => setShown(false)}
      >
        <div className="card-item-info flip-card-front">
          <div className="card-image">
            <img src={imagen} style={imageOffset} alt="" />
          </div>

          <div className="card-title">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",

                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div></div>
              <Typography
                className={Styles.title}
                variant="h5"
                fontWeight={800}
              >
                {title}
              </Typography>
              {details && (
                <IconButton
                  sx={{ p: 0, pl: 1, justifySelf: "start" }}
                  onClick={() => setShowDetails(true)}
                >
                  <InfoOutlinedIcon />
                </IconButton>
              )}
            </div>
            <Typography>{position}</Typography>
          </div>
        </div>

        {details && (
          <div className="card-item-details flip-card-back">
            <div className="card-image">
              <div
                className="card-image-fill"
                style={{ backgroundColor: "white" }}
              >
                <Typography
                  className="card-back-title"
                  variant="h5"
                  fontWeight={800}
                >
                  {title}
                </Typography>
              </div>
            </div>
            <div className="card-details">
              {Object.keys(details).map((e) => (
                <Typography
                  sx={{ fontSize: { xs: "0.85em", sm: "1em", md: "1.1em" } }}
                >
                  {e}
                </Typography>
              ))}
            </div>

            <IconButton
              className="flip-card-back-button"
              onClick={() => setShowDetails(false)}
            >
              <ArrowBackOutlinedIcon />
            </IconButton>
          </div>
        )}
      </animated.div>
    </div>
  );
};

export default MinisterCard;
