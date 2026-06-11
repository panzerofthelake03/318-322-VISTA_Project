import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

export interface ModalOption {
  label: string;
  subtitle?: string;
  value: string;
}

interface Props {
  visible: boolean;
  title: string;
  options: ModalOption[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function SelectionModal({ visible, title, options, selected, onSelect, onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 4,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSelect = async (value: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(value);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Seçenekler */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((opt, i) => {
            const isSelected = opt.value === selected;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.option,
                  i < options.length - 1 && styles.optionBorder,
                  isSelected && styles.optionSelected,
                ]}
                onPress={() => handleSelect(opt.value)}
                activeOpacity={0.7}
              >
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {opt.label}
                  </Text>
                  {opt.subtitle && (
                    <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
                  )}
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.coral} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    maxHeight: '75%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    color: colors.textPrimary,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    minHeight: 56,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.coralLight,
    marginHorizontal: -spacing.xl,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  optionText: { flex: 1 },
  optionLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  optionLabelSelected: {
    color: colors.coral,
    fontWeight: fontWeight.semiBold,
  },
  optionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
