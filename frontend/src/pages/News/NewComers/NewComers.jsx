import { Typography, Box, Card } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import NewComersTimeline from "./NewComersTimeline";

const titleBackground = {
  backgroundImage: 'url("/img/NewComers/NewComers.webp")',
};

const NewComers = () => {
  return (
    <>
      <title>새가족 - OCCE</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              textAlign: "center",
              letterSpacing: "0.4em",
              pl: "0.4em",
              color: "white",
            }}
          >
            새가족
          </Typography>
        </div>
      </div>
      <Box sx={{ backgroundColor: "#fafafa", pb: 12, pt: { xs: 6, md: 10 } }}>
        <Box
          sx={{ maxWidth: "1200px", margin: "0 auto", px: { xs: 3, md: 4 } }}
        >
          <Card
            sx={{
              borderRadius: "24px",
              p: { xs: 3, md: 6 },
              boxShadow: "0 12px 40px rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.05)",
              mb: 8,
              background: "linear-gradient(135deg, #ffffff 0%, #fff9f5 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative background circle */}
            <Box
              sx={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,204,188,0.4) 0%, rgba(255,255,255,0) 70%)",
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "#2b2b2b",
                  mb: 4,
                  letterSpacing: "-0.5px",
                }}
              >
                <span style={{ color: "#ff7043" }}>온교회</span>에 오신 여러분을
                환영합니다!
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#555",
                  lineHeight: 1.9,
                  wordBreak: "keep-all",
                  fontSize: "1.05rem",
                  mb: 3,
                }}
              >
                교회에 처음 오신 분들과 개인 사정으로 이주해 오신 분들, 신앙의
                회복을 위해 새로이 나아 오신 분들 모두를 환영합니다. 새 공동체의
                울타리 안에서 새로운 시작을 하시는 모든 분들을{" "}
                <strong style={{ color: "#2b2b2b" }}>'새가족'</strong>으로
                지칭하며 환영합니다.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#555",
                  lineHeight: 1.9,
                  wordBreak: "keep-all",
                  fontSize: "1.05rem",
                  mb: 4,
                }}
              >
                온 맘을 다해 하나님을 사랑하고 온 힘을 다해 이웃을 사랑하는
                공동체의 구성원으로 함께 세워져 가길 소원합니다. 에드먼턴 온
                공동체의 가족이 되심을 기쁨으로 환영합니다.
              </Typography>

              <Box
                sx={{
                  p: 2.5,
                  backgroundColor: "#fff3e0",
                  borderRadius: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  mb: 6,
                }}
              >
                <InfoOutlinedIcon sx={{ color: "#ed6c02", mr: 1.5 }} />
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#e65100",
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                  }}
                >
                  아래와 같은 과정을 통해 온 공동체의 가족으로 함께 하게 됩니다.
                </Typography>
              </Box>

              {/* Nested Timeline */}
              <Box
                sx={{
                  borderTop: "1px dashed rgba(255, 112, 67, 0.3)",
                  pt: 6,
                  mt: 2,
                  position: "relative",
                }}
              >
                <NewComersTimeline />
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default NewComers;
