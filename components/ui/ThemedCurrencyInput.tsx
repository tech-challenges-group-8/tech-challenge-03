import { Colors, SHAPE, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CurrencyInput from "react-native-currency-input";

interface ThemedCurrencyInputProps {
  label?: string;
  error?: string;
  value: number | null;
  onChangeValue?: (value: number | null) => void;
}

export function ThemedCurrencyInput({
  label,
  error,
  value,
  onChangeValue,
}: ThemedCurrencyInputProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.textSecondary + "10",
            borderColor: error
              ? colors.error
              : isFocused
              ? colors.primary
              : colors.border,
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      >
        <CurrencyInput
          value={value}
          onChangeValue={onChangeValue}
          prefix="R$ "
          delimiter="."
          separator=","
          precision={2}
          style={[styles.input, { color: colors.text }]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING, width: "100%" },
  label: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    fontWeight: TYPOGRAPHY.body2.fontWeight,
    marginBottom: SPACING * 0.5,
  },
  inputContainer: {
    borderRadius: SHAPE.borderRadiusLarge,
    paddingHorizontal: SPACING,
  },
  input: {
    paddingVertical: SPACING * 1.5,
    fontSize: TYPOGRAPHY.body1.fontSize,
    fontWeight: TYPOGRAPHY.body1.fontWeight,
    minHeight: 48,
  },
  error: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    marginTop: SPACING * 0.5,
  },
});
