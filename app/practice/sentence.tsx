import { router } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native'
import { C, RD, SP } from '../../lib/theme'
import { Icon } from '../../lib/icons'
import { hap, Header, PressBtn, ProgressBar } from '../../components/ui'
import { useStore } from '../../lib/store'

export default function SentenceBuild() {
  const words = useStore((s) => s.words)
  const deck = useMemo(() => words.filter((w) => w.example).slice(0, 5), [words])
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<string[]>([])
  const [attempts, setAttempts] = useState(3)
  const [state, setState] = useState<'idle' | 'right'>('idle')
  const [score, setScore] = useState(0)
  const shake = useRef(new Animated.Value(0)).current
  const w = deck[idx]

  const target = w?.example.replace(/[.,!?]/g, '').toLowerCase().split(' ')
  const chips = useMemo(() => (target ? [...target].sort(() => Math.random() - 0.5) : []), [idx])

  useEffect(() => { setPicked([]); setState('idle'); setAttempts(3) }, [idx])

  if (!w || !target) return null

  const answer = picked.join(' ')
  const isFull = picked.length === target.length

  const tapChip = (word: string) => {
    if (state === 'right' || attempts <= 0) return
    hap.tick()
    setPicked((p) => [...p, word])
  }

  const tapSlot = (i: number) => {
    if (state === 'right') return
    hap.tick()
    setPicked((p) => p.filter((_, j) => j !== i))
  }

  const check = () => {
    if (!isFull || state === 'right') return
    const ok = answer === target.join(' ')
    if (ok) {
      hap.success(); setState('right'); setScore((s) => s + 1)
    } else {
      hap.error(); setAttempts((a) => a - 1)
      Animated.sequence([
        Animated.timing(shake, { toValue: 9, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -9, duration: 50, useNativeDriver: true }),
        Animated.spring(shake, { toValue: 0, friction: 5, useNativeDriver: true }),
      ]).start()
      if (attempts - 1 <= 0) {
        setTimeout(() => { setPicked(target); setState('right') }, 500)
      }
    }
  }

  const next = () => {
    if (idx + 1 >= deck.length) router.push(`/practice/result?score=${score}&total=${deck.length}&type=Sentence building`)
    else setIdx((i) => i + 1)
  }

  const used = (word: string) => picked.filter((p) => p === word).length
  const total = (word: string) => chips.filter((c) => c === word).length
  const locked = attempts <= 0

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header
        back title="Sentence building" subtitle={`Rebuild the sentence · ${idx + 1} of ${deck.length}`}
        right={
          <View style={styles.scorePill}>
            <Icon name="type" size={14} color={C.primary} />
            <Text style={{ fontWeight: '800', color: C.ink, marginLeft: 5 }}>{score}</Text>
          </View>
        }
      />
      <View style={{ paddingHorizontal: SP.lg }}>
        <ProgressBar value={(idx + 1) / deck.length} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SP.lg }} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.term}>{w.term}</Text>
          <Text style={styles.tr}>{w.translation}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: SP.md }}>
          <Text style={{ color: C.inkMute, fontSize: 13, fontWeight: '700' }}>Attempts {Math.max(0, attempts)}/3</Text>
          <Icon name={locked ? 'lock' : 'sparkle'} size={13} color={locked ? C.inkFaint : C.primary} style={{ marginLeft: 6 }} />
        </View>

        <Animated.View style={[styles.slot, { transform: [{ translateX: shake }] }, state === 'right' && { borderColor: C.success }]}>
          {picked.length === 0 ? (
            <Text style={{ color: 'rgba(255,255,255,.45)', fontSize: 14 }}>Tap words below to build the sentence…</Text>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {picked.map((pw, i) => (
                <PressBtn key={`${pw}-${i}`} onPress={() => tapSlot(i)} hit={28}>
                  <View style={[styles.slotChip, state === 'right' && { backgroundColor: C.success, borderColor: C.success }]}>
                    <Text style={{ color: state === 'right' ? C.white : C.primary, fontWeight: '800' }}>{pw}</Text>
                  </View>
                </PressBtn>
              ))}
            </View>
          )}
          {state === 'right' && (
            <View style={styles.reveal}>
              <Icon name="check" size={15} color={C.success} strokeWidth={2.6} />
              <Text style={{ color: C.success, fontWeight: '700', fontSize: 13, marginLeft: 6 }}>“{w.example}”</Text>
            </View>
          )}
        </Animated.View>

        <View style={styles.pool}>
          {chips.map((cw, i) => {
            const left = total(cw) - used(cw)
            return (
              <PressBtn key={`${cw}-${i}`} onPress={() => tapChip(cw)} disabled={left <= 0 || state === 'right'} hit={28} style={{ marginRight: 6, marginBottom: 6 }}>
                <View style={[styles.poolChip, left <= 0 && { opacity: 0.2 }]}>
                  <Text style={{ color: C.ink, fontWeight: '600', fontSize: 14 }}>{cw}</Text>
                </View>
              </PressBtn>
            )
          })}
        </View>

        <View style={styles.bottomRow}>
          <PressBtn onPress={() => { hap.tick(); setPicked((p) => p.slice(0, -1)) }} disabled={picked.length === 0} style={{ marginRight: SP.sm }}>
            <View style={[styles.undoBtn, picked.length === 0 && { opacity: 0.35 }]}>
              <Icon name="refresh" size={17} color={C.ink} />
            </View>
          </PressBtn>
          {state === 'idle' ? (
            <PressBtn onPress={check} disabled={!isFull} style={{ flex: 1, opacity: isFull && !locked ? 1 : 0.45 }}>
              <View style={styles.doneBtn}>
                <Text style={{ color: C.white, fontWeight: '800', fontSize: 15 }}>Done</Text>
              </View>
            </PressBtn>
          ) : (
            <PressBtn onPress={next} style={{ flex: 1 }}>
              <View style={styles.doneBtn}>
                <Text style={{ color: C.white, fontWeight: '800', fontSize: 15 }}>{idx + 1 >= deck.length ? 'Finish' : 'Next sentence'}</Text>
              </View>
            </PressBtn>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scorePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: C.line },
  card: { backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, padding: SP.lg, alignItems: 'center' },
  term: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, color: C.ink },
  tr: { fontSize: 14, color: C.inkSoft, marginTop: 4 },
  slot: { minHeight: 84, backgroundColor: '#2A2740', borderRadius: RD.lg, borderWidth: 2, borderColor: C.primaryDeep, padding: SP.md, justifyContent: 'center', alignItems: 'center' },
  slotChip: { backgroundColor: C.card, borderRadius: RD.sm, borderWidth: 1.5, borderColor: C.primary, paddingHorizontal: 11, paddingVertical: 7, marginRight: 6, marginBottom: 6 },
  reveal: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  pool: { flexDirection: 'row', flexWrap: 'wrap', marginTop: SP.lg, justifyContent: 'center' },
  poolChip: { backgroundColor: C.card, borderRadius: RD.sm, borderWidth: 1.5, borderColor: C.line, paddingHorizontal: 12, paddingVertical: 8 },
  bottomRow: { flexDirection: 'row', marginTop: SP.lg },
  undoBtn: { width: 50, height: 50, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.line, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card },
  doneBtn: { backgroundColor: C.primary, borderRadius: RD.md, paddingVertical: 15, alignItems: 'center' },
})
