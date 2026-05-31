export const colors = {
  coral: '#E07B6A',
  coralLight: '#F5E8E5',
  coralBorder: '#E07B6A',

  green: '#4CAF7D',
  greenLight: '#EAF5EF',

  amber: '#F5A623',
  amberLight: '#FFF4E0',

  red: '#D0021B',
  redLight: '#FDE8EB',

  black: '#1A1A1A',
  white: '#FFFFFF',

  textPrimary: '#1A1A1A',
  textSecondary: '#8A8A8A',

  border: '#E8E8E8',
  background: '#FAFAFA',
  cardBackground: '#FFFFFF',

  navActive: '#E07B6A',
  navInactive: '#8A8A8A',
} as const;

export type ColorKey = keyof typeof colors;
