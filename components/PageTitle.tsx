import React from 'react';
import { Animated, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  animated?: boolean;
  fadeAnim?: Animated.Value;
  slideAnim?: Animated.Value;
  showDivider?: boolean;
  customStyles?: {
    container?: any;
    title?: any;
    subtitle?: any;
  };
}

export const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  animated = false,
  fadeAnim,
  slideAnim,
  showDivider = true,
  customStyles = {}
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const content = (
    <ThemedView style={[
      styles.container,
      customStyles.container
    ]}>
      <ThemedView style={styles.content}>
        <ThemedText 
          type="title" 
          style={[
            styles.title,
            { color: colors.text },
            customStyles.title
          ]}
        >
          {title}
        </ThemedText>
        
        {subtitle && (
          <ThemedText 
            type="body1" 
            style={[
              styles.subtitle,
              { color: colors.textSecondary },
              customStyles.subtitle
            ]}
          >
            {subtitle}
          </ThemedText>
        )}
      </ThemedView>

      {showDivider && (
        <ThemedView style={[
          styles.divider,
          { backgroundColor: colors.border }
        ]} />
      )}
    </ThemedView>
  );

  if (animated && fadeAnim && slideAnim) {
    return (
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}>
        {content}
      </Animated.View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING * 6, // Extra top padding for mobile status bar
    paddingHorizontal: SPACING * 2,
    paddingBottom: SPACING * 1.5,
  },
  content: {
    paddingBottom: SPACING,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    lineHeight: 38,
    marginBottom: SPACING / 2,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.8,
    marginTop: SPACING / 2,
  },
  divider: {
    height: 1,
    opacity: 0.1,
    marginTop: SPACING,
  },
});
