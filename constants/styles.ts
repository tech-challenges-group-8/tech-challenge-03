/**
 * Common styles for React Native components
 * Adapted from web styles/commonStyles.ts to work with mobile
 */

import { StyleSheet } from 'react-native';
import { Colors, SHAPE, SPACING, TYPOGRAPHY } from './theme';

// Common input styles (similar to getCommonInputStyles from web)
export const getInputStyles = (colorScheme: 'light' | 'dark' = 'light') => ({
  backgroundColor: Colors[colorScheme].background,
  borderColor: Colors[colorScheme].primary,
  borderWidth: 1,
  borderRadius: SHAPE.borderRadiusLarge,
  paddingHorizontal: SPACING,
  paddingVertical: SPACING * 1.5,
  fontSize: TYPOGRAPHY.body1.fontSize,
  color: Colors[colorScheme].text,
  minHeight: 48,
});

// Common button styles with variants
export const getButtonStyles = (
  variant: 'primary' | 'secondary' | 'outline' = 'primary',
  colorScheme: 'light' | 'dark' = 'light'
) => {
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

// Common card styles
export const getCardStyles = (colorScheme: 'light' | 'dark' = 'light') => ({
  backgroundColor: Colors[colorScheme].background,
  borderRadius: SHAPE.borderRadius,
  padding: SPACING * 2,
  shadowColor: Colors[colorScheme].text,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 3.84,
  elevation: 5,
});

// Pre-defined common styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING * 2,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  marginVertical: {
    marginVertical: SPACING,
  },
  marginHorizontal: {
    marginHorizontal: SPACING,
  },
  paddingVertical: {
    paddingVertical: SPACING,
  },
  paddingHorizontal: {
    paddingHorizontal: SPACING,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
