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
  //   setIsDatePickerOpen,
  //   id,
  //   disabled,
  //   value,
  //   sx,
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
      sx={{ color: "white", borderColor: "white", ...internalProps.sx }}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.value ? format(pickerContext.value, "yyyy") : "All Year"}
    </Button>
  );
};

const ButtonYearPicker = (props) => {
  const { disableDate, ...restProps } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={["year"]}
        yearsOrder="desc"
        slots={{ field: ButtonField }}
        slotProps={{
          popper: { placement: "bottom" },
          actionBar: {
            actions: ["clear"],
          },
        }}
        {...restProps}
        // shouldDisableDate={(date) => disableDate && disableDate(date)}
        // disableHighlightToday
      />
    </LocalizationProvider>
  );
};

export default ButtonYearPicker;
