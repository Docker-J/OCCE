import { useEffect } from "react";
import { Link } from "react-router";
import "./AboutUs.css";

import MinisterCarousel from "../../components/AboutUs/MinisterCarousel";
import { ServiceAndGatheringInfo } from "../../components/AboutUs/ServiceAndGatheringInfo";
import useSnackbar from "../../util/useSnackbar";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

const About = () => {
  const { openSnackbar } = useSnackbar();

  // Smooth scroll to hash anchor on mount or hash change
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const raw = hash.replace("#", "");
      let targetId = raw.split("/")[0];

      if (raw.includes("offering")) {
        targetId = "offering";
      } else if (raw.includes("time") || raw.includes("aboutus")) {
        targetId = "aboutus";
      }

      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const handleCopyEmail = (email) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(email);
      openSnackbar("success", `헌금 이메일(${email})이 복사되었습니다.`);
    }
  };

  return (
    <div className="about-page-root">
      <title>교회소개 - 에드먼튼 온 교회</title>

      {/* 1. Hero Section: 첫걸음 (#beginning) */}
      <section className="about-hero about-section" id="beginning">
        <div className="about-hero-content">
          <span className="about-hero-tag">2022.04.03 창립</span>
          <h1 className="about-hero-title">에드먼튼 온 교회의 첫걸음</h1>
          <p className="about-hero-subtitle">
            Based ON the OLD Truth, Moving ON to the NEW Calling
            <br />
            온 맘 다해 하나님을 사랑하고, 온 힘 다해 이웃을 사랑하는 교회
          </p>

          <div className="about-hero-callout">
            에드먼튼 온 교회는 2022년 4월 3일, 교회의 세속화에 따른 위기와 포스트 코로나라는 시대의 도전 가운데
            하나님이 디자인하고 부르신 뜻대로 새롭게 태어난 교회 공동체입니다.
            <br />
            <br />
            진리의 말씀으로 그리스도의 몸 된 교회를 온전히 지키고자 세상의 가치와 타협하지 않고,
            하나님 나라의 복음과 성령의 인도하심을 따라 건강한 신앙 공동체로 함께 든든히 서 가고 있습니다.
          </div>

          {/* Quick Jump Navigation */}
          <nav className="about-nav-pills" aria-label="교회소개 섹션 바로가기">
            <a href="#name" className="about-pill-btn">이름과 사명</a>
            <a href="#direction" className="about-pill-btn">공동체의 발걸음</a>
            <a href="#ministers" className="about-pill-btn">섬기는 사람들</a>
            <a href="#aboutus" className="about-pill-btn">예배 안내</a>
            <a href="#offering" className="about-pill-btn">헌금 안내</a>
          </nav>
        </div>
      </section>

      {/* 2. Section: 이름, 부르심과 사명 (#name) */}
      <section className="about-section" id="name">
        <div className="about-container">
          <header className="about-header-block">
            <h2 className="about-header-title">이름, 부르심과 사명</h2>
            <p className="about-header-desc">
              ‘에드먼튼 온 교회’ 이름 속에 담긴 하나님의 부르심과 우리의 존재 이유입니다.
            </p>
          </header>

          <div className="about-name-grid">
            <div className="about-name-card">
              <div className="about-name-tagline">
                <span className="about-name-key">에드먼튼</span>
                <span className="about-name-meaning">Edmonton, Community</span>
              </div>
              <div className="about-name-body">
                <strong>의미:</strong> 우리가 발 딛고 살아가는 삶의 자리
                <br />
                <strong>사명:</strong> 하나님께서 우리를 심으신 이 도시와 땅에 대한 사랑과 섬김,
                기도와 복음 전파의 사명을 결코 잊지 말라는 부르심입니다.
              </div>
            </div>

            <div className="about-name-card">
              <div className="about-name-tagline">
                <span className="about-name-key">온</span>
                <span className="about-name-meaning">All, Everything</span>
              </div>
              <div className="about-name-body">
                <strong>의미:</strong> 순우리말의 ‘모든(All)’, 온전함
                <br />
                <strong>사명:</strong> 온 마음을 다해 하나님을 사랑하고 온 힘을 다해 이웃을 사랑하라는
                주님의 가장 크고 첫째 되는 계명에 순종하는 부르심입니다.
              </div>
            </div>

            <div className="about-name-card">
              <div className="about-name-tagline">
                <span className="about-name-key">ON</span>
                <span className="about-name-meaning">Old &amp; New</span>
              </div>
              <div className="about-name-body">
                <strong>의미:</strong> 옛 진리(Old Truth)와 새로운 부르심(New Calling)
                <br />
                <strong>사명:</strong> 예부터 변함없이 주신 성경 진리의 말씀 위에 굳게 서서,
                이 시대에 주어진 새로운 사명을 삶의 자리에서 증언하라는 부르심입니다.
              </div>
            </div>

            <div className="about-name-card">
              <div className="about-name-tagline">
                <span className="about-name-key">교회</span>
                <span className="about-name-meaning">The People, Gathering</span>
              </div>
              <div className="about-name-body">
                <strong>의미:</strong> 건물이 아닌 사람, 성도들의 거룩한 모임
                <br />
                <strong>사명:</strong> 하나님이 택하고 부르신 구원받은 지체들이 하나의 신앙 고백과 사명 안에서
                서로 응답하며 아름답게 합력하라는 부르심입니다.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: 부르심에 따른 공동체의 발걸음 (#direction) */}
      <section className="about-section about-direction-section" id="direction">
        <div className="about-container about-direction-content">
          <header className="about-header-block">
            <h2 className="about-header-title">부르심에 따른 공동체의 발걸음</h2>
            <p className="about-header-desc">
              하나님 사랑과 이웃 사랑, 교회가 세상을 향해 걸어가는 두 가지 거룩한 축입니다.
            </p>
          </header>

          <div className="about-direction-grid">
            <div className="about-direction-card">
              <span className="about-direction-num">첫 번째 사명</span>
              <h3 className="about-direction-title">온 맘 다해 하나님 사랑</h3>
              <p className="about-direction-text">
                내가 주인 된 시대 속에서, 예배와 말씀을 통해 우리 삶의 창조자이며 참 주인 되시는
                성부 성자 성령 하나님의 사랑을 깊이 맛보고 나누며, 하나님을 향한 우리의 사랑을 온전히 올려드립니다.
                <br />
                <br />
                온 교회는 건물 성전에 모이는 것에만 머무르지 않고, 일상의 자리에서 하나님을 높이며
                그의 나라와 의를 구하는 참된 삶의 예배를 중요시합니다.
              </p>
            </div>

            <div className="about-direction-card">
              <span className="about-direction-num">두 번째 사명</span>
              <h3 className="about-direction-title">온 힘 다해 이웃 사랑</h3>
              <p className="about-direction-text">
                내가 중심 된 세상에서 하나님께 값없이 받은 은혜와 부르신 사명에 따라,
                공동체 안의 성도와 지역 사회의 이웃을 주의 말씀대로 겸손히 섬기고 사랑합니다.
                <br />
                <br />
                서로의 짐을 함께 지고 격려하며, 소외된 이들에게 그리스도의 따뜻한 손길과 복음의 빛을
                전하는 사랑의 통로로 살아가고자 힘씁니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: 섬기는 사람들 (#ministers) */}
      <section className="about-section" id="ministers">
        <div className="about-container">
          <header className="about-header-block">
            <h2 className="about-header-title">섬기는 사람들</h2>
            <p className="about-header-desc">
              에드먼튼 온 교회의 예배와 다음 세대, 공동체 사역을 위해 헌신하는 교역자들입니다.
            </p>
          </header>

          <div className="about-ministers-wrap">
            <MinisterCarousel />
          </div>
        </div>
      </section>

      {/* 5. Section: 예배 및 헌금 안내 (#aboutus, #offering) */}
      <section className="about-section" id="aboutus" style={{ backgroundColor: "var(--about-color-paper-warm)" }}>
        <div className="about-container">
          <header className="about-header-block">
            <h2 className="about-header-title">예배 및 헌금 안내</h2>
            <p className="about-header-desc">
              에드먼튼 온 교회의 정기 예배 시간과 온라인 및 현장 헌금 안내입니다.
            </p>
          </header>

          <div className="about-worship-wrap">
            {/* Worship & Gathering Info */}
            <div className="about-info-card">
              <h3 className="about-info-title">
                <AccessTimeIcon sx={{ color: "var(--about-color-primary)" }} />
                예배 및 모임 안내
              </h3>
              <div className="about-table-list">
                {ServiceAndGatheringInfo.map((service) => (
                  <div key={service.title} className="about-table-item">
                    <span className="about-table-name">{service.title}</span>
                    <div className="about-table-meta">
                      <span className="about-table-time">{service.time}</span>
                      <span className="about-table-place">{service.place}</span>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://goo.gl/maps/gqpiA88gJSvbjfDD9"
                target="_blank"
                rel="noopener noreferrer"
                className="about-location-btn"
              >
                <PlaceIcon fontSize="small" />
                주일예배 장소 안내 (Google Maps)
              </a>
            </div>

            {/* Offering Info */}
            <div className="about-info-card" id="offering" style={{ scrollMarginTop: "90px" }}>
              <h3 className="about-info-title">
                <VolunteerActivismIcon sx={{ color: "var(--about-color-primary)" }} />
                헌금 안내
              </h3>

              <div className="about-offering-box">
                <strong style={{ fontSize: "1.05rem", color: "var(--about-color-ink)" }}>
                  온라인 E-Transfer 헌금
                </strong>
                <div className="about-copy-row">
                  <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--about-color-ink)" }}>
                    occeoffer@gmail.com
                  </span>
                  <button
                    type="button"
                    className="about-copy-btn"
                    onClick={() => handleCopyEmail("occeoffer@gmail.com")}
                    aria-label="E-Transfer 헌금 이메일 주소 복사"
                  >
                    복사
                  </button>
                </div>
                <div style={{ fontSize: "0.9rem", color: "var(--about-color-ink-muted)" }}>
                  비밀번호 설정 필요 시: <strong>occe0403</strong>
                </div>
              </div>

              <div className="about-offering-box">
                <strong style={{ fontSize: "1.05rem", color: "var(--about-color-ink)" }}>
                  Cheque 헌금
                </strong>
                <div style={{ fontSize: "0.95rem", color: "var(--about-color-ink)", lineHeight: 1.6 }}>
                  Pay To: <strong>OCCE</strong> 또는 <strong>ON Community Church of Edmonton</strong>
                </div>
              </div>

              <div style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "var(--about-color-ink-muted)" }}>
                안내: 현장 예배에서는 본당 입구에 준비된 헌금봉투를 사용하여 헌금함에 헌금해 주시기 바랍니다.
                헌금봉투 10개 묶음이 따로 비치되어 있으니 필요하신 분들은 자유롭게 가져가셔서 미리 기도로 준비해 주시기 바랍니다.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
