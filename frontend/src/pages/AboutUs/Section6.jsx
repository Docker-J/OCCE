import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import useSnackbar from "../../util/useSnackbar";

const Section6 = () => {
  const { openSnackbar } = useSnackbar();

  const handleCopy = async (text, label) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      openSnackbar("success", `${label}가 복사되었습니다.`);
    } catch {
      openSnackbar("error", "복사에 실패했습니다. 직접 복사해 주세요.");
    }
  };

  return (
    <section className="aboutSection aboutSectionAlt" id="offering">
      <span id="aboutus-offering" className="aboutAnchor" aria-hidden="true" />

      <div className="aboutSectionContainer">
        <header className="aboutSectionHeader">
          <span className="aboutSectionBadge">Offering & Giving</span>
          <h2 className="aboutSectionTitle">헌금 안내</h2>
          <p className="aboutSectionSubtitle">
            하나님께서 주신 은혜에 감사하며 기쁨과 정성으로 드리는 헌금 안내입니다.
          </p>
        </header>

        <div className="offeringGrid">
          {/* Card 1: E-Transfer */}
          <article className="offeringCard offeringCardEtransfer">
            <span className="offeringBadge">
              <VolunteerActivismOutlinedIcon sx={{ fontSize: "1rem" }} />
              온라인 E-Transfer
            </span>

            <h3 className="offeringCardTitle">온라인 E-Transfer 헌금</h3>

            <div className="offeringCopyField">
              <div>
                <div className="offeringFieldLabel">수취 이메일 주소</div>
                <div className="offeringFieldValue">occeoffer@gmail.com</div>
              </div>
              <button
                type="button"
                className="offeringCopyBtn"
                onClick={() => handleCopy("occeoffer@gmail.com", "이메일 주소")}
                aria-label="이메일 주소 복사"
              >
                <ContentCopyOutlinedIcon sx={{ fontSize: "1rem" }} />
                이메일 복사
              </button>
            </div>

            <div className="offeringCopyField">
              <div>
                <div className="offeringFieldLabel">보안 질문 비밀번호</div>
                <div className="offeringFieldValue">occe0403</div>
              </div>
              <button
                type="button"
                className="offeringCopyBtn"
                onClick={() => handleCopy("occe0403", "비밀번호")}
                aria-label="비밀번호 복사"
              >
                <ContentCopyOutlinedIcon sx={{ fontSize: "1rem" }} />
                비밀번호 복사
              </button>
            </div>

            <div className="offeringNoticeBox">
              <strong>💡 E-Transfer 송금 시 유의사항</strong>
              <p style={{ margin: "0.4rem 0 0 0" }}>
                메모(Message/Memo)란에 성도님의 <strong>실명과 헌금 종류</strong>(예:{" "}
                <code>홍길동 십일조</code>, <code>홍길동 감사</code>, <code>홍길동 선교</code>)를 꼭 적어주세요.
                기재해주신 정보는 연말 세금 공제 영수증(Donation Tax Receipt) 발급에 사용됩니다.
              </p>
            </div>
          </article>

          {/* Card 2: Cheque & In-person */}
          <article className="offeringCard offeringCardCheque">
            <span className="offeringBadge">
              <AccountBalanceOutlinedIcon sx={{ fontSize: "1rem" }} />
              Cheque & 현장 헌금
            </span>

            <h3 className="offeringCardTitle">수표 및 주일 현장 헌금</h3>

            <div className="offeringChequeInfo">
              <div className="offeringChequePayTo">
                <div className="offeringChequePayToLabel">Cheque 수취인 (Pay to the Order of)</div>
                <div className="offeringChequePayToValue">OCCE 또는 ON Community Church of Edmonton</div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: "var(--about-navy)", marginBottom: "0.35rem" }}>
                  <ReceiptLongOutlinedIcon sx={{ fontSize: "1.1rem", color: "var(--about-gold)" }} />
                  현장 헌금봉투 안내
                </div>
                <p style={{ margin: 0 }}>
                  현장에서는 준비된 봉투를 사용하여 본당 입구 헌금함에 헌금해 주시기 바랍니다.
                  성도님들의 편의를 위해 헌금봉투 10개를 한 묶음으로 따로 준비해 놓았으니, 필요하신 분들은 자유롭게
                  가져가셔서 가정에서 미리 기도로 헌금을 준비해 주시기 바랍니다.
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Closing Sanctuary Callout */}
        <aside className="sanctuaryCallout">
          <h3 className="sanctuaryCalloutTitle">에드먼턴 온 교회는 언제나 여러분을 환영합니다</h3>
          <p className="sanctuaryCalloutText">
            새롭게 교회를 찾으시거나 신앙에 대해 더 깊이 나누고 싶으신 분은 언제든 편안히 방문해 주세요.
            하나님의 사랑 안에서 여러분을 기쁨과 축복으로 맞이합니다.
          </p>

          <div className="sanctuaryCalloutBtns">
            <a
              href="https://goo.gl/maps/gqpiA88gJSvbjfDD9"
              target="_blank"
              rel="noopener noreferrer"
              className="sanctuaryBtnPrimary"
            >
              주일예배 오시는 길
              <OpenInNewOutlinedIcon sx={{ fontSize: "1.05rem" }} />
            </a>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfYN9EECPuQ0e4TrPfok4UhMH3zKnvjUckKwGfe3SkQM-0O-A/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="sanctuaryBtnSecondary"
            >
              온라인 교인 등록하기
              <OpenInNewOutlinedIcon sx={{ fontSize: "1.05rem" }} />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Section6;
