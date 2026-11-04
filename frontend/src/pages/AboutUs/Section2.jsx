const callings = [
  {
    index: "01",
    keyword: "Community & Field",
    title: "에드먼턴",
    subtitle: "Edmonton, Community",
    meaning: "우리의 삶의 자리",
    mission: "우리를 심으신 이 땅에 대한 사랑과 섬김, 기도와 복음 전파를 잊지 말라는 하나님의 부르심",
  },
  {
    index: "02",
    keyword: "Wholehearted",
    title: "온",
    subtitle: "All, Whole",
    meaning: "온 우리말의 '모든(All)'이라는 의미를 담고 있다.",
    mission: "온 마음을 다해 하나님을 사랑하고 온 힘을 다해 이웃을 사랑하라는 부르심",
  },
  {
    index: "03",
    keyword: "Truth & Generation",
    title: "ON",
    subtitle: "Old & New",
    meaning: "Old & New 의 약자",
    mission: "예부터 주신 진리의 말씀인 성경을 따라, 새로운 시대에 주어진 사명을 삶의 자리에서 살아내고 그리스도의 복음을 증언하라는 부르심",
  },
  {
    index: "04",
    keyword: "People & Gathering",
    title: "교회",
    subtitle: "Ecclesia",
    meaning: "건물이 아니라 사람, 회중",
    mission: "하나님이 택하고 부르신 사람들이 하나의 신앙 고백과 사명 가운데 응답하며 합력하라는 부르심",
  },
];

const Section2 = () => {
  return (
    <section className="aboutSection aboutSectionAlt" id="calling">
      <span id="name" className="aboutAnchor" aria-hidden="true" />
      <span id="edmonton" className="aboutAnchor" aria-hidden="true" />
      <span id="all" className="aboutAnchor" aria-hidden="true" />
      <span id="on" className="aboutAnchor" aria-hidden="true" />
      <span id="building" className="aboutAnchor" aria-hidden="true" />

      <div className="aboutSectionContainer">
        <header className="aboutSectionHeader">
          <span className="aboutSectionBadge">Name & Calling</span>
          <h2 className="aboutSectionTitle">이름, 부르심과 사명</h2>
          <p className="aboutSectionSubtitle">
            '에드먼턴 온 교회'의 모든 이름 속에는 하나님께서 공동체에 맡기신 거룩한 약속과 사명이 담겨 있습니다.
          </p>
        </header>

        <div className="callingGrid">
          {callings.map((item) => (
            <article key={item.index} className="callingCard">
              <div className="callingCardTop">
                <span className="callingIndexBadge">{item.index}</span>
                <span className="callingKeywordBadge">{item.keyword}</span>
              </div>

              <h3 className="callingCardTitle">
                {item.title}{" "}
                <small style={{ fontSize: "0.6em", fontWeight: 600, color: "var(--about-text-muted)" }}>
                  ({item.subtitle})
                </small>
              </h3>

              <div className="callingBlock">
                <span className="callingLabel">의미</span>
                <p className="callingText">{item.meaning}</p>
              </div>

              <div className="callingBlock">
                <span className="callingLabel">사명</span>
                <p className="callingText">{item.mission}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section2;
