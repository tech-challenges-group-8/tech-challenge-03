import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = "add",
  color
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const buttonColor = color || colors.success;

  return (
    <TouchableOpacity 
      style={[styles.buttonAddTransaction, { backgroundColor: buttonColor }]} 
      onPress={onPress}
    >
      <Ionicons name={icon} size={28} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonAddTransaction: {
    position: "absolute",
    bottom: SPACING * 3,
    right: SPACING * 3,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
