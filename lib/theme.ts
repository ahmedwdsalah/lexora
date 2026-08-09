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
  { code: 'ES', name: 'Spanish', native: 'Español', color: '#C43E4E' },
  { code: 'FR', name: 'French', native: 'Français', color: '#2E5FA3' },
  { code: 'DE', name: 'German', native: 'Deutsch', color: '#C89B3C' },
  { code: 'IT', name: 'Italian', native: 'Italiano', color: '#3E9B6E' },
  { code: 'PT', name: 'Portuguese', native: 'Português', color: '#1F7A5A' },
  { code: 'JA', name: 'Japanese', native: '日本語', color: '#B33951' },
  { code: 'ZH', name: 'Mandarin', native: '中文', color: '#B3342F' },
  { code: 'AR', name: 'Arabic', native: 'العربية', color: '#1F6B5C' },
  { code: 'KO', name: 'Korean', native: '한국어', color: '#4A4A8A' },
  { code: 'RU', name: 'Russian', native: 'Русский', color: '#8C3B5A' },
  { code: 'HI', name: 'Hindi', native: 'हिन्दी', color: '#C2762A' },
  { code: 'TR', name: 'Turkish', native: 'Türkçe', color: '#C2402F' },
  { code: 'NL', name: 'Dutch', native: 'Nederlands', color: '#2E6E8E' },
  { code: 'SV', name: 'Swedish', native: 'Svenska', color: '#4C6E9E' },
  { code: 'EL', name: 'Greek', native: 'Ελληνικά', color: '#3E7C8E' },
  { code: 'PL', name: 'Polish', native: 'Polski', color: '#8E4C6E' },
  { code: 'VI', name: 'Vietnamese', native: 'Tiếng Việt', color: '#A34E3C' },
  { code: 'TH', name: 'Thai', native: 'ไทย', color: '#7A5CA8' },
  { code: 'SW', name: 'Swahili', native: 'Kiswahili', color: '#2E7D6E' },
  { code: 'UR', name: 'Urdu', native: 'اردو', color: '#5E7C4E' },
] as const

export const langOf = (code: string) => LANG.find((l) => l.code === code) ?? LANG[0]
