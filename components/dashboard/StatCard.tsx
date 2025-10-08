import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  delay?: number;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  delay = 0,
  loading = false
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const cardAnim = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    if (!loading) {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }).start();
    }
  }, [delay, cardAnim, loading]);

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.backgroundLight,
          opacity: cardAnim,
          transform: [
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <ThemedView style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </ThemedView>
      <ThemedView
        style={[
          styles.statContent,
          { backgroundColor: colors.backgroundLight },
        ]}
      >
        <ThemedText type="body2" style={{ color: colors.textSecondary }}>
          {title}
        </ThemedText>
        <ThemedText type="h2" style={{ color: color }}>
          {value}
        </ThemedText>
      </ThemedView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    minWidth: 150,
    padding: SPACING * 1.5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING,
  },
  statContent: {
    flex: 1,
  },
});
