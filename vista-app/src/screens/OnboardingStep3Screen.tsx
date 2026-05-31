import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingProgressBar, SelectionCard, PrimaryButton } from '../components';
import { colors, fontSize, fontWeight, spacing } from '../theme';
import { useOnboardingStore } from '../store/onboardingStore';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Step3'>;

const ROOMS = [
  { id: 'baby_room', icon: 'home-outline' as const, title: 'Çocuk odası', subtitle: 'Otomatik gece modu, düşük ses' },
  { id: 'living', icon: 'tv-outline' as const, title: 'Oturma odası', subtitle: 'Yüksek sirkülasyon kapasitesi' },
  { id: 'kitchen', icon: 'restaurant-outline' as const, title: 'Mutfak', subtitle: 'VOC ve CO₂ öncelikli' },
  { id: 'office', icon: 'briefcase-outline' as const, title: 'Ofis', subtitle: 'CO₂ ve konsantrasyon modu' },
];

export function OnboardingStep3Screen({ navigation }: Props) {
  const [selected, setSelected] = useState('');
  const setRoomType = useOnboardingStore((s) => s.setRoomType);

  const handleContinue = () => {
    setRoomType(selected);
    navigation.navigate('Step4');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <OnboardingProgressBar currentStep={3} totalSteps={4} />
        <Text style={styles.title}>Cihaz nerede olacak?</Text>
        <Text style={styles.subtitle}>Oda tipi; hedef AQI ve gece modunu etkiler.</Text>
        <View style={styles.list}>
          {ROOMS.map((r) => (
            <SelectionCard
              key={r.id}
              icon={r.icon}
              title={r.title}
              subtitle={r.subtitle}
              selected={selected === r.id}
              onPress={() => setSelected(r.id)}
            />
          ))}
        </View>
        <PrimaryButton title="Devam" onPress={handleContinue} disabled={!selected} />
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
