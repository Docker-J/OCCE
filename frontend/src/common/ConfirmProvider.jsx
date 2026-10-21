import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import "./CustomDialog.css";

const ConfirmContext = createContext(null);

const DEFAULT_OPTIONS = {
  title: "확인",
  message: "",
  description: "",
  content: null,
  confirmText: "확인",
  cancelText: "취소",
  confirmColor: "primary",
  severity: null, // "warning" | "error" | "info"
  isDestructive: false,
  maxWidth: "xs",
};

/**
 * ConfirmProvider provides a centralized, imperative, Promise-based confirmation dialog.
 * Resolves to `true` on confirm, `false` on cancel, backdrop click, or Escape key.
 * Guarantees memory safety by resolving pending promises on unmount.
 */
export const ConfirmProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    ...DEFAULT_OPTIONS,
  });

  const resolverRef = useRef(null);

  // Memory safety: cancel and clean up any pending promise on unmount
  useEffect(() => {
    return () => {
      if (resolverRef.current) {
        resolverRef.current(false);
        resolverRef.current = null;
      }
    };
  }, []);

  const confirm = useCallback((options) => {
    // If a dialog is already awaiting confirmation, cancel previous with false
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }

    let mergedOptions = { ...DEFAULT_OPTIONS };
    if (typeof options === "string") {
      mergedOptions.message = options;
      mergedOptions.description = options;
    } else if (options && typeof options === "object") {
      mergedOptions = {
        ...mergedOptions,
        ...options,
        message: options.message || options.description || "",
        description: options.description || options.message || "",
      };
    }

    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialogState({
        isOpen: true,
        ...mergedOptions,
      });
    });
  }, []);

  const handleClose = useCallback((confirmed = false) => {
    if (resolverRef.current) {
      resolverRef.current(confirmed);
      resolverRef.current = null;
    }
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const isErrorOrDestructive =
    dialogState.isDestructive ||
    dialogState.severity === "error" ||
    dialogState.confirmColor === "error";

  const getSeverityIcon = () => {
    if (dialogState.severity === "error" || dialogState.isDestructive) {
      return (
        <ErrorOutlineRoundedIcon
          sx={{ color: "#dc2626", fontSize: "1.6rem", flexShrink: 0 }}
        />
      );
    }
    if (dialogState.severity === "warning") {
      return (
        <WarningAmberRoundedIcon
          sx={{ color: "#ea580c", fontSize: "1.6rem", flexShrink: 0 }}
        />
      );
    }
    if (dialogState.severity === "info") {
      return (
        <InfoOutlinedIcon
          sx={{ color: "#0284c7", fontSize: "1.6rem", flexShrink: 0 }}
        />
      );
    }
    return null;
  };

  const getConfirmButtonColor = () => {
    if (isErrorOrDestructive) return "error";
    if (
      ["primary", "secondary", "warning", "info", "success"].includes(
        dialogState.confirmColor
      )
    ) {
      return dialogState.confirmColor;
    }
    return "primary";
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog
        open={dialogState.isOpen}
        onClose={() => handleClose(false)}
        maxWidth={dialogState.maxWidth}
        fullWidth
        slotProps={{
          backdrop: { className: "custom-dialog-backdrop" },
          paper: { className: "custom-dialog-paper" },
        }}
      >
        {dialogState.title && (
          <DialogTitle
            sx={{
              fontWeight: 800,
              fontSize: "1.25rem",
              fontFamily: "inherit",
              color: isErrorOrDestructive ? "#dc2626" : "#1e293b",
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              pb: 1,
              pt: 2,
              px: 3,
            }}
          >
            {getSeverityIcon()}
            <span>{dialogState.title}</span>
          </DialogTitle>
        )}

        <DialogContent sx={{ px: 3, pt: dialogState.title ? 1 : 2.5, pb: 1 }}>
          {(dialogState.message || dialogState.description) && (
            <DialogContentText
              sx={{
                color: "#475569",
                lineHeight: 1.6,
                fontFamily: "inherit",
                fontSize: "0.95rem",
                mb: dialogState.content ? 2 : 0,
                whiteSpace: "pre-line",
              }}
            >
              {dialogState.message || dialogState.description}
            </DialogContentText>
          )}
          {dialogState.content && <Box sx={{ mt: 1 }}>{dialogState.content}</Box>}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
          <Button
            onClick={() => handleClose(false)}
            color="inherit"
            sx={{
              fontWeight: 600,
              px: 2.5,
              borderRadius: "12px",
              color: "#64748b",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            {dialogState.cancelText}
          </Button>
          <Button
            onClick={() => handleClose(true)}
            variant="contained"
            color={getConfirmButtonColor()}
            autoFocus
            sx={{
              borderRadius: "12px",
              px: 3,
              fontWeight: 700,
              ...(isErrorOrDestructive
                ? {
                    backgroundColor: "#dc2626",
                    "&:hover": {
                      backgroundColor: "#b91c1c",
                    },
                  }
                : dialogState.confirmColor === "primary"
                ? {
                    backgroundColor: "#FF6B00",
                    "&:hover": {
                      backgroundColor: "#e65100",
                    },
                  }
                : {}),
            }}
          >
            {dialogState.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
};

ConfirmProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to request user confirmation imperatively.
 *
 * @returns {(options: string | {
 *   title?: string,
 *   message?: string,
 *   description?: string,
 *   confirmText?: string,
 *   cancelText?: string,
 *   confirmColor?: "primary" | "error" | "warning" | "info" | "success",
 *   severity?: "warning" | "error" | "info",
 *   isDestructive?: boolean,
 *   content?: React.ReactNode,
 *   maxWidth?: "xs" | "sm" | "md"
 * }) => Promise<boolean>}
 */
export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};

export default ConfirmProvider;
