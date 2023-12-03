import PropTypes from "prop-types";
import { useState } from "react";
import { Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import * as enCA from "date-fns/locale/en-CA";

const ButtonField = (props) => {
  const {
    setIsDatePickerOpen,
    id,
    disabled,
    value,
    InputProps: { ref } = {},
    inputProps: { "aria-label": ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="outlined"
      size="large"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => setIsDatePickerOpen?.((prev) => !prev)}
    >
      {format(value, "yyyy/MM/dd")}
    </Button>
  );
};

ButtonField.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  inputProps: PropTypes.shape({
    "aria-label": PropTypes.string,
  }),
  InputProps: PropTypes.shape({
    endAdornment: PropTypes.node,
    startAdornment: PropTypes.node,
  }),
  setIsDatePickerOpen: PropTypes.func,
  label: PropTypes.node,
};

const ButtonDatePicker = (props) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const notSunday = (date) => {
    const day = date.getDay();
    return day !== 0;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        slots={{ field: ButtonField, ...props.slots }}
        slotProps={{
          field: { setIsDatePickerOpen },
          popper: { placement: "bottom" },
        }}
        {...props}
        open={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        shouldDisableDate={notSunday}
        disableHighlightToday
      />
    </LocalizationProvider>
  );
};

export default ButtonDatePicker;
