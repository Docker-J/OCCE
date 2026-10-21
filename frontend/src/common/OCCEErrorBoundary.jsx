import React from "react";
import PropTypes from "prop-types";
import { ErrorBoundary } from "react-error-boundary";
import OCCEFallbackCard from "./OCCEFallbackCard";

/**
 * Contextual Error Boundary wrapper powered by `react-error-boundary`.
 * Catches child component errors without bringing down the whole view or requiring page reloads.
 */
export default function OCCEErrorBoundary({
  children,
  title = "모듈을 불러오는 중 오류가 발생했습니다",
  description = "일시적인 오류가 발생했습니다. 아래 버튼을 눌러 다시 시도해 주세요.",
  actionText = "다시 시도",
  compact = false,
  minHeight,
  resetKeys = [],
  onReset,
  onError,
  fallbackLink,
  extraAction,
  fallbackRender,
  FallbackComponent,
}) {
  const defaultFallbackRender = ({ error, resetErrorBoundary }) => (
    <OCCEFallbackCard
      error={error}
      resetErrorBoundary={resetErrorBoundary}
      title={title}
      description={description}
      actionText={actionText}
      compact={compact}
      minHeight={minHeight}
      onReset={onReset}
      fallbackLink={fallbackLink}
      extraAction={extraAction}
    />
  );

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      fallbackRender={
        FallbackComponent ? undefined : fallbackRender || defaultFallbackRender
      }
      onReset={onReset}
      onError={onError}
      resetKeys={resetKeys}
    >
      {children}
    </ErrorBoundary>
  );
}

OCCEErrorBoundary.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  actionText: PropTypes.string,
  compact: PropTypes.bool,
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  resetKeys: PropTypes.array,
  onReset: PropTypes.func,
  onError: PropTypes.func,
  fallbackLink: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string.isRequired,
    }),
  ]),
  extraAction: PropTypes.node,
  fallbackRender: PropTypes.func,
  FallbackComponent: PropTypes.elementType,
};

export { OCCEFallbackCard };
