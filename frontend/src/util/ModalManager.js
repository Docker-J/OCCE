import { useDispatch, useSelector } from "react-redux";
import { selectModal } from "../store/modalSlice";

import { MODAL_TYPES } from "../constant/MODAL_TYPES";
import SignInModal from "../components/User/SignInModal";
import SignUpModal from "../components/User/SignUpModal";
import AnnouncementPostModal from "../components/News/Announcement/AnnouncementPostModal";
import BulletinUploadModal from "./../components/News/WeeklyUpdate/BulletinUploadModal";

const MODAL_COMPONENTS = [
  {
    type: MODAL_TYPES.SignInModal,
    component: <SignInModal />,
  },
  {
    type: MODAL_TYPES.SignUpModal,
    component: <SignUpModal />,
  },
  {
    type: MODAL_TYPES.AnnouncementPostModal,
    component: <AnnouncementPostModal />,
  },
  {
    type: MODAL_TYPES.WeeklyUpdatePostModal,
    component: <BulletinUploadModal />,
  },
];

const ModalManager = () => {
  const { modalType, isOpen } = useSelector(selectModal);
  //   const dispatch = useDispatch();
  if (!isOpen) return;

  const findModal = MODAL_COMPONENTS.find((modal) => {
    return modal.type === modalType;
  });

  const renderModal = () => {
    return findModal.component;
  };

  return renderModal();
};

export default ModalManager;
