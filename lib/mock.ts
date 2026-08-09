import type { IconName } from './icons'

export type Word = {
  id: string
  term: string
  translation: string
  pronunciation: string
  example: string
  exampleTr: string
  folderIds: string[]
  source: 'manual' | 'scan' | 'media' | 'chat'
  addedAt: string
  reps: number
  due: boolean
  strength: number // 0..1
}

export type Folder = {
  id: string
  name: string
  color: string
  kind: 'auto' | 'custom'
}

export type Sim = {
  id: string
  name: string
  icon: IconName
  desc: string
  level: string
  color: string
  starter: string
  cue: string
  goal: string[]
}

export type Clip = {
  id: string
  kind: 'subtitle' | 'quote' | 'song' | 'scene'
  source: string
  content: string
  note: string
  words: string[]
  idiom: boolean
  lang: string
}

export const FOLDERS: Folder[] = [
  { id: 'f-verbs', name: 'Verbs', color: '#534AB7', kind: 'auto' },
  { id: 'f-food', name: 'Food', color: '#C43E4E', kind: 'auto' },
  { id: 'f-travel', name: 'Travel', color: '#2E5FA3', kind: 'auto' },
  { id: 'f-emotions', name: 'Emotions', color: '#D85A30', kind: 'auto' },
  { id: 'f-work', name: 'Work emails', color: '#3E9B6E', kind: 'custom' },
  { id: 'f-madrid', name: 'Istanbul trip', color: '#C89B3C', kind: 'custom' },
]

export const WORDS: Word[] = [
  { id: 'w1', term: 'kahvaltı yapmak', translation: 'to have breakfast', pronunciation: 'kah-vahl-TUH yahp-mahk', example: 'Her sabah kahvaltı yaparım.', exampleTr: 'I have breakfast every morning.', folderIds: ['f-verbs', 'f-food'], source: 'scan', addedAt: '2026-08-02', reps: 4, due: true, strength: 0.62 },
  { id: 'w2', term: 'hak etmek', translation: 'to deserve', pronunciation: 'hahk et-MEHK', example: 'Sen bir mola hak ediyorsun.', exampleTr: 'You deserve a break.', folderIds: ['f-verbs'], source: 'manual', addedAt: '2026-08-01', reps: 2, due: true, strength: 0.41 },
  { id: 'w3', term: 'yastık', translation: 'pillow', pronunciation: 'yahs-TUHk', example: 'Bir yastık daha lazım.', exampleTr: 'I need another pillow.', folderIds: ['f-travel', 'f-madrid'], source: 'scan', addedAt: '2026-08-03', reps: 1, due: true, strength: 0.3 },
  { id: 'w4', term: 'değerlendirmek', translation: 'to take advantage of', pronunciation: 'deh-er-len-DEER-mehk', example: 'Güzel havayı değerlendirelim.', exampleTr: "Let's make the most of the good weather.", folderIds: ['f-verbs'], source: 'chat', addedAt: '2026-08-04', reps: 3, due: true, strength: 0.55 },
  { id: 'w5', term: 'garson', translation: 'waiter / waitress', pronunciation: 'gahr-SOHN', example: 'Garson hesabı getiriyor.', exampleTr: 'The waiter brings the bill.', folderIds: ['f-food', 'f-work'], source: 'scan', addedAt: '2026-08-02', reps: 5, due: false, strength: 0.78 },
  { id: 'w6', term: 'şafak', translation: 'dawn', pronunciation: 'shah-FAHK', example: 'Şafakta eve döndük.', exampleTr: 'We got home at dawn.', folderIds: ['f-travel'], source: 'media', addedAt: '2026-08-05', reps: 1, due: true, strength: 0.25 },
  { id: 'w7', term: 'canı çekmek', translation: 'craving', pronunciation: 'jah-NUH chehk-MEHK', example: 'Canım çikolata çekti.', exampleTr: 'I got a craving for chocolate.', folderIds: ['f-food', 'f-emotions'], source: 'media', addedAt: '2026-08-05', reps: 2, due: false, strength: 0.48 },
  { id: 'w8', term: 'utanç', translation: 'embarrassment / shame', pronunciation: 'oo-TAHNCH', example: 'Çok utandım, adını unuttum.', exampleTr: "How embarrassing — I forgot their name.", folderIds: ['f-emotions'], source: 'manual', addedAt: '2026-07-30', reps: 6, due: false, strength: 0.85 },
  { id: 'w9', term: 'kayısı', translation: 'apricot', pronunciation: 'kah-YUH-suh', example: 'Kayısı olgunlaşmış.', exampleTr: 'The apricot is ripe.', folderIds: ['f-food'], source: 'scan', addedAt: '2026-08-06', reps: 1, due: true, strength: 0.22 },
  { id: 'w10', term: 'taşınmak', translation: 'to move (house)', pronunciation: 'tah-shuhn-MAHK', example: 'Gelecek ay İstanbul’a taşınıyoruz.', exampleTr: "We're moving to Istanbul next month.", folderIds: ['f-verbs', 'f-madrid'], source: 'chat', addedAt: '2026-08-03', reps: 2, due: true, strength: 0.38 },
  { id: 'w11', term: 'program', translation: 'schedule / timetable', pronunciation: 'proh-RAHM', example: 'Programım her hafta değişiyor.', exampleTr: 'My schedule changes every week.', folderIds: ['f-work'], source: 'manual', addedAt: '2026-07-29', reps: 4, due: false, strength: 0.7 },
  { id: 'w12', term: 'bilet', translation: 'ticket', pronunciation: 'bee-LET', example: 'Gidiş-dönüş bir bilet, lütfen.', exampleTr: 'A return ticket, please.', folderIds: ['f-travel', 'f-madrid'], source: 'scan', addedAt: '2026-08-04', reps: 3, due: true, strength: 0.52 },
  { id: 'w13', term: 'anahtar', translation: 'key', pronunciation: 'ah-NAH-tahr', example: 'Dairenin anahtarlarını kaybettim.', exampleTr: "I've lost the keys to the flat.", folderIds: ['f-travel', 'f-madrid'], source: 'manual', addedAt: '2026-08-01', reps: 2, due: false, strength: 0.44 },
  { id: 'w14', term: 'komşu', translation: 'neighbour', pronunciation: 'KOHM-shoo', example: 'Komşum geceleri gitar çalıyor.', exampleTr: 'My neighbour plays guitar at night.', folderIds: ['f-emotions', 'f-work'], source: 'media', addedAt: '2026-08-05', reps: 1, due: true, strength: 0.28 },
  { id: 'w15', term: 'göndermek', translation: 'to send', pronunciation: 'guhn-DEHR-mehk', example: 'Raporu bu öğleden sonra gönderirim.', exampleTr: "I'll send you the report this afternoon.", folderIds: ['f-verbs', 'f-work'], source: 'manual', addedAt: '2026-07-28', reps: 7, due: false, strength: 0.9 },
]

