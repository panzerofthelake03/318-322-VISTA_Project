import { create } from 'zustand';

type FanSpeed = 1 | 2 | 3 | 'Max';
type DeviceMode = 'auto' | 'turbo' | 'baby' | 'manual';

interface Room {
  name: string;
  aqi: number;
  status: string;
  statusColor: string;
}

interface DeviceState {
  aqi: number;
  pm25: number;
  co2: number;
  humidity: number;
  voc: string;
  fanSpeed: FanSpeed;
  mode: DeviceMode;
  isAlertActive: boolean;
  filters: { hepa: number; carbon: number; preFilter: number };
  rooms: Room[];

  setFanSpeed: (speed: FanSpeed) => void;
  setMode: (mode: DeviceMode) => void;
  simulateAlert: () => void;
  clearAlert: () => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  aqi: 32,
  pm25: 8,
  co2: 612,
  humidity: 58,
  voc: 'Normal',
  fanSpeed: 2,
  mode: 'auto',
  isAlertActive: false,
  filters: { hepa: 87, carbon: 72, preFilter: 45 },
  rooms: [
    { name: "Ada'nın odası", aqi: 32, status: 'İyi', statusColor: '#4CAF7D' },
    { name: 'Oturma odası', aqi: 74, status: 'Orta', statusColor: '#F5A623' },
  ],

  setFanSpeed: (speed) => set({ fanSpeed: speed }),
  setMode: (mode) => set({ mode }),

  simulateAlert: () =>
    set({
      aqi: 142,
      pm25: 68,
      voc: 'Yüksek',
      humidity: 65,
      isAlertActive: true,
      fanSpeed: 'Max',
      mode: 'turbo',
    }),

  clearAlert: () =>
    set({
      aqi: 32,
      pm25: 8,
      voc: 'Normal',
      isAlertActive: false,
      fanSpeed: 2,
      mode: 'auto',
    }),
}));
