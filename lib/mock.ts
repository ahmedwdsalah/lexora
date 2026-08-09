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
  { id: 'f-madrid', name: 'Madrid trip', color: '#C89B3C', kind: 'custom' },
]

export const WORDS: Word[] = [
  { id: 'w1', term: 'desayunar', translation: 'to have breakfast', pronunciation: 'deh-sah-yoo-NAHR', example: 'Suelo desayunar a las ocho.', exampleTr: 'I usually have breakfast at eight.', folderIds: ['f-verbs', 'f-food'], source: 'scan', addedAt: '2026-08-02', reps: 4, due: true, strength: 0.62 },
  { id: 'w2', term: 'merecer', translation: 'to deserve', pronunciation: 'meh-reh-SEHR', example: 'Mereces un descanso.', exampleTr: 'You deserve a break.', folderIds: ['f-verbs'], source: 'manual', addedAt: '2026-08-01', reps: 2, due: true, strength: 0.41 },
  { id: 'w3', term: 'la almohada', translation: 'pillow', pronunciation: 'ahl-moh-AH-dah', example: 'Necesito otra almohada.', exampleTr: 'I need another pillow.', folderIds: ['f-travel', 'f-madrid'], source: 'scan', addedAt: '2026-08-03', reps: 1, due: true, strength: 0.3 },
  { id: 'w4', term: 'aprovechar', translation: 'to take advantage of', pronunciation: 'ah-proh-veh-CHAR', example: 'Vamos a aprovechar el buen tiempo.', exampleTr: "Let's make the most of the good weather.", folderIds: ['f-verbs'], source: 'chat', addedAt: '2026-08-04', reps: 3, due: true, strength: 0.55 },
  { id: 'w5', term: 'el/la camarero/a', translation: 'waiter / waitress', pronunciation: 'kah-mah-REH-roh', example: 'El camarero trae la cuenta.', exampleTr: 'The waiter brings the bill.', folderIds: ['f-food', 'f-work'], source: 'scan', addedAt: '2026-08-02', reps: 5, due: false, strength: 0.78 },
  { id: 'w6', term: 'la madrugada', translation: 'early morning / dawn', pronunciation: 'mah-droo-GAH-dah', example: 'Volvimos a casa de madrugada.', exampleTr: 'We got home in the early hours.', folderIds: ['f-travel'], source: 'media', addedAt: '2026-08-05', reps: 1, due: true, strength: 0.25 },
  { id: 'w7', term: 'el antojo', translation: 'craving', pronunciation: 'ahn-TOH-hoh', example: 'Me dio antojo de chocolate.', exampleTr: 'I got a craving for chocolate.', folderIds: ['f-food', 'f-emotions'], source: 'media', addedAt: '2026-08-05', reps: 2, due: false, strength: 0.48 },
  { id: 'w8', term: 'la vergüenza', translation: 'embarrassment / shame', pronunciation: 'behr-GWEHN-sah', example: 'Qué vergüenza, se me olvidó su nombre.', exampleTr: "How embarrassing — I forgot their name.", folderIds: ['f-emotions'], source: 'manual', addedAt: '2026-07-30', reps: 6, due: false, strength: 0.85 },
  { id: 'w9', term: 'el albaricoque', translation: 'apricot', pronunciation: 'ahl-bah-ree-KOH-keh', example: 'El albaricoque está maduro.', exampleTr: 'The apricot is ripe.', folderIds: ['f-food'], source: 'scan', addedAt: '2026-08-06', reps: 1, due: true, strength: 0.22 },
  { id: 'w10', term: 'mudarse', translation: 'to move (house)', pronunciation: 'moo-DAHR-seh', example: 'Nos mudamos a Sevilla el mes que viene.', exampleTr: "We're moving to Seville next month.", folderIds: ['f-verbs', 'f-madrid'], source: 'chat', addedAt: '2026-08-03', reps: 2, due: true, strength: 0.38 },
  { id: 'w11', term: 'el horario', translation: 'schedule / timetable', pronunciation: 'oh-RAH-ryoh', example: 'Mi horario cambia cada semana.', exampleTr: 'My schedule changes every week.', folderIds: ['f-work'], source: 'manual', addedAt: '2026-07-29', reps: 4, due: false, strength: 0.7 },
  { id: 'w12', term: 'el billete', translation: 'ticket', pronunciation: 'bee-YEH-teh', example: 'Un billete de ida y vuelta, por favor.', exampleTr: 'A return ticket, please.', folderIds: ['f-travel', 'f-madrid'], source: 'scan', addedAt: '2026-08-04', reps: 3, due: true, strength: 0.52 },
  { id: 'w13', term: 'la llave', translation: 'key', pronunciation: 'YAH-beh', example: 'He perdido las llaves del piso.', exampleTr: "I've lost the keys to the flat.", folderIds: ['f-travel', 'f-madrid'], source: 'manual', addedAt: '2026-08-01', reps: 2, due: false, strength: 0.44 },
  { id: 'w14', term: 'el/la vecino/a', translation: 'neighbour', pronunciation: 'beh-THEE-noh', example: 'Mi vecino toca la guitarra por la noche.', exampleTr: 'My neighbour plays guitar at night.', folderIds: ['f-emotions', 'f-work'], source: 'media', addedAt: '2026-08-05', reps: 1, due: true, strength: 0.28 },
  { id: 'w15', term: 'enviar', translation: 'to send', pronunciation: 'ehn-BYAR', example: 'Te envío el informe esta tarde.', exampleTr: "I'll send you the report this afternoon.", folderIds: ['f-verbs', 'f-work'], source: 'manual', addedAt: '2026-07-28', reps: 7, due: false, strength: 0.9 },
]

