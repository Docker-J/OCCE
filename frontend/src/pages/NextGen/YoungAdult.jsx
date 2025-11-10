import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import InfoCard from "../../components/NextGen/InfoCard";

const titleBackground = {
  backgroundImage: 'url("/img/NextGen/YoungAdult/YoungAdults.webp")',
  backgroundPositionY: "60%",
};

const imgs = [{ src: "/img/NextGen/YoungAdult/1.webp" }];

const ministries = [
  { title: "예배 Worship", content: ["주일예배", "주중예배"] },
  {
    title: "교육 Teaching",
    content: ["입교/세례 교육", "성경공부", "제자훈련", "기도회", "수련회"],
  },
  {
    title: "교제 Fellowship",
    content: ["정원모임", "친교(식사, 활동)", "지역 청년들과의 교류/연합"],
  },
  {
    title: "봉사 Serving",
    content: ["교회사역", "봉사", "지역사회 봉사/구제"],
  },
  { title: "전도 Preaching", content: ["선교지 후원", "단기선교 참여"] },
];

const YoungAdult = () => {
  return (
    <>
      <title>청년부 - OCCE</title>

      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            온마음 청년부
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ color: "white" }}>
            Heart ON God YOUNG ADULTS
          </Typography>

          <br />
          <Typography variant="body1" sx={{ color: "white" }}>
            하늘에 있는 것에 마음을 두십시오.
            <br />
            Set your hearts on things above.
            <br />- 골로새서 Colossians 3:1b -
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <InfoCard
              age=""
              time="주일 오후 4시"
              place="Youth Room"
              ask="김휘경 전도사"
              imgs={imgs}
            />
          </div>

          <br />
          <Typography sx={{ fontSize: "1.1em", color: "black" }}>
            <Typography component="span" fontWeight="bold" fontSize="1.5em">
              온교회 청년부
            </Typography>
            는 예수 그리스도의 이름으로 모여, 하나님의 성령으로 한 마음을 품고,
            하나님과 이웃에 대한 사랑이 점점 커져가며, 그 사랑으로 세상에서
            하나님 나라의 공의와 정의를 이뤄가는 청년 공동체를 세워갑니다.
            <br />
            <br />
            주제 말씀: 에스겔 Ezekiel 11:19-20 <br />
            내가 그들에게 한 마음을 주고 그 속에 새 영을 주며 그 몸에서 돌 같은
            마음을 제거하고 살처럼 부드러운 마음을 주어 내 율례를 따르며 내
            규례를 지켜 행하게 하리니 그들은 내 백성이 되고 나는 그들의 하나님이
            되리라 <br />I will give them an undivided heart and put a new
            spirit in them; I will remove from them their heart of stone and
            give them a heart of flesh. Then they will follow my decrees and be
            careful to keep my laws. They will be my people, and I will be their
            God.
            <br />
            <br />
          </Typography>

          <Typography variant="h6" fontWeight={500}>
            모임 및 사역 안내
          </Typography>

          <div
            style={{
              width: "100%",
              display: "flex",
              overflowX: "scroll",
            }}
          >
            {ministries.map((ministry) => (
              <Card
                key={ministry.title}
                elevation={5}
                sx={{
                  minWidth: "320px",
                  m: "12px",
                  ml: 1,
                  borderRadius: "1em",
                }}
              >
                <CardContent>
                  <CardHeader title={ministry.title} />
                  {ministry.content.map((item) => (
                    <Typography key={item}>{item}</Typography>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default YoungAdult;
