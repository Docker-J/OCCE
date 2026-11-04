import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";

const Section3 = () => {
  return (
    <section className="aboutSection" id="direction">
      <span id="lovegod" className="aboutAnchor" aria-hidden="true" />
      <span id="loveneighbor" className="aboutAnchor" aria-hidden="true" />

      <div className="aboutSectionContainer">
        <header className="aboutSectionHeader">
          <span className="aboutSectionBadge">Two Pillars</span>
          <h2 className="aboutSectionTitle">부르심에 따른 공동체의 발걸음</h2>
          <p className="aboutSectionSubtitle">
            하나님을 향한 온전한 사랑과 이웃을 향한 따뜻한 섬김이라는 두 날개로 믿음의 삶을 걸어갑니다.
          </p>
        </header>

        <div className="pillarsGrid">
          <article className="pillarCard pillarCardGod">
            <div className="pillarCardTopAccent" />
            <div className="pillarBadge">
              <FavoriteBorderIcon sx={{ fontSize: "1rem" }} />
              First Pillar
            </div>
            <h3 className="pillarTitle">온 맘 다해 하나님 사랑</h3>
            <p className="pillarQuote">
              "모일 때 힘써 모여 예배하고, 일상의 자리에서 하나님을 높이는 삶의 예배"
            </p>
            <p className="pillarDescription">
              내가 주인 된 시대 속에서, 예배와 말씀을 통해 우리 삶의 창조자이며 참 주인 되시며 인도자이신 성부 성자
              성령 하나님의 사랑을 맛보고 나누며, 하나님을 향한 우리의 사랑을 온전히 올려드립니다.
              에드먼턴 온 교회는 교회 성전 중심으로 모이는 것만 중요시하는 공동체가 아니라, 모일 때 힘써 모여
              예배드리고 기도하지만 일상의 자리에서 하나님을 높이며 그의 나라와 의를 구하며 말씀대로 살아가는
              '삶의 예배'를 소중히 여기는 공동체입니다.
            </p>
          </article>

          <article className="pillarCard pillarCardNeighbor">
            <div className="pillarCardTopAccent" />
            <div className="pillarBadge">
              <HandshakeOutlinedIcon sx={{ fontSize: "1rem" }} />
              Second Pillar
            </div>
            <h3 className="pillarTitle">온 힘 다해 이웃 사랑</h3>
            <p className="pillarQuote">
              "받은 은혜와 사명에 따라, 세상과 이웃을 말씀대로 섬기는 믿음의 실천"
            </p>
            <p className="pillarDescription">
              내가 중심된 세상에서 하나님께 받은 은혜와 부르신 사명에 따라 공동체와 이웃을 말씀대로 사랑하고 섬기며
              살아갑니다. 말과 혀로만의 사랑에 머무르지 않고, 우리를 심으신 에드먼턴 지역 사회와 고단한 이웃들의 삶의
              자리에 그리스도의 따뜻한 손길과 복음의 빛을 비추며 겸손히 섬깁니다.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Section3;
