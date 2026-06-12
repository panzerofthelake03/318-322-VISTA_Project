import { useSettingsStore, Language, TempUnit } from '../store/settingsStore';

const tr = {
  // Tab bar
  tab_home: 'Ana sayfa',
  tab_graph: 'Grafik',
  tab_control: 'Kontrol',
  tab_settings: 'Ayarlar',

  // Settings screen
  settings: 'Ayarlar',
  app_section: 'UYGULAMA',
  language: 'Dil',
  units: 'Birimler',
  privacy: 'Gizlilik & Güvenlik',
  location_permission: 'Konum İzni',
  data_sharing: 'Veri Paylaşımı',
  notifications_section: 'BİLDİRİMLER',
  notifications: 'Bildirimler',
  pm25_alarm: 'PM2.5 Alarmı',
  pm25_alarm_sub: 'Eşik aşıldığında bildir',
  co2_warning: 'CO₂ Uyarısı',
  co2_warning_sub: '1000 ppm üzerinde',
  filter_change: 'Filtre Değişimi',
  filter_change_sub: '%20 altına düştüğünde',
  device_section: 'CİHAZ',
  device_info: 'Cihaz Bilgileri',
  help_support: 'Yardım ve Destek',

  // Control screen
  control: 'Kontrol',
  mode_auto: 'Otomatik',
  mode_sleep: 'Uyku',
  mode_manual: 'Manuel',
  fan_speed: 'Fan hızı',
  fan_quiet: 'Sessiz',
  fan_normal: 'Normal',
  fan_strong: 'Güçlü',
  fan_max: 'Max',
  water_level: 'Su Seviyesi',
  humidity_level: 'Nem Seviyesi',
  check_it: 'Kontrol et →',
  air_flow: 'Hava Akışı',
  light: 'Işık',
  night_mode: 'Gece modu',
  night_mode_sub: 'Orb söner, fan 1 kademe',
  baby_sensitivity: 'Bebek hassasiyeti',
  baby_sensitivity_sub: 'PM1.0 algılama aktif',
  voc_alarm: 'VOC alarmı',
  voc_alarm_sub: 'Kimyasal gaz bildirimi',
  auto_program: 'Otomatik program',

  // Dashboard screen
  good_morning: 'Günaydın',
  alert_present: 'Uyarı var',
  clean_air: 'Temiz hava',
  unhealthy: 'Sağlıksız',
  excellent: 'Mükemmel',
  critical: 'Kritik',
  critical_for_child: '{name} için kritik',
  max_power: 'Max güce geç',
  dismiss: 'Yoksay',
  humidity_short: 'Nem',
  co2_advice: 'havalandırma önerilir',
  see_solutions: 'Çözüm önerilerini gör →',
  temperature: 'Sıcaklık',
  ideal_range: 'İdeal aralık',
  filter_life: 'Filtre ömrü',
  months_left: '~4 ay kaldı',
  total_suffix: 'toplam',
  quick_control: 'Hızlı kontrol',

  // Graph screen
  graph: 'Grafik',
  good_for_child: 'Ada için iyi',
  avg_prefix: 'ort.',
  week: 'Hafta',
  month: 'Ay',
  last_30_days: 'Son 30 gün',
  pm25_24h: 'PM2.5 · 24 saat',
  child_threshold: 'Ada eşiği: 15μg',
  max_label: 'maks',
  threshold: 'eşik',
  clean_day: 'Temiz gün',
  avg_aqi: 'Ort. AQI',
  runtime: 'Çalışma',
};

const en: typeof tr = {
  tab_home: 'Home',
  tab_graph: 'Graph',
  tab_control: 'Control',
  tab_settings: 'Settings',

  settings: 'Settings',
  app_section: 'APPLICATION',
  language: 'Language',
  units: 'Units',
  privacy: 'Privacy & Security',
  location_permission: 'Location Permission',
  data_sharing: 'Data Sharing',
  notifications_section: 'NOTIFICATIONS',
  notifications: 'Notifications',
  pm25_alarm: 'PM2.5 Alarm',
  pm25_alarm_sub: 'Notify when threshold exceeded',
  co2_warning: 'CO₂ Warning',
  co2_warning_sub: 'Above 1000 ppm',
  filter_change: 'Filter Change',
  filter_change_sub: 'When below 20%',
  device_section: 'DEVICE',
  device_info: 'Device Info',
  help_support: 'Help & Support',

  control: 'Control',
  mode_auto: 'Auto',
  mode_sleep: 'Sleep',
  mode_manual: 'Manual',
  fan_speed: 'Fan speed',
  fan_quiet: 'Quiet',
  fan_normal: 'Normal',
  fan_strong: 'Strong',
  fan_max: 'Max',
  water_level: 'Water Level',
  humidity_level: 'Humidity Level',
  check_it: 'Check →',
  air_flow: 'Air Flow',
  light: 'Light',
  night_mode: 'Night mode',
  night_mode_sub: 'Orb off, fan 1 level down',
  baby_sensitivity: 'Baby sensitivity',
  baby_sensitivity_sub: 'PM1.0 detection active',
  voc_alarm: 'VOC alarm',
  voc_alarm_sub: 'Chemical gas notification',
  auto_program: 'Auto program',

  good_morning: 'Good morning',
  alert_present: 'Alert active',
  clean_air: 'Clean air',
  unhealthy: 'Unhealthy',
  excellent: 'Excellent',
  critical: 'Critical',
  critical_for_child: 'critical for {name}',
  max_power: 'Go max power',
  dismiss: 'Dismiss',
  humidity_short: 'Humidity',
  co2_advice: 'ventilation recommended',
  see_solutions: 'See solutions →',
  temperature: 'Temperature',
  ideal_range: 'Ideal range',
  filter_life: 'Filter life',
  months_left: '~4 months left',
  total_suffix: 'total',
  quick_control: 'Quick control',

  graph: 'Graph',
  good_for_child: 'Good for Ada',
  avg_prefix: 'avg.',
  week: 'Week',
  month: 'Month',
  last_30_days: 'Last 30 days',
  pm25_24h: 'PM2.5 · 24 hours',
  child_threshold: "Ada's threshold: 15μg",
  max_label: 'max',
  threshold: 'threshold',
  clean_day: 'Clean days',
  avg_aqi: 'Avg. AQI',
  runtime: 'Runtime',
};

