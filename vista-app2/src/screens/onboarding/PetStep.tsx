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
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'PetStep'>;
};

type PetOption = 'yes' | 'no';

export function PetStep({ navigation }: Props) {
  const setHasPet = useOnboardingStore((s) => s.setHasPet);
  const [selected, setSelected] = useState<PetOption>('no');

  const handleComplete = () => {
    setHasPet(selected === 'yes');
    navigation.navigate('SetupComplete');
  };

  return (
    <OnboardingLayout
      step={4}
      totalSteps={4}
      title="Evde seninle yaşayan evcil bir dostun var mı?"
      ctaLabel="Kurulumu tamamla"
      onCta={handleComplete}
      onBack={() => navigation.goBack()}
    >
      <View style={styles.cardsContainer}>
        {/* Yes option */}
        <TouchableOpacity
          style={[styles.card, selected === 'yes' && styles.cardSelected]}
          onPress={() => setSelected('yes')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, selected === 'yes' && styles.iconContainerSelected]}>
            <Ionicons
              name="paw-outline"
              size={22}
              color={selected === 'yes' ? colors.coral : colors.textSecondary}
            />
          </View>
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, selected === 'yes' && styles.cardTitleSelected]}>
              Evet, kedi/köpek var
            </Text>
            <Text style={styles.cardDesc}>Tüy ve koku modu için</Text>
          </View>
          {selected === 'yes' && (
            <Ionicons name="checkmark-circle" size={20} color={colors.coral} />
          )}
        </TouchableOpacity>

        {/* No option */}
        <TouchableOpacity
          style={[styles.card, selected === 'no' && styles.cardSelected]}
          onPress={() => setSelected('no')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, selected === 'no' && styles.iconContainerSelected]}>
            <Ionicons
              name="close-outline"
              size={22}
              color={selected === 'no' ? colors.coral : colors.textSecondary}
            />
          </View>
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, selected === 'no' && styles.cardTitleSelected]}>
              Hayır, yok
            </Text>
          </View>
          {selected === 'no' && (
            <Ionicons name="checkmark-circle" size={20} color={colors.coral} />
          )}
        </TouchableOpacity>
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
