import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CLIPS, FOLDERS, REPLIES, SIMS, WORDS, type ChatMode, type Clip, type Folder, type Word } from './mock'

export type ChatMsg = { id: string; role: 'user' | 'assistant'; text: string; newWords?: string[] }

export type Profile = {
  language: string
  reason: string
  style: string
  minutes: number
  level: string
  motivation: string
  struggle: string
  planSource: 'quiz' | 'chat'
}

export type ExerciseResult = { type: string; score: number; total: number; newWords: number }

let uid = 0
const nid = () => `n${Date.now()}-${uid++}`

type State = {
  hydrated: boolean
  onboarded: boolean
  profile: Profile
  words: Word[]
  folders: Folder[]
  clips: Clip[]
  chatMode: ChatMode
  chat: ChatMsg[]
  simMsgs: Record<string, ChatMsg[]>
  typing: boolean
  scanImage: string | null
  extracted: Word[]
  intensity: string
  streak: number
  todayMinutes: number
  stats: { sessions: number; correct: number; answered: number }
  settings: { cultural: boolean; pronunciation: boolean; reminder: boolean; haptics: boolean; location: boolean }
  toast: string | null
  setHydrated: () => void
  setProfile: (p: Partial<Profile>) => void
  completeOnboarding: () => void
  addWord: (w: Omit<Word, 'id' | 'addedAt' | 'reps' | 'due' | 'strength'>) => void
  updateWord: (id: string, patch: Partial<Word>) => void
  deleteWord: (id: string) => void
  addFolder: (name: string, color: string) => void
  renameFolder: (id: string, name: string) => void
  deleteFolder: (id: string) => void
  mergeFolders: (fromId: string, intoId: string) => void
  moveWord: (wordId: string, folderId: string) => void
  setChatMode: (m: ChatMode) => void
  sendChat: (text: string) => void
  sendSim: (simId: string, text: string) => void
  resetSim: (simId: string) => void
  setScan: (image: string | null, words: Word[]) => void
  commitScan: (words: Word[]) => void
  setIntensity: (i: string) => void
  bumpStreak: () => void
  addReview: (correct: number, total: number) => void
  toggle: (k: keyof State['settings']) => void
  addClip: (c: Omit<Clip, 'id'>) => void
  deleteClip: (id: string) => void
  saveWordsFromMedia: (terms: string[]) => void
  toastMsg: (m: string) => void
  clearToast: () => void
}