export const SIMS: Sim[] = [
  { id: 'restaurant', name: 'Restaurant', icon: 'crown', desc: 'Order tapas, ask for the bill, complain politely about the wait.', level: 'Beginner+', color: '#C43E4E', starter: '¡Buenas tardes! ¿Mesa para cuántos?', cue: 'Try: “Una mesa para dos, por favor.”', goal: ['Order food', 'Ask for the bill', 'Handle a mistake'] },
  { id: 'supermarket', name: 'Supermarket', icon: 'tag', desc: 'Find products, compare prices, ask where the checkout is.', level: 'Beginner', color: '#3E9B6E', starter: 'Hola, ¿buscas algo en especial?', cue: 'Try: “¿Dónde están los huevos?”', goal: ['Ask where things are', 'Compare prices', 'Checkout chat'] },
  { id: 'airport', name: 'Airport', icon: 'send', desc: 'Check-in, security questions, missed-flight stress talk.', level: 'Intermediate', color: '#2E5FA3', starter: 'Buenos días. ¿Su pasaporte, por favor?', cue: 'Try: “Tengo una conexión en dos horas.”', goal: ['Check in', 'Flight delays', 'Security chat'] },
  { id: 'hospital', name: 'Hospital', icon: 'heart', desc: 'Describe symptoms, understand the doctor, pick up a prescription.', level: 'Intermediate', color: '#C74343', starter: '¿Qué le pasa? Cuénteme qué siente.', cue: 'Try: “Me duele la garganta desde ayer.”', goal: ['Describe symptoms', 'Understand advice', 'Pharmacy'] },
  { id: 'university', name: 'University', icon: 'grad', desc: 'Enrolment, talking to professors, group project negotiation.', level: 'Intermediate+', color: '#534AB7', starter: 'Hola, ¿eres de primero?', cue: 'Try: “Sí, estoy en el grupo de las diez.”', goal: ['Introduce yourself', 'Talk to professors', 'Group work'] },
  { id: 'work', name: 'Work', icon: 'layers', desc: 'Small talk, meetings, pushback on a deadline, feedback.', level: 'Advanced', color: '#C89B3C', starter: 'Buenos días a todos, empecemos la reunión.', cue: 'Try: “Antes de eso, un punto importante…”', goal: ['Small talk', 'Push back', 'Give feedback'] },
]

