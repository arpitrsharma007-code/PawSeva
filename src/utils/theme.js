import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#0F0620',
  card: '#1A0A2E',
  cardLight: '#2D1B69',
  accent: '#E6B422',
  accentLight: '#E6B42233',
  success: '#2EA043',
  successLight: '#2EA04333',
  danger: '#F85149',
  dangerLight: '#F8514933',
  info: '#58A6FF',
  infoLight: '#58A6FF33',
  text: '#FFFFFF',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  border: '#3D2A6E',
  inputBg: '#0F0620',
  overlay: 'rgba(0,0,0,0.6)',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  padding: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
