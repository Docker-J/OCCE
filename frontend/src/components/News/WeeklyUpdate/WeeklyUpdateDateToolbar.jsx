import { Box, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { isSunday } from "date-fns";
import ButtonDatePicker from "../../../common/ButtonDatePicker";

const WeeklyUpdateDateToolbar = ({
  selectedDate,
  onChangeDate,
  previousSunday,
  nextSunday,
  canGoPrevious,
  canGoNext,
  minDate,
  maxDate,
}) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "40px",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.05)",
        border: "1px solid rgba(0, 0, 0, 0.15)",
        px: 1,
        py: 0.5,
        mb: 3,
        mt: 1,
      }}
    >
      <IconButton
        id="previousBulletin"
        onClick={previousSunday}
        disabled={!canGoPrevious}
        sx={{
          color: "#FF6B00",
          "&:hover": { backgroundColor: "rgba(255, 107, 0, 0.1)" },
        }}
      >
        <ArrowBackIosIcon sx={{ fontSize: "1.1rem", ml: 0.5 }} />
      </IconButton>

      <ButtonDatePicker
        value={selectedDate}
        minDate={minDate}
        maxDate={maxDate}
        onChange={onChangeDate}
        disableDate={(date) => !isSunday(date)}
        buttonVariant="text"
        hideIcon={true}
        buttonSx={{ px: { xs: 1, sm: 2 } }}
      />

      <IconButton
        id="nextBulletin"
        onClick={nextSunday}
        disabled={!canGoNext}
        sx={{
          color: "#FF6B00",
          "&:hover": { backgroundColor: "rgba(255, 107, 0, 0.1)" },
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: "1.1rem" }} />
      </IconButton>
    </Box>
  );
};

export default WeeklyUpdateDateToolbar;
