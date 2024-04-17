import { Typography } from "@mui/material";
import {
  useSpring,
  animated,
  easings,
  useSpringRef,
  useChain,
} from "@react-spring/web";

import "./MainAnimation.css";
import { useState } from "react";

const MainAnimation = () => {
  const [resetKey, setResetKey] = useState(0);

  const spinRef = useSpringRef();
  const fadeInRef = useSpringRef();
  const fadeOutRef = useSpringRef();
  const fadeOut2Ref = useSpringRef();
  const fadeIn2Ref = useSpringRef();
  const moveLeftRef = useSpringRef();
  const moveRightRef = useSpringRef();
  const fadeIn3Ref = useSpringRef();
  const spinHorizontalRef = useSpringRef();

  const initialState = () => {
    spinRef.start({
      to: { transform: "rotate(0deg) scale(1)" },
      immediate: true,
    });
    fadeOutRef.start({
      to: { opacity: 1 },
      immediate: true,
    });
    fadeInRef.start({
      to: { opacity: 0 },
      immediate: true,
    });
    fadeOut2Ref.start({
      to: { opacity: 1 },
      immediate: true,
    });
    fadeIn2Ref.start({
      to: { opacity: 0 },
      immediate: true,
    });
    fadeIn3Ref.start({
      to: { opacity: 0 },
      immediate: true,
    });
    moveLeftRef.start({
      to: { transform: "translateX(0%)" },
      immediate: true,
    });
    moveRightRef.start({
      to: { transform: "translateX(0%)" },
      immediate: true,
    });
    spinHorizontalRef.start({
      to: { transform: "rotate(0deg) scale(1)" },
      immediate: true,
    });
    setResetKey((prev) => prev + 1);
  };

  const spin = useSpring({
    ref: spinRef,
    from: { transform: "rotate(0deg) scale(1)" },
    to: { transform: "rotate(90deg) scale(0.65)" },
    delay: 2000,
    reset: true,
    config: {
      duration: 4000,
      easing: easings.easeInOutSine,
    },
  });

  const fadeOut2 = useSpring({
    ref: fadeOut2Ref,
    from: { opacity: 1 },
    to: { opacity: 0 },
    reset: true,
    config: {
      duration: 4000,
      easing: easings.easeInOutSine,
    },
  });

  const fadeIn = useSpring({
    ref: fadeInRef,
    from: { opacity: 0 },
    to: [{ opacity: 1 }, { opacity: 0 }],
    reset: true,
    config: {
      duration: 4000,
      easing: easings.easeInOutSine,
    },
  });

  const fadeOut = useSpring({
    ref: fadeOutRef,
    from: { opacity: 1 },
    to: { opacity: 0 },
    reset: true,
    config: {
      duration: 4000,
      easing: easings.easeInOutSine,
    },
  });

  const fadeIn2 = useSpring({
    ref: fadeIn2Ref,
    from: { opacity: 0 },
    to: { opacity: 1 },
    reset: true,
    config: {
      duration: 4000,
      easing: easings.easeInOutSine,
    },
  });

  const moveLeft = useSpring({
    ref: moveLeftRef,
    from: { transform: "translateX(0%)" },
    to: [{ transform: "translateX(-30%)" }, { transform: "translateX(-65%)" }],
    reset: true,
    config: {
      duration: 3700,
    },
  });

  const moveRight = useSpring({
    ref: moveRightRef,
    from: { transform: "translateX(0%)" },
    to: [{ transform: "translateX(50%)" }, { transform: "translateX(120%)" }],
    reset: true,
    config: {
      duration: 3700,
    },
  });

  const fadeIn3 = useSpring({
    ref: fadeIn3Ref,
    from: { opacity: 0 },
    to: { opacity: 1 },
    reset: true,
    config: {
      duration: 3700,
    },
  });

  const spinHorizontal = useSpring({
    ref: spinHorizontalRef,
    from: { transform: "rotate(0deg) scale(1)" },
    to: { transform: "rotate(-90deg) scale(1.4)" },
    reset: true,
    config: {
      duration: 5800,
      easing: easings.easeOutBack,
    },
    onRest: () =>
      setTimeout(() => {
        initialState();
      }, 5000),
  });

  useChain(
    [
      spinRef,
      fadeOut2Ref,
      fadeInRef,
      fadeOutRef,
      fadeIn2Ref,
      moveLeftRef,
      moveRightRef,
      fadeIn3Ref,
      spinHorizontalRef,
    ],
    [0, 1, 2, 3, 4, 4.6, 4.6, 5, 6.3],
    3000
  );

  return (
    <div key={resetKey} className="nameExplanationContainer">
      <animated.img
        style={{
          maxWidth: "400px",
          width: "21vmax",
          height: "auto",
          padding: "4svh 0",
          ...spin,
          ...fadeOut,
        }}
        src="img/ONLogo.svg"
        alt="logo of ON Community Church of Edmonton"
      />

      <animated.div className="nameExplanation" style={{ ...fadeOut2 }}>
        <Typography
          className="old"
          variant="h5"
          fontWeight="530"
          fontSize={"min(5.5vw, 36px)"}
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
      </animated.div>

      <animated.div className="nameExplanation2" style={{ ...fadeIn }}>
        <Typography
          variant="h5"
          fontWeight="530"
          fontSize={"min(5.5vw, 36px)"}
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
      </animated.div>

      <animated.div className="nameExplanation3" style={{ ...fadeIn2 }}>
        {/* <animated.div style={{ display: "flex", ...final }}> */}
        <animated.div style={{ ...moveLeft }}>
          <Typography
            className="edmonton"
            variant="h5"
            fontWeight="530"
            fontSize={"min(3.5svmax, 75px)"}
            style={{ color: "#f1cdb0" }}
          >
            에드먼턴
          </Typography>
        </animated.div>

        <animated.div style={{ ...moveRight }}>
          <Typography
            className="church"
            variant="h5"
            fontWeight="530"
            fontSize={"min(3.5svmax, 75px)"}
            color="white"
          >
            교회
          </Typography>
        </animated.div>

        <animated.img
          className="verticalLogo"
          src="img/ONLogoVertical.svg"
          alt="Vertical Logo"
          style={{ ...fadeIn3, ...spinHorizontal }}
        />
        {/* </animated.div> */}
      </animated.div>
    </div>
  );
};

export default MainAnimation;
