export const Colors = {
  // Backgrounds (Figma design tokens)
  bgDefault:  '#1a1510',
  bgGood:     '#141a14',
  bgModerate: '#1a1608',
  bgBad:      '#1a0c0c',
  bgSleep:    '#0e0c14',

  // Text
  textPrimary:   '#EDE8DF',
  textSecondary: '#C4BAA8',
  textDim:       'rgba(237,232,223,0.55)',
  textDimmer:    'rgba(237,232,223,0.28)',

  // Green (İyi / Good)
  greenBorder: '#4A9E72',
  greenText:   '#6FCF9A',

  // Amber (Orta / Moderate)
  amberBorder: '#D4873A',
  amberText:   '#F5C87A',

  // Coral (Kötü / Bad)
  coralBorder: '#B84030',
  coralText:   '#E07860',

  // Purple (Uyku / Sleep)
  purpleBorder: '#5050A0',
  purpleText:   '#A8A0E0',

  // Legacy aliases (used in existing code)
  background:    '#1a1510',
  surface:       'rgba(255,255,255,0.06)',
  border:        'rgba(237,232,223,0.12)',
  aqiGood:       '#6FCF9A',
  aqiModerate:   '#F5C87A',
  aqiUnhealthy:  '#E07860',
  babyMode:      '#A8A0E0',
  sleepMode:     '#A8A0E0',
  turboMode:     '#E07860',
  coral:         '#E07860',
  textMuted:     'rgba(237,232,223,0.28)',
};

export type AqiLevel = 'good' | 'moderate' | 'bad' | 'sleep';

export function getAqiLevel(aqi: number): AqiLevel {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  return 'bad';
}

export function getLevelColors(level: AqiLevel) {
  switch (level) {
    case 'good':     return { bg: Colors.bgGood,     accent: Colors.greenText,  border: Colors.greenBorder };
    case 'moderate': return { bg: Colors.bgModerate,  accent: Colors.amberText,  border: Colors.amberBorder };
    case 'bad':      return { bg: Colors.bgBad,       accent: Colors.coralText,  border: Colors.coralBorder };
    case 'sleep':    return { bg: Colors.bgSleep,     accent: Colors.purpleText, border: Colors.purpleBorder };
  }
}

export function getAqiLabel(aqi: number, level?: AqiLevel): string {
  if (level === 'sleep') return 'Uyku modu';
  if (aqi <= 50)  return 'Temiz hava';
  if (aqi <= 100) return 'Orta kalite';
  return 'Sağlıksız!';
}

export function getAqiColor(aqi: number): string {
  return getLevelColors(getAqiLevel(aqi)).accent;
}
