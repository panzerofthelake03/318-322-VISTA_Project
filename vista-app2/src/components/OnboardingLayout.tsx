import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

interface Props {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaDisabled?: boolean;
  onCta: () => void;
  onBack: () => void;
  children: React.ReactNode;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function OnboardingLayout({
  step,
  totalSteps,
  title,
  subtitle,
  ctaLabel = 'Devam et',
  ctaDisabled = false,
  onCta,
  onBack,
  children,
}: Props) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step / totalSteps,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [step, totalSteps]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH - spacing.lg * 2],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        <Text style={styles.backText}>Geri</Text>
      </TouchableOpacity>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepLabel}>
          {step}/{totalSteps}
        </Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.ctaButton, ctaDisabled && styles.ctaDisabled]}
          onPress={onCta}
          disabled={ctaDisabled}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaText, ctaDisabled && styles.ctaTextDisabled]}>
            {ctaLabel}
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    minHeight: 44,
  },
  backText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
    fontWeight: fontWeight.medium,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.coral,
    borderRadius: radius.full,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  stepLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  ctaContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  ctaButton: {
    backgroundColor: colors.coral,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  ctaDisabled: {
    backgroundColor: colors.border,
  },
  ctaText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.white,
  },
  ctaTextDisabled: {
    color: colors.textSecondary,
  },
});
