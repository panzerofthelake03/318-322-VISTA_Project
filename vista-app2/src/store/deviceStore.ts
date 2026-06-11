import { create } from 'zustand';
import { ALL_ROOMS, ROOM_DEVICE_MAP, RoomKey } from '../data/mockDevice';

type FanSpeed = 1 | 2 | 3 | 4;
type DeviceMode = 'auto' | 'sleep' | 'manual';

interface DeviceState {
  aqi: number;
  pm25: number;
  co2: number;
  humidity: number;
  temperature: number;
  fanSpeed: FanSpeed;
  mode: DeviceMode;
  isAlertActive: boolean;
  filterLife: { hepa: number; carbon: number; preFilter: number };
  totalRuntime: number;
  lightOn: boolean;
  lightPreset: 'Sunrise' | 'Sunset' | 'Moonlight';
  airFlow: 1 | 2 | 3 | 4;
  waterLevel: number;
  nightMode: boolean;
  babySensitivity: boolean;
  vocAlarm: boolean;
  autoProgram: boolean;
  rooms: typeof ALL_ROOMS;
  setFanSpeed: (s: FanSpeed) => void;
  setMode: (m: DeviceMode) => void;
  setAirFlow: (a: 1 | 2 | 3 | 4) => void;
  setLightPreset: (p: 'Sunrise' | 'Sunset' | 'Moonlight') => void;
  toggleLight: () => void;
  toggleNightMode: () => void;
  toggleBabySensitivity: () => void;
  toggleVocAlarm: () => void;
  toggleAutoProgram: () => void;
  switchRoom: (roomKey: RoomKey) => void;
  clearAlert: () => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  ...ROOM_DEVICE_MAP.baby_room,
  fanSpeed: 2,
  mode: 'auto',
  isAlertActive: false,
  filterLife: { hepa: 87, carbon: 72, preFilter: 45 },
  totalRuntime: 312,
  lightOn: true,
  lightPreset: 'Sunrise',
  airFlow: 2,
  waterLevel: 45,
  nightMode: true,
  babySensitivity: true,
  vocAlarm: true,
  autoProgram: true,
  rooms: ALL_ROOMS,

  setFanSpeed: (s) => set({ fanSpeed: s }),
  setMode: (m) => set({ mode: m }),
  setAirFlow: (a) => set({ airFlow: a }),
  setLightPreset: (p) => set({ lightPreset: p }),
  toggleLight: () => set((s) => ({ lightOn: !s.lightOn })),
  toggleNightMode: () => set((s) => ({ nightMode: !s.nightMode })),
  toggleBabySensitivity: () => set((s) => ({ babySensitivity: !s.babySensitivity })),
  toggleVocAlarm: () => set((s) => ({ vocAlarm: !s.vocAlarm })),
  toggleAutoProgram: () => set((s) => ({ autoProgram: !s.autoProgram })),

  switchRoom: (roomKey) => {
    const device = ROOM_DEVICE_MAP[roomKey];
    if (!device) return;
    const alert = device.isAlert ?? false;
    set({
      aqi: device.aqi,
      pm25: device.pm25,
      co2: device.co2,
      humidity: device.humidity,
      temperature: device.temperature,
      isAlertActive: alert,
      fanSpeed: alert ? 4 : 2,
      mode: 'auto',
    });
  },

  clearAlert: () =>
    set({
      aqi: 32,
      pm25: 8,
      co2: 612,
      isAlertActive: false,
      fanSpeed: 2,
      mode: 'auto',
    }),
}));
