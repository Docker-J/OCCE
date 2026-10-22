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

import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import { useState } from "react";
import { Popover, Typography } from "@mui/material";

const NewComersTimeline = () => {
  const [anchorEl, setAnchorEl] = useState({ anchor: null, popoverID: null });

  const handlePopoverOpen = (event, popoverID) => {
    setAnchorEl({ anchor: event.currentTarget, popoverID });
  };

  const handlePopoverClose = () => {
    setAnchorEl({ anchor: null, popoverID: null });
  };

  const handleTogglePopover = (event, popoverID) => {
    event.stopPropagation();
    setAnchorEl((prev) =>
      prev.popoverID === popoverID
        ? { anchor: null, popoverID: null }
        : { anchor: event.currentTarget, popoverID }
    );
  };

  const openRegister = anchorEl.popoverID === 1 && Boolean(anchorEl.anchor);
  const openDiscipline = anchorEl.popoverID === 2 && Boolean(anchorEl.anchor);

  return (
    <Timeline position="alternate" sx={{ pb: 0, mb: 0 }}>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary">
            <EditNoteIcon color="primary" />
          </TimelineDot>
          <TimelineConnector sx={{ height: "45px" }} />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "24px" }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#2b2b2b",
              letterSpacing: "-0.5px",
            }}
          >
            방문카드 작성
          </Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary">
            <HowToRegIcon color="primary" />
          </TimelineDot>
          <TimelineConnector sx={{ height: "45px" }} />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "24px" }}>
          <Typography
            onMouseEnter={(e) => handlePopoverOpen(e, 1)}
            onMouseLeave={handlePopoverClose}
            onClick={(e) => handleTogglePopover(e, 1)}
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#2b2b2b",
              letterSpacing: "-0.5px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              userSelect: "none",
            }}
          >
            등록{" "}
            <HelpOutlineIcon
              fontSize="small"
              color="primary"
              sx={{ verticalAlign: "middle" }}
            />
          </Typography>

          <Popover
            id="mouse-over-popover"
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
            PaperProps={{
              sx: {
                p: 1.5,
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                border: "1px solid rgba(0,0,0,0.06)",
                maxWidth: 280,
              },
            }}
          >
            <Typography sx={{ fontSize: "0.9rem", color: "#334155" }}>
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
          <TimelineConnector sx={{ height: "45px" }} />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "24px" }}>
          <Typography
            onMouseEnter={(e) => handlePopoverOpen(e, 2)}
            onMouseLeave={handlePopoverClose}
            onClick={(e) => handleTogglePopover(e, 2)}
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#2b2b2b",
              letterSpacing: "-0.5px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              userSelect: "none",
            }}
          >
            새가족 교육{" "}
            <HelpOutlineIcon
              fontSize="small"
              color="primary"
              sx={{ verticalAlign: "middle" }}
            />
          </Typography>
        </TimelineContent>
        <Popover
          id="mouse-over-popover2"
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
          PaperProps={{
            sx: {
              p: 1.5,
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              border: "1px solid rgba(0,0,0,0.06)",
              maxWidth: 280,
            },
          }}
        >
          <Typography sx={{ fontSize: "0.9rem", color: "#334155" }}>
            4주 과정, 주일 오후 4시 15분 새가족실(1층 미팅룸)
          </Typography>
        </Popover>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary">
            <LocalFloristIcon color="primary" />
          </TimelineDot>
          <TimelineConnector sx={{ height: "45px" }} />
        </TimelineSeparator>
        <TimelineContent sx={{ py: "24px" }}>
          <Typography sx={{
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "#2b2b2b",
            letterSpacing: "-0.5px"
          }}>소그룹(정원) 배치</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="primary">
            <CelebrationIcon color="primary" />
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent sx={{ py: "24px" }}>
          <Typography sx={{
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "#2b2b2b",
            letterSpacing: "-0.5px"
          }}>새가족 환영회</Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
};

export default NewComersTimeline;
