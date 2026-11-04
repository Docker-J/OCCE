import ChildCareOutlinedIcon from "@mui/icons-material/ChildCareOutlined";

const seniorPastor = {
  name: "진성인 목사",
  position: "담임 목사",
  image: "/img/About/Servers/ChinSeongIn.webp",
  message:
    "진리의 말씀 위에 굳건히 서서 온 맘 다해 하나님을 예배하고, 온 힘 다해 이웃을 섬기는 건강한 믿음의 공동체로 성도님들과 함께 걸어가기를 소망합니다.",
  current: "에드먼턴 온 교회 담임",
  education: [
    "장로회신학대학원 목회학석사 (M.Div, 대한예수교장로회 통합)",
    "장로회신학대학교 기독교교육과 (B.A, 대한예수교장로회 통합)",
  ],
  experience: [
    "에드몬톤 한인장로교회 담임 (캐나다장로교 한카서부노회)",
    "나나이모 한인장로교회 담임 (캐나다장로교 한카서부노회)",
    "칠레 영락교회 부목사 (해외한인장로회 중남미노회)",
    "제주 중문교회 부목사 (대한예수교장로회 통합 제주노회)",
    "괌 동서장로교회 부목사 (대한예수교장로회 통합 단기 선교사)",
  ],
};

const associateMinisters = [
  {
    name: "김휘경 목사",
    position: "중고등부 · 청년부 · 찬양",
    image: "/img/About/Servers/KimHwikyung.webp",
  },
  {
    name: "이수연 전도사",
    position: "유초등부",
    image: "/img/About/Servers/LeeSooyeon.webp",
  },
  {
    name: "김태영 목사",
    position: "행정",
    image: "/img/About/Servers/KimTaeyoung.webp",
  },
  {
    name: "유아유치부",
    position: "다음세대 유아유치부 섬김",
    image: null,
    isDept: true,
  },
];

const Section4 = () => {
  return (
    <section className="aboutSection aboutSectionAlt" id="ministers">
      <span id="servers" className="aboutAnchor" aria-hidden="true" />
      <span id="section4" className="aboutAnchor" aria-hidden="true" />

      <div className="aboutSectionContainer">
        <header className="aboutSectionHeader">
          <span className="aboutSectionBadge">Ministers & Servants</span>
          <h2 className="aboutSectionTitle">섬기는 사람들</h2>
          <p className="aboutSectionSubtitle">
            기도와 말씀으로 교회를 섬기며 성도님들의 영적 여정에 함께하는 목회진입니다.
          </p>
        </header>

        <div className="ministersContainer">
          {/* Senior Pastor Feature Card */}
          <article className="seniorPastorCard">
            <div className="pastorImageWrapper">
              <img
                src={seniorPastor.image}
                alt={seniorPastor.name}
                className="pastorImage"
                loading="lazy"
              />
            </div>

            <div className="pastorInfoWrapper">
              <span className="pastorRoleBadge">{seniorPastor.position}</span>
              <h3 className="pastorName">{seniorPastor.name}</h3>
              <p className="pastorGreeting">"{seniorPastor.message}"</p>

              <div className="pastorDetailsList">
                <div className="pastorDetailRow">
                  <span className="pastorDetailTag">현직</span>
                  <span className="pastorDetailContent">{seniorPastor.current}</span>
                </div>

                <div className="pastorDetailRow">
                  <span className="pastorDetailTag">학력</span>
                  <span className="pastorDetailContent">
                    {seniorPastor.education.join(" / ")}
                  </span>
                </div>

                <div className="pastorDetailRow">
                  <span className="pastorDetailTag">주요이력</span>
                  <span className="pastorDetailContent">
                    {seniorPastor.experience.join(" · ")}
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* Associate Ministers Grid */}
          <div className="pastoralStaffGrid">
            {associateMinisters.map((staff) => (
              <article key={staff.name} className="staffCard">
                <div className="staffImageWrapper">
                  {staff.image ? (
                    <img
                      src={staff.image}
                      alt={staff.name}
                      className="staffImage"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "var(--about-gold-bg)",
                        color: "var(--about-gold)",
                      }}
                    >
                      <ChildCareOutlinedIcon sx={{ fontSize: "3rem" }} />
                    </div>
                  )}
                </div>
                <h4 className="staffName">{staff.name}</h4>
                <p className="staffPosition">{staff.position}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section4;
