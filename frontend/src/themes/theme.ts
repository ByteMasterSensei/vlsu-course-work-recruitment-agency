import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0F172A", 
      light: "#334155",
      dark: "#020617",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#64748B", 
      light: "#94A3B8",
      dark: "#475569",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    error: {
      main: "#EF4444",
      light: "#FCA5A5",
      dark: "#DC2626",
    },
    warning: {
      main: "#F59E0B",
      light: "#FCD34D",
      dark: "#D97706",
    },
    info: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
    },
    background: {
      default: "#F8FAFC", 
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
      disabled: "#CBD5E1",
    },
    divider: "#E2E8F0",
    action: {
      hover: "rgba(0, 0, 0, 0.04)",
      selected: "rgba(0, 0, 0, 0.08)",
      disabled: "#CBD5E1",
      disabledBackground: "#F1F5F9",
    },
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "3rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      "@media (max-width: 768px)": {
        fontSize: "2rem",
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.25rem",
      lineHeight: 1.25,
      letterSpacing: "-0.02em",
      "@media (max-width: 768px)": {
        fontSize: "1.75rem",
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.875rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
      "@media (max-width: 768px)": {
        fontSize: "1.5rem",
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
      "@media (max-width: 768px)": {
        fontSize: "1.25rem",
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
      "@media (max-width: 768px)": {
        fontSize: "1.125rem",
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      "@media (max-width: 768px)": {
        fontSize: "0.9375rem",
      },
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.9375rem",
      letterSpacing: "0",
    },
    subtitle1: {
      fontSize: "1.125rem",
      lineHeight: 1.5,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F8FAFC",
          color: "#0F172A",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 20px",
          fontWeight: 500,
          fontSize: "0.9375rem",
          textTransform: "none",
          transition: "all 0.2s ease",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          background: "#0F172A",
          color: "#FFFFFF",
          "&:hover": {
            background: "#020617",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        outlined: {
          borderColor: "#E2E8F0",
          color: "#0F172A",
          "&:hover": {
            borderColor: "#0F172A",
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
        text: {
          color: "#64748B",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            color: "#0F172A",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: "#CBD5E1",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: 0,
          border: "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#FFFFFF",
            borderRadius: 0,
            fontSize: "0.9375rem",
            fontWeight: 500,
            minHeight: "48px",
            transition: "all 0.15s ease",
            "& fieldset": {
              borderColor: "rgba(0, 0, 0, 0.1)",
              transition: "border-color 0.15s ease",
            },
            "&:hover fieldset": {
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0F172A",
              borderWidth: "1px",
            },
            "&.Mui-error fieldset": {
              borderColor: "#EF4444",
            },
          },
          "& .MuiInputLabel-root": {
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            color: "#64748B",
            fontSize: "0.9375rem",
            fontWeight: 500,
            "&.Mui-focused": {
              color: "#0F172A",
            },
            "&.Mui-error": {
              color: "#EF4444",
            },
          },
          "& .MuiInputBase-input": {
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            color: "#0F172A",
            fontSize: "0.9375rem",
            fontWeight: 500,
            padding: "14px 16px",
            height: "48px",
            boxSizing: "border-box",
            "&::placeholder": {
              color: "#94A3B8",
              opacity: 1,
            },
          },
          "& .MuiInputAdornment-root": {
            height: "48px",
            "& .MuiSvgIcon-root": {
              fontSize: "20px",
            },
          },
          "& .MuiFormHelperText-root": {
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            color: "#64748B",
            fontSize: "0.8125rem",
            fontWeight: 400,
            marginTop: "6px",
            "&.Mui-error": {
              color: "#EF4444",
            },
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
          "@media (min-width: 600px)": {
            paddingLeft: "24px",
            paddingRight: "24px",
          },
          "@media (min-width: 1200px)": {
            paddingLeft: "32px",
            paddingRight: "32px",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2E8F0",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "72px !important",
          paddingLeft: "16px !important",
          paddingRight: "16px !important",
          "@media (min-width: 600px)": {
            paddingLeft: "24px !important",
            paddingRight: "24px !important",
          },
          "@media (min-width: 1200px)": {
            paddingLeft: "32px !important",
            paddingRight: "32px !important",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "#F1F5F9",
          color: "#475569",
          border: "1px solid #E2E8F0",
          borderRadius: 8,
          fontWeight: 500,
          fontSize: "0.8125rem",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#E2E8F0",
            borderColor: "#CBD5E1",
          },
        },
        colorPrimary: {
          backgroundColor: "rgba(0, 0, 0, 0.06)",
          color: "#0F172A",
          borderColor: "rgba(0, 0, 0, 0.1)",
        },
        colorSuccess: {
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          color: "#10B981",
          borderColor: "rgba(16, 185, 129, 0.2)",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          backgroundColor: "#FFFFFF",
          borderRadius: 0,
          fontSize: "0.9375rem",
          fontWeight: 500,
          minHeight: "48px",
          "& .MuiSelect-select": {
            padding: "14px 16px",
            minHeight: "48px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.1)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.2)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0F172A",
            borderWidth: "1px",
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          border: "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          border: "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: "0.9375rem",
          fontWeight: 500,
          borderRadius: 0,
          margin: "0",
          padding: "12px 16px",
          minHeight: "48px",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.12)",
            },
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            color: "#64748B",
            borderColor: "#E2E8F0",
            borderRadius: 8,
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              borderColor: "#0F172A",
            },
            "&.Mui-selected": {
              background: "#0F172A",
              color: "#FFFFFF",
              borderColor: "transparent",
              "&:hover": {
                background: "#020617",
              },
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid",
          animation: "fadeIn 0.3s ease-in",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        },
        standardError: {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderColor: "#FCA5A5",
          color: "#DC2626",
        },
        standardSuccess: {
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "#6EE7B7",
          color: "#059669",
        },
        standardWarning: {
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderColor: "#FCD34D",
          color: "#D97706",
        },
        standardInfo: {
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderColor: "#93C5FD",
          color: "#2563EB",
        },
      },
    },
  },
});

export default theme;
