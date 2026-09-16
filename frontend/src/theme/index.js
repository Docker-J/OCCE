import { createTheme } from "@mui/material/styles";
import "../common/CustomDialog.css";

/**
 * OCCE Unified Design Tokens
 */
export const tokens = {
  colors: {
    primary: "#FF6B00",
    primaryHover: "#e65100",
    primaryLight: "#ff9240",
    primarySubtle: "rgba(255, 107, 0, 0.08)",
    primaryBorder: "rgba(255, 107, 0, 0.18)",
    textPrimary: "#1e293b",
    textSecondary: "#64748b",
    pageBg: "#fcfbf9",
    borderSubtle: "rgba(0, 0, 0, 0.08)",
  },
  radii: {
    dialog: 24,
    card: 20,
    button: 12,
    chip: 8,
  },
  shadows: {
    dialog: "0 20px 60px rgba(0, 0, 0, 0.15)",
    popover: "0 12px 36px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(255, 107, 0, 0.08)",
    card: "0 4px 20px rgba(0, 0, 0, 0.08)",
    cardHover: "0 6px 24px rgba(0, 0, 0, 0.06)",
  },
};

/**
 * OCCE Centralized Material UI Theme
 */
const theme = createTheme({
  palette: {
    primary: {
      light: tokens.colors.primaryLight,
      main: tokens.colors.primary,
      dark: tokens.colors.primaryHover,
      contrastText: "#ffffff",
      red: "#ff0000",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: tokens.colors.pageBg,
      paper: "#ffffff",
    },
    text: {
      primary: tokens.colors.textPrimary,
      secondary: tokens.colors.textSecondary,
    },
  },
  typography: {
    fontFamily: "NanumSquareNeoVariable",
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: tokens.radii.button,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.colors.pageBg,
        },
      },
    },
    MuiDialog: {
      defaultProps: {
        slotProps: {
          backdrop: {
            className: "custom-dialog-backdrop",
          },
        },
      },
      styleOverrides: {
        paper: {
          borderRadius: tokens.radii.dialog,
          boxShadow: tokens.shadows.dialog,
          border: `1px solid ${tokens.colors.borderSubtle}`,
          overflow: "hidden",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.button,
          fontWeight: 700,
          textTransform: "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            backgroundColor: tokens.colors.primaryHover,
            boxShadow: "0 4px 12px rgba(255, 107, 0, 0.25)",
          },
        },
      },
    },
    MuiFab: {
      defaultProps: {
        color: "primary",
      },
      styleOverrides: {
        root: {
          boxShadow: "0 6px 20px rgba(255, 107, 0, 0.35)",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: tokens.colors.primaryHover,
            boxShadow: "0 8px 24px rgba(255, 107, 0, 0.45)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.card,
          border: `1px solid ${tokens.colors.borderSubtle}`,
          boxShadow: tokens.shadows.card,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.chip,
          fontWeight: 700,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: tokens.radii.dialog,
          boxShadow: tokens.shadows.popover,
          border: `1px solid ${tokens.colors.primaryBorder}`,
          overflow: "hidden",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.button,
          transition: "all 0.2s ease",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.colors.primary,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.colors.primary,
            borderWidth: "2px",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: tokens.colors.primary,
          },
        },
      },
    },
    MuiPagination: {
      defaultProps: {
        shape: "rounded",
        variant: "outlined",
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.button,
          border: `1px solid ${tokens.colors.borderSubtle}`,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          color: "#555",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: tokens.colors.primarySubtle,
            borderColor: tokens.colors.primary,
            color: tokens.colors.primary,
          },
          "&.Mui-selected": {
            backgroundColor: `${tokens.colors.primary} !important`,
            color: "#ffffff !important",
            borderColor: `${tokens.colors.primary} !important`,
            fontWeight: 800,
            boxShadow: `0 4px 12px ${tokens.colors.primarySubtle}`,
            "&:hover": {
              backgroundColor: `${tokens.colors.primaryHover} !important`,
            },
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          "&.Mui-selected": {
            backgroundColor: `${tokens.colors.primary} !important`,
            color: "#ffffff !important",
            fontWeight: 800,
            "&:hover, &:focus": {
              backgroundColor: `${tokens.colors.primaryHover} !important`,
            },
          },
          "&.MuiPickersDay-today": {
            borderColor: `${tokens.colors.primary} !important`,
          },
        },
      },
    },
    MuiPickersYear: {
      styleOverrides: {
        yearButton: {
          borderRadius: tokens.radii.button,
          fontWeight: 600,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: tokens.colors.primarySubtle,
            color: tokens.colors.primary,
          },
          "&.Mui-selected": {
            backgroundColor: `${tokens.colors.primary} !important`,
            color: "#ffffff !important",
            fontWeight: 800,
            "&:hover, &:focus": {
              backgroundColor: `${tokens.colors.primaryHover} !important`,
            },
          },
          "&.MuiPickersYear-today": {
            borderColor: `${tokens.colors.primary} !important`,
          },
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        label: {
          fontWeight: 800,
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          borderRadius: tokens.radii.chip,
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          fontSize: "0.8rem",
          fontWeight: 600,
          padding: "6px 12px",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.18)",
        },
        arrow: {
          color: "rgba(15, 23, 42, 0.92)",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 44,
        },
        indicator: {
          backgroundColor: tokens.colors.primary,
          height: 3,
          borderRadius: "3px 3px 0 0",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          fontSize: "0.95rem",
          color: tokens.colors.textSecondary,
          minHeight: 44,
          transition: "color 0.2s ease",
          "&:hover": {
            color: tokens.colors.primary,
          },
          "&.Mui-selected": {
            color: tokens.colors.primary,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radii.button,
          fontWeight: 600,
        },
        standardInfo: {
          border: "1px solid rgba(2, 132, 199, 0.2)",
        },
        standardSuccess: {
          border: "1px solid rgba(22, 163, 74, 0.2)",
        },
        standardWarning: {
          border: "1px solid rgba(234, 88, 12, 0.2)",
        },
        standardError: {
          border: "1px solid rgba(220, 38, 38, 0.2)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: tokens.colors.borderSubtle,
          fontFamily: "inherit",
        },
        head: {
          fontWeight: 700,
          color: tokens.colors.textSecondary,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: tokens.colors.borderSubtle,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          "&:last-child": {
            paddingBottom: 24,
          },
        },
      },
    },
  },
});

export default theme;
