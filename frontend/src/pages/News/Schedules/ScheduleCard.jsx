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

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const textWidth = textRef.current.offsetWidth;
        const containerWidth = containerRef.current.clientWidth;
        if (textWidth > containerWidth) {
          setOverflowAmount(textWidth - containerWidth + 4);
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

  return (
    <Box 
      ref={containerRef} 
      {...boxProps}
      sx={{ overflow: "hidden", width: "100%", minWidth: 0, ...boxProps?.sx }}
      style={isOverflowing ? { "--overflow-amount": `${overflowAmount}px`, ...boxProps?.style } : boxProps?.style}
    >
      <Box
        sx={{
          display: isOverflowing ? "inline-block" : "block",
          whiteSpace: "nowrap",
          overflow: isOverflowing ? "visible" : "hidden",
          textOverflow: isOverflowing ? "clip" : "ellipsis",
          animation: isOverflowing ? `${marquee} 8s ease-in-out infinite` : "none",
          "&:hover": {
            animationPlayState: "paused",
          },
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
        minWidth: 0,
        borderBottom: isLast ? "none" : "1px solid rgba(0, 0, 0, 0.05)",
        ...(allday && {
          borderLeft: `4px solid ${sunday ? "#c1121f" : "#FF6B00"}`,
          pl: 2,
          my: 1,
          bgcolor: sunday ? "rgba(193, 18, 31, 0.02)" : "rgba(255, 107, 0, 0.02)",
          borderRadius: "0 8px 8px 0"
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
