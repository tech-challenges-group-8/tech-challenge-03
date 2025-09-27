import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedInput } from '@/components/ui/ThemedInput';
import { commonStyles } from '@/constants/styles';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

export default function ThemeShowcaseScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';

  const handleLogin = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Theme showcase completed!');
    }, 2000);
  };

  return (
    <ScrollView style={[commonStyles.container, { backgroundColor: Colors[colorScheme].backgroundLight }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="h1">Theme Showcase</ThemedText>
        <ThemedText type="body2" style={{ marginTop: SPACING }}>
          This demo shows your unified design system working across web and mobile
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>Typography</ThemedText>
        <ThemedText type="h1">Heading 1 (H1)</ThemedText>
        <ThemedText type="h2">Heading 2 (H2)</ThemedText>
        <ThemedText type="body1">Body 1 text - regular content</ThemedText>
        <ThemedText type="body2">Body 2 text - smaller content</ThemedText>
        <ThemedText type="subtitle">Subtitle text</ThemedText>
        <ThemedText type="button">Button text style</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>Form Components</ThemedText>
        
        <ThemedInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <ThemedInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <ThemedInput
          label="Email with Error"
          placeholder="invalid-email"
          error="Please enter a valid email address"
          value="invalid-email"
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>Buttons</ThemedText>
        
        <ThemedView style={styles.buttonGroup}>
          <ThemedButton
            title="Primary Button"
            onPress={handleLogin}
            variant="primary"
            loading={loading}
          />
          
          <ThemedButton
            title="Secondary Button"
            onPress={() => Alert.alert('Secondary', 'Secondary button pressed')}
            variant="secondary"
          />
          
          <ThemedButton
            title="Outline Button"
            onPress={() => Alert.alert('Outline', 'Outline button pressed')}
            variant="outline"
          />
          
          <ThemedButton
            title="Disabled Button"
            onPress={() => {}}
            disabled
          />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>Button Sizes</ThemedText>
        
        <ThemedView style={styles.buttonGroup}>
          <ThemedButton
            title="Small Button"
            onPress={() => Alert.alert('Size', 'Small button pressed')}
            size="small"
          />
          
          <ThemedButton
            title="Medium Button"
            onPress={() => Alert.alert('Size', 'Medium button pressed')}
            size="medium"
          />
          
          <ThemedButton
            title="Large Button"
            onPress={() => Alert.alert('Size', 'Large button pressed')}
            size="large"
          />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>Colors</ThemedText>
        <ThemedText type="body1">
          Your app now uses the same color palette as your web version:
        </ThemedText>
        <ThemedText type="body2" style={{ color: Colors[colorScheme].primary }}>
          • Primary: {Colors[colorScheme].primary}
        </ThemedText>
        <ThemedText type="body2" style={{ color: Colors[colorScheme].success }}>
          • Success: {Colors[colorScheme].success}
        </ThemedText>
        <ThemedText type="body2" style={{ color: Colors[colorScheme].error }}>
          • Error: {Colors[colorScheme].error}
        </ThemedText>
        <ThemedText type="body2" style={{ color: Colors[colorScheme].textSecondary }}>
          • Secondary Text: {Colors[colorScheme].textSecondary}
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: SPACING * 2,
    paddingBottom: SPACING,
    alignItems: 'center',
  },
  section: {
    marginVertical: SPACING,
    padding: SPACING * 2,
  },
  sectionTitle: {
    marginBottom: SPACING,
  },
  buttonGroup: {
    gap: SPACING,
  },
});
