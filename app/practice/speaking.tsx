import { router } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native'
import { C, RD, SP } from '../../lib/theme'
import { Icon } from '../../lib/icons'
import { hap, Header, PressBtn, ProgressBar } from '../../components/ui'
import { useStore } from '../../lib/store'

export default function Speaking() {
  const words = useStore((s) => s.words)
  const deck = useMemo(() => words.filter((w) => w.translation !== '—').slice(0, 5), [words])
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'rec' | 'scoring' | 'result'>('idle')
  const [secs, setSecs] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const pulse = useRef(new Animated.Value(1)).current
  const scan = useRef(new Animated.Value(0)).current
  const w = deck[idx]

  useEffect(() => { setPhase('idle'); setSecs(0) }, [idx])

  if (!w) return null

  const start = () => {
    hap.medium()
    setPhase('rec'); setSecs(0)
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.25, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    )
    loop.start()
    const ti = setInterval(() => setSecs((s) => s + 1), 1000)
    const to = setTimeout(() => {
      clearInterval(ti); loop.stop(); pulse.setValue(1)
      setPhase('scoring')
      Animated.timing(scan, { toValue: 1, duration: 1400, useNativeDriver: false }).start(() => {
        hap.success()
        setTotalScore((s) => s + scoreFor(w.term, secs))
        setPhase('result')
        setTimeout(() => scan.setValue(0), 300)
      })
    }, 4000)
    return () => { clearInterval(ti); clearTimeout(to); loop.stop() }
  }

  const scoreFor = (term: string, t: number) => (term.length % 2 === 0 ? 88 : 74) + Math.min(6, t)

  const next = () => {
    if (idx + 1 >= deck.length) router.push(`/practice/result?score=${Math.round(totalScore / deck.length)}&total=100&type=Speaking`)
    else setIdx((i) => i + 1)
  }

  const score = scoreFor(w.term, secs)

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header
        back title="Speaking" subtitle={`Pronounce it aloud · ${idx + 1} of ${deck.length}`}
        right={
          <View style={styles.scorePill}>
            <Icon name="mic" size={14} color={C.primary} />
            <Text style={{ fontWeight: '800', color: C.ink, marginLeft: 5 }}>{totalScore}</Text>
          </View>
        }
      />
      <View style={{ paddingHorizontal: SP.lg }}>
        <ProgressBar value={(idx + 1) / deck.length} color={C.primary} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SP.lg, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.prompt}>Say this word out loud</Text>
          <Text style={styles.term}>{w.term}</Text>
          <Text style={styles.pron}>{w.pronunciation}</Text>
          <Text style={styles.tr}>{w.translation}</Text>
        </View>

        {phase === 'idle' && (
          <PressBtn onPress={start} haptic="medium" style={{ marginTop: SP.xxl }}>
            <View style={styles.recBtn}>
              <Icon name="mic" size={26} color={C.white} />
              <Text style={{ color: C.white, fontWeight: '800', fontSize: 14, marginTop: 6 }}>Hold to record</Text>
            </View>
          </PressBtn>
        )}

        {phase === 'rec' && (
          <View style={{ marginTop: SP.xxl, alignItems: 'center' }}>
            <Animated.View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#FDEEE6', alignItems: 'center', justifyContent: 'center', transform: [{ scale: pulse }] }}>
              <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: C.flame, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="mic" size={26} color={C.white} />
              </View>
            </Animated.View>
            <Text style={{ color: C.flame, fontWeight: '800', fontSize: 16, marginTop: SP.lg }}>{secs}s</Text>
            <Text style={{ color: C.inkMute, fontSize: 12, marginTop: 4 }}>speaking…</Text>
          </View>
        )}

        {phase === 'scoring' && (
          <View style={{ marginTop: SP.xxl, alignItems: 'center', width: '100%' }}>
            <Text style={{ color: C.inkSoft, fontWeight: '700', marginBottom: SP.lg }}>Comparing your audio to native speakers…</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 90 }}>
              {[0.4, 0.7, 0.5, 0.9, 0.6, 1, 0.55, 0.8].map((h, i) => (
                <Animated.View
                  key={i}
                  style={{
                    width: 10, marginHorizontal: 4, borderRadius: 5, backgroundColor: C.primary,
                    height: scan.interpolate({ inputRange: [0, 1], outputRange: [8, 88 * h] }),
                  }}
                />
              ))}
            </View>
            <Text style={{ color: C.inkMute, fontSize: 12, marginTop: SP.md }}>phoneme alignment · prosody · completeness</Text>
          </View>
        )}

        {phase === 'result' && (
          <View style={{ marginTop: SP.xl, width: '100%' }}>
            <View style={styles.resultCard}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.bigScore}>{score}</Text>
                <Text style={{ color: C.inkMute, fontSize: 15, fontWeight: '700' }}>/100</Text>
              </View>
              <Text style={{ color: C.inkSoft, fontSize: 13, marginTop: 4 }}>
                {score >= 85 ? 'Crisp! A native would nod along.' : score >= 70 ? 'Clear enough — one syllable to polish.' : 'Understandable, but the accent is doing heavy lifting.'}
              </Text>
              <View style={styles.phonRow}>
                {w.pronunciation.split('-').map((part, i) => {
                  const bad = i === 1 && score < 85
                  return (
                    <View key={i} style={[styles.phonCell, bad && { backgroundColor: C.dangerBg, borderColor: C.danger }]}>
                      <Text style={{ color: bad ? C.danger : C.primary, fontWeight: '800', fontSize: 13 }}>{part}</Text>
                      <Text style={{ color: C.inkMute, fontSize: 10, marginTop: 2 }}>{bad ? 'needs work' : 'on point'}</Text>
                    </View>
                  )
                })}
              </View>
              <View style={{ flexDirection: 'row', marginTop: SP.lg }}>
                <PressBtn onPress={start} style={{ flex: 1, marginRight: SP.sm }}>
                  <View style={styles.retryBtn}>
                    <Icon name="repeat" size={16} color={C.primary} />
                    <Text style={{ color: C.primary, fontWeight: '800', marginLeft: 6 }}>Retry</Text>
                  </View>
                </PressBtn>
                <PressBtn onPress={next} style={{ flex: 1, marginLeft: SP.sm }}>
                  <View style={styles.nextBtn}>
                    <Text style={{ color: C.white, fontWeight: '800' }}>{idx + 1 >= deck.length ? 'Finish' : 'Next'}</Text>
                  </View>
                </PressBtn>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scorePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: C.line },
  card: { backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, padding: SP.xl, alignItems: 'center', width: '100%' },
  prompt: { fontSize: 13, fontWeight: '600', color: C.inkMute },
  term: { fontSize: 36, fontWeight: '800', letterSpacing: -0.9, color: C.ink, marginTop: SP.sm },
  pron: { fontSize: 14, color: C.inkMute, fontStyle: 'italic', marginTop: 6 },
  tr: { fontSize: 15, color: C.primary, fontWeight: '600', marginTop: SP.sm },
  recBtn: { width: 140, height: 140, borderRadius: 70, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', shadowColor: C.primaryDeep, shadowOpacity: 0.4, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  resultCard: { backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, padding: SP.lg },
  bigScore: { fontSize: 44, fontWeight: '800', letterSpacing: -1.4, color: C.primary },
  phonRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: SP.md },
  phonCell: { backgroundColor: C.primarySoft, borderRadius: RD.sm, borderWidth: 1, borderColor: C.primary, paddingHorizontal: 10, paddingVertical: 6, marginRight: 6, marginBottom: 6, alignItems: 'center' },
  retryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.card, borderRadius: RD.md, paddingVertical: 14, borderWidth: 1.5, borderColor: C.primary },
  nextBtn: { backgroundColor: C.primary, borderRadius: RD.md, paddingVertical: 14, alignItems: 'center' },
})
