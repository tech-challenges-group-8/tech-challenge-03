import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedInput } from '@/components/ui/ThemedInput';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthService } from '../../services/AuthService';

interface LoginFormProps {
  onToggleSignUp: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleSignUp }) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const renderEyeIcon = (visible: boolean, onToggle: () => void) => (
    <TouchableOpacity onPress={onToggle} style={styles.eyeIcon}>
      <Ionicons 
        name={visible ? 'eye-off' : 'eye'} 
        size={20} 
        color={colors.textSecondary} 
      />
    </TouchableOpacity>
  );

  const handleLogin = async () => {
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!email || !password) {
      setErrorMessage(t('messages.fillAllFields'));
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.signIn(email, password);
      setSuccessMessage(t('messages.loggedInSuccessfully'));
      // Clear form after successful login
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!email) {
      setErrorMessage(t('messages.enterEmailAddress'));
      return;
    }

    try {
      await AuthService.resetPassword(email);
      setSuccessMessage(t('messages.passwordResetEmailSent'));
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.form, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('auth.signIn')}
        </Text>
        
        {/* Error Message */}
        {errorMessage ? (
          <View style={[styles.messageContainer, { backgroundColor: colors.error + '20', borderColor: colors.error }]}>
            <Text style={[styles.messageText, { color: colors.error }]}>
              {errorMessage}
            </Text>
          </View>
        ) : null}
        
        {/* Success Message */}
        {successMessage ? (
          <View style={[styles.messageContainer, { backgroundColor: colors.success + '20', borderColor: colors.success }]}>
            <Text style={[styles.messageText, { color: colors.success }]}>
              {successMessage}
            </Text>
          </View>
        ) : null}
        
        <ThemedInput
          placeholder={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          // @ts-ignore - name prop for web autofill
          name="email"
        />
        
        <ThemedInput
          placeholder={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          // @ts-ignore - name prop for web autofill
          name="password"
          rightIcon={renderEyeIcon(showPassword, () => setShowPassword(!showPassword))}
        />
        
        <ThemedButton
          title={isLoading ? t('auth.signingIn') : t('auth.signIn')}
          onPress={handleLogin}
          disabled={isLoading}
          loading={isLoading}
        />
        
        <TouchableOpacity onPress={handleForgotPassword} style={styles.linkButton}>
          <Text style={[styles.linkText, { color: colors.primary }]}>
            {t('auth.forgotPassword')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onToggleSignUp} style={styles.linkButton}>
          <Text style={[styles.linkText, { color: colors.primary }]}>
            {t('auth.dontHaveAccount')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
  },
  linkButton: {
    marginTop: 15,
  },
  linkText: {
    textAlign: 'center',
    fontSize: 14,
  },
});
