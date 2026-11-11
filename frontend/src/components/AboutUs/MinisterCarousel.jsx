import { useState } from "react";
import { MinistersList } from "./MinistersList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "./MinisterCarousel.css";

const MinisterCarousel = () => {
  const [showSeniorDetails, setShowSeniorDetails] = useState(false);

  // Find senior pastor and associate ministry team
  const seniorPastor = MinistersList.find((m) => m.position?.includes("담임"));
  const associateMinisters = MinistersList.filter(
    (m) => m !== seniorPastor && m.title?.trim()
  );

  return (
    <div className="about-ministers-container">
      {/* 1. Senior Pastor Feature Card */}
      {seniorPastor && (
        <article className="about-senior-card">
          <div className="about-senior-media">
            <img
              src={seniorPastor.image}
              alt={`${seniorPastor.title} ${seniorPastor.position}`}
              className="about-senior-img"
              loading="lazy"
            />
          </div>

          <div className="about-senior-body">
            <div className="about-senior-header">
              <span className="about-role-badge">{seniorPastor.position}</span>
              <h3 className="about-senior-name">{seniorPastor.title}</h3>
            </div>

            <p className="about-senior-intro">
              하나님의 변함없는 옛 진리(Old Truth) 위에 굳게 서서, 이 시대 가운데 주시는 새로운 부르심(New Calling)을 향해
              온 성도와 함께 온 맘과 힘을 다해 사랑하며 걸어갑니다.
            </p>

            {seniorPastor.details && (
              <div className="about-senior-history-section">
                <button
                  type="button"
                  className="about-senior-history-toggle"
                  onClick={() => setShowSeniorDetails((prev) => !prev)}
                  aria-expanded={showSeniorDetails}
                >
                  <span>{showSeniorDetails ? "목회 이력 및 학력 닫기" : "목회 이력 및 학력 보기"}</span>
                  {showSeniorDetails ? (
                    <ExpandLessIcon fontSize="small" />
                  ) : (
                    <ExpandMoreIcon fontSize="small" />
                  )}
                </button>

                {showSeniorDetails && (
                  <div className="about-senior-history-content">
                    {Object.entries(seniorPastor.details).map(([sectionTitle, entries]) => (
                      <div key={sectionTitle} className="about-history-group">
                        <span className="about-history-label">{sectionTitle}</span>
                        <ul className="about-history-list">
                          {Object.entries(entries).map(([mainText, subText]) => (
                            <li key={mainText} className="about-history-item">
                              <span className="about-history-main">{mainText}</span>
                              {subText && <span className="about-history-sub">{subText}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </article>
      )}

      {/* 2. Associate Ministry Team Grid */}
      <div className="about-associates-grid">
        {associateMinisters.map((minister) => (
          <article key={minister.title} className="about-associate-card">
            <div className="about-associate-media">
              <img
                src={minister.image}
                alt={`${minister.title} ${minister.position}`}
                className="about-associate-img"
                loading="lazy"
              />
            </div>
            <div className="about-associate-body">
              <span className="about-role-badge">{minister.position}</span>
              <h4 className="about-associate-name">{minister.title}</h4>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MinisterCarousel;
