export const colors = {
  bg: '#1A1A2E',
  card: '#16213E',
  cardAlt: '#0F3460',
  accent: '#E94560',
  accentSoft: '#E9456033',
  text: '#EAEAEA',
  textMuted: '#8B8FA3',
  textDim: '#5C6078',
  success: '#81B29A',
  successSoft: '#81B29A22',
  warning: '#F2CC8F',
  warningSoft: '#F2CC8F22',
  border: '#2A2D45',
  danger: '#E07A5F',
  dangerSoft: '#E07A5F22',
} as const;

export const fonts = {
  display: 'BebasNeue_400Regular',
  light: 'Outfit_300Light',
  regular: 'Outfit_400Regular',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
} as const;

export const workoutTypeColors: Record<string, string> = {
  'strength-endurance': '#E07A5F',
  'strength-hypertrophy': '#7C82A8',
  'cardio-l2': '#81B29A',
  'cardio-vo2max': '#F2CC8F',
};

export const workoutTypes: Record<string, { label: string; short: string; color: string; icon: string }> = {
  'strength-endurance': { label: 'Strength: Endurance', short: 'Endurance', color: '#E07A5F', icon: '🔥' },
  'strength-hypertrophy': { label: 'Strength: Hypertrophy', short: 'Hypertrophy', color: '#7C82A8', icon: '⚡' },
  'cardio-l2': { label: 'Cardio: L2 Steady State', short: 'L2 Cardio', color: '#81B29A', icon: '🫁' },
  'cardio-vo2max': { label: 'Cardio: VO2 Max', short: 'VO2 Max', color: '#F2CC8F', icon: '💀' },
};

export const equipmentOptions = [
  { id: 'bodyweight', label: 'Bodyweight', icon: '🏋️', desc: 'Just you and gravity' },
  { id: 'household', label: 'Household / DIY', icon: '🪨', desc: 'Sandbags, kids, creativity' },
  { id: 'kettlebell', label: 'Kettlebell', icon: '🔔', desc: 'The COVID purchase that pays off' },
  { id: 'dumbbell', label: 'Dumbbell', icon: '💪', desc: 'Home gym staple' },
  { id: 'full-gym', label: 'Full Gym', icon: '🏢', desc: 'Barbells, cables, sleds, the works' },
] as const;

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
