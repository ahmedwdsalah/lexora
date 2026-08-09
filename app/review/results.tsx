import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../lib/theme'
import { Icon } from '../../lib/icons'
import { Btn, hap, PressBtn } from '../../components/ui'
import { Celebration } from '../../components/celebrate'
import { useStore } from '../../lib/store'

export default function ReviewResults() {
  const { correct, total, missed } = useLocalSearchParams<{ correct: string; total: string; missed?: string }>()
  const c = parseInt(correct || '0', 10)
  const t = parseInt(total || '0', 10)
  const insets = useSafeAreaInsets()
  const addReview = useStore((s) => s.addReview)
  const streak = useStore((s) => s.streak)
  const words = useStore((s) => s.words)
  const toast = useStore((s) => s.toastMsg)
  const [logged, setLogged] = useState(false)
  const [showC, setShowC] = useState(false)
  const missedWords = (missed ?? '').split(',').filter(Boolean).map((id) => words.find((w) => w.id === id)).filter(Boolean)

  const ring = useRef(new Animated.Value(0)).current
  const pop = useRef(new Animated.Value(0)).current
  const R = 54
  const circ = 2 * Math.PI * R
  const pct = c / Math.max(1, t)

  useEffect(() => {
    Animated.timing(ring, { toValue: pct, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start()
    Animated.spring(pop, { toValue: 1, friction: 5, tension: 130, useNativeDriver: true, delay: 300 }).start()
    if (!logged) {
      setLogged(true)
      setTimeout(() => {
        addReview(c, t)
        if (c === t) setTimeout(() => setShowC(true), 900)
      }, 1200)
    }
  }, [])

  const celebrate = () => {
    hap.success()
    toast(`Streak is now ${streak + 1} days — keep the flame alive`)
  }

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + SP.lg }]}>
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
        <View style={styles.ringWrap}>
          <Svg width={140} height={140}>
            <Circle cx={70} cy={70} r={R} stroke={C.lineSoft} strokeWidth={10} fill="none" />
            <AnimatedCircle
              cx={70} cy={70} r={R} stroke={C.primary} strokeWidth={10} fill="none"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={ring.interpolate({ inputRange: [0, 1], outputRange: [circ, 0] })}
              rotation={-90} originX={70} originY={70}
            />
          </Svg>
          <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={styles.score}>{c}/{t}</Text>
            <Text style={styles.scoreLabel}>correct</Text>
          </View>
          <View style={styles.star}>
            <Icon name="sparkle" size={18} color={C.white} />
          </View>
        </View>
        <Text style={styles.title}>{pct >= 0.85 ? 'Brilliant session!' : pct >= 0.6 ? 'Solid work!' : 'Good effort — reps are reps'}</Text>
        <Text style={styles.sub}>Review complete · +1 day streak · your FSRS schedule just recalibrated</Text>
      </Animated.View>

      <View style={styles.statsRow}>
        {[
          { v: `${Math.round(pct * 100)}%`, l: 'accuracy' },
          { v: '4m 20s', l: 'time' },
          { v: '+1', l: 'streak' },
        ].map((s, i) => (
          <View key={s.l} style={[styles.stat, i < 2 && { marginRight: SP.sm }]}>
            <Text style={styles.statV}>{s.v}</Text>
            <Text style={styles.statL}>{s.l}</Text>
          </View>
        ))}
      </View>

      <View style={styles.reviewBox}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: 6 }}>
          {missedWords.length > 0 ? 'Words needing another look' : 'Nothing missed — every word graduated. Rare!'}
        </Text>
        {missedWords.map((w) => (
          <View key={w!.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{w!.term}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute, marginLeft: 8 }}>{w!.translation}</Text>
            <Text style={{ marginLeft: 'auto', fontSize: 11, color: C.flame, fontWeight: '700' }}>re-due tomorrow</Text>
          </View>
        ))}
        {missedWords.length === 0 && <Text style={{ fontSize: 13, color: C.inkSoft }} />}
      </View>

      <View style={{ paddingHorizontal: SP.lg }}>
        <PressBtn onPress={celebrate} haptic="light" style={{ marginBottom: SP.sm }}>
          <View style={styles.shareBtn}>
            <Icon name="share" size={17} color={C.primary} />
            <Text style={{ color: C.primary, fontWeight: '800', fontSize: 14, marginLeft: 8 }}>Share milestone</Text>
          </View>
        </PressBtn>
        {missedWords.length > 0 && (
          <PressBtn onPress={() => router.push('/review')} haptic="light" style={{ marginBottom: SP.sm }}>
            <View style={styles.reviewAgain}>
              <Icon name="refresh" size={17} color={C.white} />
              <Text style={{ color: C.white, fontWeight: '800', fontSize: 14, marginLeft: 8 }}>Review again now</Text>
            </View>
          </PressBtn>
        )}
        <Btn label="Done — back home" onPress={() => router.dismissAll()} />
      </View>

      <Celebration
        visible={showC}
        onClose={() => setShowC(false)}
        icon="crown"
        title="Flawless session!"
        sub="Every word graduated. Your FSRS schedule just got a perfect day."
        badge="+10 XP · perfect review"
        cta="Awesome!"
        onCta={() => { hap.medium(); setShowC(false); router.dismissAll() }}
      />
    </View>
  )
}

function AnimatedCircle(props: any) {
  return <Circle {...props} />
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg, justifyContent: 'space-between' },
  ringWrap: { width: 150, height: 150 },
  score: { fontSize: 34, fontWeight: '800', letterSpacing: -1, color: C.ink },
  scoreLabel: { fontSize: 12, color: C.inkMute, fontWeight: '600' },
  star: { position: 'absolute', top: 6, right: 4, width: 34, height: 34, borderRadius: 17, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '12deg' }] },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, color: C.ink, marginTop: SP.lg, textAlign: 'center' },
  sub: { fontSize: 13, color: C.inkSoft, marginTop: 6, textAlign: 'center', paddingHorizontal: SP.xl, lineHeight: 19 },
  statsRow: { flexDirection: 'row', paddingHorizontal: SP.lg, marginTop: SP.xl },
  stat: { flex: 1, backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, paddingVertical: SP.md, alignItems: 'center' },
  statV: { fontSize: 20, fontWeight: '800', color: C.ink },
  statL: { fontSize: 12, color: C.inkMute, marginTop: 2 },
  reviewBox: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.lg, marginHorizontal: SP.lg, marginTop: SP.md },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.card, borderRadius: RD.md, paddingVertical: 15, borderWidth: 1.5, borderColor: C.primary },
  reviewAgain: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.flame, borderRadius: RD.md, paddingVertical: 15 },
})
