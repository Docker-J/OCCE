import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";

const calculateDimensions = () => {
  if (typeof window === "undefined") {
    return { width: null, height: null };
  }
  const width = isMobile
    ? document.documentElement.clientWidth
    : window.innerWidth;
  const height = isMobile
    ? document.documentElement.clientHeight
    : window.innerHeight;

  const aspectRatio = height / width;
  const isPortrait = aspectRatio >= 16 / 10;

  return {
    width: isPortrait ? width - 30 : null,
    height: isPortrait ? null : height,
  };
};

export const useBulletinDimensions = () => {
  const [dimensions, setDimensions] = useState(calculateDimensions);

  useEffect(() => {
    const handleResize = () => {
      setDimensions(calculateDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
};

export default useBulletinDimensions;
