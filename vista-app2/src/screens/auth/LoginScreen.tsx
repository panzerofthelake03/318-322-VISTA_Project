import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuthStore } from '../../store/authStore';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    const name = email.split('@')[0] || 'Kullanıcı';
    await AsyncStorage.setItem('isLoggedIn', 'true');
    login(name);
  };

  const handleMockOAuth = async (provider: string) => {
    await AsyncStorage.setItem('isLoggedIn', 'true');
    login(provider + ' Kullanıcı');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brandTitle}>Vista Air</Text>
            <Text style={styles.welcomeText}>Hoş geldin</Text>
            <Text style={styles.subtitle}>Hesabına giriş yap</Text>
          </View>

          {/* OAuth Buttons */}
          <TouchableOpacity
            style={styles.oauthButton}
            onPress={() => handleMockOAuth('Apple')}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-apple" size={20} color={colors.textPrimary} />
            <Text style={styles.oauthText}>Apple ile giriş yap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.oauthButton}
            onPress={() => handleMockOAuth('Google')}
            activeOpacity={0.8}
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.oauthText}>Google ile giriş yap</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* E-posta input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-posta</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="ornek@email.com"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Şifre input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Şifre</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>
                  {showPassword ? 'Gizle' : 'Göster'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Şifreni mi unuttun?</Text>
          </TouchableOpacity>

          {/* Login CTA */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>Giriş yap</Text>
          </TouchableOpacity>

          {/* Register link */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>
              Hesabın yok mu?{' '}
              <Text style={styles.linkBold}>Kayıt ol</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  brandTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.coral,
    marginBottom: spacing.sm,
  },
  welcomeText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
    gap: spacing.sm,
  },
  oauthText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  googleG: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#4285F4',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 80,
  },
  eyeButton: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    minHeight: 44,
  },
  eyeText: {
    fontSize: fontSize.sm,
    color: colors.coral,
    fontWeight: fontWeight.medium,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
    paddingVertical: spacing.xs,
    minHeight: 44,
    justifyContent: 'center',
  },
  forgotText: {
    fontSize: fontSize.sm,
    color: colors.coral,
    fontWeight: fontWeight.medium,
  },
  ctaButton: {
    backgroundColor: colors.coral,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  ctaText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.white,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  linkText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  linkBold: {
    color: colors.coral,
    fontWeight: fontWeight.semiBold,
  },
});
