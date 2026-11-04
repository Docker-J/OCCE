import { useState, useEffect, useRef } from "react";

const navItems = [
  { id: "beginning", label: "첫걸음과 고백" },
  { id: "calling", label: "이름과 사명" },
  { id: "direction", label: "공동체의 발걸음" },
  { id: "ministers", label: "섬기는 사람들" },
  { id: "worship", label: "예배 안내" },
  { id: "offering", label: "헌금 안내" },
];

const AboutHero = ({ onScrollTo }) => {
  const [activeId, setActiveId] = useState("");
  const [appBarBottom, setAppBarBottom] = useState(89);
  const navContainerRef = useRef(null);
  const pillRefs = useRef({});

  // 1. Dynamically track the live bottom position of the floating AppBar across all screen sizes
  useEffect(() => {
    const updateAppBarBottom = () => {
      const appBar = document.querySelector(".MuiAppBar-root");
      if (appBar) {
        const rect = appBar.getBoundingClientRect();
        if (rect.height > 0) {
          const bottom = Math.round(rect.bottom);
          setAppBarBottom(bottom);
          document.documentElement.style.setProperty("--appbar-bottom", `${bottom}px`);
        }
      }
    };

    updateAppBarBottom();

    window.addEventListener("resize", updateAppBarBottom, { passive: true });
    window.addEventListener("scroll", updateAppBarBottom, { passive: true });

    let observer;
    const appBar = document.querySelector(".MuiAppBar-root");
    if (appBar && window.ResizeObserver) {
      observer = new ResizeObserver(updateAppBarBottom);
      observer.observe(appBar);
    }

    return () => {
      window.removeEventListener("resize", updateAppBarBottom);
      window.removeEventListener("scroll", updateAppBarBottom);
      if (observer) observer.disconnect();
    };
  }, []);

  // 2. Detect which section is currently active as user scrolls through the page
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollOffset = appBarBottom + 70;
          const scrollPos = window.scrollY + scrollOffset;

          for (let i = navItems.length - 1; i >= 0; i--) {
            const el = document.getElementById(navItems[i].id);
            if (el && el.offsetTop <= scrollPos) {
              setActiveId(navItems[i].id);
              ticking = false;
              return;
            }
          }
          setActiveId("");
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [appBarBottom]);

  // 3. Automatically scroll horizontal quick nav bar to keep active pill centered on narrow screens
  useEffect(() => {
    if (!activeId) return;
    const container = navContainerRef.current;
    const activePill = pillRefs.current[activeId];

    if (container && activePill) {
      if (container.scrollWidth > container.clientWidth) {
        const targetScrollLeft =
          activePill.offsetLeft - (container.clientWidth / 2) + (activePill.offsetWidth / 2);

        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: "smooth",
        });
      }
    }
  }, [activeId]);

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

      <nav
        className="aboutQuickNavContainer"
        style={{ top: `${appBarBottom}px` }}
        aria-label="교회소개 바로가기 메뉴"
      >
        <div className="aboutQuickNav" ref={navContainerRef}>
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => (pillRefs.current[item.id] = el)}
                type="button"
                className={`aboutNavPill ${isActive ? "aboutNavPillActive" : ""}`}
                onClick={() => onScrollTo(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default AboutHero;
