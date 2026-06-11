import { create } from 'zustand';
import { ROOM_DEVICE_MAP, RoomKey } from '../data/mockDevice';

interface OnboardingState {
  isOnboardingComplete: boolean;
  userProfiles: string[];
  healthConditions: string[];
  roomType: string;
  routines: Record<string, boolean>;
  profileName: string;
  filterType: string;
  pmThreshold: number;

  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setUserProfiles: (profiles: string[]) => void;
  setHealthConditions: (conditions: string[]) => void;
  setRoomType: (room: string) => void;
  setRoutines: (routines: Record<string, boolean>) => void;
  setFilterType: (filterType: string) => void;
  setPmThreshold: (pmThreshold: number) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  isOnboardingComplete: false,
  userProfiles: [],
  healthConditions: [],
  roomType: '',
  routines: {
    morning: true,
    noon: true,
    night: true,
    weeklyReport: false,
  },
  profileName: 'Ada',
  filterType: 'HEPA H13',
  pmThreshold: 10,

  completeOnboarding: () => set({ isOnboardingComplete: true }),
  resetOnboarding: () =>
    set({
      isOnboardingComplete: false,
      userProfiles: [],
      healthConditions: [],
      roomType: '',
      routines: { morning: true, noon: true, night: true, weeklyReport: false },
    }),

  setUserProfiles: (profiles) => set({ userProfiles: profiles }),
  setHealthConditions: (conditions) => set({ healthConditions: conditions }),
  setRoomType: (room) => {
    const device = ROOM_DEVICE_MAP[room as RoomKey];
    set({ roomType: room, filterType: device?.filterType ?? 'HEPA H13' });
  },
  setRoutines: (routines) => set({ routines }),
  setFilterType: (filterType) => set({ filterType }),
  setPmThreshold: (pmThreshold) => set({ pmThreshold }),
}));
