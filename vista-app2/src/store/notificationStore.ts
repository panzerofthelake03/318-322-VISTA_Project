import { create } from 'zustand';
import { mockNotifications } from '../data/mockDevice';

export type NotificationType = 'pm25' | 'co2' | 'report' | 'filter' | 'mode';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  time: string;
  date: 'Bugün' | 'Dün';
}

interface NotificationState {
  notifications: AppNotification[];
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: mockNotifications as AppNotification[],
  clearAll: () => set({ notifications: [] }),
}));
