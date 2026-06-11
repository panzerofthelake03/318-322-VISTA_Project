export const Colors = {
  background: '#0A0A0A',
  surface: '#1A1A1A',
  border: '#333333',
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#666666',

  aqiGood: '#4CAF50',
  aqiModerate: '#FFC107',
  aqiUnhealthy: '#F44336',

  babyMode: '#64B5F6',
  sleepMode: '#9575CD',
  turboMode: '#FF7043',
  coral: '#FF6B6B',
};

export type AqiLevel = 'good' | 'moderate' | 'unhealthy';

export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return Colors.aqiGood;
  if (aqi <= 100) return Colors.aqiModerate;
  return Colors.aqiUnhealthy;
}

export function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return 'İYİ';
  if (aqi <= 100) return 'ORTA';
  return 'KÖTÜ';
}
