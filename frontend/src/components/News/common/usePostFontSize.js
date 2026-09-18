import { useState } from "react";

export const usePostFontSize = (
  initialSize = 17,
  minSize = 13,
  maxSize = 25,
  step = 2,
) => {
  const [fontSize, setFontSize] = useState(initialSize);

  const increaseFont = () =>
    setFontSize((prev) => Math.min(prev + step, maxSize));
  const decreaseFont = () =>
    setFontSize((prev) => Math.max(prev - step, minSize));
  const resetFont = () => setFontSize(initialSize);

  return {
    fontSize,
    increaseFont,
    decreaseFont,
    resetFont,
    minSize,
    maxSize,
  };
};

export default usePostFontSize;
