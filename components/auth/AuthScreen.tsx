import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { WelcomeHeader } from './WelcomeHeader';

export const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundLight }]}>
      <WelcomeHeader />
      {isSignUp ? (
        <SignUpForm onToggleSignIn={toggleForm} />
      ) : (
        <LoginForm onToggleSignUp={toggleForm} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
