import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  login: (name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userName: '',
      login: (name) => set({ isLoggedIn: true, userName: name }),
      logout: () => set({ isLoggedIn: false, userName: '' }),
    }),
    {
      name: 'vista-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
