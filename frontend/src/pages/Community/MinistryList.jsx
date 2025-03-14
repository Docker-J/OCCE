import SchoolIcon from "@mui/icons-material/School";
import PianoIcon from "@mui/icons-material/Piano";
import CameraIcon from "@mui/icons-material/Camera";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import HandshakeIcon from "@mui/icons-material/Handshake";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import ChurchIcon from "@mui/icons-material/Church";
import GroupsIcon from "@mui/icons-material/Groups";
import PaymentsIcon from "@mui/icons-material/Payments";
import FoldedHandsIcon from "./folded_hands.svg";
import RestaurantIcon from "@mui/icons-material/Restaurant";

export const MinistryList = [
  {
    title: "교육부서 Staff",
    icon: <SchoolIcon />,
    types: ["유아유치부", "유초등부", "중고등부", "청년부 섬김"],
  },
  {
    title: "찬양팀",
    icon: <PianoIcon />,
    types: [
      "찬양인도 보컬",
      "피아노 키보드",
      "통기타 일렉기타",
      "베이스기타 드럼",
      "바이올린 플룻",
      "Others",
    ],
  },
  {
    title: "미디어팀",
    icon: <CameraIcon />,
    types: [
      "사운드믹서 운용",
      "PPT/조명/비디오믹서 운용",
      "PPT 제작",
      "사진/비디오 촬영",
      "동영상 제작",
      "포스터 제작 및 각종 디자인",
    ],
  },
  {
    title: "관리팀",
    icon: <HomeRepairServiceIcon />,
    types: ["교회 물품 및 스토리지 관리"],
  },
  {
    title: "새가족/안내팀",
    icon: <HandshakeIcon />,
    types: [
      "방문등록카드 준비 및 작성 안내",
      "새가족 사진촬영 및 전달",
      "새가족 환영회",
      "출결 확인",
      "예배 후 교제 장소 안내",
    ],
  },
  {
    title: "선교팀",
    icon: <VolunteerActivismIcon />,
    types: ["단기 선교", "정원별 후원 선교 사역 지원"],
  },
  {
    title: "예배준비팀",
    icon: <ChurchIcon />,
    types: [
      "주일예배 준비",
      "헌금함 준비",
      "본당 좌석 안내",
      "성례(세례/성찬) 준비",
      "특별집회 준비",
      "외부강사 섬김",
      "주보 제작 및 디자인",
    ],
  },
  {
    title: "장년양육팀",
    icon: <GroupsIcon />,
    types: [
      "장년 수련회 준비",
      "장년 프로그램 등록 안내",
      "수료자 명단 관리",
      "자녀 돌봄 사역 지원",
    ],
  },
  {
    title: "재정팀",
    icon: <PaymentsIcon />,
    types: [
      "교회 재정 관련 모든 업무",
      "교회 렌탈 계약 및 보험",
      "헌금봉투 구입 및 관리",
    ],
  },
  {
    title: "중보기도팀",
    icon: <FoldedHandsIcon />,
    types: [
      "교회 공동체를 위한 중보기도",
      "주일 예배를 위한 중보기도",
      "기도 요청에 따른 중보기도",
    ],
  },
  {
    title: "교제팀",
    icon: <RestaurantIcon />,
    types: ["교회 내 각종 교제", "경조사 관련 사역"],
  },
];
