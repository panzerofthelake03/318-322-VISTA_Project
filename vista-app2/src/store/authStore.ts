import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  login: (name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userName: '',
  login: (name) => set({ isLoggedIn: true, userName: name }),
  logout: () => set({ isLoggedIn: false, userName: '' }),
}));