export const SIMS: Sim[] = [
  { id: 'restaurant', name: 'Restaurant', icon: 'crown', desc: 'Order meze, ask for the bill, complain politely about the wait.', level: 'Beginner+', color: '#C43E4E', starter: 'İyi akşamlar! Kaç kişilik bir masa?', cue: 'Try: “İki kişilik bir masa, lütfen.”', goal: ['Order food', 'Ask for the bill', 'Handle a mistake'] },
  { id: 'supermarket', name: 'Supermarket', icon: 'tag', desc: 'Find products, compare prices, ask where the checkout is.', level: 'Beginner', color: '#3E9B6E', starter: 'Merhaba, bir şey mi arıyorsunuz?', cue: 'Try: “Yumurtalar nerede?”', goal: ['Ask where things are', 'Compare prices', 'Checkout chat'] },
  { id: 'airport', name: 'Airport', icon: 'send', desc: 'Check-in, security questions, missed-flight stress talk.', level: 'Intermediate', color: '#2E5FA3', starter: 'Günaydın. Pasaportunuz, lütfen?', cue: 'Try: “İki saat sonra aktarmam var.”', goal: ['Check in', 'Flight delays', 'Security chat'] },
  { id: 'hospital', name: 'Hospital', icon: 'heart', desc: 'Describe symptoms, understand the doctor, pick up a prescription.', level: 'Intermediate', color: '#C74343', starter: 'Nereniz ağrıyor? Ne zamandır böyle?', cue: 'Try: “Boğazım dünden beri ağrıyor.”', goal: ['Describe symptoms', 'Understand advice', 'Pharmacy'] },
  { id: 'university', name: 'University', icon: 'grad', desc: 'Enrolment, talking to professors, group project negotiation.', level: 'Intermediate+', color: '#534AB7', starter: 'Merhaba, birinci sınıftan mısın?', cue: 'Try: “Evet, on buçuktaki gruptayım.”', goal: ['Introduce yourself', 'Talk to professors', 'Group work'] },
  { id: 'work', name: 'Work', icon: 'layers', desc: 'Small talk, meetings, pushback on a deadline, feedback.', level: 'Advanced', color: '#C89B3C', starter: 'Herkese günaydın, toplantıya başlayalım.', cue: 'Try: “Ondan önce önemli bir nokta var…”', goal: ['Small talk', 'Push back', 'Give feedback'] },
]

