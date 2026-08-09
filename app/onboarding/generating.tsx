import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { C, RD, SP } from '../../lib/theme'
import { BrandMark } from '../../lib/icons'
import { ProgressBar, Skeleton } from '../../components/ui'

const STEPS = ['Mapping your goals…', 'Tuning challenge to your level…', 'Folding your word bank…', 'Seeding your first session…']

export default function Generating() {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0.08)
  const o = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(o, { toValue: 1, duration: 500, useNativeDriver: true }).start()
    const si = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 620)
    const pi = setInterval(() => setProgress((p) => Math.min(1, p + 0.1)), 240)
    const done = setTimeout(() => router.replace('/onboarding/ready'), 3000)
    return () => { clearInterval(si); clearInterval(pi); clearTimeout(done) }
  }, [])

  return (
    <View style={styles.wrap}>
      <View style={{ alignItems: 'center', marginBottom: SP.xxl }}>
        <BrandMark size={56} />
        <Text style={styles.title}>Building your plan</Text>
        <Text style={styles.sub}>{STEPS[step]}</Text>
      </View>
      <View style={{ paddingHorizontal: SP.xxl }}>
        <ProgressBar value={progress} />
        <View style={{ marginTop: SP.xl }}>
          <Skeleton h={52} r={RD.md} style={{ marginBottom: SP.md }} />
          <Skeleton h={52} r={RD.md} style={{ marginBottom: SP.md }} />
          <Skeleton h={52} r={RD.md} style={{ marginBottom: SP.md }} />
          <Skeleton h={52} r={RD.md} w="60%" />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4, color: C.ink, marginTop: SP.lg },
  sub: { fontSize: 14, color: C.inkSoft, marginTop: 6 },
})
