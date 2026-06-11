import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { OnboardingLayout } from '../../components/OnboardingLayout';
import { useOnboardingStore } from '../../store/onboardingStore';
import { colors, spacing, fontSize, fontWeight, radius } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'UserProfileStep'>;
};

type ProfileOption = {
  key: 'baby' | 'child' | 'adult' | 'elderly';
  title: string;
  desc: string;
};

const PROFILE_OPTIONS: ProfileOption[] = [
  { key: 'baby', title: 'Bebek veya küçük çocuk', desc: '0–6 yaş, hassas profil' },
  { key: 'child', title: 'Çocuk', desc: '7–17 yaş' },
  { key: 'adult', title: 'Yetişkin', desc: '18+ yaş' },
  { key: 'elderly', title: 'Yaşlı birey', desc: '65+, öncelikli uyarılar' },
];

export function UserProfileStep({ navigation }: Props) {
  const setUserProfile = useOnboardingStore((s) => s.setUserProfile);
  const [selected, setSelected] = useState<ProfileOption['key'] | null>(null);

  return (
    <OnboardingLayout
      step={1}
      totalSteps={4}
      title="Bu cihazı kim kullanacak?"
      subtitle="Birden fazla seçebilirsiniz."
      ctaDisabled={selected === null}
      onCta={() => {
        if (selected) {
          setUserProfile(selected);
          navigation.navigate('HealthConditionStep');
        }
      }}
      onBack={() => navigation.goBack()}
    >
      <View style={styles.cardsContainer}>
        {PROFILE_OPTIONS.map((opt) => {
          const isSelected = selected === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => setSelected(opt.key)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={isSelected ? colors.coral : colors.textSecondary}
                />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                  {opt.title}
                </Text>
                <Text style={styles.cardDesc}>{opt.desc}</Text>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={20} color={colors.coral} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 72,
    gap: spacing.md,
  },
  cardSelected: {
    backgroundColor: colors.coralLight,
    borderColor: colors.coral,
  },
  iconContainer: {
    width: 44,
    height: 44,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSelected: {
    backgroundColor: colors.coralLight,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cardTitleSelected: {
    color: colors.coral,
  },
  cardDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
