import { useState, useEffect, useRef } from "react";
import { TextField } from "@mui/material";

const DebouncedTextField = ({
  value = "",
  onChange,
  delay = 300,
  ...props
}) => {
  const [localVal, setLocalVal] = useState(value || "");
  const [prevValue, setPrevValue] = useState(value || "");
  const timerRef = useRef(null);

  // Adjust state during render when controlled value prop changes (no post-render effect cycle)
  if (prevValue !== (value || "")) {
    setPrevValue(value || "");
    setLocalVal(value || "");
  }

  const handleChange = (e) => {
    const newVal = e.target.value;
    setLocalVal(newVal);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onChange?.(newVal);
    }, delay);
  };

  const handleBlur = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (localVal !== (value || "")) {
      onChange?.(localVal);
    }
    props.onBlur?.(e);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <TextField
      {...props}
      value={localVal}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default DebouncedTextField;
