// Modals.js
import { use } from "react";
import { ModalsDispatchContext, ModalsStateContext } from "./ModalsContext";

const Modals = () => {
  const openedModal = use(ModalsStateContext);
  const { close } = use(ModalsDispatchContext);

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
