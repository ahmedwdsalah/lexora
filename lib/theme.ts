export const C = {
  primary: '#534AB7',
  primaryDeep: '#413798',
  primarySoft: '#EEEDFE',
  selected: '#F3F1FC',
  bg: '#F7F6F2',
  card: '#FFFFFF',
  ink: '#1A1625',
  inkSoft: '#8A8880',
  inkMute: '#A8A79D',
  inkFaint: '#C9C7BD',
  line: '#E7E5DD',
  lineSoft: '#EFEEE8',
  success: '#0F6E56',
  successTitle: '#085041',
  successBg: '#E1F5EE',
  attention: '#854F0B',
  attentionTitle: '#633806',
  attentionBg: '#FAEEDA',
  flame: '#D85A30',
  danger: '#C74343',
  dangerBg: '#FBE9E7',
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
