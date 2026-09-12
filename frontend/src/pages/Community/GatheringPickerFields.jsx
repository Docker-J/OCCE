import { Box, TextField, InputAdornment, useForkRef } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { PickerDay, usePickerContext, useSplitFieldProps } from "@mui/x-date-pickers";
import { format } from "date-fns";

export function GatheringCustomDay(props) {
  const { day, outsideCurrentMonth, selected, historyDates = [], ...other } = props;
  const dateStr =
    day && !isNaN(new Date(day).getTime()) ? format(day, "yyyy-MM-dd") : "";
  const isMarked =
    !outsideCurrentMonth && dateStr && historyDates.includes(dateStr);

  return (
    <Box
      component="span"
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PickerDay
        {...other}
        day={day}
        selected={selected}
        outsideCurrentMonth={outsideCurrentMonth}
      />
      {isMarked && (
        <Box
          component="span"
          sx={{
            position: "absolute",
            bottom: "4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: selected ? "#ffffff" : "#ea580c",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
}

export const GatheringDateButtonField = (props) => {
  const { _, forwardedProps } = useSplitFieldProps(props, "date");
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const { disabled } = forwardedProps;

  let displayDate = "";
  if (pickerContext.value && !isNaN(new Date(pickerContext.value).getTime())) {
    const d = new Date(pickerContext.value);
    const dayOfWeekNames = ["일", "월", "화", "수", "목", "금", "토"];
    displayDate = `${format(d, "yyyy. MM. dd.")} (${dayOfWeekNames[d.getDay()]})`;
  }

  return (
    <TextField
      fullWidth
      ref={handleRef}
      label="모임 날짜"
      placeholder="날짜 선택"
      value={displayDate}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          pickerContext.setOpen((prev) => !prev);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          pickerContext.setOpen((prev) => !prev);
        } else if (!e.ctrlKey && !e.metaKey && e.key.length === 1) {
          e.preventDefault();
        }
      }}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
        input: {
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <CalendarTodayIcon
                sx={{
                  color: "#ea580c",
                  cursor: disabled ? "default" : "pointer",
                }}
              />
            </InputAdornment>
          ),
          sx: {
            cursor: disabled ? "default" : "pointer",
            "& input": {
              cursor: disabled ? "default" : "pointer",
              fontWeight: 500,
              color: "#222",
              userSelect: "none",
            },
          },
        },
        htmlInput: {
          readOnly: true,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          cursor: disabled ? "default" : "pointer",
          backgroundColor: "#fff",
          "&:hover fieldset": {
            borderColor: disabled ? undefined : "#ea580c",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#ea580c",
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#ea580c",
        },
      }}
    />
  );
};

export const GatheringTimeButtonField = (props) => {
  const { _, forwardedProps } = useSplitFieldProps(props, "time");
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const { disabled } = forwardedProps;

  let displayTime = "";
  if (pickerContext.value && !isNaN(new Date(pickerContext.value).getTime())) {
    const d = new Date(pickerContext.value);
    const hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours < 12 ? "오전" : "오후";
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    displayTime = `${ampm} ${displayHours}:${minutes}`;
  }

  return (
    <TextField
      fullWidth
      ref={handleRef}
      label="모임 시간"
      placeholder="시간 선택"
      value={displayTime}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          pickerContext.setOpen((prev) => !prev);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          pickerContext.setOpen((prev) => !prev);
        } else if (!e.ctrlKey && !e.metaKey && e.key.length === 1) {
          e.preventDefault();
        }
      }}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
        input: {
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <AccessTimeIcon
                sx={{
                  color: "#ea580c",
                  cursor: disabled ? "default" : "pointer",
                }}
              />
            </InputAdornment>
          ),
          sx: {
            cursor: disabled ? "default" : "pointer",
            "& input": {
              cursor: disabled ? "default" : "pointer",
              fontWeight: 500,
              color: "#222",
              userSelect: "none",
            },
          },
        },
        htmlInput: {
          readOnly: true,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          cursor: disabled ? "default" : "pointer",
          backgroundColor: "#fff",
          "&:hover fieldset": {
            borderColor: disabled ? undefined : "#ea580c",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#ea580c",
          },
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#ea580c",
        },
      }}
    />
  );
};
