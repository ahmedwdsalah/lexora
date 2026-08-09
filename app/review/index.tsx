import { router } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../lib/theme'
import { Icon } from '../../lib/icons'
import { hap, Header, PressBtn, ProgressBar } from '../../components/ui'
import { useStore } from '../../lib/store'

export default function ReviewSession() {
  const insets = useSafeAreaInsets()
  const words = useStore((s) => s.words)
  const deck = useMemo(() => words.filter((w) => w.due).slice(0, 8), [words])
  const [idx, setIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [missed, setMissed] = useState<string[]>([])
  const [flipped, setFlipped] = useState(false)
  const rotY = useRef(new Animated.Value(0)).current
  const dx = useRef(new Animated.Value(0)).current
  const rot = useRef(new Animated.Value(0)).current
  const [leaving, setLeaving] = useState<string | null>(null)

  const w = deck[idx]

  const flip = () => {
    if (leaving) return
    hap.tick()
    setFlipped(!flipped)
    Animated.spring(rotY, { toValue: flipped ? 0 : 1, friction: 7, tension: 120, useNativeDriver: true }).start()
  }

  const next = (knew: boolean) => {
    if (!w || leaving) return
    hap.medium()
    setLeaving(knew ? 'right' : 'left')
    Animated.timing(dx, { toValue: knew ? 380 : -380, duration: 220, useNativeDriver: true }).start(() => {
      if (knew) setCorrect((c) => c + 1)
      else setMissed((m) => [...m, w.id])
      dx.setValue(0); rot.setValue(0); rotY.setValue(0); setFlipped(false); setLeaving(null)
      if (idx + 1 >= deck.length) {
        router.push(`/review/results?correct=${correct + (knew ? 1 : 0)}&total=${deck.length}&missed=${missed.join(',')}`)
      } else {
        setIdx((i) => i + 1)
      }
    })
  }

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_, g) => {
          dx.setValue(g.dx)
          rot.setValue(g.dx / 12)
          if (Math.abs(g.dx) > 90 && !leaving) hap.light()
        },
        onPanResponderRelease: (_, g) => {
          if (g.dx > 90) next(true)
          else if (g.dx < -90) next(false)
          else {
            Animated.spring(dx, { toValue: 0, friction: 7, useNativeDriver: true }).start()
            Animated.spring(rot, { toValue: 0, friction: 7, useNativeDriver: true }).start()
          }
        },
      }),
    [w, idx, leaving]
  )

  useEffect(() => {
    dx.setValue(0); rot.setValue(0)
  }, [idx])

  if (!w) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', paddingTop: insets.top }}>
        <Text style={{ color: C.inkSoft }}>Nothing due right now — enjoy the break 🎉</Text>
      </View>
    )
  }

  const front = { transform: [{ perspective: 900 }, { rotateY: rotY.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }
  const back = { transform: [{ perspective: 900 }, { rotateY: rotY.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] }) }] }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title="Smart Review" subtitle={`${idx + 1} of ${deck.length} · tap card to flip`} />
      <View style={{ paddingHorizontal: SP.lg }}>
        <ProgressBar value={(idx + 1) / deck.length} />
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SP.lg }}>
        <Animated.View
          {...pan.panHandlers}
          style={{ transform: [{ translateX: dx }, { rotate: rot.interpolate({ inputRange: [-1, 1], outputRange: ['-8deg', '8deg'] }) }], width: '100%' }}
        >
          {/* stacked deck: next cards peeking behind */}
          {deck[idx + 1] && (
            <View style={[styles.peekCard, { transform: [{ scale: 0.93 }, { translateY: 12 }] }]}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: C.inkFaint }}>{deck[idx + 1].term}</Text>
            </View>
          )}
          {deck[idx + 2] && <View style={[styles.peekCard, { transform: [{ scale: 0.87 }, { translateY: 22 }] }]} />}
          <PressBtn onPress={flip}>
            <View style={styles.cardWrap}>
              <Animated.View style={[StyleSheet.absoluteFill, front, { backfaceVisibility: 'hidden' as any }]}>
                <View style={styles.card}>
                  <View style={styles.cardTag}>
                    <Icon name="vocab" size={14} color={C.primary} />
                    <Text style={{ color: C.primary, fontSize: 11, fontWeight: '700', marginLeft: 6 }}>TURKISH</Text>
                  </View>
                  <Text style={styles.term}>{w.term}</Text>
                  <Text style={styles.pron}>{w.pronunciation}</Text>
                  <Text style={styles.flipHint}>tap to flip</Text>
                </View>
              </Animated.View>
              <Animated.View style={[StyleSheet.absoluteFill, back, { backfaceVisibility: 'hidden' as any }]}>
                <View style={[styles.card, { backgroundColor: C.primarySoft, borderColor: C.primary }]}>
                  <Text style={styles.tr}>{w.translation}</Text>
                  {!!w.example && (
                    <View style={styles.exCard}>
                      <Text style={styles.exText}>{w.example}</Text>
                      <Text style={styles.exTr}>{w.exampleTr}</Text>
                    </View>
                  )}
                  <Text style={styles.flipHint}>tap to flip back</Text>
                </View>
              </Animated.View>
              {/* colored flash on answer */}
              <Animated.View
                pointerEvents="none"
                style={[
                  StyleSheet.absoluteFill, styles.cardFlash,
                  { borderColor: leaving === 'right' ? C.success : C.danger, opacity: dx.interpolate({ inputRange: [-380, 0, 380], outputRange: [1, 0, 1] }) },
                ]}
              />
            </View>
          </PressBtn>
        </Animated.View>

        <View style={{ flexDirection: 'row', marginTop: SP.xxl, width: '100%' }}>
          <PressBtn onPress={() => next(false)} style={{ flex: 1, marginRight: SP.sm }} haptic="light">
            <View style={styles.againBtn}>
              <Icon name="refresh" size={18} color={C.flame} />
              <Text style={{ color: C.flame, fontWeight: '800', fontSize: 15, marginLeft: 8 }}>Still learning</Text>
            </View>
          </PressBtn>
          <PressBtn onPress={() => next(true)} style={{ flex: 1, marginLeft: SP.sm }} haptic="light">
            <View style={styles.knewBtn}>
              <Icon name="check" size={18} color={C.white} strokeWidth={2.6} />
              <Text style={{ color: C.white, fontWeight: '800', fontSize: 15, marginLeft: 8 }}>I knew it</Text>
            </View>
          </PressBtn>
        </View>
        <Text style={{ color: C.inkMute, fontSize: 12, marginTop: SP.md }}>swipe right = knew it · left = still learning</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardWrap: { height: 330, width: '100%' },
  peekCard: { position: 'absolute', left: 0, right: 0, top: 0, height: 330, borderRadius: RD.xl, backgroundColor: '#EDEBE4', borderWidth: 1.5, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  cardFlash: { borderRadius: RD.xl, borderWidth: 5, backgroundColor: 'transparent' },
  card: {
    flex: 1, backgroundColor: C.card, borderRadius: RD.xl, borderWidth: 1.5, borderColor: C.line,
    padding: SP.xl, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.ink, shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 4,
  },
  cardTag: { flexDirection: 'row', alignItems: 'center', position: 'absolute', top: SP.lg, left: SP.lg },
  term: { fontSize: 38, fontWeight: '800', letterSpacing: -1, color: C.ink, textAlign: 'center' },
  pron: { fontSize: 15, color: C.inkMute, marginTop: 8, fontStyle: 'italic' },
  flipHint: { position: 'absolute', bottom: SP.lg, fontSize: 11, color: C.inkFaint, fontWeight: '600' },
  tr: { fontSize: 24, fontWeight: '800', color: C.primary, textAlign: 'center', letterSpacing: -0.4 },
  exCard: { backgroundColor: C.card, borderRadius: RD.md, padding: SP.md, marginTop: SP.lg, width: '100%' },
  exText: { fontSize: 15, color: C.ink, lineHeight: 21 },
  exTr: { fontSize: 12, color: C.inkSoft, marginTop: 4 },
  againBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDEEE6', borderRadius: RD.md, paddingVertical: 15, borderWidth: 1, borderColor: '#F8DCCB' },
  knewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary, borderRadius: RD.md, paddingVertical: 15 },
})
