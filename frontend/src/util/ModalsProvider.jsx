import { useState } from "react";
import { ModalsStateContext, ModalsDispatchContext } from "./ModalsContext";

const ModalsProvider = ({ children }) => {
  const [openedModals, setOpenedModals] = useState([]);
  const open = (Component, props) => {
    setOpenedModals((modals) => {
      const modalIndex = modals.findIndex(
        (modal) => modal.Component === Component
      );
      if (modalIndex !== -1) {
        modals[modalIndex].isOpen = true;
        modals[modalIndex].props = props;
        return [...modals];
      }
      return [...modals, { Component, props, isOpen: true }];
    });
  };

  const close = (Component) => {
    setOpenedModals((modals) => {
      return modals.map((modal) =>
        modal.Component === Component ? { ...modal, isOpen: false } : modal
      );
    });
  };

  const dispatch = { open, close };

  return (
    <ModalsDispatchContext value={dispatch}>
      <ModalsStateContext value={openedModals}>
        {children}
      </ModalsStateContext>
    </ModalsDispatchContext>
  );
};

export default ModalsProvider;
