import { Typography, Box } from "@mui/material";
import YoutubePlaylist from "./../../components/Online/YoutubePlaylist";
import { useLoaderData } from "react-router";
import CustomCarousel from "../../common/CustomCarousel";

const titleBackground = {
  backgroundImage: 'url("/img/Online/Sermon.webp")',
  backgroundPositionX: "52%",
};

/**
 * Safely extracts or normalizes YouTube playlist embed URL from various link formats.
 */
const getYoutubeEmbedUrl = (link) => {
  if (!link || typeof link !== "string") return "";

  // 1. Direct embed URL already provided
  if (link.includes("youtube.com/embed")) {
    return link;
  }

  // 2. Query parameter: ?list=... or &list=...
  try {
    const url = new URL(link);
    const listId = url.searchParams.get("list");
    if (listId) {
      return `https://www.youtube.com/embed/videoseries?list=${listId}`;
    }
  } catch {
    // If not a full URL, fallback to regex search
  }

  const listMatch = link.match(/[?&]list=([^#&?]+)/);
  if (listMatch?.[1]) {
    return `https://www.youtube.com/embed/videoseries?list=${listMatch[1]}`;
  }

  // 3. Fallback for "PL-" or "PL" playlist ID pattern
  const plMatch = link.match(/(PL[-a-zA-Z0-9_]+)/);
  if (plMatch?.[1]) {
    return `https://www.youtube.com/embed/videoseries?list=${plMatch[1]}`;
  }

  return link;
};

const Bible291 = () => {
  const { today, match } = useLoaderData();

  return (
    <>
      <title>291일 성경 1독 - OCCE</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              letterSpacing: "0.3em",
              pl: "0.4em",
              color: "white",
            }}
          >
            291일 성경 1독
          </Typography>
        </div>
      </div>
      <div className="container-wrapper">
        <div className="container">
          {match ? (
            <>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 830,
                  lineHeight: 1.6,
                  wordBreak: "keep-all",
                  textAlign: "center",
                }}
              >
                {today} 오늘의 1독 말씀은 <br />
                <Box
                  component="span"
                  sx={{
                    color: "primary.main",
                    backgroundColor: "rgba(255, 107, 0, 0.1)",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    display: "inline-block",
                    mt: 1,
                  }}
                >
                  "{match.read}"
                </Box>
                입니다.
              </Typography>
              <br />
              <YoutubePlaylist src={getYoutubeEmbedUrl(match.link)} />
            </>
          ) : (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 830,
                textAlign: "center",
              }}
            >
              {today} 오늘은 성경 1독을 쉬어가는 날입니다
            </Typography>
          )}

          <div
            style={{
              marginTop: "40px",
              paddingBottom: "40px",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <CustomCarousel
              autoPlay={true}
              autoPlayInterval={5000}
              showArrows={false}
              showDots={true}
              loop={true}
            >
              <div>
                <img loading="lazy" style={{
                    width: "100%",
                    display: "block",
                    borderRadius: "12px",
                  }}
                  src="/img/Online/291Bible/1.webp"
                  alt="안내 1"
                />
              </div>
              <div>
                <img loading="lazy" style={{
                    width: "100%",
                    display: "block",
                    borderRadius: "12px",
                  }}
                  src="/img/Online/291Bible/2.webp"
                  alt="안내 2"
                />
              </div>
              <div>
                <img loading="lazy" style={{
                    width: "100%",
                    display: "block",
                    borderRadius: "12px",
                  }}
                  src="/img/Online/291Bible/3.webp"
                  alt="안내 3"
                />
              </div>
              <div>
                <img loading="lazy" style={{
                    width: "100%",
                    display: "block",
                    borderRadius: "12px",
                  }}
                  src="/img/Online/291Bible/4.webp"
                  alt="안내 4"
                />
              </div>
            </CustomCarousel>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bible291;
