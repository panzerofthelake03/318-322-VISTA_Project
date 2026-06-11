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
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'RoomTypeStep'>;
};

type RoomOption = {
  key: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  desc: string;
};

const ROOM_OPTIONS: RoomOption[] = [
  {
    key: 'baby_room',
    icon: 'home-outline',
    title: 'Çocuk odası',
    desc: 'Otomatik gece modu, düşük ses',
  },
  {
    key: 'living',
    icon: 'tv-outline',
    title: 'Oturma odası',
    desc: 'Yüksek sirkülasyon kapasitesi',
  },
  {
    key: 'kitchen',
    icon: 'restaurant-outline',
    title: 'Mutfak',
    desc: 'VOC ve CO₂ öncelikli',
  },
  {
    key: 'office',
    icon: 'briefcase-outline',
    title: 'Ofis',
    desc: 'CO₂ ve konsantrasyon modu',
  },
];

export function RoomTypeStep({ navigation }: Props) {
  const setRoomType = useOnboardingStore((s) => s.setRoomType);
  const currentRoomType = useOnboardingStore((s) => s.roomType);
  const [selected, setSelected] = useState<string>(currentRoomType || 'baby_room');

  return (
    <OnboardingLayout
      step={3}
      totalSteps={4}
      title="Cihaz nerede olacak?"
      subtitle="Oda tipi; hedef AQI ve gece modunu etkiler."
      onCta={() => {
        setRoomType(selected);
        navigation.navigate('PetStep');
      }}
      onBack={() => navigation.goBack()}
    >
      <View style={styles.cardsContainer}>
        {ROOM_OPTIONS.map((opt) => {
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
                  name={opt.icon}
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