export const CLIPS: Clip[] = [
  { id: 'c1', kind: 'subtitle', source: 'Kurtlar Vadisi · S1', content: '“Damlaya damlaya göl olur.”', note: 'Turkish proverb: drop by drop, a lake forms — small efforts add up.', words: ['damla', 'göl'], idiom: true, lang: 'TR' },
  { id: 'c2', kind: 'quote', source: 'Nasreddin Hoca', content: '“Parayı veren düdüğü çalar.”', note: 'Classic Nasreddin Hoca joke: he who pays the piper calls the tune.', words: ['para', 'düdük', 'çalmak'], idiom: true, lang: 'TR' },
  { id: 'c3', kind: 'song', source: 'Sezen Aksu — “Şarkı Söylemek Lazım”', content: '“Şarkı söylemek lazım, söylemek lazım.”', note: 'Sezen Aksu classic. Lazım = needed/necessary.', words: ['şarkı', 'söylemek', 'lazım'], idiom: false, lang: 'TR' },
  { id: 'c4', kind: 'scene', source: 'Çukur · S1E1', content: '“Bu mahallenin kurallarına uyacaksın.”', note: 'Said to the newcomer: you will follow this neighborhood’s rules.', words: ['mahalle', 'kural', 'uymak'], idiom: false, lang: 'TR' },
  { id: 'c5', kind: 'subtitle', source: 'Kiralık Aşk · S1E3', content: '“Sakin ol, ısırmaz.”', note: 'Said about someone intimidating. Literal: don’t worry, it doesn’t bite.', words: ['sakin', 'ısırmak'], idiom: false, lang: 'TR' },
]

export const CHAT_MODE_META = {
  comfort: { label: 'Comfort', blurb: 'I stick to words you already know. New words get translated instantly. Warm and safe.', ratio: '0–10% new words' },
  growth: { label: 'Growth', blurb: 'I weave in a few new words per message and help you figure them out from context.', ratio: '20% new words' },
  challenge: { label: 'Challenge', blurb: 'Near-native pace. I use unfamiliar vocabulary and only clarify if you ask.', ratio: '40%+ new words' },
} as const

export type ChatMode = keyof typeof CHAT_MODE_META

export const REPLIES: Record<ChatMode, string[]> = {
  comfort: [
    'Tabii ki. Bugün ne pratik yapmak istersin? Gününü, en sevdiğin yemeği ya da dilediğin konuyu konuşabiliriz.',
    'Harika! Bunu şöyle de diyebilirsin: “çok hoşuma gidiyor…” — işte bu kadar, başka sır yok.',
    'Anladım, seni çok iyi anlıyorum. Daha doğal bir söyleyiş de ister misin?',
  ],
  growth: [
    'Anlıyorum. Bu arada buraya uyan yeni bir kelime: *canı çekmek* — bir şeyi çok istemek. “Canım dondurma çekti.” Anladın mı?',
    'Söyleyişini beğendim. Seviyeyi biraz yükseltelim: *değerlendirmek* fırsattan en iyi şekilde yararlanmak demek. “Günü değerlendir.”',
    'Evet, aynen. Daha doğal konuşmak istersen *şafak* dene — çok erken sabah, sabah 5 civarı.',
  ],
  challenge: [
    'Yine de bunu biraz netleştirmek gerek. Fark üsluba göre değişir: resmî mi günlük mü? Hangisini keşfetmek istersin?',
    'İlginç. Ama tam olarak söylemek gerekirse *faydalanmak* kulağa edebî gelir; sokakta *yararlanmak* ya da *kullanmak* deriz.',
    'Güzel söyledin. Şimdi bunu dilek kipiyle yeniden kur — “belki de… daha iyi olur” — farkı hissediyor musun?',
  ],
}