const de: typeof tr = {
  tab_home: 'Startseite',
  tab_graph: 'Grafik',
  tab_control: 'Steuerung',
  tab_settings: 'Einstellungen',

  settings: 'Einstellungen',
  app_section: 'ANWENDUNG',
  language: 'Sprache',
  units: 'Einheiten',
  privacy: 'Datenschutz & Sicherheit',
  location_permission: 'Standortberechtigung',
  data_sharing: 'Datenfreigabe',
  notifications_section: 'BENACHRICHTIGUNGEN',
  notifications: 'Benachrichtigungen',
  pm25_alarm: 'PM2.5-Alarm',
  pm25_alarm_sub: 'Bei Überschreitung benachrichtigen',
  co2_warning: 'CO₂-Warnung',
  co2_warning_sub: 'Über 1000 ppm',
  filter_change: 'Filterwechsel',
  filter_change_sub: 'Unter 20%',
  device_section: 'GERÄT',
  device_info: 'Geräteinformationen',
  help_support: 'Hilfe & Support',

  control: 'Steuerung',
  mode_auto: 'Automatik',
  mode_sleep: 'Schlaf',
  mode_manual: 'Manuell',
  fan_speed: 'Lüftergeschwindigkeit',
  fan_quiet: 'Leise',
  fan_normal: 'Normal',
  fan_strong: 'Stark',
  fan_max: 'Max',
  water_level: 'Wasserstand',
  humidity_level: 'Luftfeuchtigkeit',
  check_it: 'Prüfen →',
  air_flow: 'Luftstrom',
  light: 'Licht',
  night_mode: 'Nachtmodus',
  night_mode_sub: 'Orb aus, Lüfter 1 Stufe runter',
  baby_sensitivity: 'Baby-Empfindlichkeit',
  baby_sensitivity_sub: 'PM1.0-Erkennung aktiv',
  voc_alarm: 'VOC-Alarm',
  voc_alarm_sub: 'Chemiegas-Benachrichtigung',
  auto_program: 'Automatikprogramm',

  good_morning: 'Guten Morgen',
  alert_present: 'Warnung aktiv',
  clean_air: 'Saubere Luft',
  unhealthy: 'Ungesund',
  excellent: 'Ausgezeichnet',
  critical: 'Kritisch',
  critical_for_child: 'kritisch für {name}',
  max_power: 'Auf Max schalten',
  dismiss: 'Ignorieren',
  humidity_short: 'Feuchte',
  co2_advice: 'Lüften empfohlen',
  see_solutions: 'Lösungen ansehen →',
  temperature: 'Temperatur',
  ideal_range: 'Idealer Bereich',
  filter_life: 'Filterlebensdauer',
  months_left: '~4 Monate übrig',
  total_suffix: 'gesamt',
  quick_control: 'Schnellsteuerung',

  graph: 'Grafik',
  good_for_child: 'Gut für Ada',
  avg_prefix: 'Ø',
  week: 'Woche',
  month: 'Monat',
  last_30_days: 'Letzte 30 Tage',
  pm25_24h: 'PM2.5 · 24 Stunden',
  child_threshold: 'Adas Schwelle: 15μg',
  max_label: 'max',
  threshold: 'Schwelle',
  clean_day: 'Saubere Tage',
  avg_aqi: 'Ø AQI',
  runtime: 'Laufzeit',
};

const translations: Record<Language, typeof tr> = { tr, en, de };

export type TranslationKey = keyof typeof tr;

export const LANGUAGE_LABELS: Record<Language, string> = {
  tr: 'Türkçe',
  en: 'İngilizce',
  de: 'Almanca',
};

export const UNIT_LABELS: Record<TempUnit, string> = {
  C: 'Celsius',
  F: 'Fahrenheit',
  K: 'Kelvin',
};

export function useTranslation() {
  const language = useSettingsStore((s) => s.language);
  const t = (key: TranslationKey) => translations[language][key];
  return { t, language };
}

export function formatTemperature(celsius: number, unit: TempUnit): string {
  switch (unit) {
    case 'F':
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    case 'K':
      return `${Math.round(celsius + 273.15)} K`;
    default:
      return `${celsius}°C`;
  }
}

export function useTemperature() {
  const unit = useSettingsStore((s) => s.unit);
  return { unit, format: (celsius: number) => formatTemperature(celsius, unit) };
}
