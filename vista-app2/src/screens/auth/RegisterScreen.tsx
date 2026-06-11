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
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export function RegisterScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((s) => s.login);

  const handleRegister = async () => {
    const name = fullName.trim() || 'Kullanıcı';
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
            <Text style={styles.welcomeText}>Hesap oluştur</Text>
            <Text style={styles.subtitle}>Çocuğun için profil kur</Text>
          </View>

          {/* OAuth Buttons */}
          <TouchableOpacity
            style={styles.oauthButton}
            onPress={() => handleMockOAuth('Apple')}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-apple" size={20} color={colors.textPrimary} />
            <Text style={styles.oauthText}>Apple ile kayıt ol</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.oauthButton}
            onPress={() => handleMockOAuth('Google')}
            activeOpacity={0.8}
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.oauthText}>Google ile kayıt ol</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Ad Soyad */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ad soyad</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              placeholder="Adınız Soyadınız"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* E-posta */}
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

          {/* Şifre */}
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

          {/* Register CTA */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>Kayıt ol</Text>
          </TouchableOpacity>

          {/* Login link */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              Zaten hesabın var mı?{' '}
              <Text style={styles.linkBold}>Giriş yap</Text>
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
  ctaButton: {
    backgroundColor: colors.coral,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginTop: spacing.md,
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
