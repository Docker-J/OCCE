import { Typography } from "@mui/material";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useCallback } from "react";

// Assuming MainAnimation.css contains necessary layout styles
import "./MainAnimation.css";

const MainAnimation = () => {
  // Animation Controls for each element/group
  const logoControls = useAnimationControls(); // ONLogo.svg
  const nameExplanation1Controls = useAnimationControls(); // "Based ON the OLD..."
  const nameExplanation2Controls = useAnimationControls(); // "온 맘 다해..."
  const nameExplanation3Controls = useAnimationControls(); // Container for "에드먼턴 교회" and vertical logo
  const edmontonTextControls = useAnimationControls();
  const churchTextControls = useAnimationControls();
  const verticalLogoControls = useAnimationControls();

  // Durations in seconds (Framer Motion)
  const durations = {
    spin: 4,
    fadeOut: 4,
    fadeOut2: 4,
    fadeInMulti: 6,
    fadeIn2: 4,
    moveTextMulti: 6,
    fadeIn3: 4.1,
    spinHorizontal: 6,
  };

  // Delays in seconds (from original timeSteps)
  const delays = {
    spin: 2, // Special handling for initial 2s delay on first run
    fadeOut: 6,
    fadeOut2: 2,
    fadeInMulti: 4,
    fadeIn2: 8, // Parent container for text + vertical logo
    moveLeft: 11,
    moveRight: 11,
    fadeIn3: 11.5,
    spinHorizontal: 14.2,
    loopRestart: 4, // Delay before the entire sequence loops
  };

  const playSequence = useCallback(async () => {
    // 1. Reset all elements to their initial states IMMEDIATELY
    logoControls.set({ rotate: 0, scale: 1, opacity: 1 });
    nameExplanation1Controls.set({ opacity: 1 });
    nameExplanation2Controls.set({ opacity: 0 });
    nameExplanation3Controls.set({ opacity: 0 });
    edmontonTextControls.set({ x: "0%" });
    churchTextControls.set({ x: "0%" });
    verticalLogoControls.set({ opacity: 0, rotate: 0, scale: 1 });

    // 2. Start animations with their respective delays

    // ONLogo.svg (Spin and FadeOut)
    logoControls.start({
      rotate: 90,
      scale: 0.65,
      transition: {
        duration: durations.spin,
        ease: "easeInOut",
        delay: delays.spin,
      },
    });
    logoControls.start({
      // Properties merge; opacity animates with its own transition
      opacity: 0,
      transition: {
        duration: durations.fadeOut,
        ease: "easeInOut",
        delay: delays.fadeOut,
      },
    });

    // nameExplanation ("Based ON the OLD...") - fadeOut2
    nameExplanation1Controls.start({
      opacity: 0,
      transition: {
        duration: durations.fadeOut2,
        ease: "easeInOut",
        delay: delays.fadeOut2,
      },
    });

    // nameExplanation2 ("온 맘 다해...") - fadeIn then out
    nameExplanation2Controls.start({
      opacity: [0, 1, 0], // Keyframes: start, middle, end
      transition: {
        duration: durations.fadeInMulti,
        ease: "easeInOut",
        delay: delays.fadeInMulti,
        times: [0, 0.5, 1], // opacity:1 at 50% of duration
      },
    });

    // nameExplanation3 (Container for Korean text & vertical logo) - fadeIn2
    nameExplanation3Controls.start({
      opacity: 1,
      transition: {
        duration: durations.fadeIn2,
        ease: "easeInOut",
        delay: delays.fadeIn2,
      },
    });

    // 에드먼턴 Typography - moveLeft
    edmontonTextControls.start({
      x: ["0%", "-30%", "-65%"],
      transition: {
        duration: durations.moveTextMulti,
        ease: "easeInOut",
        delay: delays.moveLeft,
        times: [0, 0.4, 1],
      },
    });

    // 교회 Typography - moveRight
    churchTextControls.start({
      x: ["0%", "50%", "120%"],
      transition: {
        duration: durations.moveTextMulti,
        ease: "easeInOut",
        delay: delays.moveRight,
        times: [0, 0.4, 1],
      },
    });

    // ONLogoVertical.svg (fadeIn3 and spinHorizontal)
    verticalLogoControls.start({
      // fadeIn3
      opacity: 1,
      transition: {
        duration: durations.fadeIn3,
        ease: "easeInOut",
        delay: delays.fadeIn3,
      },
    });

    // spinHorizontal - This is the LAST animation. We await its completion.
    await verticalLogoControls.start({
      rotate: -90,
      scale: 1.4,
      transition: {
        duration: durations.spinHorizontal,
        ease: "backOut", // Corresponds to easeOutBack
        delay: delays.spinHorizontal,
      },
    });

    console.log("Full sequence completed. Restarting after delay...");
    setTimeout(playSequence, delays.loopRestart * 1000); // Convert loop delay to ms
  });

  useEffect(() => {
    playSequence();
  }, []); // Run once on mount

  return (
    <div className="nameExplanationContainer">
      <motion.img
        animate={logoControls}
        initial={{ rotate: 0, scale: 1, opacity: 1 }}
        style={{
          maxWidth: "400px",
          width: "21vmax",
          height: "auto",
          padding: "4svh 0",
        }}
        src="img/ONLogo.svg"
        alt="logo of ON Community Church of Edmonton"
      />

      <motion.div
        className="nameExplanation"
        animate={nameExplanation1Controls}
        initial={{ opacity: 1 }}
      >
        <Typography
          className="old"
          variant="h5"
          fontWeight="530"
          fontSize="min(5.5vw, 36px)"
          color="#f1cdb0"
        >
          Based ON the OLD Truth
        </Typography>
        <Typography
          className="new"
          variant="h5"
          fontWeight="530"
          fontSize="min(5vw, 36px)"
          color="white"
        >
          Moving ON to the NEW Calling
        </Typography>
      </motion.div>

      <motion.div
        className="nameExplanation2"
        animate={nameExplanation2Controls}
        initial={{ opacity: 0 }}
      >
        <Typography
          variant="h5"
          fontWeight="530"
          fontSize="min(5.5vw, 36px)"
          color="#f1cdb0"
        >
          온 맘 다해 하나님을 사랑하고
        </Typography>
        <Typography
          variant="h5"
          fontWeight="530"
          fontSize="min(5vw, 36px)"
          color="white"
        >
          온 힘 다해 이웃을 사랑하는 교회
        </Typography>
      </motion.div>

      <motion.div
        className="nameExplanation3"
        animate={nameExplanation3Controls}
        initial={{ opacity: 0 }}
      >
        <motion.div animate={edmontonTextControls} initial={{ x: "0%" }}>
          <Typography
            className="edmonton"
            variant="h5"
            fontWeight="530"
            fontSize="min(3.5svmax, 75px)"
            color="#f1cdb0"
          >
            에드먼턴
          </Typography>
        </motion.div>

        <motion.div animate={churchTextControls} initial={{ x: "0%" }}>
          <Typography
            className="church"
            variant="h5"
            fontWeight="530"
            fontSize="min(3.5svmax, 75px)"
            color="white"
          >
            교회
          </Typography>
        </motion.div>

        <motion.img
          className="verticalLogo"
          animate={verticalLogoControls}
          initial={{ opacity: 0, rotate: 0, scale: 1 }}
          src="img/ONLogoVertical.svg"
          alt="Vertical Logo"
        />
      </motion.div>
    </div>
  );
};

export default MainAnimation;
