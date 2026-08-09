import { useEffect, useRef } from 'react'
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native'
import ReAnimated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../lib/theme'
import { Icon, type IconName } from '../lib/icons'
import { BlurHeader, DayStrip, hap, Header, PressBtn, SectionTitle } from '../components/ui'
import { useStore } from '../lib/store'

const MILESTONES: { icon: IconName; label: string; at: number; got: boolean }[] = [
  { icon: 'sparkle', label: 'First word saved', at: 1, got: true },
  { icon: 'flame', label: '7-day streak', at: 7, got: true },
  { icon: 'vocab', label: '50 words in your bank', at: 50, got: true },
  { icon: 'bolt', label: '14-day streak', at: 14, got: false },
  { icon: 'crown', label: '100 words mastered', at: 100, got: false },
]

function BellCurve({ percentile }: { percentile: number }) {
  const pts: string[] = []
  for (let x = 0; x <= 300; x += 10) {
    const u = (x - 150) / 62
    const y = 90 - 88 * Math.exp(-(u * u) / 2)
    pts.push(`${x},${y}`)
  }
  const d = `M0,90 L${pts.map((p) => `L${p}`).join(' ')} L300,90 Z`
  const line = `M0,90 L${pts.map((p) => `L${p}`).join(' ')}`
  const mx = Math.min(300, Math.max(0, percentile * 3))
  const u = (mx - 150) / 62
  const my = 90 - 88 * Math.exp(-(u * u) / 2)
  return (
    <View>
      <Svg width="100%" height={100} viewBox="0 0 300 100">
        <Defs>
          <LinearGradient id="curve" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={C.primary} stopOpacity="0.35" />
            <Stop offset="1" stopColor={C.primary} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>
        <Path d={d} fill="url(#curve)" />
        <Path d={line} stroke={C.primary} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <Line x1={mx} y1={my} x2={mx} y2={94} stroke={C.primary} strokeWidth={1.5} strokeDasharray="3,3" />
        <Circle cx={mx} cy={my} r={6} fill={C.white} stroke={C.primary} strokeWidth={3} />
      </Svg>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <Text style={{ color: C.inkMute, fontSize: 10, fontWeight: '600' }}>0</Text>
        <Text style={{ color: C.inkMute, fontSize: 10, fontWeight: '600' }}>Average</Text>
        <Text style={{ color: C.inkMute, fontSize: 10, fontWeight: '600' }}>100</Text>
      </View>
    </View>
  )
}

