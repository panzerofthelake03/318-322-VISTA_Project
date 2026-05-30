import { create } from 'zustand';

interface OnboardingState {
  userProfiles: string[];
  healthConditions: string[];
  roomType: string;
  routines: Record<string, boolean>;
  profileName: string;
  filterType: string;
  pmThreshold: number;

  setUserProfiles: (profiles: string[]) => void;
  setHealthConditions: (conditions: string[]) => void;
  setRoomType: (room: string) => void;
  setRoutines: (routines: Record<string, boolean>) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
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

  setUserProfiles: (profiles) => set({ userProfiles: profiles }),
  setHealthConditions: (conditions) => set({ healthConditions: conditions }),
  setRoomType: (room) => set({ roomType: room }),
  setRoutines: (routines) => set({ routines }),
}));
