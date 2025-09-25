import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors, TYPOGRAPHY } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'h1' | 'h2' | 'body1' | 'body2' | 'button';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'h1' ? styles.h1 : undefined,
        type === 'h2' ? styles.h2 : undefined,
        type === 'body1' ? styles.body1 : undefined,
        type === 'body2' ? styles.body2 : undefined,
        type === 'button' ? styles.button : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: TYPOGRAPHY.body1.fontSize,
    lineHeight: TYPOGRAPHY.body1.lineHeight,
    fontWeight: TYPOGRAPHY.body1.fontWeight,
  },
  defaultSemiBold: {
    fontSize: TYPOGRAPHY.body1.fontSize,
    lineHeight: TYPOGRAPHY.body1.lineHeight,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.subtitle.fontSize,
    fontWeight: TYPOGRAPHY.subtitle.fontWeight,
    lineHeight: TYPOGRAPHY.subtitle.lineHeight,
  },
  link: {
    lineHeight: 30,
    fontSize: TYPOGRAPHY.body1.fontSize,
    color: Colors.light.primary,
  },
  h1: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: TYPOGRAPHY.h1.fontWeight,
    lineHeight: TYPOGRAPHY.h1.lineHeight,
  },
  h2: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    lineHeight: TYPOGRAPHY.h2.lineHeight,
  },
  body1: {
    fontSize: TYPOGRAPHY.body1.fontSize,
    fontWeight: TYPOGRAPHY.body1.fontWeight,
    lineHeight: TYPOGRAPHY.body1.lineHeight,
  },
  body2: {
    fontSize: TYPOGRAPHY.body2.fontSize,
    fontWeight: TYPOGRAPHY.body2.fontWeight,
    lineHeight: TYPOGRAPHY.body2.lineHeight,
  },
  button: {
    fontSize: TYPOGRAPHY.button.fontSize,
    fontWeight: TYPOGRAPHY.button.fontWeight,
    lineHeight: TYPOGRAPHY.button.lineHeight,
  },
});
