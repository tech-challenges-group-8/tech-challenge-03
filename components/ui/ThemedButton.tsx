import { Colors, SHAPE, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function ThemedButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  size = 'medium',
}: ThemedButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getButtonStyle = () => {
    const baseStyle = [
      styles.button,
      styles[size],
      { opacity: disabled ? 0.6 : 1 }
    ];

    switch (variant) {
      case 'primary':
        return [...baseStyle, { backgroundColor: colors.success }];
      case 'secondary':
        return [...baseStyle, { backgroundColor: colors.error }];
      case 'outline':
        return [
          ...baseStyle,
          {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.primary,
          },
        ];
      default:
        return [...baseStyle, { backgroundColor: colors.primary }];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];

    switch (variant) {
      case 'outline':
        return [...baseStyle, { color: colors.primary }];
      default:
        return [...baseStyle, { color: colors.background }];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.primary : colors.background} 
          size="small" 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: SHAPE.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    paddingVertical: SPACING * 0.75,
    paddingHorizontal: SPACING * 1.5,
    minHeight: 36,
  },
  medium: {
    paddingVertical: SPACING,
    paddingHorizontal: SPACING * 2,
    minHeight: 44,
  },
  large: {
    paddingVertical: SPACING * 1.25,
    paddingHorizontal: SPACING * 2.5,
    minHeight: 52,
  },
  text: {
    fontSize: TYPOGRAPHY.button.fontSize,
    fontWeight: TYPOGRAPHY.button.fontWeight,
    lineHeight: TYPOGRAPHY.button.lineHeight,
  },
});