export default function Stats() {
  const streak = useStore((s) => s.streak)
  const stats = useStore((s) => s.stats)
  const wordCount = useStore((s) => s.words.length)
  const toast = useStore((s) => s.toastMsg)
  const grow = useRef(new Animated.Value(0)).current
  const flame = useRef(new Animated.Value(1)).current
  const percentile = 34
  const insets = useSafeAreaInsets()
  const sv = useSharedValue(0)
  const onScroll = useAnimatedScrollHandler((e) => { sv.value = e.contentOffset.y })

  useEffect(() => {
    Animated.timing(grow, { toValue: 1, duration: 700, useNativeDriver: true }).start()
    Animated.sequence([
      Animated.timing(flame, { toValue: 1.3, duration: 180, useNativeDriver: true }),
      Animated.spring(flame, { toValue: 1, friction: 3, tension: 180, useNativeDriver: true }),
    ]).start()
  }, [])

  const share = () => {
    hap.success()
    toast('Milestone card copied — paste it anywhere')
  }

  const gridStats: { v: string; l: string; icon: IconName; color: string }[] = [
    { v: `${wordCount}`, l: 'Read', icon: 'vocab', color: C.primary },
    { v: '4', l: 'Favorited', icon: 'heart', color: '#B33951' },
    { v: '7', l: 'Saved', icon: 'bookmark', color: C.gold },
    { v: '10', l: 'Practices', icon: 'grad', color: C.success },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BlurHeader scrollY={sv}>
        <Header
          back title="Streak & stats" subtitle="Consistency beats intensity"
          right={
            <PressBtn onPress={share} hit={36}>
              <View style={styles.shareBtn}>
                <Icon name="share" size={17} color={C.primary} />
              </View>
            </PressBtn>
          }
        />
      </BlurHeader>
      <ReAnimated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: SP.lg, paddingTop: insets.top + 80, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.streakCard}>
          <View style={styles.streakTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Animated.View style={{ transform: [{ scale: flame }] }}>
                <Icon name="flame" size={30} color={C.flame} filled />
              </Animated.View>
              <Text style={styles.streakBig}>{streak}</Text>
              <Text style={styles.streakLabel}>day streak · best {Math.max(streak, 12)}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <PressBtn onPress={share} hit={30} style={{ marginRight: SP.sm }}>
                <Icon name="share" size={18} color={C.inkSoft} />
              </PressBtn>
              <PressBtn onPress={() => toast('Streak history coming soon')} hit={30}>
                <Icon name="dots" size={18} color={C.inkSoft} />
              </PressBtn>
            </View>
          </View>
          <DayStrip
            days={[
              { label: 'Tu', done: true },
              { label: 'We', done: true },
              { label: 'Th', done: true },
              { label: 'Fr', done: true },
              { label: 'Sa', done: true },
              { label: 'Su' },
              { label: 'Mo', today: true },
            ]}
          />
        </View>

        <View style={styles.grid}>
          {gridStats.map((s) => (
            <View key={s.l} style={styles.gridCard}>
              <View style={[styles.gridIcon, { backgroundColor: s.color + '1A' }]}>
                <Icon name={s.icon} size={16} color={s.color} />
              </View>
              <Text style={styles.gridV}>{s.v}</Text>
              <Text style={styles.gridL}>{s.l.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        <SectionTitle title="Your rank" />
        <View style={styles.rankCard}>
          <Text style={styles.rankTitle}>You outrank {percentile}% of learners</Text>
          <Text style={{ color: C.inkSoft, fontSize: 13, marginTop: 2 }}>Your score: {Math.round((stats.correct / Math.max(1, stats.answered)) * 100)}</Text>
          <View style={{ marginTop: SP.lg }}>
            <BellCurve percentile={percentile} />
          </View>
          <PressBtn onPress={() => toast('Practice to move the marker right')} style={{ marginTop: SP.md }}>
            <View style={styles.rankCta}>
              <Text style={{ color: C.white, fontWeight: '800', fontSize: 14 }}>Practice now</Text>
            </View>
          </PressBtn>
        </View>

        <SectionTitle title="Last 5 weeks" />
        <View style={styles.heatCard}>
          {Array.from({ length: 35 }).map((_, i) => {
            const intensity = LEVELS[Math.floor(i / 7) % 5]
            const done = i < 28 + streak
            return (
              <View key={i} style={[styles.heatCell, { backgroundColor: !done ? C.lineSoft : HEAT[intensity] }]} />
            )
          })}
        </View>

        <SectionTitle title="Lifetime" />
        <View style={styles.statsGrid}>
          {[
            { v: `${wordCount}`, l: 'words learned' },
            { v: `${stats.sessions}`, l: 'sessions' },
            { v: '8h 20m', l: 'total time' },
            { v: `${Math.round((stats.correct / Math.max(1, stats.answered)) * 100)}%`, l: 'accuracy' },
          ].map((s) => (
            <View key={s.l} style={styles.statCell}>
              <Text style={styles.statV}>{s.v}</Text>
              <Text style={styles.statL}>{s.l}</Text>
            </View>
          ))}
        </View>

        <SectionTitle title="Milestones" />
        <View style={styles.mileCard}>
          {MILESTONES.map((m, i) => (
            <View key={m.label} style={[styles.mileRow, i > 0 && { borderTopWidth: 1, borderTopColor: C.lineSoft }]}>
              <View style={[styles.mileIcon, { backgroundColor: m.got ? '#FBEED0' : C.lineSoft }]}>
                <Icon name={m.icon} size={17} color={m.got ? C.gold : C.inkFaint} />
              </View>
              <Text style={{ flex: 1, color: m.got ? C.ink : C.inkMute, fontWeight: '600', fontSize: 14, marginLeft: SP.md }}>
                {m.label}
              </Text>
              {m.got ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="check" size={14} color={C.success} strokeWidth={2.6} />
                  <Text style={{ color: C.success, fontWeight: '700', fontSize: 11, marginLeft: 4 }}>Unlocked</Text>
                </View>
              ) : (
                <Text style={{ color: C.inkFaint, fontSize: 11, fontWeight: '700' }}>{m.at} needed</Text>
              )}
            </View>
          ))}
        </View>
      </ReAnimated.ScrollView>
    </View>
  )
}

const LEVELS = [0, 0.25, 0.5, 0.75, 1]
const HEAT: Record<number, string> = { 0: C.lineSoft, 0.25: '#C9C4EC', 0.5: '#9B94D9', 0.75: C.primary, 1: C.primaryDeep }

const styles = StyleSheet.create({
  shareBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  streakCard: { backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, padding: SP.lg },
  streakTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SP.sm },
  streakBig: { fontSize: 40, fontWeight: '800', letterSpacing: -1.5, color: C.flame, marginLeft: 8 },
  streakLabel: { fontSize: 12, color: C.inkSoft, fontWeight: '600', marginLeft: 8, maxWidth: 100 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: SP.sm, marginTop: SP.md },
  gridCard: { width: '48.5%', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md, minHeight: 96 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: SP.sm },
  gridIcon: { position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  gridV: { fontSize: 30, fontWeight: '800', letterSpacing: -1, color: C.ink, marginTop: 4 },
  gridL: { fontSize: 10, color: C.inkMute, fontWeight: '700', letterSpacing: 0.8, marginTop: 2 },
  rankCard: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.lg },
  rankTitle: { fontSize: 17, fontWeight: '800', color: C.ink, letterSpacing: -0.3 },
  rankCta: { backgroundColor: C.primary, borderRadius: RD.full, paddingVertical: 13, alignItems: 'center' },
  heatCard: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md },
  heatCell: { width: 14, height: 14, borderRadius: 4, margin: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: SP.sm },
  statCell: { width: '48.5%', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md },
  statV: { fontSize: 22, fontWeight: '800', color: C.ink, letterSpacing: -0.4 },
  statL: { fontSize: 12, color: C.inkMute, marginTop: 2 },
  mileCard: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, paddingHorizontal: SP.md },
  mileRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  mileIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
})
