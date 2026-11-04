import { useState, useEffect, useRef, useTransition } from "react";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";

/**
 * DebouncedTextField
 * Modern buffered input component utilizing React 19 Concurrent Transitions (`startTransition`).
 * Keeps typing 100% fluid and non-blocking while buffering controlled state updates.
 */
const DebouncedTextField = ({
  value = "",
  onChange,
  delay = 300,
  ...props
}) => {
  const normalizedValue = value ?? "";
  const [localVal, setLocalVal] = useState(normalizedValue);
  const [prevValue, setPrevValue] = useState(normalizedValue);
  const [, startTransition] = useTransition();
  const timerRef = useRef(null);

  // Sync state during render when controlled value prop changes from parent
  if (prevValue !== normalizedValue) {
    setPrevValue(normalizedValue);
    setLocalVal(normalizedValue);
  }

  const handleChange = (e) => {
    const newVal = e.target.value;
    setLocalVal(newVal);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (delay > 0) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        startTransition(() => {
          onChange?.(newVal);
        });
      }, delay);
    } else {
      startTransition(() => {
        onChange?.(newVal);
      });
    }
  };

  const handleBlur = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (localVal !== normalizedValue) {
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

DebouncedTextField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  delay: PropTypes.number,
  onBlur: PropTypes.func,
};

export default DebouncedTextField;
