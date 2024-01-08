import { useSelector } from "react-redux";
import { selectModal } from "../store/modalSlice";

import { MODAL_TYPES } from "../constant/MODAL_TYPES";
import SignInModal from "../components/User/SignInModal";
import SignUpModal from "../components/User/SignUpModal";
import AnnouncementPostModal from "../components/News/Announcement/AnnouncementPostModal";
import WeeklyUpdatePostModal from "../components/News/WeeklyUpdate/WeeklyUpdatePostModal";
import MeditationONModal from "../components/Online/MeditationON/MeditationONModal";

const MODAL_COMPONENTS = {
  [MODAL_TYPES.SignInModal]: SignInModal,
  [MODAL_TYPES.SignUpModal]: SignUpModal,
  [MODAL_TYPES.AnnouncementPostModal]: AnnouncementPostModal,
  [MODAL_TYPES.WeeklyUpdatePostModal]: WeeklyUpdatePostModal,
  [MODAL_TYPES.MeditationONPostModal]: MeditationONModal,
};

const ModalManager = () => {
  const { modalType, props, isOpen } = useSelector(selectModal);
  console.log(props);
  if (!isOpen) return;

  const ModalComponent = MODAL_COMPONENTS[modalType];

  return <ModalComponent {...props} />;
};

export default ModalManager;
