// Oda → cihaz eşleşme tablosu (filtre tipi odaya bağlı, değiştirilemez)
export type RoomKey = 'baby_room' | 'living' | 'kitchen' | 'office';

export interface RoomDevice {
  name: string;
  filterType: string;
  aqi: number;
  pm25: number;
  co2: number;
  humidity: number;
  status: 'İyi' | 'Orta' | 'Sağlıksız';
  statusColor: string;
  isAlert?: boolean;
}

export const ROOM_DEVICE_MAP: Record<RoomKey, RoomDevice> = {
  baby_room: {
    name: "Ada'nın odası",
    filterType: 'HEPA H13',
    aqi: 32,
    pm25: 8,
    co2: 612,
    humidity: 58,
    status: 'İyi',
    statusColor: '#4CAF7D',
  },
  living: {
    name: 'Oturma odası',
    filterType: 'HEPA H11',
    aqi: 148,
    pm25: 72,
    co2: 980,
    humidity: 55,
    status: 'Sağlıksız',
    statusColor: '#D0021B',
    isAlert: true,
  },
  kitchen: {
    name: 'Mutfak',
    filterType: 'Aktif Karbon',
    aqi: 131,
    pm25: 58,
    co2: 1140,
    humidity: 62,
    status: 'Sağlıksız',
    statusColor: '#D0021B',
    isAlert: true,
  },
  office: {
    name: 'Ofis',
    filterType: 'Kombine H13+Karbon',
    aqi: 55,
    pm25: 14,
    co2: 1100,
    humidity: 48,
    status: 'Orta',
    statusColor: '#F5A623',
  },
};

export const ALL_ROOMS = Object.entries(ROOM_DEVICE_MAP).map(([key, val]) => ({
  key: key as RoomKey,
  ...val,
}));

export const mockNormalDevice = {
  aqi: 32,
  pm25: 8,
  co2: 612,
  humidity: 58,
  voc: 'Normal',
  fanSpeed: 2 as const,
  mode: 'auto' as const,
  isAlertActive: false,
  filters: { hepa: 87, carbon: 72, preFilter: 45 },
  rooms: [
    { name: "Ada'nın odası", aqi: 32, status: 'İyi', statusColor: '#4CAF7D' },
    { name: 'Oturma odası', aqi: 74, status: 'Orta', statusColor: '#F5A623' },
  ],
};

export const mockAlertDevice = {
  aqi: 142,
  pm25: 68,
  co2: 890,
  humidity: 65,
  voc: 'Yüksek',
  fanSpeed: 'Max' as const,
  mode: 'turbo' as const,
  isAlertActive: true,
  filters: { hepa: 87, carbon: 72, preFilter: 45 },
  rooms: [
    { name: "Ada'nın odası", aqi: 142, status: 'Sağlıksız', statusColor: '#D0021B' },
    { name: 'Oturma odası', aqi: 98, status: 'Orta', statusColor: '#F5A623' },
  ],
};

// Haftalık PM2.5 verileri (son 7 gün)
export const weeklyPM25 = [
  { day: 'Pzt', value: 12 },
  { day: 'Sal', value: 8 },
  { day: 'Çar', value: 22 },
  { day: 'Per', value: 15 },
  { day: 'Cum', value: 68 },
  { day: 'Cmt', value: 30 },
  { day: 'Paz', value: 10 },
];

export const weeklyHumidity = [
  { day: 'Pzt', value: 54 },
  { day: 'Sal', value: 58 },
  { day: 'Çar', value: 61 },
  { day: 'Per', value: 57 },
  { day: 'Cum', value: 65 },
  { day: 'Cmt', value: 60 },
  { day: 'Paz', value: 58 },
];

export const mockAlerts = [
  {
    id: '1',
    type: 'pm25' as const,
    message: "Ada için PM2.5 alarmı!",
    detail: 'PM2.5 seviyesi 68 μg/m³ — WHO sınırının 6.8 katı.',
    time: '14:32',
    date: 'Bugün',
    resolved: true,
  },
  {
    id: '2',
    type: 'filter' as const,
    message: 'Ön filtre yakında bitiyor',
    detail: 'Ön filtre %45 dolulukta. Sipariş vermeyi düşünün.',
    time: '09:15',
    date: 'Bugün',
    resolved: false,
  },
  {
    id: '3',
    type: 'pm25' as const,
    message: "Ada için PM2.5 alarmı!",
    detail: 'PM2.5 seviyesi 55 μg/m³.',
    time: '22:47',
    date: 'Dün',
    resolved: true,
  },
  {
    id: '4',
    type: 'aqi' as const,
    message: 'Hava kalitesi düştü',
    detail: 'AQI 102 — Hassas gruplar için sağlıksız.',
    time: '16:20',
    date: 'Dün',
    resolved: true,
  },
];
