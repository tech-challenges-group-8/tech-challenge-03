import { Colors, SHAPE, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface ThemedSelectProps {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
  value: string;
  onValueChange: (value: string) => void;
}

export function ThemedSelect({
  label,
  error,
  options,
  value,
  onValueChange,
}: ThemedSelectProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View
        style={[
          styles.selectContainer,
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
        <Picker
            selectedValue={value}
            style={[styles.picker, { color: colors.text }]}
            onValueChange={onValueChange}
        >
            {options.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
        </Picker>
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
  selectContainer: {
    borderRadius: SHAPE.borderRadiusLarge,
    paddingHorizontal: SPACING,
    justifyContent: "center",
    height: 48, 
  },
  error: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    marginTop: SPACING * 0.5,
  },
  picker: {
    height: 52,
    width: "100%",
  },
});
