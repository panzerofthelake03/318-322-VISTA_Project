import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { useOnboardingStore } from '../../store/onboardingStore';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'HealthConditionStep'>;
};

const CONDITIONS = [
  'Astım',
  'Alerji',
  'KOAH',
  'Polen has.',
  'Toz alerjisi',
  'Deri hassas.',
  'Kalp hastalığı',
  'Hiçbiri',
];

export function HealthConditionStep({ navigation }: Props) {
  const healthConditions = useOnboardingStore((s) => s.healthConditions);
  const toggleHealthCondition = useOnboardingStore((s) => s.toggleHealthCondition);

  return (
    <OnboardingLayout
      step={2}
      totalSteps={4}
      title="Sağlık durumu var mı?"
      subtitle="Filtre hassasiyetini buna göre ayarlayacağız."
      onCta={() => navigation.navigate('RoomTypeStep')}
      onBack={() => navigation.goBack()}
    >
      <View style={styles.chipsContainer}>
        {CONDITIONS.map((condition) => {
          const isSelected = healthConditions.includes(condition);
          return (
            <TouchableOpacity
              key={condition}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => toggleHealthCondition(condition)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {condition}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {healthConditions.length > 0 && healthConditions[0] !== 'Hiçbiri' && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackLabel}>Seçilen:</Text>
          <Text style={styles.feedbackText}>{healthConditions.join(', ')}</Text>
        </View>
      )}
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: colors.coral,
    backgroundColor: colors.coralLight,
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  chipTextSelected: {
    color: colors.coral,
    fontWeight: fontWeight.semiBold,
  },
  feedbackContainer: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  feedbackLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  feedbackText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
});
