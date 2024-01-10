// Modals.js
import { useContext } from "react";
import { ModalsDispatchContext, ModalsStateContext } from "./ModalsContext";

const Modals = () => {
  const openedModal = useContext(ModalsStateContext);
  const { close } = useContext(ModalsDispatchContext);

  return openedModal.map((modal, index) => {
    const { Component, props, isOpen } = modal;
    const { onSubmit, ...restProps } = props;

    const onClose = () => {
      close(Component);
    };

    const handleSubmit = async () => {
      if (typeof onSubmit === "function") {
        await onSubmit();
      }
      onClose();
    };

    return (
      <Component
        key={index}
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
        {...restProps}
      />
    );
  });
};

export default Modals;