const defaultProfile: Profile = {
  language: 'TR',
  reason: '',
  style: '',
  minutes: 10,
  level: 'balanced',
  motivation: '',
  struggle: '',
  planSource: 'quiz',
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboarded: false,
      profile: defaultProfile,
      words: WORDS,
      folders: FOLDERS,
      clips: CLIPS,
      chatMode: 'growth',
      chat: [
        { id: 'n0', role: 'assistant', text: 'Merhaba, Ahmed! Ben Lexa. Bugün tekrar edeceğimiz 8 kelime var ve simülasyonda bekleyen bir kahve. Nereden başlayalım?' },
      ],
      simMsgs: {},
      typing: false,
      scanImage: null,
      extracted: [],
      intensity: 'balanced',
      streak: 6,
      todayMinutes: 0,
      stats: { sessions: 14, correct: 47, answered: 62 },
      settings: { cultural: true, pronunciation: true, reminder: true, haptics: true, location: false },
      toast: null,
      setHydrated: () => set({ hydrated: true }),
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      completeOnboarding: () => set({ onboarded: true }),
      addWord: (w) =>
        set((s) => ({
          words: [{ ...w, id: nid(), addedAt: new Date().toISOString().slice(0, 10), reps: 0, due: true, strength: 0.2 }, ...s.words],
        })),
      updateWord: (id, patch) =>
        set((s) => ({ words: s.words.map((w) => (w.id === id ? { ...w, ...patch } : w)) })),
      deleteWord: (id) => set((s) => ({ words: s.words.filter((w) => w.id !== id) })),
      addFolder: (name, color) =>
        set((s) => ({ folders: [...s.folders, { id: `f-${Date.now()}`, name, color, kind: 'custom' as const }] })),
      renameFolder: (id, name) =>
        set((s) => ({ folders: s.folders.map((f) => (f.id === id ? { ...f, name } : f)) })),
      deleteFolder: (id) =>
        set((s) => ({
          folders: s.folders.filter((f) => f.id !== id),
          words: s.words.map((w) => ({ ...w, folderIds: w.folderIds.filter((f) => f !== id) })),
        })),
      mergeFolders: (fromId, intoId) =>
        set((s) => ({
          folders: s.folders.filter((f) => f.id !== fromId),
          words: s.words.map((w) =>
            w.folderIds.includes(fromId) ? { ...w, folderIds: [...new Set(w.folderIds.filter((f) => f !== fromId).concat(intoId))] } : w
          ),
        })),
      moveWord: (wordId, folderId) =>
        set((s) => ({
          words: s.words.map((w) =>
            w.id === wordId
              ? { ...w, folderIds: w.folderIds.includes(folderId) ? w.folderIds.filter((f) => f !== folderId) : [...w.folderIds, folderId] }
              : w
          ),
        })),
      setChatMode: (m) => set({ chatMode: m }),
      sendChat: (text) => {
        const { chat, chatMode, words } = get()
        const userMsg: ChatMsg = { id: nid(), role: 'user', text }
        set({ chat: [...chat, userMsg], typing: true })
        const known = words.filter((w) => w.due || Math.random() > 0.5)
        const newWords = known.slice(0, chatMode === 'challenge' ? 2 : 1).map((w) => w.term)
        const base = REPLIES[chatMode][chat.length % REPLIES[chatMode].length]
        const reply: ChatMsg = { id: nid(), role: 'assistant', text: base, newWords }
        setTimeout(() => {
          set((s) => ({ chat: [...s.chat, reply], typing: false }))
        }, 1400)
      },
      sendSim: (simId, text) => {
        const { simMsgs } = get()
        const msgs = simMsgs[simId] ?? [{ id: 's0', role: 'assistant', text: SIMS.find((x) => x.id === simId)?.starter ?? 'Merhaba.' }]
        set({ simMsgs: { ...simMsgs, [simId]: [...msgs, { id: nid(), role: 'user', text }] }, typing: true })
        const replies = [
          'Peki, başka ne lazım? Dinliyorum.',
          'Anlaşıldı. Önemli bir detay: nakit mi, kartla mı?',
          'Tabii, sorun değil. Her zamanki seçeneği mi yoksa yeni bir şey mi denersiniz?',
          'Tamam. Tekrar ediyorum: önce form, sonra sağdaki kuyruk.',
        ]
        setTimeout(() => {
          const reply = replies[msgs.length % replies.length]
          set((s) => ({ simMsgs: { ...s.simMsgs, [simId]: [...(s.simMsgs[simId] ?? msgs), { id: nid(), role: 'assistant', text: reply }] }, typing: false }))
        }, 1500)
      },
      resetSim: (simId) => {
        const starter = SIMS.find((x) => x.id === simId)?.starter ?? 'Merhaba.'
        set((s) => ({ simMsgs: { ...s.simMsgs, [simId]: [{ id: nid(), role: 'assistant', text: starter }] } }))
      },
      setScan: (image, words) => set({ scanImage: image, extracted: words }),
      commitScan: (words) => set((s) => ({ words: [...words, ...s.words] })),
      setIntensity: (i) => set({ intensity: i }),
      bumpStreak: () => set((s) => ({ streak: s.streak + 1 })),
      addReview: (correct, total) =>
        set((s) => ({
          stats: { sessions: s.stats.sessions + 1, correct: s.stats.correct + correct, answered: s.stats.answered + total },
          todayMinutes: s.todayMinutes + 10,
          streak: s.streak + 1,
        })),
      toggle: (k) => set((s) => ({ settings: { ...s.settings, [k]: !s.settings[k] } })),
      addClip: (c) => set((s) => ({ clips: [{ ...c, id: nid() }, ...s.clips] })),
      deleteClip: (id) => set((s) => ({ clips: s.clips.filter((c) => c.id !== id) })),
      saveWordsFromMedia: (terms) =>
        set((s) => {
          const missing = terms.filter((t) => !s.words.some((w) => w.term === t))
          const added = missing.map<Word>((t) => ({
            id: nid(), term: t, translation: '—', pronunciation: '', example: '', exampleTr: '',
            folderIds: ['f-madrid'], source: 'media', addedAt: new Date().toISOString().slice(0, 10), reps: 0, due: true, strength: 0.15,
          }))
          return { words: [...added, ...s.words] }
        }),
      toastMsg: (m) => set({ toast: m }),
      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'lexora',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        onboarded: s.onboarded,
        profile: s.profile,
        words: s.words,
        folders: s.folders,
        clips: s.clips,
        chat: s.chat,
        chatMode: s.chatMode,
        simMsgs: s.simMsgs,
        intensity: s.intensity,
        streak: s.streak,
        todayMinutes: s.todayMinutes,
        stats: s.stats,
        settings: s.settings,
      }),
    }
  )
)
