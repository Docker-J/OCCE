import { useState } from "react";
import { Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";

const ButtonField = (props) => {
  const {
    setIsDatePickerOpen,
    id,
    disabled,
    value,
    sx,
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
      sx={{ color: "white", borderColor: "white", ...sx }}
      onClick={() => setIsDatePickerOpen?.((prev) => !prev)}
    >
      {value ? format(value, "yyyy") : "All Year"}
    </Button>
  );
};

const ButtonYearPicker = (props) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { disableDate, ...restProps } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={["year"]}
        slots={{ field: ButtonField }}
        slotProps={{
          field: { setIsDatePickerOpen },
          popper: { placement: "bottom" },
          actionBar: {
            actions: ["clear"],
          },
        }}
        {...restProps}
        open={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        // shouldDisableDate={(date) => disableDate && disableDate(date)}
        // disableHighlightToday
      />
    </LocalizationProvider>
  );
};

export default ButtonYearPicker;
