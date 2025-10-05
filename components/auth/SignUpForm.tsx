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

interface SignUpFormProps {
  onToggleSignIn: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleSignIn }) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Test translation on component mount
  console.log('Translation test:', t('messages.error'));
  console.log('Component mounted, t function:', typeof t);

  const renderEyeIcon = (visible: boolean, onToggle: () => void) => (
    <TouchableOpacity onPress={onToggle} style={styles.eyeIcon}>
      <Ionicons 
        name={visible ? 'eye-off' : 'eye'} 
        size={20} 
        color={colors.textSecondary} 
      />
    </TouchableOpacity>
  );

  const handleSignUp = async () => {
    console.log('SignUp button pressed!'); // Debug log
    console.log('Form values:', { email, password, confirmPassword, displayName }); // Debug form values
    
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      console.log('Checking form validation...'); // Debug log
      
      if (!email || !password || !confirmPassword) {
        console.log('Validation failed: Missing required fields'); // Debug log
        const errorMsg = t('messages.fillAllRequiredFields');
        console.log('Error message from translation:', errorMsg); // Debug log
        setErrorMessage(errorMsg);
        return;
      }

      if (password !== confirmPassword) {
        console.log('Validation failed: Passwords do not match'); // Debug log
        setErrorMessage(t('messages.passwordsDoNotMatch'));
        return;
      }

      if (password.length < 6) {
        console.log('Validation failed: Password too short'); // Debug log
        setErrorMessage(t('messages.passwordTooShort'));
        return;
      }

      console.log('Validation passed, starting signup process...'); // Debug log
      setIsLoading(true);
      
      try {
        console.log('Calling AuthService.signUp...'); // Debug log
        const user = await AuthService.signUp(email, password, displayName);
        console.log('Signup successful:', user?.email); // Debug log
        setSuccessMessage(t('messages.accountCreatedSuccessfully'));
        
        // Clear form after successful signup
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setDisplayName('');
      } catch (authError: any) {
        console.error('Signup error:', authError); // Debug log
        setErrorMessage(authError.message || 'An unknown error occurred during signup');
      }
    } catch (generalError: any) {
      console.error('General error in handleSignUp:', generalError); // Debug log
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.form, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('auth.signUp')}
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
          placeholder={t('auth.displayName')}
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          autoCorrect={false}
        />
        
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
          autoComplete="new-password"
          textContentType="newPassword"
          // @ts-ignore - name prop for web autofill
          name="new-password"
          rightIcon={renderEyeIcon(showPassword, () => setShowPassword(!showPassword))}
        />
        
        <ThemedInput
          placeholder={t('auth.confirmPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          // @ts-ignore - name prop for web autofill
          name="confirm-password"
          rightIcon={renderEyeIcon(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
        />
        
        <ThemedButton
          title={isLoading ? t('auth.creatingAccount') : t('auth.signUp')}
          onPress={handleSignUp}
          disabled={isLoading}
          loading={isLoading}
        />
        
        <TouchableOpacity onPress={onToggleSignIn} style={styles.linkButton}>
          <Text style={[styles.linkText, { color: colors.primary }]}>
            {t('auth.alreadyHaveAccount')}
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
