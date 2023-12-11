import { useState } from "react";
import { Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isSunday } from "date-fns";

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

const ButtonDatePicker = (props) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        slots={{ field: ButtonField }}
        slotProps={{
          field: { setIsDatePickerOpen },
          popper: { placement: "bottom" },
        }}
        {...props}
        open={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        shouldDisableDate={(date) => !isSunday(date)}
        disableHighlightToday
      />
    </LocalizationProvider>
  );
};

export default ButtonDatePicker;
