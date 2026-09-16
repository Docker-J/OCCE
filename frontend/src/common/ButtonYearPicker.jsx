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
  const {
    slotProps,
    inputRef,
    slots,
    ownerState,
    ...buttonProps
  } = forwardedProps;
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef, inputRef);

  return (
    <Button
      {...buttonProps}
      variant="outlined"
      size="large"
      ref={handleRef}
      sx={{
        color: "white",
        borderColor: "white",
        width: "135px",
        minWidth: "135px",
        px: 2,
        whiteSpace: "nowrap",
        fontWeight: 700,
        "&:hover": {
          borderColor: "white",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
        ...internalProps.sx,
      }}
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
            sx: {
              px: 2,
              pb: 1.5,
              "& .MuiButton-root": {
                color: "#FF6B00",
                fontWeight: 700,
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 0, 0.08)",
                },
              },
            },
          },
          layout: {
            sx: {
              ".MuiYearCalendar-root": {
                pt: 2.5,
                px: 1.5,
              },
              ".MuiPickersYear-yearButton": {
                borderRadius: "12px",
                fontWeight: 600,
                transition: "all 0.2s ease",
              },
              ".MuiPickersYear-yearButton:hover": {
                backgroundColor: "rgba(255, 107, 0, 0.1)",
                color: "#FF6B00",
              },
              ".MuiPickersYear-yearButton.Mui-selected": {
                backgroundColor: "#FF6B00 !important",
                color: "#fff !important",
                fontWeight: 800,
              },
              ".MuiPickersYear-yearButton.Mui-selected:hover, .MuiPickersYear-yearButton.Mui-selected:focus": {
                backgroundColor: "#e65100 !important",
              },
              ".MuiPickersYear-yearButton.MuiPickersYear-today": {
                borderColor: "#FF6B00 !important",
              },
              ".MuiPickersCalendarHeader-label": {
                fontWeight: 800,
              },
            },
          },
          desktopPaper: {
            sx: {
              borderRadius: "24px",
              boxShadow: "0 10px 40px rgba(255, 107, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.05)",
              border: "1px solid rgba(255, 107, 0, 0.1)",
              marginTop: "8px",
            },
          },
          mobilePaper: {
            sx: {
              borderRadius: "24px",
            },
          },
        }}
        {...restProps}
      />
    </LocalizationProvider>
  );
};

export default ButtonYearPicker;
