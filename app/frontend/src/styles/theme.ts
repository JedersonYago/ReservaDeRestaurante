// Base theme com propriedades compartilhadas
const baseTheme = {
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      md: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },
  spacing: {
    px: "1px",
    0: "0",
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px
    11: "2.75rem", // 44px
    12: "3rem", // 48px
    14: "3.5rem", // 56px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    28: "7rem", // 112px
    32: "8rem", // 128px
    36: "9rem", // 144px
    40: "10rem", // 160px
    44: "11rem", // 176px
    48: "12rem", // 192px
    52: "13rem", // 208px
    56: "14rem", // 224px
    60: "15rem", // 240px
    64: "16rem", // 256px
    72: "18rem", // 288px
    80: "20rem", // 320px
    96: "24rem", // 384px
  },
  breakpoints: {
    xs: "0px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    "2xl": "1400px",
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    focus: "0 0 0 3px rgba(250, 118, 31, 0.2)", // Primary color with opacity
    focusSecondary: "0 0 0 3px rgba(73, 168, 76, 0.2)", // Secondary color with opacity
  },
  borderRadius: {
    none: "0",
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    "3xl": "2rem", // 32px
    full: "9999px",
  },
  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  transitions: {
    property: {
      none: "none",
      all: "all",
      default:
        "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
      colors: "background-color, border-color, color, fill, stroke",
      opacity: "opacity",
      shadow: "box-shadow",
      transform: "transform",
    },
    timing: {
      linear: "linear",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    duration: {
      75: "75ms",
      100: "100ms",
      150: "150ms",
      200: "200ms",
      300: "300ms",
      500: "500ms",
      700: "700ms",
      1000: "1000ms",
    },
  },
} as const;

// Light theme
export const lightTheme = {
  ...baseTheme,
  colors: {
    primary: {
      main: "#FA761F",
      light: "#FFA855",
      dark: "#E85D00",
      contrast: "#FFFFFF",
      50: "#FFF7F0",
      100: "#FFEDD6",
      200: "#FFD6AD",
      300: "#FFB885",
      400: "#FF975C",
      500: "#FA761F",
      600: "#E85D00",
      700: "#C44F00",
      800: "#A04200",
      900: "#7D3500",
    },
    secondary: {
      main: "#49A84C",
      light: "#7BC47E",
      dark: "#2E7D32",
      contrast: "#FFFFFF",
      50: "#F1F8F1",
      100: "#DCEEDD",
      200: "#B9DDB9",
      300: "#96CC96",
      400: "#73BB73",
      500: "#49A84C",
      600: "#2E7D32",
      700: "#1B5E20",
      800: "#0D3F0E",
      900: "#052706",
    },
    neutral: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    semantic: {
      success: "#49A84C",
      warning: "#FA761F",
      error: "#D32F2F",
      info: "#1976D2",
    },
    background: {
      primary: "#FFFFFF",
      secondary: "#FAFAFA",
      tertiary: "#F5F5F5",
    },
    text: {
      primary: "#212121",
      secondary: "#616161",
      disabled: "#9E9E9E",
      inverse: "#FFFFFF",
    },
  },
} as const;

// Dark theme
export const darkTheme = {
  ...baseTheme,
  colors: {
    primary: {
      main: "#FA761F",
      light: "#FFA855",
      dark: "#E85D00",
      contrast: "#FFFFFF",
      50: "#FFF7F0",
      100: "#FFEDD6",
      200: "#FFD6AD",
      300: "#FFB885",
      400: "#FF975C",
      500: "#FA761F",
      600: "#E85D00",
      700: "#C44F00",
      800: "#A04200",
      900: "#7D3500",
    },
    secondary: {
      main: "#49A84C",
      light: "#7BC47E",
      dark: "#2E7D32",
      contrast: "#FFFFFF",
      50: "#F1F8F1",
      100: "#DCEEDD",
      200: "#B9DDB9",
      300: "#96CC96",
      400: "#73BB73",
      500: "#49A84C",
      600: "#2E7D32",
      700: "#1B5E20",
      800: "#0D3F0E",
      900: "#052706",
    },
    neutral: {
      50: "#18181B",
      100: "#27272A",
      200: "#3F3F46",
      300: "#52525B",
      400: "#71717A",
      500: "#A1A1AA",
      600: "#D4D4D8",
      700: "#E4E4E7",
      800: "#F4F4F5",
      900: "#FAFAFA",
    },
    semantic: {
      success: "#22C55E",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
    background: {
      primary: "#0F0F0F",
      secondary: "#18181B",
      tertiary: "#27272A",
    },
    text: {
      primary: "#FAFAFA",
      secondary: "#D4D4D8",
      disabled: "#71717A",
      inverse: "#18181B",
    },
  },
  shadows: {
    ...baseTheme.shadows,
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.2)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
  },
} as const;

// Tema padrão (light theme)
export const theme = lightTheme;

export type Theme = typeof lightTheme | typeof darkTheme;
export type ThemeMode = "light" | "dark";

// Utility types para autocomplete
export type Colors = keyof typeof lightTheme.colors;
export type ColorShades = keyof typeof lightTheme.colors.primary;
export type FontSizes = keyof typeof lightTheme.typography.fontSize;
export type FontWeights = keyof typeof lightTheme.typography.fontWeight;
export type Spacing = keyof typeof lightTheme.spacing;
export type Breakpoints = keyof typeof lightTheme.breakpoints;
export type Shadows = keyof typeof lightTheme.shadows;
export type BorderRadius = keyof typeof lightTheme.borderRadius;
