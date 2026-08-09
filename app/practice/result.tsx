import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../lib/theme'
import { Icon } from '../../lib/icons'
import { Btn, hap, PressBtn } from '../../components/ui'
import { Celebration } from '../../components/celebrate'

export default function ExerciseResult() {
  const { score, total, type } = useLocalSearchParams<{ score: string; total: string; type?: string }>()
  const insets = useSafeAreaInsets()
  const s = parseInt(score || '0', 10)
  const t = parseInt(total || '1', 10)
  const pct = Math.min(100, Math.round((s / Math.max(1, t)) * 100))
  const stars = pct >= 90 ? 3 : pct >= 65 ? 2 : 1
  const pop = useRef(new Animated.Value(0)).current
  const confetti = useRef(new Animated.Value(0)).current
  const [celebrate, setCelebrate] = useState(false)

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }).start()
    Animated.timing(confetti, { toValue: 1, duration: 1200, useNativeDriver: true }).start()
    if (stars >= 2) hap.success()
    if (stars === 3) setTimeout(() => setCelebrate(true), 1200)
  }, [])

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + SP.lg }]}>
      <View style={styles.grab} />
      <View style={{ alignItems: 'center', marginTop: SP.lg }}>
        <Animated.View style={{ transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }] }}>
          <View style={styles.badge}>
            <Icon name={stars === 3 ? 'crown' : stars === 2 ? 'trophy' : 'sparkle'} size={34} color={C.white} />
          </View>
        </Animated.View>
        <View style={{ flexDirection: 'row', marginTop: SP.md }}>
          {[0, 1, 2].map((i) => (
            <Icon key={i} name="star" size={26} color={i < stars ? C.gold : C.inkFaint} filled={i < stars} />
          ))}
        </View>
        <Text style={styles.title}>
          {stars === 3 ? 'Flawless!' : stars === 2 ? 'Great run!' : 'Good first attempt'}
        </Text>
        <Text style={styles.sub}>
          {type ?? 'Exercise'} · {s}/{t} correct · {pct}%
        </Text>
      </View>

      {confettiView(confetti)}

      <View style={styles.stats}>
        <View style={styles.statRow}>
          <Icon name="bolt" size={17} color={C.primary} />
          <Text style={{ color: C.ink, fontWeight: '700', marginLeft: 10 }}>Words reinforced</Text>
          <Text style={{ marginLeft: 'auto', color: C.primary, fontWeight: '800' }}>+{t}</Text>
        </View>
        <View style={styles.statRow}>
          <Icon name="flame" size={17} color={C.flame} />
          <Text style={{ color: C.ink, fontWeight: '700', marginLeft: 10 }}>Streak bonus</Text>
          <Text style={{ marginLeft: 'auto', color: C.flame, fontWeight: '800' }}>+1 day</Text>
        </View>
        <View style={styles.statRow}>
          <Icon name="target" size={17} color={C.success} />
          <Text style={{ color: C.ink, fontWeight: '700', marginLeft: 10 }}>Next review</Text>
          <Text style={{ marginLeft: 'auto', color: C.success, fontWeight: '800' }}>tomorrow</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: SP.lg, marginTop: 'auto' }}>
        <Btn label="Back to practice" onPress={() => router.dismissTo('/practice/hub')} />
        <PressBtn onPress={() => { hap.light(); router.dismissTo('/practice/hub') }} hit={30} style={{ marginTop: SP.sm }}>
          <Text style={{ textAlign: 'center', color: C.inkMute, fontSize: 13, fontWeight: '600' }}>Retry for 3 stars</Text>
        </PressBtn>
      </View>

      <Celebration
        visible={celebrate}
        onClose={() => setCelebrate(false)}
        icon="trophy"
        title="Three stars earned!"
        sub={`Perfect run on ${type ?? 'this exercise'} — Lexa's folding these words deeper into your deck.`}
        badge="+10 XP · streak bonus ready"
        cta="Had fun! I'm done"
        onCta={() => { hap.medium(); setCelebrate(false); router.dismissTo('/practice/hub') }}
      />
    </View>
  )
}

function confettiView(a: Animated.Value) {
  const parts = [
    { x: -90, y: -40, r: 0, c: C.primary },
    { x: 90, y: -30, r: 30, c: C.gold },
    { x: -120, y: 10, r: 60, c: C.success },
    { x: 120, y: 10, r: 90, c: '#B33951' },
    { x: 0, y: -80, r: 20, c: C.flame },
  ]
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      {parts.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute', width: 10, height: 10, borderRadius: 3, backgroundColor: p.c,
            transform: [
              { translateX: a.interpolate({ inputRange: [0, 1], outputRange: [0, p.x] }) },
              { translateY: a.interpolate({ inputRange: [0, 1], outputRange: [-20, p.y] }) },
              { rotate: `${p.r}deg` },
              { scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
            ],
            opacity: a.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 1, 0.4] }),
          }}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.card, borderTopLeftRadius: RD.xl, borderTopRightRadius: RD.xl, paddingTop: SP.md },
  grab: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.inkFaint, alignSelf: 'center' },
  badge: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', shadowColor: C.primaryDeep, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5, color: C.ink, marginTop: SP.md },
  sub: { fontSize: 14, color: C.inkSoft, marginTop: 4 },
  stats: { backgroundColor: C.bg, borderRadius: RD.md, marginHorizontal: SP.lg, marginTop: SP.xl, padding: SP.md },
  statRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
})
