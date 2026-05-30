import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingProgressBar, SelectionCard, PrimaryButton } from '../components';
import { colors, fontSize, fontWeight, spacing } from '../theme';
import { useOnboardingStore } from '../store/onboardingStore';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Step1'>;

const OPTIONS = [
  { id: 'baby', icon: 'person-outline' as const, title: 'Bebek veya küçük çocuk', subtitle: '0–6 yaş, hassas profil' },
  { id: 'child', icon: 'body-outline' as const, title: 'Çocuk', subtitle: '7–17 yaş' },
  { id: 'adult', icon: 'people-outline' as const, title: 'Yetişkin', subtitle: '18+ yaş' },
  { id: 'elder', icon: 'accessibility-outline' as const, title: 'Yaşlı birey', subtitle: '65+, öncelikli uyarılar' },
];

export function OnboardingStep1Screen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const setUserProfiles = useOnboardingStore((s) => s.setUserProfiles);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    setUserProfiles(selected);
    navigation.navigate('Step2');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <OnboardingProgressBar currentStep={1} totalSteps={4} />
        <Text style={styles.title}>Bu cihazı kim kullanacak?</Text>
        <Text style={styles.subtitle}>Birden fazla seçebilirsiniz.</Text>
        <View style={styles.list}>
          {OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.id}
              icon={opt.icon}
              title={opt.title}
              subtitle={opt.subtitle}
              selected={selected.includes(opt.id)}
              onPress={() => toggle(opt.id)}
            />
          ))}
        </View>
        <PrimaryButton title="Devam" onPress={handleContinue} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  list: {
    gap: spacing.md,
    marginBottom: spacing.xxxl,
  },
});
