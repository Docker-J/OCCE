import { useState } from "react";
import { Button, useForkRef } from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  usePickerContext,
  useSplitFieldProps,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";

const ButtonField = (props) => {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, "date");
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);

  // const {
  //   InputProps: { ref } = {},
  //   inputProps: { "aria-label": ariaLabel } = {},
  // } = props;

  return (
    <Button
      {...forwardedProps}
      variant="outlined"
      size="large"
      // id={id}
      // disabled={disabled}
      ref={handleRef}
      // aria-label={ariaLabel}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {format(pickerContext.value, "yyyy/MM/dd")}
    </Button>
  );
};

const ButtonDatePicker = (props) => {
  const { disableDate, ...restProps } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        slots={{ field: ButtonField }}
        slotProps={{
          popper: { placement: "bottom" },
        }}
        {...restProps}
        shouldDisableDate={(date) => disableDate && disableDate(date)}
        disableHighlightToday
      />
    </LocalizationProvider>
  );
};

export default ButtonDatePicker;
