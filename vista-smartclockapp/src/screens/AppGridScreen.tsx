import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image,
} from 'react-native';
import { Colors } from '../theme/colors';

const VISTA_LOGO = require('../../assets/vista-logo.png');

const ICON_SIZE = 40;
const GAP = 6;

interface AppDef {
  id: string;
  icon?: string;
  isVista?: boolean;
  bg: string;
}

// 3-icon ve 4-icon satırlar dönüşümlü → doğal ortalama ile honeycomb offset oluşur
const ROWS: AppDef[][] = [
  [
    { id: 'phone',    icon: '📞', bg: '#184D2B' },
    { id: 'mail',     icon: '✉️',  bg: '#0B2D60' },
    { id: 'messages', icon: '💬', bg: '#184D2B' },
  ],
  [
    { id: 'activity', icon: '⊙',  bg: '#3A0F1C' },
    { id: 'fitness',  icon: '⊕',  bg: '#103040' },
    { id: 'running',  icon: '🏃', bg: '#1A3D20' },
    { id: 'settings', icon: '⚙️', bg: '#1C1C1E' },
  ],
  [
    { id: 'timer1',  icon: '⏱',  bg: '#3A2200' },
    { id: 'vista',   isVista: true, bg: '#12302A' },
    { id: 'clock',   icon: '🕐',  bg: '#3A2200' },
  ],
  [
    { id: 'globe',   icon: '🌐', bg: '#0B2D60' },
    { id: 'maps',    icon: '🗺️', bg: '#3A2200' },
    { id: 'weather', icon: '⛅', bg: '#0B2D60' },
    { id: 'timer2',  icon: '⏰', bg: '#3A2200' },
  ],
  [
    { id: 'photos',  icon: '🖼️', bg: '#3A2200' },
    { id: 'music',   icon: '🎵', bg: '#3A0F1C' },
    { id: 'health',  icon: '❤️', bg: '#3A0F1C' },
  ],
];

interface Props {
  onOpenVista: () => void;
}

export function AppGridScreen({ onOpenVista }: Props) {
  return (
    <ScrollView
      style={ag.root}
      contentContainerStyle={ag.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {ROWS.map((row, ri) => (
        <View key={ri} style={ag.row}>
          {row.map((app) => {
            if (app.isVista) {
              return (
                <TouchableOpacity
                  key={app.id}
                  style={[ag.icon, { backgroundColor: app.bg, borderColor: Colors.greenBorder, borderWidth: 1.5 }]}
                  onPress={onOpenVista}
                  activeOpacity={0.75}
                >
                  <Image source={VISTA_LOGO} style={ag.vistaImg} resizeMode="contain" />
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={app.id}
                style={[ag.icon, { backgroundColor: app.bg }]}
                activeOpacity={0.75}
              >
                <Text style={ag.iconEmoji}>{app.icon}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

const ag = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    paddingVertical: 10,
    gap: GAP,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
    justifyContent: 'center',
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  iconEmoji: {
    fontSize: 18,
  },
  vistaImg: {
    width: ICON_SIZE - 12,
    height: ICON_SIZE - 12,
  },
});
