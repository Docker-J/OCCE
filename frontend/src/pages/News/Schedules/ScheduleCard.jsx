import { useState, useRef, useEffect } from "react";
import { Box, Stack, Typography, keyframes } from "@mui/material";
import {
  addDays,
  differenceInDays,
  format,
  getDate,
  isSameDay,
  parseISO,
} from "date-fns";

import ScheduleIcon from "@mui/icons-material/Schedule";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

function isSameDayEvent(start, end, endTime) {
  return (
    isSameDay(start, end) ||
    (getDate(addDays(start, 1)) === getDate(end) && endTime === "00:00 AM")
  );
}

const marquee = keyframes`
  0%, 20% {
    transform: translateX(0);
  }
  80%, 100% {
    transform: translateX(calc(-1 * var(--overflow-amount)));
  }
`;

const MarqueeText = ({ children, typographyProps, boxProps }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [overflowAmount, setOverflowAmount] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const textWidth = textRef.current.offsetWidth;
        const containerWidth = containerRef.current.clientWidth;
        if (textWidth > containerWidth) {
          setOverflowAmount(textWidth - containerWidth + 10);
          setIsOverflowing(true);
        } else {
          setIsOverflowing(false);
          setOverflowAmount(0);
        }
      }
    };
    
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [children]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsClicked(false);
      }
    };
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box 
      ref={containerRef} 
      onClick={() => isOverflowing && setIsClicked(!isClicked)}
      {...boxProps}
      className={isClicked ? "is-clicked" : ""}
      sx={{ 
        overflow: "hidden", 
        width: "100%", 
        minWidth: 0, 
        cursor: isOverflowing ? "pointer" : "inherit",
        ...boxProps?.sx,
        "&:hover .marquee-text, &.is-clicked .marquee-text": isOverflowing ? {
          display: "inline-block",
          width: "max-content",
          overflow: "visible",
          textOverflow: "clip",
          animation: `${marquee} 6s linear infinite`,
        } : {}
      }}
      style={isOverflowing ? { "--overflow-amount": `${overflowAmount}px`, ...boxProps?.style } : boxProps?.style}
    >
      <Box
        className="marquee-text"
        sx={{
          display: "block",
          width: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <Typography
          ref={textRef}
          component="span"
          {...typographyProps}
        >
          {children}
        </Typography>
      </Box>
    </Box>
  );
};

const ScheduleCard = ({ date, event, sunday, isLast }) => {
  const allday = event.allday;

  const start = parseISO(allday ? event.start.date : event.start.dateTime);
  const end = parseISO(allday ? event.end.date : event.end.dateTime);
  const startDate = format(start, "dd");
  const startTime = format(start, "hh:mm a");
  const endDate = format(end, "dd");
  const endTime = format(end, "hh:mm a");

  const sameDay = isSameDayEvent(start, end, endTime);

  return (
    <Box
      sx={{
        py: 1.5,
        px: 1.5,
        my: 0.5,
        borderRadius: "12px",
        minWidth: 0,
        borderBottom: isLast ? "none" : "1px solid rgba(0, 0, 0, 0.04)",
        transition: "background-color 0.2s, transform 0.2s",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.02)",
        },
        ...(allday && {
          borderLeft: `4px solid ${sunday ? "#c1121f" : "#FF6B00"}`,
          borderBottom: "none",
          pl: 2,
          my: 1,
          bgcolor: sunday ? "rgba(193, 18, 31, 0.03)" : "rgba(255, 107, 0, 0.03)",
          borderRadius: "4px 12px 12px 4px",
          "&:hover": {
            backgroundColor: sunday ? "rgba(193, 18, 31, 0.06)" : "rgba(255, 107, 0, 0.06)",
          }
        }),
      }}
    >
      <MarqueeText
        boxProps={{ sx: { mb: 0.5 } }}
        typographyProps={{
          sx: {
            fontSize: "1.15em",
            fontWeight: 750,
            color: "#2b2b2b",
          }
        }}
      >
        {event.summary}
        {allday &&
          !sameDay &&
          ` (Day ${differenceInDays(date, start) + 1}/${event.alldaylength})`}
      </MarqueeText>

      {event.description && (
        <Typography
          sx={{
            mb: 0.5,
            color: "#666",
            fontSize: "0.95em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {event.description}
        </Typography>
      )}
      {!allday && (
        <Stack
          direction="row"
          spacing={0.8}
          sx={{
            alignItems: "center",
            mt: 0.5
          }}
        >
          <ScheduleIcon sx={{ fontSize: 18, color: "#888" }} />
          <Typography variant="body2" sx={{ color: "#555", fontWeight: 500 }}>
            {startTime}
            {!allday &&
              (sameDay
                ? ` - ${endTime}`
                : ` - ${format(end, "MM/dd hh:mm a")} `)}
          </Typography>
        </Stack>
      )}
      {event?.location && (
        <Stack
          direction="row"
          spacing={0.8}
          sx={{
            alignItems: "center",
            marginTop: "6px",
            minWidth: 0,
          }}
        >
          <PlaceOutlinedIcon sx={{ color: "#FF6B00", fontSize: 18, flexShrink: 0 }} />
          <MarqueeText
            typographyProps={{
              component: "a",
              target: "_blank",
              href: `https://www.google.com/maps/search/?api=1&query=${event.location}`,
              variant: "body2",
              sx: { 
                color: "#555", 
                textDecoration: "none", 
                fontWeight: 500,
                transition: "color 0.2s",
                "&:hover": { color: "#FF6B00" } 
              }
            }}
          >
            {event.location.split(",")[0]}
          </MarqueeText>
        </Stack>
      )}
    </Box>
  );
};

export default ScheduleCard;
