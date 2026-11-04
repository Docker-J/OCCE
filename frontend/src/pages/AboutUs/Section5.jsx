import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ChurchOutlinedIcon from "@mui/icons-material/ChurchOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

const scheduleCategories = [
  {
    title: "정기 예배 & 말씀 묵상",
    icon: ChurchOutlinedIcon,
    items: [
      { name: "주일예배", time: "오후 2시 30분", place: "본당" },
      { name: "새벽 QT", time: "월-토요일 오전 6시", place: "교회 Youtube 채널" },
    ],
  },
  {
    title: "특별 기도회 & 중보기도",
    icon: AutoAwesomeOutlinedIcon,
    items: [
      { name: "신년 특별 새벽기도회", time: "1월 첫주 월-토", place: "본당" },
      { name: "하반기 특별 새벽기도회", time: "8월 마지막 주 월-토", place: "본당" },
      { name: "중보기도 모임", time: "주일 오후 1:50, 월 오전 10시", place: "문의: 주미옥 장로" },
    ],
  },
  {
    title: "다음세대 주일활동",
    icon: SchoolOutlinedIcon,
    items: [
      { name: "유아유치부", time: "주일 오후 4시", place: "Preschool Room" },
      { name: "유초등부", time: "주일 오후 4시", place: "Sunday School Room" },
      { name: "중고등부", time: "주일 오후 4시", place: "Fireside Room" },
    ],
  },
  {
    title: "청년부 모임",
    icon: GroupsOutlinedIcon,
    items: [
      { name: "청년부 예배", time: "첫째 토요일 오후 5시", place: "본당" },
      { name: "청년부 정원 모임", time: "둘째, 넷째 주일 오후 4시", place: "Youth Room, 본당" },
      { name: "청년부 연합 정원 모임", time: "셋째 금요일 오후 6시", place: "문의: 부장 집사" },
    ],
  },
];

const Section5 = () => {
  return (
    <section className="aboutSection" id="worship">
      <span id="aboutus" className="aboutAnchor" aria-hidden="true" />
      <span id="time" className="aboutAnchor" aria-hidden="true" />
      <span id="section5" className="aboutAnchor" aria-hidden="true" />

      <div className="aboutSectionContainer">
        <header className="aboutSectionHeader">
          <span className="aboutSectionBadge">Worship & Gatherings</span>
          <h2 className="aboutSectionTitle">예배 및 모임 안내</h2>
          <p className="aboutSectionSubtitle">
            하나님을 기쁨으로 높이고 성도 간의 따뜻한 위로와 교제를 나누는 은혜의 자리에 초대합니다.
          </p>
        </header>

        <div className="worshipContainer">
          {/* Sunday Worship Feature Card */}
          <article className="sundayHeroCard">
            <div className="sundayHeroTop">
              <div>
                <span className="sundayHeroBadge">
                  <ChurchOutlinedIcon sx={{ fontSize: "1.1rem" }} />
                  Sunday Worship Service
                </span>
                <h3 className="sundayHeroTitle">주일예배 안내</h3>
              </div>

              <a
                href="https://goo.gl/maps/gqpiA88gJSvbjfDD9"
                target="_blank"
                rel="noopener noreferrer"
                className="sundayMapBtn"
              >
                본당 위치 확인 (Google 지도)
                <OpenInNewOutlinedIcon sx={{ fontSize: "1.1rem" }} />
              </a>
            </div>

            <div className="sundayHeroDetails">
              <div className="sundayDetailItem">
                <AccessTimeOutlinedIcon className="sundayDetailIcon" />
                <div>
                  <div className="sundayDetailLabel">예배 시간</div>
                  <div className="sundayDetailValue">매주일 오후 2시 30분</div>
                </div>
              </div>

              <div className="sundayDetailItem">
                <PlaceOutlinedIcon className="sundayDetailIcon" />
                <div>
                  <div className="sundayDetailLabel">예배 장소</div>
                  <div className="sundayDetailValue">Robertson-Wesley United Church 본당</div>
                  <div className="sundayDetailSub">10412 100 Ave NW, Edmonton, AB T5J 0N8</div>
                </div>
              </div>
            </div>
          </article>

          {/* Categorized Gatherings Schedule Grid */}
          <div className="scheduleCategoriesGrid">
            {scheduleCategories.map((category) => {
              const IconComp = category.icon;
              return (
                <article key={category.title} className="scheduleCategoryCard">
                  <div className="scheduleCategoryHeader">
                    <IconComp className="scheduleCategoryIcon" />
                    <h4 className="scheduleCategoryTitle">{category.title}</h4>
                  </div>

                  <div className="scheduleItemList">
                    {category.items.map((item) => (
                      <div key={item.name} className="scheduleItem">
                        <span className="scheduleItemName">{item.name}</span>
                        <div className="scheduleItemMeta">
                          <span className="scheduleItemTime">{item.time}</span>
                          <span className="scheduleItemPlace">{item.place}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section5;
