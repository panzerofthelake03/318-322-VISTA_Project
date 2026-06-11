export type RoomKey = 'baby_room' | 'living' | 'kitchen' | 'office';

export interface RoomDevice {
  name: string;
  filterType: string;
  aqi: number;
  pm25: number;
  co2: number;
  humidity: number;
  temperature: number;
  status: 'İyi' | 'Orta' | 'Sağlıksız';
  statusColor: string;
  isAlert?: boolean;
}

export const ROOM_DEVICE_MAP: Record<RoomKey, RoomDevice> = {
  baby_room: {
    name: 'Çocuk Odası',
    filterType: 'HEPA H13',
    aqi: 32,
    pm25: 8,
    co2: 612,
    humidity: 58,
    temperature: 22,
    status: 'İyi',
    statusColor: '#5B8C5A',
  },
  living: {
    name: 'Oturma Odası',
    filterType: 'HEPA H11',
    aqi: 148,
    pm25: 72,
    co2: 980,
    humidity: 55,
    temperature: 23,
    status: 'Sağlıksız',
    statusColor: '#C0392B',
    isAlert: true,
  },
  kitchen: {
    name: 'Mutfak',
    filterType: 'Aktif Karbon',
    aqi: 131,
    pm25: 58,
    co2: 1140,
    humidity: 62,
    temperature: 24,
    status: 'Sağlıksız',
    statusColor: '#C0392B',
    isAlert: true,
  },
  office: {
    name: 'Ofis',
    filterType: 'Kombine H13+Karbon',
    aqi: 55,
    pm25: 14,
    co2: 1100,
    humidity: 48,
    temperature: 21,
    status: 'Orta',
    statusColor: '#D4A017',
  },
};

export const ALL_ROOMS = Object.entries(ROOM_DEVICE_MAP).map(([key, val]) => ({
  key: key as RoomKey,
  ...val,
}));

export const weeklyAQI = [
  { day: 'Pzt', value: 38 },
  { day: 'Sal', value: 45 },
  { day: 'Çrş', value: 92 },
  { day: 'Prş', value: 52 },
  { day: 'Cum', value: 38 },
  { day: 'Cmt', value: 38 },
  { day: 'Pzr', value: 41 },
];

export const hourlyPM25 = [
  { hour: '00:00', value: 6 },
  { hour: '03:00', value: 5 },
  { hour: '06:00', value: 8 },
  { hour: '09:00', value: 12 },
  { hour: '12:00', value: 18 },
  { hour: '15:00', value: 24 },
  { hour: '18:00', value: 32 },
  { hour: '21:00', value: 22 },
];

export const mockNotifications = [
  {
    id: '1',
    type: 'pm25' as const,
    title: 'PM2.5 alarm · Ada',
    message: 'Çocuk odası PM2.5 değeri 68 μg/m³ oldu. Cihaz max güce geçirildi.',
    link: 'Cihazı kontrol et →',
    time: '14:32',
    date: 'Bugün' as const,
  },
  {
    id: '2',
    type: 'co2' as const,
    title: 'CO₂ yüksek',
    message: '1.100 CO₂ algılandı.',
    link: 'Çözüm önerilerini gör →',
    time: '13:10',
    date: 'Bugün' as const,
  },
  {
    id: '3',
    type: 'report' as const,
    title: 'Sabah raporu',
    message: "Ada'nın odası gece boyunca temiz kaldı. Ort. AQI: 28.",
    time: '08:00',
    date: 'Bugün' as const,
  },
  {
    id: '4',
    type: 'filter' as const,
    title: 'Ön filtre uyarısı',
    message: 'Ön filtre %45 kaldı. Yakında değiştirin.',
    link: 'Filtre durumunu gör →',
    time: '09:15',
    date: 'Dün' as const,
  },
  {
    id: '5',
    type: 'mode' as const,
    title: 'Uyku modu aktif',
    message: 'Fan hızı 1, orb söndü.',
    time: '22:30',
    date: 'Dün' as const,
  },
];
