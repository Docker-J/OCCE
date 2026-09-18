import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { TextField } from "@mui/material";

const DebouncedTextField = ({
  value = "",
  onChange,
  delay = 300,
  ...props
}) => {
  const [localVal, setLocalVal] = useState(value || "");
  const timerRef = useRef(null);

  useEffect(() => {
    setLocalVal(value || "");
  }, [value]);

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
      flushSync(() => {
        onChange?.(localVal);
      });
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
