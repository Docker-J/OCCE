import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState } from "react";
import { Popover, Typography } from "@mui/material";

const NewComersTimeline = () => {
  const [anchorEl, setAnchorEl] = useState({ anchor: null, popoverID: null });

  const handlePopoverOpen = (event, popoverID) => {
    setAnchorEl({ anchor: event.currentTarget, popoverID: popoverID });
  };

  const handlePopoverClose = () => {
    setAnchorEl({ anchor: null, popoverID: null });
  };

  const openRegister = anchorEl.popoverID === 1 && anchorEl.anchor;
  const openDiscipline = anchorEl.popoverID === 2 && anchorEl.anchor;

  return (
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>방문카드 작성</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography
            onMouseEnter={(e) => handlePopoverOpen(e, 1)}
            onMouseLeave={handlePopoverClose}
          >
            등록 <HelpOutlineIcon fontSize="small" color="primary" />
          </Typography>

          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: "none",
            }}
            open={openRegister}
            anchorEl={anchorEl.anchor}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
            disableScrollLock
          >
            <Typography sx={{ p: 1 }}>
              QR코드 온라인 등록 또는 오프라인 등록 양식 작성
            </Typography>
          </Popover>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography
            onMouseEnter={(e) => handlePopoverOpen(e, 2)}
            onMouseLeave={handlePopoverClose}
          >
            새가족 교육 <HelpOutlineIcon fontSize="small" color="primary" />
          </Typography>
        </TimelineContent>
        <Popover
          id="mouse-over-popover2"
          sx={{
            pointerEvents: "none",
          }}
          open={openDiscipline}
          anchorEl={anchorEl.anchor}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
          disableScrollLock
        >
          <Typography sx={{ p: 1 }}>
            4주 과정, 주일 오후 4시 15분 새가족실(1층 미팅룸)
          </Typography>
        </Popover>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>소그룹(정원) 배치</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary" />
        </TimelineSeparator>
        <TimelineContent>새가족 환영회</TimelineContent>
      </TimelineItem>
    </Timeline>
  );
};

export default NewComersTimeline;
