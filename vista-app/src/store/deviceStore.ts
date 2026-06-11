import { create } from 'zustand';
import { ALL_ROOMS, ROOM_DEVICE_MAP, RoomKey } from '../data/mockDevice';

type FanSpeed = 1 | 2 | 3 | 'Max';
type DeviceMode = 'auto' | 'turbo' | 'baby' | 'manual';

interface DeviceState {
  // Aktif oda verisi (onboardingStore'daki roomType'a göre güncellenir)
  aqi: number;
  pm25: number;
  co2: number;
  humidity: number;
  voc: string;
  fanSpeed: FanSpeed;
  mode: DeviceMode;
  isAlertActive: boolean;
  filters: { hepa: number; carbon: number; preFilter: number };

  // Tüm odaların listesi (Profil'de seçilen oda değişince güncellenir)
  rooms: typeof ALL_ROOMS;

  isAutoModeActive: boolean;
  setFanSpeed: (speed: FanSpeed) => void;
  setMode: (mode: DeviceMode) => void;
  toggleAutoMode: () => void;
  switchRoom: (roomKey: RoomKey) => void;
  simulateAlert: () => void;
  clearAlert: () => void;
}

const DEFAULT_FILTERS = { hepa: 87, carbon: 72, preFilter: 45 };

export const useDeviceStore = create<DeviceState>((set) => ({
  // Başlangıçta baby_room verileri
  ...ROOM_DEVICE_MAP.baby_room,
  voc: 'Normal',
  fanSpeed: 2,
  mode: 'auto',
  isAlertActive: false,
  isAutoModeActive: true,
  filters: DEFAULT_FILTERS,
  rooms: ALL_ROOMS,

  setFanSpeed: (speed) => set({ fanSpeed: speed }),
  setMode: (mode) => set({ mode }),
  toggleAutoMode: () => set((s) => ({ isAutoModeActive: !s.isAutoModeActive })),

  // Oda değişince aktif odanın cihaz verilerini yükle
  switchRoom: (roomKey) => {
    const device = ROOM_DEVICE_MAP[roomKey];
    if (!device) return;
    const alert = device.isAlert ?? false;
    set({
      aqi: device.aqi,
      pm25: device.pm25,
      co2: device.co2,
      humidity: device.humidity,
      voc: alert ? 'Yüksek' : 'Normal',
      isAlertActive: alert,
      fanSpeed: alert ? 'Max' : 2,
      mode: alert ? 'turbo' : 'auto',
    });
  },

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

  clearAlert: () => {
    // Alert kapanınca mevcut odanın verilerine dön
    set((state) => {
      const currentRooms = state.rooms;
      const activeRoom = currentRooms[0]; // geçici — switchRoom ile senkronize
      return {
        aqi: 32,
        pm25: 8,
        voc: 'Normal',
        isAlertActive: false,
        fanSpeed: 2,
        mode: 'auto',
      };
    });
  },
}));
