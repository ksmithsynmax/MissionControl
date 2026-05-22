import { createTheme } from '@mantine/core';

export const theiaTheme = createTheme({
  primaryColor: 'theia-blue',
  colors: {
    'theia-blue': [
      '#E5F0FB', '#CCE2F7', '#B2D3F3', '#66A7E7', '#3389DF',
      '#006CD7', '#0056AC', '#004181', '#002B56', '#002041',
    ],
    'theia-dark': [
      '#888F9E', '#6b7280', '#4b5563', '#393C56', '#2d3048',
      '#24263C', '#1e2035', '#181926', '#14151f', '#0f1019',
    ],
  },
  fontFamily: "'Inter', sans-serif",
  headings: { fontFamily: "'Inter', sans-serif" },
  defaultRadius: 'sm',
  other: {
    pageBg: '#181926',
    cardBg: '#24263C',
    border: '#393C56',
    textPrimary: '#ffffff',
    textMuted: '#888F9E',
    vesselBlue: '#00A3E3',
    alertRed: '#F75349',
    warningOrange: '#FFA500',
    stsOrange: '#ff8800',
    spoofingPink: '#FF6D99',
  },
});
