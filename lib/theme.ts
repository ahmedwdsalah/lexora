export const C = {
  primary: '#534AB7',
  primaryDeep: '#413798',
  primarySoft: '#2A2550',
  selected: '#262145',
  bg: '#0D0C11',
  card: '#17161D',
  ink: '#F1F0F6',
  inkSoft: '#B5B3BE',
  inkMute: '#8F8D99',
  inkFaint: '#63616E',
  line: '#2A2931',
  lineSoft: '#212026',
  success: '#3ECFA8',
  successTitle: '#5BE0BC',
  successBg: '#12312A',
  attention: '#E8B25E',
  attentionTitle: '#F0C476',
  attentionBg: '#33291A',
  flame: '#D85A30',
  danger: '#F07171',
  dangerBg: '#3A1F1F',
  gold: '#E8A33D',
  white: '#FFFFFF',
  black: '#000000',
}

export const SP = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 }
export const RD = { sm: 10, md: 14, lg: 20, xl: 28, full: 999 }

export const LANG = [
  { code: 'TR', name: 'Turkish', native: 'Türkçe', color: '#C2402F' },
] as const

export const langOf = (code: string) => LANG.find((l) => l.code === code) ?? LANG[0]
