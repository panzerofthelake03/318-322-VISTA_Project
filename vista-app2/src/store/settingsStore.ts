import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'tr' | 'en' | 'de';
export type TempUnit = 'C' | 'F' | 'K';

interface SettingsState {
  language: Language;
  unit: TempUnit;
  setLanguage: (l: Language) => void;
  setUnit: (u: TempUnit) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'tr',
      unit: 'C',
      setLanguage: (l) => set({ language: l }),
      setUnit: (u) => set({ unit: u }),
    }),
    {
      name: 'vista-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
