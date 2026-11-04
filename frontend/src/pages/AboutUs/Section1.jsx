import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";

const Section1 = () => {
  return (
    <section className="aboutSection" id="beginning">
      <span id="start" className="aboutAnchor" aria-hidden="true" />
      <span id="story" className="aboutAnchor" aria-hidden="true" />

      <div className="aboutSectionContainer">
        <header className="aboutSectionHeader">
          <span className="aboutSectionBadge">Our Beginning</span>
          <h2 className="aboutSectionTitle">첫걸음과 신앙 고백</h2>
          <p className="aboutSectionSubtitle">
            2022년 4월 3일, 진리의 말씀 위에 바로 서기 위해 내딛은 에드먼턴 온 교회의 시작입니다.
          </p>
        </header>

        <article className="beginningCard">
          <div className="beginningHighlightBox">
            <p className="beginningHighlightText">
              "에드먼턴 온 교회는 2022년 4월 3일, 교회의 세속화에 따른 위기와 포스트 코로나라는 시대의 도전 가운데
              하나님이 디자인하고 부르신 뜻대로 새롭게 태어난 교회 공동체입니다."
            </p>
          </div>

          <p className="beginningBodyText">
            Presbyterian Church in Canada 캐나다 장로교(이하 PCC)에 속했던 공동체였으나, 2021년 교단이
            결혼의 정의에 대하여 "두 사람 간의 결합(즉, 동성 간의 결혼)"을 인정하고 "성소수자"의 목사(teaching elders)
            및 장로(ruling elders) 안수를 허용하는 것으로 PCC 교단의 헌법과 교리를 수정함에 따라, 세상의 가치와
            타협하여 세속화 되어가는 교회에 대한 애통함과, 진리의 말씀으로 그리스도의 몸 된 공동체를 지키고
            세워가고자 하는 소망함으로 PCC 교단을 떠나 새롭게 시작한 공동체입니다.
          </p>

          <p className="beginningBodyText">
            에드먼턴 온 교회는 현재 소속된 교단은 없지만, 성령의 인도하심 가운데 향후 공동체가 복음 위에 바로 서며,
            예수 그리스도의 복음으로 영혼을 구원하고 하나님 나라의 사랑과 공의를 함께 이뤄갈 수 있는 건강한
            교단으로의 가입을 위해 기도하며 준비 중에 있습니다.
          </p>

          <div className="beginningPillars">
            <div className="beginningPillarItem">
              <CalendarTodayOutlinedIcon className="beginningPillarIcon" />
              <div>
                <div className="beginningPillarLabel">창립일</div>
                <div className="beginningPillarValue">2022년 4월 3일</div>
              </div>
            </div>

            <div className="beginningPillarItem">
              <MenuBookOutlinedIcon className="beginningPillarIcon" />
              <div>
                <div className="beginningPillarLabel">신앙의 기초</div>
                <div className="beginningPillarValue">오직 성경과 진리의 말씀</div>
              </div>
            </div>

            <div className="beginningPillarItem">
              <VolunteerActivismOutlinedIcon className="beginningPillarIcon" />
              <div>
                <div className="beginningPillarLabel">부르심의 목적</div>
                <div className="beginningPillarValue">복음으로 영혼 구원과 섬김</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Section1;
