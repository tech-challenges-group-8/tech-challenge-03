import { Colors, SHAPE, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

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

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      <View style={[
        styles.inputContainer,
        {
          backgroundColor: colors.background,
          borderColor: error ? colors.error : colors.border,
        }
      ]}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              flex: leftIcon || rightIcon ? 1 : undefined,
            },
            style,
          ]}
          placeholderTextColor={colors.textSecondary}
          {...rest}
        />
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING,
  },
  label: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    fontWeight: TYPOGRAPHY.body2.fontWeight,
    marginBottom: SPACING * 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SHAPE.borderRadiusLarge,
    paddingHorizontal: SPACING,
  },
  input: {
    paddingVertical: SPACING * 1.5,
    fontSize: TYPOGRAPHY.body1.fontSize,
    fontWeight: TYPOGRAPHY.body1.fontWeight,
    minHeight: 48,
  },
  iconContainer: {
    marginHorizontal: SPACING * 0.5,
  },
  error: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    marginTop: SPACING * 0.5,
  },
});
