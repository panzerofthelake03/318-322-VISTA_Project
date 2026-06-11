import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoOuter}>
            <View style={styles.logoLeaf1} />
            <View style={styles.logoLeaf2} />
            <Text style={styles.logoLetter}>V</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Vista Air</Text>
        <Text style={styles.subtitle}>Temiz hava, güvenli büyüme</Text>
      </View>

      {/* Bottom actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Başla</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>
            Zaten hesabın var?{' '}
            <Text style={styles.linkTextBold}>Giriş yap</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    marginBottom: spacing.xxl,
  },
  logoOuter: {
    width: 96,
    height: 96,
    backgroundColor: colors.coralLight,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoLeaf1: {
    position: 'absolute',
    width: 48,
    height: 48,
    backgroundColor: colors.coral,
    borderRadius: 24,
    top: 8,
    left: 8,
    opacity: 0.7,
  },
  logoLeaf2: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#5B8C5A',
    borderRadius: 20,
    bottom: 10,
    right: 8,
    opacity: 0.6,
  },
  logoLetter: {
    fontSize: 36,
    fontWeight: fontWeight.bold,
    color: colors.white,
    zIndex: 1,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  ctaButton: {
    backgroundColor: colors.coral,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
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
  linkTextBold: {
    color: colors.coral,
    fontWeight: fontWeight.semiBold,
  },
});
