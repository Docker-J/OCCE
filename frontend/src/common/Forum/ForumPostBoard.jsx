/**
 * @file ForumPostBoard.jsx
 * @description 온교회 공지사항 및 목회칼럼 게시판 목록 컴포넌트
 * DOMParser 병목 제거: extractPlainText 유틸리티 적용으로 렌더링 성능 최적화
 */

import PropTypes from "prop-types";
import { Box, Card, Stack, Typography, Chip } from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router";

import PushPinIcon from "@mui/icons-material/PushPin";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { extractPlainText } from "../../util/textUtils";

/**
 * 개별 게시글 카드 컴포넌트
 */
const ForumPostCard = ({ post, themeColor, themeBg, themeHover }) => {
  const isPinned = Boolean(post?.pin);
  const formattedDate = post?.timestamp ? format(new Date(post.timestamp), "yyyy. MM. dd") : "";
  const plainSnippet = extractPlainText(post?.body);

  return (
    <Card
      component={Link}
      to={post.id}
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        bgcolor: isPinned ? themeBg : "#ffffff",
        mb: 2.5,
        p: { xs: 2, sm: 2.5 },
        borderRadius: "20px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.06)",
          borderColor: "rgba(0, 0, 0, 0.12)",
          "& .post-title": {
            color: themeColor,
          },
        },
      }}
    >
      {/* 뱃지 & 아이콘 행 */}
      <Stack direction="row" sx={{ alignItems: "center", mb: 2, width: "100%" }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          {isPinned && (
            <Chip
              icon={<PushPinIcon sx={{ fontSize: "16px !important", color: "white !important" }} />}
              label="중요"
              size="small"
              sx={{
                bgcolor: themeColor,
                color: "white",
                fontWeight: 800,
                borderRadius: "8px",
                height: "26px",
              }}
            />
          )}
          {formattedDate && (
            <Chip
              icon={
                <CalendarTodayIcon
                  sx={{ fontSize: "14px !important", color: `${themeColor} !important` }}
                />
              }
              label={formattedDate}
              size="small"
              sx={{
                bgcolor: themeBg,
                color: themeColor,
                fontWeight: 700,
                borderRadius: "8px",
                height: "26px",
                border: `1px solid ${themeHover}`,
              }}
            />
          )}

          {post?.images && (
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: "8px",
                bgcolor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PhotoOutlinedIcon sx={{ color: "#777", fontSize: 16 }} />
            </Box>
          )}
          {post?.video && (
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: "8px",
                bgcolor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MovieOutlinedIcon sx={{ color: "#777", fontSize: 16 }} />
            </Box>
          )}
        </Stack>
      </Stack>

      {/* 제목 */}
      <Typography
        className="post-title"
        sx={{
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          fontWeight: 800,
          color: "#2b2b2b",
          mb: 1,
          lineHeight: 1.3,
          transition: "color 0.3s ease",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {post.title}
      </Typography>

      {/* 미리보기 본문 (DOMParser 제거, 초경량 텍스트 추출 적용) */}
      <Typography
        sx={{
          fontSize: "14px",
          color: "#666666",
          lineHeight: "1.6",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: "2",
          overflow: "hidden",
          textOverflow: "ellipsis",
          wordBreak: "break-all",
        }}
      >
        {plainSnippet}
      </Typography>
    </Card>
  );
};

ForumPostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    pin: PropTypes.bool,
    images: PropTypes.any,
    video: PropTypes.any,
  }).isRequired,
  themeColor: PropTypes.string.isRequired,
  themeBg: PropTypes.string.isRequired,
  themeHover: PropTypes.string.isRequired,
};

/**
 * 게시판 목록 컨테이너 컴포넌트
 */
const ForumPostBoard = ({
  announcements: posts = [],
  themeColor = "#FF6B00",
  themeBg = "rgba(255, 107, 0, 0.08)",
  themeHover = "rgba(255, 107, 0, 0.15)",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "850px",
      }}
    >
      {posts.map((post) => (
        <Box key={post.id} sx={{ width: "100%" }}>
          <ForumPostCard
            post={post}
            themeColor={themeColor}
            themeBg={themeBg}
            themeHover={themeHover}
          />
        </Box>
      ))}
    </Box>
  );
};

ForumPostBoard.propTypes = {
  announcements: PropTypes.arrayOf(PropTypes.object),
  themeColor: PropTypes.string,
  themeBg: PropTypes.string,
  themeHover: PropTypes.string,
};

export default ForumPostBoard;
