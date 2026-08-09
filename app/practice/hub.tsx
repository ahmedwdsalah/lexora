import { router } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { C, RD, SP } from '../../lib/theme'
import { Icon, type IconName } from '../../lib/icons'
import { hap, Header, IconChip, PressBtn, Sheet } from '../../components/ui'
import { useStore } from '../../lib/store'

const TILES: { label: string; icon: IconName; to: string; bg: string; color: string; desc: string; time: string }[] = [
  { label: 'Speaking', icon: 'mic', to: '/practice/speaking', bg: '#E1F5EE', color: '#0F6E56', desc: 'Say words aloud, get phoneme scores', time: '4 min' },
  { label: 'Listening', icon: 'phones', to: '/practice/listening', bg: '#E8F0FB', color: '#2E5FA3', desc: 'Understand native-speed audio', time: '5 min' },
  { label: 'Typing', icon: 'keyboard', to: '/practice/typing', bg: '#EEEDFE', color: '#534AB7', desc: 'Produce the meaning from memory', time: '3 min' },
  { label: 'Quizzes', icon: 'dice', to: '/practice/quiz', bg: '#FAEEDA', color: '#854F0B', desc: 'Fast multiple choice rounds', time: '3 min' },
  { label: 'Matching', icon: 'grid', to: '/practice/quiz?kind=match', bg: '#FBE9F0', color: '#B33951', desc: 'Pair words with their meanings', time: '3 min' },
  { label: 'Games', icon: 'bolt', to: '/practice/quiz?kind=game', bg: '#3A2416', color: '#D85A30', desc: 'Beat the clock on every question', time: '2 min' },
  { label: 'Sentence building', icon: 'type', to: '/practice/sentence', bg: '#EAF6F0', color: '#1F7A5A', desc: 'Rebuild real sentences tile by tile', time: '5 min' },
]

export default function PracticeHub() {
  const intensity = useStore((s) => s.intensity)
  const words = useStore((s) => s.words)
  const folders = useStore((s) => s.folders)
  const [pending, setPending] = useState<{ label: string; to: string } | null>(null)
  const [scope, setScope] = useState('all')

  const launch = (to: string) => {
    hap.medium()
    const suffix = scope === 'all' ? '' : scope === 'due' ? '?scope=due' : `?scope=folder&id=${scope}`
    router.push((to + suffix) as any)
    setPending(null)
    setScope('all')
  }

  const scopes = [
    { id: 'all', label: `All words · ${words.length}` },
    { id: 'due', label: `Due now · ${words.filter((w) => w.due).length}` },
    ...folders.slice(0, 3).map((f) => ({ id: f.id, label: f.name })),
  ]

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title="Practice" subtitle={`Intensity: ${intensity[0].toUpperCase() + intensity.slice(1)} · generated from your words`} />
      <View style={{ paddingHorizontal: SP.lg }}>
        <Text style={{ fontSize: 13, color: C.inkSoft, marginBottom: SP.sm }}>
          Every exercise is built from your own vocabulary — {words.length} words and counting.
        </Text>
        {TILES.map((t) => (
          <PressBtn key={t.label} onPress={() => setPending({ label: t.label, to: t.to })} haptic="light" style={{ marginBottom: SP.sm }}>
            <View style={styles.row}>
              <IconChip name={t.icon} size={42} iconSize={19} bg={t.bg} color={t.color} />
              <View style={{ flex: 1, marginLeft: SP.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.label}>{t.label}</Text>
                  {t.label === 'Speaking' && (
                    <View style={styles.newBadge}>
                      <Text style={{ color: C.white, fontSize: 10, fontWeight: '800' }}>NEW</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.desc} numberOfLines={1}>{t.desc}</Text>
              </View>
              <Text style={{ color: C.inkMute, fontSize: 11, fontWeight: '700', marginRight: SP.sm }}>{t.time}</Text>
              <Icon name="chevR" size={18} color={C.inkFaint} />
            </View>
          </PressBtn>
        ))}
        <PressBtn onPress={() => { hap.light(); setPending({ label: 'Custom set', to: '/practice/quiz' }) }} style={{ marginTop: SP.xs }}>
          <View style={styles.addRow}>
            <View style={styles.addSquare}>
              <Icon name="plus" size={18} color={C.primary} strokeWidth={2.4} />
            </View>
            <Text style={{ color: C.primary, fontWeight: '700', fontSize: 14, marginLeft: SP.md }}>Add practice set</Text>
          </View>
        </PressBtn>
      </View>

      <Sheet visible={!!pending} onClose={() => setPending(null)} title={pending?.label ? `Practice ${pending.label.toLowerCase()} — which words?` : undefined}>
        {scopes.map((s) => (
          <PressBtn key={s.id} onPress={() => { hap.light(); setScope(s.id) }} hit={30}>
            <View style={[styles.scopeRow, scope === s.id && { backgroundColor: C.selected, borderRadius: RD.md }]}>
              <Text style={{ flex: 1, color: C.ink, fontWeight: '600', fontSize: 15 }}>{s.label}</Text>
              {scope === s.id && <Icon name="check" size={16} color={C.primary} strokeWidth={2.6} />}
            </View>
          </PressBtn>
        ))}
        <PressBtn onPress={() => pending && launch(pending.to)} style={{ marginTop: SP.sm }}>
          <View style={styles.goBtn}>
            <Text style={{ color: C.white, fontWeight: '800', fontSize: 15 }}>Start</Text>
          </View>
        </PressBtn>
      </Sheet>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md },
  label: { fontSize: 15, fontWeight: '700', color: C.ink },
  desc: { fontSize: 12, color: C.inkMute, marginTop: 2 },
  newBadge: { backgroundColor: C.primary, borderRadius: RD.sm, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 },
  addRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SP.md },
  addSquare: { width: 42, height: 42, borderRadius: RD.md, borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  scopeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: SP.sm },
  goBtn: { backgroundColor: C.primary, borderRadius: RD.md, paddingVertical: 15, alignItems: 'center' },
})
