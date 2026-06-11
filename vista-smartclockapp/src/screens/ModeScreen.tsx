import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  onBack: () => void;
}

type Mode = 'baby' | 'sleep' | 'turbo' | null;

const MODES = [
  { id: 'baby' as Mode, label: 'Bebek', icon: '🌙', color: Colors.babyMode, desc: 'Sessiz & Loş' },
  { id: 'sleep' as Mode, label: 'Uyku', icon: '💤', color: Colors.sleepMode, desc: 'Otomatik' },
  { id: 'turbo' as Mode, label: 'Turbo', icon: '💨', color: Colors.turboMode, desc: 'Max Güç' },
];

export function ModeScreen({ onBack }: Props) {
  const [activeMode, setActiveMode] = useState<Mode>(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>‹ Geri</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Mod Seçimi</Text>

      <View style={styles.grid}>
        {MODES.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeCard,
                isActive && { borderColor: mode.color, backgroundColor: mode.color + '18' },
              ]}
              onPress={() => setActiveMode(isActive ? null : mode.id)}
              activeOpacity={0.75}
            >
              <Text style={styles.modeIcon}>{mode.icon}</Text>
              <Text style={[styles.modeLabel, isActive && { color: mode.color }]}>
                {mode.label}
              </Text>
              <Text style={styles.modeDesc}>{mode.desc}</Text>
              {isActive && (
                <View style={[styles.activeDot, { backgroundColor: mode.color }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {activeMode && (
        <Text style={styles.activeText}>
          {MODES.find(m => m.id === activeMode)?.label} modu aktif
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  modeCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    position: 'relative',
  },
  modeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  modeLabel: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  modeDesc: {
    color: Colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
  },
  activeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeText: {
    color: Colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
