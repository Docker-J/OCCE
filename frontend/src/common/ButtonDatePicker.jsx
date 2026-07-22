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
        }}
        {...restProps}
        shouldDisableDate={(date) => disableDate && disableDate(date)}
        disableHighlightToday
      />
    </LocalizationProvider>
  );
};

export default ButtonDatePicker;
