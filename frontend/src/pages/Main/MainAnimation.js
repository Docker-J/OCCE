import { Typography } from "@mui/material";
import {
  useSpring,
  animated,
  easings,
  useSpringRef,
  useChain,
} from "@react-spring/web";

import "./MainNameAnimation.css";
import { useEffect, useState } from "react";

const MainAnimation = () => {
  const api = useSpringRef();
  const fadeInRef = useSpringRef();
  const fadeOutRef = useSpringRef();
  const fadeOut2Ref = useSpringRef();
  const fadeIn2Ref = useSpringRef();
  const moveLeftRef = useSpringRef();
  const moveRightRef = useSpringRef();
  const fadeIn3Ref = useSpringRef();
  const spinHorizontalRef = useSpringRef();

  const springRefs = [
    api,
    fadeInRef,
    fadeOutRef,
    fadeOut2Ref,
    fadeIn2Ref,
    moveLeftRef,
    moveRightRef,
    fadeIn3Ref,
    spinHorizontalRef,
  ];

  const spin = useSpring({
    ref: api,
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
    // delay: 2000,
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
    // delay: 6000,
    reset: true,
    config: {
      duration: 3500,
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
      duration: 4000,
      easing: easings.easeInOutSine,
    },
  });

  const moveRight = useSpring({
    ref: moveRightRef,
    from: { transform: "translateX(0%)" },
    to: [{ transform: "translateX(50%)" }, { transform: "translateX(120%)" }],
    reset: true,
    config: {
      duration: 4000,
      easing: easings.easeInOutSine,
    },
  });

  const fadeIn3 = useSpring({
    ref: fadeIn3Ref,
    from: { opacity: 0 },
    to: { opacity: 1 },
    reset: true,
    config: {
      duration: 4000,
      easing: easings.easeInOutSine,
    },
  });

  const [pause, setPause] = useState(false);

  const test = () => {
    if (api) {
      console.log(api.current);
      fadeOutRef.start({
        from: { opacity: 0 },
        to: { opacity: 1 },
        immediate: true,
      });
      fadeIn2Ref.start({
        from: { opacity: 1 },
        to: { opacity: 0 },
        immediate: true,
      });
      // fadeOutRef.start();
    }
  };

  // useEffect(() => {
  //   if (!pause) {
  //     springRefs.forEach((ref) => ref.pause());
  //     setPause(true);
  //   }

  //   if (pause) {
  //     springRefs.forEach((ref) => ref.resume());
  //     setPause(false);
  //   }
  // }, [pause]);

  const spinHorizontal = useSpring({
    ref: spinHorizontalRef,
    from: { transform: "rotate(0deg) scale(1)" },
    to: { transform: "rotate(-90deg) scale(1.4)" },
    // reset: true,
    config: {
      duration: 4800,
      easing: easings.easeOutBack,
    },
    // onRest: test,
  });

  const [resetKey, setResetKey] = useState(0);

  useChain(
    [
      api,
      fadeOut2Ref,
      fadeInRef,
      fadeOutRef,
      fadeIn2Ref,
      moveLeftRef,
      moveRightRef,
      fadeIn3Ref,
      spinHorizontalRef,
    ],
    [0, 1, 2, 3, 4, 4.6, 4.6, 5, 6.4],
    3000
  );

  return (
    <div
      key={resetKey}
      // onClick={() => test()}
      className="nameExplanationContainer"
    >
      <animated.img
        style={{
          maxWidth: "400px",
          width: "21vmax",
          height: "auto",
          padding: "4vh 0",
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
      </animated.div>

      <animated.div className="nameExplanation2" style={{ ...fadeIn }}>
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
      </animated.div>

      <animated.div className="nameExplanation3" style={{ ...fadeIn2 }}>
        <animated.div style={{ ...moveLeft }}>
          <Typography
            className="edmonton"
            variant="h5"
            fontWeight="530"
            fontSize={"3.4vmax"}
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
            fontSize={"3.4vmax"}
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
      </animated.div>
    </div>
  );
};

export default MainAnimation;
