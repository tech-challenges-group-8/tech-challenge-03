/**
 * Mobile theme adapted from web styles/tokens.ts
 * Using the same design system across web and mobile platforms
 */

import { Platform } from 'react-native';

// Design tokens from web theme
export const COLORS = {
  brand: {
    main: "#004D61",
    dark: "#0F4A7B",
    light: "#3FAE8C",
    contrast: "#FF5031",
  },
  alert: {
    error: "#FF5031",
    success: "#1A8F38",
  },
  neutral: {
    900: "#000000",
    700: "#4A5568", // Secondary text
    600: "#47A138", // Active text
    500: "#6B7280", // Disabled text/inactive menu
    300: "#D1D5DB", // Borders/inactive
    100: "#e4ede3", // Light background
    white: "#FFFFFF",
  },
};

export const Colors = {
  light: {
    text: COLORS.neutral[900],
    textSecondary: COLORS.neutral[700],
    textDisabled: COLORS.neutral[500],
    background: COLORS.neutral.white,
    backgroundLight: COLORS.neutral[100],
    tint: COLORS.brand.main,
    primary: COLORS.brand.main,
    secondary: COLORS.alert.error,
    success: COLORS.alert.success,
    error: COLORS.alert.error,
    icon: COLORS.neutral[600],
    tabIconDefault: COLORS.neutral[500],
    tabIconSelected: COLORS.brand.main,
    border: COLORS.neutral[300],
  },
  dark: {
    text: COLORS.neutral.white,
    textSecondary: COLORS.neutral[300],
    textDisabled: COLORS.neutral[500],
    background: COLORS.neutral[900],
    backgroundLight: COLORS.neutral[700],
    tint: COLORS.brand.light,
    primary: COLORS.brand.light,
    secondary: COLORS.alert.error,
    success: COLORS.alert.success,
    error: COLORS.alert.error,
    icon: COLORS.neutral[300],
    tabIconDefault: COLORS.neutral[500],
    tabIconSelected: COLORS.brand.light,
    border: COLORS.neutral[700],
  },
};

// Typography tokens from web theme
export const TYPOGRAPHY = {
  fontFamily: "Inter",
  h1: {
    fontSize: 25,
    fontWeight: '600' as const,
    lineHeight: 30,
  },
  h2: {
    fontSize: 20,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  body2: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 15,
  },
  button: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 17,
  },
};

// Spacing tokens from web theme
export const SPACING = 8;

// Shape tokens from web theme
export const SHAPE = {
  borderRadius: 4,
  borderRadiusLarge: 8,
};

// Platform-specific font configuration
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'Inter',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  android: {
    sans: 'Inter',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  default: {
    sans: 'Inter',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Common styles for components (similar to commonStyles.ts for web)
export const getInputStyles = (colorScheme: 'light' | 'dark' = 'light') => ({
  backgroundColor: Colors[colorScheme].background,
  borderColor: Colors[colorScheme].primary,
  borderWidth: 1,
  borderRadius: SHAPE.borderRadiusLarge,
  padding: SPACING * 1.5,
  fontSize: TYPOGRAPHY.body1.fontSize,
  color: Colors[colorScheme].text,
  minHeight: 48,
});

export const getButtonStyles = (variant: 'primary' | 'secondary' | 'outline' = 'primary', colorScheme: 'light' | 'dark' = 'light') => {
  const baseStyle = {
    borderRadius: SHAPE.borderRadius,
    paddingVertical: SPACING,
    paddingHorizontal: SPACING * 2,
    minHeight: 44,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: Colors[colorScheme].success,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: Colors[colorScheme].error,
      };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors[colorScheme].primary,
      };
    default:
      return baseStyle;
  }
};
