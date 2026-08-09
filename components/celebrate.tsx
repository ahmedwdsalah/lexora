import React, { useEffect, useMemo, useRef } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native'
import { C, RD, SP } from '../lib/theme'
import { Icon, type IconName } from '../lib/icons'
import { Btn } from './ui'

// Falling confetti particles (Runna/Numo celebration pattern)
export function Confetti({ count = 22 }: { count?: number }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1200,
        dur: 1600 + Math.random() * 1600,
        size: 6 + Math.random() * 7,
        rot: Math.random() * 360,
        drift: -40 + Math.random() * 80,
        color: [C.primary, C.gold, '#B33951', C.success, C.flame, '#9B94D9'][i % 6],
        square: i % 3 !== 0,
      })),
    []
  )
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {parts.map((p, i) => <Particle key={i} p={p} />)}
    </View>
  )
}

function Particle({ p }: { p: { left: number; delay: number; dur: number; size: number; rot: number; drift: number; color: string; square: boolean } }) {
  const y = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(y, { toValue: 1, duration: p.dur, delay: p.delay, easing: Easing.linear, useNativeDriver: true })
    )
    loop.start()
    return () => loop.stop()
  }, [])
  return (
    <Animated.View
      style={{
        position: 'absolute', left: `${p.left}%`, top: -20,
        width: p.size, height: p.size, borderRadius: p.square ? 2 : p.size / 2, backgroundColor: p.color,
        transform: [
          { translateY: y.interpolate({ inputRange: [0, 1], outputRange: [-30, 760] }) },
          { translateX: y.interpolate({ inputRange: [0, 1], outputRange: [0, p.drift] }) },
          { rotate: y.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.rot}deg`] }) },
        ],
        opacity: y.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1, 0.3] }),
      }}
    />
  )
}

// Full-bleed celebration takeover
export function Celebration({
  visible, onClose, icon, title, sub, cta, onCta, badge,
}: {
  visible: boolean
  onClose: () => void
  icon: IconName
  title: string
  sub?: string
  cta: string
  onCta: () => void
  badge?: string
}) {
  const o = useRef(new Animated.Value(0)).current
  const pop = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (visible) {
      o.setValue(0); pop.setValue(0)
      Animated.timing(o, { toValue: 1, duration: 250, useNativeDriver: true }).start()
      Animated.spring(pop, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true, delay: 150 }).start()
    }
  }, [visible])
  if (!visible) return null
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: C.bg, zIndex: 100 }]}>
      <Confetti />
      {!!badge && (
        <View style={styles.toast}>
          <Icon name="bolt" size={14} color={C.gold} filled />
          <Text style={{ color: C.ink, fontWeight: '800', fontSize: 13, marginLeft: 6 }}>{badge}</Text>
        </View>
      )}
      <Animated.View style={{ flex: 1, opacity: o, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={{ transform: [{ scale: pop }], alignItems: 'center' }}>
          <View style={styles.badge}>
            <Icon name={icon} size={44} color={C.white} />
          </View>
          <Text style={styles.title}>{title}</Text>
          {!!sub && <Text style={styles.sub}>{sub}</Text>}
        </Animated.View>
      </Animated.View>
      <View style={styles.ctaWrap}>
        <Btn label={cta} onPress={onCta} />
        <Text style={{ textAlign: 'center', color: C.inkMute, fontSize: 12, marginTop: SP.sm }}>tap outside to skip</Text>
      </View>
      <View style={[styles.close, { top: 56 }]}>
        <PressableX onPress={onClose} />
      </View>
    </View>
  )
}

function PressableX({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(26,22,37,.06)', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="close" size={18} color={C.ink} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute', top: 96, alignSelf: 'center', flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.card, borderRadius: RD.full, paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: C.line, shadowColor: C.ink, shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  badge: { width: 104, height: 104, borderRadius: 52, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', shadowColor: C.primaryDeep, shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6, color: C.ink, marginTop: SP.xl, textAlign: 'center' },
  sub: { fontSize: 14, color: C.inkSoft, marginTop: 8, textAlign: 'center', paddingHorizontal: SP.xxl, lineHeight: 20 },
  ctaWrap: { paddingHorizontal: SP.lg, paddingBottom: 48 },
  close: { position: 'absolute', right: SP.lg },
})
