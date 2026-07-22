import { Button, useForkRef } from "@mui/material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import {
  DatePicker,
  LocalizationProvider,
  usePickerContext,
  useSplitFieldProps,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";

const ButtonField = (props) => {
  const { _, forwardedProps } = useSplitFieldProps(props, "date");
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);

  return (
    <Button
      {...forwardedProps}
      variant="text"
      size="large"
      ref={handleRef}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
      sx={{
        fontWeight: 800,
        fontSize: "1.15rem",
        color: "#2b2b2b",
        px: { xs: 2, sm: 4 },
        borderRadius: "20px",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {format(pickerContext.value, "yyyy. MM. dd.")}
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
          layout: {
            sx: {
              ".MuiPickersDay-root.Mui-selected": {
                backgroundColor: "#FF6B00 !important",
                color: "#fff",
              },
              ".MuiPickersDay-root.Mui-selected:hover, .MuiPickersDay-root.Mui-selected:focus": {
                backgroundColor: "#e65100 !important",
              },
              ".MuiPickersDay-root.MuiPickersDay-today": {
                borderColor: "#FF6B00 !important",
              },
              ".MuiPickersCalendarHeader-label": {
                fontWeight: 800,
              }
            }
          },
          desktopPaper: {
            sx: {
              borderRadius: "24px",
              boxShadow: "0 10px 40px rgba(255, 107, 0, 0.08), 0 2px 10px rgba(0,0,0,0.05)",
              border: "1px solid rgba(255, 107, 0, 0.1)",
              marginTop: "8px",
            }
          },
          mobilePaper: {
            sx: {
              borderRadius: "24px",
            }
          }
        }}
        {...restProps}
        shouldDisableDate={(date) => disableDate && disableDate(date)}
        disableHighlightToday
      />
    </LocalizationProvider>
  );
};

export default ButtonDatePicker;
