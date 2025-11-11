import { use } from "react";
import { ModalsDispatchContext } from "./ModalsContext";

export default function useModals() {
  const { open, close } = use(ModalsDispatchContext);

  const openModal = (Component, props) => {
    open(Component, props);
  };
  const closeModal = (Component) => {
    close(Component);
  };

  return { openModal, closeModal };
}
