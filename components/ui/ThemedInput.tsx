import { Colors, SHAPE, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface ThemedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function ThemedInput({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: ThemedInputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.textSecondary + '10',
            borderColor: error
              ? colors.error
              : isFocused
              ? colors.primary
              : colors.border,
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: 'transparent',
            },
            // Web-specific autofill styling
            Platform.OS === 'web' && {
              // @ts-ignore - Web-specific CSS properties
              '&:-webkit-autofill': {
                WebkitTextFillColor: `${colors.text} !important`,
                WebkitBoxShadow: `0 0 0 1000px ${colors.textSecondary + '10'} inset !important`,
                transition: 'background-color 5000s ease-in-out 0s !important',
              },
              '&:-webkit-autofill:hover': {
                WebkitTextFillColor: `${colors.text} !important`,
                WebkitBoxShadow: `0 0 0 1000px ${colors.textSecondary + '10'} inset !important`,
              },
              '&:-webkit-autofill:focus': {
                WebkitTextFillColor: `${colors.text} !important`,
                WebkitBoxShadow: `0 0 0 1000px ${colors.textSecondary + '10'} inset !important`,
              },
            },
            style,
          ]}
          placeholderTextColor={colors.textSecondary}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING,
    width: '100%',
  },
  label: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    fontWeight: TYPOGRAPHY.body2.fontWeight,
    marginBottom: SPACING * 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SHAPE.borderRadiusLarge,
    paddingHorizontal: SPACING,
    width: '100%',
  },
  input: {
    paddingVertical: SPACING * 1.5,
    fontSize: TYPOGRAPHY.body1.fontSize,
    fontWeight: TYPOGRAPHY.body1.fontWeight,
    minHeight: 48,
    flex: 1,
    // Web-specific properties to style autofill without blocking it
    ...(Platform.OS === 'web' && {
      WebkitTextFillColor: 'inherit !important',
      WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
      transition: 'background-color 5000s ease-in-out 0s !important',
      // Additional properties to ensure text visibility
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none',
    }),
  },
  iconContainer: {
    marginHorizontal: SPACING * 0.5,
  },
  error: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    marginTop: SPACING * 0.5,
  },
});
