/**
 * @file SmallGroupReportContext.jsx
 * @description 정원 보고서 상태 및 액션을 공유하기 위한 React 19 Context Provider
 */

import { createContext, use, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import useModals from "../../util/useModal";
import { useConfirm } from "../../common/ConfirmProvider";
import { useSmallGroupReport } from "./hooks/useSmallGroupReport";

export const SmallGroupReportContext = createContext(null);

export const useSmallGroupReportContext = () => use(SmallGroupReportContext);

export const SmallGroupReportProvider = ({ children }) => {
  const { openModal } = useModals();
  const confirm = useConfirm();
  const { state, actions } = useSmallGroupReport();

  const { validateForm, handleConfirmSubmit } = actions;

  const handleSubmitWithConfirm = useCallback(async () => {
    if (validateForm && !validateForm()) return;
    if (
      await confirm({
        title: "보고서 제출",
        message: "작성하신 보고서를 제출하시겠습니까?",
        confirmText: "제출",
        cancelText: "취소",
      })
    ) {
      handleConfirmSubmit();
    }
  }, [validateForm, confirm, handleConfirmSubmit]);

  const handleLoginClick = useCallback(async () => {
    const { default: SignInModal } = await import(
      "../../components/User/SignInModal"
    );
    openModal(SignInModal, {});
  }, [openModal]);

  const contextValue = useMemo(
    () => ({
      state,
      actions: {
        ...actions,
        handleSubmitWithConfirm,
        handleLoginClick,
      },
    }),
    [state, actions, handleSubmitWithConfirm, handleLoginClick]
  );

  return (
    <SmallGroupReportContext value={contextValue}>
      {children}
    </SmallGroupReportContext>
  );
};

SmallGroupReportProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
