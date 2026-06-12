import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROOM_DEVICE_MAP, RoomKey } from '../data/mockDevice';

type UserProfile = 'baby' | 'child' | 'adult' | 'elderly';

interface OnboardingState {
  isOnboardingComplete: boolean;
  childName: string;
  childAge: number;
  userProfile: UserProfile | null;
  healthConditions: string[];
  roomType: string;
  filterType: string;
  pmThreshold: number;
  hasPet: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setUserProfile: (p: UserProfile) => void;
  toggleHealthCondition: (c: string) => void;
  setRoomType: (r: string) => void;
  setPmThreshold: (v: number) => void;
  setHasPet: (v: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
  isOnboardingComplete: false,
  childName: 'Ada',
  childAge: 4,
  userProfile: null,
  healthConditions: [],
  roomType: 'baby_room',
  filterType: 'HEPA H13',
  pmThreshold: 10,
  hasPet: false,
  completeOnboarding: () => set({ isOnboardingComplete: true }),
  resetOnboarding: () =>
    set({
      isOnboardingComplete: false,
      userProfile: null,
      healthConditions: [],
      roomType: 'baby_room',
      filterType: 'HEPA H13',
      pmThreshold: 10,
      hasPet: false,
    }),
  setUserProfile: (p) => set({ userProfile: p }),
  toggleHealthCondition: (c) =>
    set((s) => {
      if (c === 'Hiçbiri') return { healthConditions: ['Hiçbiri'] };
      const next = s.healthConditions.filter((x) => x !== 'Hiçbiri');
      return {
        healthConditions: next.includes(c)
          ? next.filter((x) => x !== c)
          : [...next, c],
      };
    }),
  setRoomType: (r) => {
    const device = ROOM_DEVICE_MAP[r as RoomKey];
    set({ roomType: r, filterType: device?.filterType ?? 'HEPA H13' });
  },
      setPmThreshold: (v) => set({ pmThreshold: v }),
      setHasPet: (v) => set({ hasPet: v }),
    }),
    {
      name: 'vista-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
