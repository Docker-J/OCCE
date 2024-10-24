import { Typography } from "@mui/material";
import Styles from "./Card.module.css";
import React, { useState } from "react";
import { useSpring, animated } from "react-spring";

function Card({ imagen, imageOffset, title, position }) {
  const [show, setShown] = useState(false);

  const props3 = useSpring({
    transform: show ? "scale(1.03)" : "scale(1)",
    boxShadow: show
      ? "0 20px 25px rgb(0 0 0 / 25%)"
      : "0 2px 10px rgb(0 0 0 / 8%)",
  });

  return (
    <div className={Styles.boxWrapper}>
      <animated.div
        className={Styles.card}
        style={props3}
        onMouseEnter={() => setShown(true)}
        onMouseLeave={() => setShown(false)}
      >
        <div className={Styles.crop}>
          <img src={imagen} style={imageOffset} alt="" />
        </div>
        <div className={Styles.text}>
          <Typography className={Styles.title} variant="h5" fontWeight={800}>
            {title}
          </Typography>
          <Typography>{position}</Typography>
        </div>
      </animated.div>
    </div>
  );
}

export default Card;
