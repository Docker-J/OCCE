import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import { Stack, Typography, Box } from "@mui/material";

const YouthTimeline = () => {
  return (
    <Stack
      direction="row"
      useFlexGap
      spacing={0.5}
      sx={{
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        // maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
          width: "48%",
          px: 0,
          m: 0,
        }}
      >
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                backgroundColor: "#455a64",
                boxShadow: "0 4px 12px rgba(69, 90, 100, 0.4)",
              }}
            />
            <TimelineConnector
              sx={{ backgroundColor: "rgba(84, 110, 122, 0.2)" }}
            />
          </TimelineSeparator>
          <TimelineContent sx={{ pb: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: "#2b2b2b", mb: 0.5 }}
            >
              들음
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: "#455a64", mb: 0.5 }}
            >
              "나의 이 말을 듣고"
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#777", display: "block" }}
            >
              To hear the words of Christ
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              variant="outlined"
              sx={{ borderColor: "#546e7a", borderWidth: 2 }}
            />
            <TimelineConnector
              sx={{ backgroundColor: "rgba(84, 110, 122, 0.2)" }}
            />
          </TimelineSeparator>
          <TimelineContent sx={{ pb: 4 }}>
            <Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>
              예배 Worship
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              주일 예배 | 2:30 PM (본당)
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              variant="outlined"
              sx={{ borderColor: "#546e7a", borderWidth: 2 }}
            />
            <TimelineConnector
              sx={{ backgroundColor: "rgba(84, 110, 122, 0.2)" }}
            />
          </TimelineSeparator>
          <TimelineContent sx={{ pb: 4 }}>
            <Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>
              묵상 / 교리문답 QT / Catechism
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              중고등부 모임 | 4 PM (Fireside)
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              variant="outlined"
              sx={{ borderColor: "#546e7a", borderWidth: 2 }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>
              성경 읽기 Bible Reading
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
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
          m: 0,
        }}
      >
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                backgroundColor: "#455a64",
                boxShadow: "0 4px 12px rgba(69, 90, 100, 0.4)",
              }}
            />
            <TimelineConnector
              sx={{ backgroundColor: "rgba(84, 110, 122, 0.2)" }}
            />
          </TimelineSeparator>
          <TimelineContent sx={{ pb: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: "#2b2b2b", mb: 0.5 }}
            >
              행함
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: "#455a64", mb: 0.5 }}
            >
              "행하는 자는"
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#777", display: "block" }}
            >
              To put the words of Christ into practice
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              variant="outlined"
              sx={{ borderColor: "#546e7a", borderWidth: 2 }}
            />
            <TimelineConnector
              sx={{ backgroundColor: "rgba(84, 110, 122, 0.2)" }}
            />
          </TimelineSeparator>
          <TimelineContent sx={{ pb: 4 }}>
            <Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>
              교제 Fellowship
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              월별 생일 축하, 실내/외 Activities
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              variant="outlined"
              sx={{ borderColor: "#546e7a", borderWidth: 2 }}
            />
            <TimelineConnector
              sx={{ backgroundColor: "rgba(84, 110, 122, 0.2)" }}
            />
          </TimelineSeparator>
          <TimelineContent sx={{ pb: 4 }}>
            <Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>
              수련회 Retreat
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              방학 기간 수련회
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              variant="outlined"
              sx={{ borderColor: "#546e7a", borderWidth: 2 }}
            />
          </TimelineSeparator>
          <TimelineContent>
            <Typography sx={{ fontWeight: 700, color: "#2b2b2b", mb: 0.5 }}>
              선교 Mission
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              교회 봉사, 지역 봉사, 선교 여행
            </Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Stack>
  );
};

export default YouthTimeline;
