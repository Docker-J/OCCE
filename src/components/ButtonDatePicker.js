import { useState } from "react";
import { Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function ButtonDatePicker(props) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const notSunday = (date) => {
    const day = date.getDay();
    return day !== 0;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        {...props}
        open={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        shouldDisableDate={notSunday}
        disableHighlightToday
        renderInput={(props) => (
          <Button
            ref={props.inputRef}
            variant="outlined"
            size="large"
            onClick={() =>
              setIsDatePickerOpen((isDatePickerOpen) => !isDatePickerOpen)
            }
          >
            {props.inputProps.value}
          </Button>
        )}
      />
    </LocalizationProvider>
  );
}

export default ButtonDatePicker;
