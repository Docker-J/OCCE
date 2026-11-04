const navItems = [
  { id: "beginning", label: "첫걸음과 고백" },
  { id: "calling", label: "이름과 사명" },
  { id: "direction", label: "공동체의 발걸음" },
  { id: "ministers", label: "섬기는 사람들" },
  { id: "worship", label: "예배 안내" },
  { id: "offering", label: "헌금 안내", isHighlight: true },
];

const AboutHero = ({ onScrollTo }) => {
  return (
    <>
      <header className="aboutHero">
        <div className="aboutHeroOverlay" />
        <div className="aboutHeroContent">
          <span className="aboutHeroBadge">Edmonton ON Community Church</span>
          <h1 className="aboutHeroTitle">에드먼턴 온 교회 이야기</h1>
          <p className="aboutHeroSubtitle">
            진리의 말씀 위에 굳건히 서서, 하나님을 온 맘 다해 사랑하고 이웃을 온 힘 다해 섬기는 믿음의 공동체입니다.
          </p>
        </div>
      </header>

      <nav className="aboutQuickNavContainer" aria-label="교회소개 바로가기 메뉴">
        <div className="aboutQuickNav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`aboutNavPill ${item.isHighlight ? "aboutNavPillHighlight" : ""}`}
              onClick={() => onScrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default AboutHero;
