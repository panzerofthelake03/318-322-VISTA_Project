import { create } from 'zustand';

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
  setRoomType: (room) => set({ roomType: room }),
  setRoutines: (routines) => set({ routines }),
}));
