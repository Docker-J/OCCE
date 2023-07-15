import { List, ListItem, Typography } from "@mui/material";
import "../NextGen/NextGen.css";
import { Link } from "react-router-dom";

const Ministry = () => {
  return (
    <>
      <h1>사역</h1>

      <div className="container">
        <Typography variant="h5" fontWeight={800}>
          정원 순환 사역
        </Typography>
        <Typography sx={{ fontSize: "1.1em" }}>
          주일 안내팀과 친교팀은 각 팀 staff의 안내에 따라 매달 순서를 맡은
          소그룹 <Link to="/community/smallgroup">'정원' </Link>이 순환하여
          섬깁니다.
        </Typography>
        <br />
        <Typography variant="h5" fontWeight={800}>
          온 교회 사역 지원
        </Typography>
        <Typography sx={{ fontSize: "1.1em" }}>
          교회에 필요한 사역 지원을 수시로 받고 있습니다. 허락하신 달란트대로
          주의 몸 된 교회를 함께 세우고, 온 맘과 온 힘을 다해 하나님과 이웃을
          사랑하는 공동체가 되길 소망합니다. 아래의 사역 분야를 참고해 주시고,
          온라인 링크를 통하여 지원해 주시면 감사하겠습니다. <br />
          {/* 교육부서 Staff -유아유치부 -유초등부 -중고등부 중보기도팀 찬양팀
          -찬양인도 -보컬 -피아노 -키보드 -통기타 -일렉기타 -베이스기타 -드럼
          -바이올린 -플룻 -others 미디어팀 -사운드믹서 운용 -PPT/조명/비디오믹서
          운용 -PPT 제작 -사진/비디오 촬영 -동영상 제작 -포스터 제작 및 각종
          디자인 */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              flex: 1,
            }}
          >
            <List>
              <ListItem>교육부서</ListItem>
              <List>
                <ListItem>유아유치부</ListItem>
                <ListItem>유초등부</ListItem>
                <ListItem>중고등부</ListItem>
              </List>
            </List>
            <List>
              <ListItem>찬양팀</ListItem>
              <List>
                <ListItem>찬양인도 보컬</ListItem>
                <ListItem>피아노 키보드</ListItem>
                <ListItem>통기타 일렉기타</ListItem>
                <ListItem>베이스기타 드럼</ListItem>
                <ListItem>바이올린 플룻</ListItem>
                <ListItem>Others</ListItem>
              </List>
            </List>
            <List>
              <ListItem>미디어팀</ListItem>
              <List>
                <ListItem>사운드믹서 운용</ListItem>
                <ListItem>PPT/조명/비디오믹서 운용</ListItem>
                <ListItem>PPT 제작</ListItem>
                <ListItem>사진/비디오 촬영</ListItem>
                <ListItem>동영상 제작</ListItem>
                <ListItem>포스터 제작 및 각종 디자인</ListItem>
              </List>
            </List>
            <List>
              <ListItem>중보기도팀</ListItem>
            </List>
          </div>
          <br />
          <a target="__blank" href="https://forms.gle/5kGFLfA5fhfotVTW6">
            온라인 사역 지원 링크 바로가기
          </a>
        </Typography>
      </div>
    </>
  );
};

export default Ministry;
