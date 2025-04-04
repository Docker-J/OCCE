import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import EditNoteIcon from "@mui/icons-material/EditNote";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import SchoolIcon from "@mui/icons-material/School";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import CelebrationIcon from "@mui/icons-material/Celebration";

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
    <Timeline position="alternate" sx={{ pb: 0, mb: 0 }}>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary">
            <EditNoteIcon color="primary" />
          </TimelineDot>
          <TimelineConnector sx={{ height: "30px" }} />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "18px" }}>
          <Typography fontWeight={600}>방문카드 작성</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary">
            <HowToRegIcon color="primary" />
          </TimelineDot>
          <TimelineConnector sx={{ height: "30px" }} />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "18px" }}>
          <Typography
            fontWeight={600}
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
          <TimelineDot variant="outlined" color="primary">
            <SchoolIcon color="primary" />
          </TimelineDot>
          <TimelineConnector sx={{ height: "30px" }} />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "18px" }}>
          <Typography
            fontWeight={600}
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
          <TimelineDot variant="outlined" color="primary">
            <LocalFloristIcon color="primary" />
          </TimelineDot>
          <TimelineConnector sx={{ height: "30px" }} />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "18px" }}>
          <Typography fontWeight={600}>소그룹(정원) 배치</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary">
            <CelebrationIcon color="primary" />
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent sx={{ py: "18px" }}>
          <Typography fontWeight={600}>새가족 환영회</Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
};

export default NewComersTimeline;
