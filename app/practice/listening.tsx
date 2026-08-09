import { router } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native'
import { C, RD, SP } from '../../lib/theme'
import { Icon } from '../../lib/icons'
import { hap, Header, PressBtn, ProgressBar } from '../../components/ui'
import { useStore } from '../../lib/store'

export default function Listening() {
  const words = useStore((s) => s.words)
  const deck = useMemo(() => words.filter((w) => w.translation !== '—').slice(0, 6), [words])
  const options = useMemo(() => words.filter((w) => w.translation !== '—').slice(0, 9), [words])
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [plays, setPlays] = useState(0)
  const eq = useRef(new Animated.Value(0)).current
  const w = deck[idx]
  const heard = w

  useEffect(() => { setPicked(null); setPlays(0) }, [idx])

  if (!w) return null

  const play = () => {
    if (playing) return
    hap.light()
    setPlaying(true)
    setPlays((p) => p + 1)
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(eq, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.timing(eq, { toValue: 0.25, duration: 260, useNativeDriver: true }),
      ])
    )
    loop.start()
    setTimeout(() => { loop.stop(); setPlaying(false); eq.setValue(0) }, 1600)
  }

  const pick = (opt: string) => {
    if (picked) return
    const ok = opt === heard.term
    setPicked(opt)
    if (ok) { hap.success(); setScore((s) => s + 1) } else hap.error()
    setTimeout(() => {
      if (idx + 1 >= deck.length) router.push(`/practice/result?score=${score + (ok ? 1 : 0)}&total=${deck.length}&type=Listening`)
      else setIdx((i) => i + 1)
    }, 800)
  }

  const pool = [heard.term, ...options.filter((o) => o.id !== heard.id).slice(0, 2).map((o) => o.term)]

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header
        back title="Listening" subtitle={`What did you hear? · ${idx + 1} of ${deck.length}`}
        right={
          <View style={styles.scorePill}>
            <Icon name="phones" size={14} color={C.primary} />
            <Text style={{ fontWeight: '800', color: C.ink, marginLeft: 5 }}>{score}</Text>
          </View>
        }
      />
      <View style={{ paddingHorizontal: SP.lg }}>
        <ProgressBar value={(idx + 1) / deck.length} color={C.primary} />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: SP.lg }}>
        <View style={styles.card}>
          <Text style={styles.prompt}>Listen and pick the word you hear</Text>
          <PressBtn onPress={play} haptic="light">
            <View style={[styles.playBtn, playing && { borderColor: C.primary }]}>
              {playing ? (
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 26 }}>
                  {[0.9, 0.4, 1, 0.6, 0.8].map((h, i) => (
                    <Animated.View
                      key={i}
                      style={{
                        width: 4, marginHorizontal: 2, borderRadius: 2, backgroundColor: C.primary,
                        height: eq.interpolate({ inputRange: [0, 1], outputRange: [6, 24 * h + 2] }),
                      }}
                    />
                  ))}
                </View>
              ) : (
                <Icon name="volume" size={30} color={C.primary} />
              )}
            </View>
          </PressBtn>
          <Text style={{ color: C.inkMute, fontSize: 12, marginTop: SP.sm }}>
            {plays === 0 ? 'Tap to play · native speed' : `Played ${plays}× · replay allowed`}
          </Text>
        </View>

        <View style={{ marginTop: SP.lg }}>
          {pool.map((o) => {
            const isAns = o === heard.term
            const isPick = picked === o
            return (
              <PressBtn key={o} onPress={() => pick(o)} disabled={!!picked} style={{ marginBottom: SP.sm }} haptic="light">
                <View
                  style={[
                    styles.opt,
                    picked && isAns && styles.optRight,
                    picked && isPick && !isAns && styles.optWrong,
                  ]}
                >
                  <Text style={[styles.optText, picked && !isAns && { opacity: 0.5 }]}>{o}</Text>
                  {picked && isAns && <Icon name="check" size={16} color={C.success} strokeWidth={2.6} />}
                </View>
              </PressBtn>
            )
          })}
        </View>
        {picked && picked !== heard.term && (
          <Text style={{ color: C.danger, fontWeight: '700', fontSize: 13, textAlign: 'center', marginTop: SP.sm }}>
            You heard: “{heard.term}”
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  scorePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: C.line },
  card: { backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, padding: SP.xl, alignItems: 'center' },
  prompt: { fontSize: 14, fontWeight: '600', color: C.inkSoft, marginBottom: SP.lg },
  playBtn: { width: 84, height: 84, borderRadius: 42, borderWidth: 2.5, borderColor: C.line, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  opt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.line, paddingVertical: 15, paddingHorizontal: SP.lg },
  optRight: { borderColor: C.success, backgroundColor: C.successBg },
  optWrong: { borderColor: C.danger, backgroundColor: C.dangerBg },
  optText: { fontSize: 16, fontWeight: '600', color: C.ink },
})