export const CLIPS: Clip[] = [
  { id: 'c1', kind: 'subtitle', source: 'La Casa de Papel · S2E4', content: '“El que siembra vientos, recoge tempestades.”', note: 'Said right before everything goes wrong. Literally: who sows winds reaps storms.', words: ['sembrar', 'recoger', 'la tempestad'], idiom: true, lang: 'ES' },
  { id: 'c2', kind: 'quote', source: 'Mafalda · Quino', content: '“Parar el mundo, que me quiero bajar.”', note: 'Classic existential joke. Stop the world, I want to get off.', words: ['parar', 'bajarse'], idiom: true, lang: 'ES' },
  { id: 'c3', kind: 'song', source: 'Rosalía — “Despechá”', content: '“Me dijiste que me querías, y era puro humo.”', note: 'Despecho = heartbreak spite. “Puro humo” = all talk, nothing real.', words: ['despecho', 'el humo'], idiom: false, lang: 'ES' },
  { id: 'c4', kind: 'scene', source: 'Casa en llamas · Netflix', content: '“A ver si nos aclaramos, que aquí no se entiende ni Dios.”', note: 'Furious family argument line. “Ni Dios” = absolutely nobody.', words: ['aclararse', 'entender'], idiom: false, lang: 'ES' },
  { id: 'c5', kind: 'subtitle', source: 'Elite · S1E1', content: '“Tranquila, que no muerde.”', note: 'Said about the new student. Literal: don’t worry, it doesn’t bite.', words: ['tranquilo', 'morder'], idiom: false, lang: 'ES' },
]

export const CHAT_MODE_META = {
  comfort: { label: 'Comfort', blurb: 'I stick to words you already know. New words get translated instantly. Warm and safe.', ratio: '0–10% new words' },
  growth: { label: 'Growth', blurb: 'I weave in a few new words per message and help you figure them out from context.', ratio: '20% new words' },
  challenge: { label: 'Challenge', blurb: 'Near-native pace. I use unfamiliar vocabulary and only clarify if you ask.', ratio: '40%+ new words' },
} as const

export type ChatMode = keyof typeof CHAT_MODE_META

export const REPLIES: Record<ChatMode, string[]> = {
  comfort: [
    'Claro que sí. ¿Qué te gustaría practicar hoy? Podemos hablar de tu día, tu comida favorita o lo que prefieras.',
    '¡Genial! Eso que dices lo sabemos decir así: “me gusta mucho…” y ya está, no hay más secreto.',
    'Perfecto, te entiendo perfectamente. ¿Quieres que te dé otra forma de decirlo, más natural?',
  ],
  growth: [
    'Entiendo. A propósito, una palabra nueva que encaja aquí es *el antojo* — un deseo fuerte de comer algo. “Me dio antojo de paella.” ¿La pillas?',
    'Me gusta cómo lo has dicho. Para subir un poco el nivel: *aprovechar* significa sacar el máximo partido. “Aprovecha el día.”',
    'Sí, exacto. Y si quieres sonar más nativo, prueba con *la madrugada* — de madrugada = muy temprano, entre las 2 y las 6.',
  ],
  challenge: [
    'No obstante, habría que matizar eso. El matiz cambia según el registro: formal o coloquial. ¿Cuál prefieres explorar?',
    'Interesante. Aunque para ser precisos, el verbo *acaecer* suena muy literario; en la calle diríamos *suceder* o *pasar*.',
    'Bien dicho. Ahora, intenta reformularlo usando el subjuntivo — “quizá sea mejor…” — y dime si notas la diferencia.',
  ],
}
