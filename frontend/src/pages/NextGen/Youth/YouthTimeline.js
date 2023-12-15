import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState } from "react";
import { Popover, Stack, Typography } from "@mui/material";

const YouthTimeline = () => {
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
    <Stack
      direction="row"
      useFlexGap
      flexWrap="wrap"
      spacing={0.5}
      justifyContent="space-evenly"
      sx={{ maxWidth: "800px", margin: "0 auto" }}
    >
      {/* <Typography>
        하나님 앞에서 지혜로운 사람 A wise person before God
      </Typography> */}
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
          width: "48%",
          px: 0,
        }}
      >
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight={600}>
              들음
              <br />
              "나의 이 말을 듣고" <br />
              To hear the words of Christ
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight={600}>
              예배 Worship
              <br />
              주일 예배 | 2:30 PM (본당)
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight={600}>
              묵상/교리문답 QT/Catechism
              <br />
              중고등부 모임 | 4 PM (Fireside)
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="primary" />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight={600}>
              성경 읽기 Bible Reading
              <br />
              월-금요일 | 공동체 성경 읽기
            </Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>

      <Timeline
        position="left"
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
          width: "48%",
          px: 0,
        }}
      >
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight={600}>
              행함
              <br />
              "행하는 자는" <br />
              To put the words of Christ into practice
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight={600}>
              교제 Fellowship
              <br />
              월별 생일 축하, 실내/외 Activities
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight={600}>
              수련회 Retreat
              <br />
              방학 기간 수련회
            </Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant="outlined" color="primary" />
          </TimelineSeparator>
          <TimelineContent>
            <Typography fontWeight={600}>
              선교 Mission
              <br />
              교회 봉사, 지역 봉사, 선교 여행
            </Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Stack>
  );
};

export default YouthTimeline;
