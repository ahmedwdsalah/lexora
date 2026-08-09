import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated, Easing, LayoutAnimation, PanResponder, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text,
  TextInput, View, type ViewStyle, UIManager,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import AnimatedRN, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated'
import { BrandMark, Icon, type IconName } from '../lib/icons'
import { C, RD, SP } from '../lib/theme'
import { langOf } from '../lib/theme'
import { useStore } from '../lib/store'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

// ── haptics helpers ──────────────────────────────────────────────────────────
export const hap = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  tick: () => Haptics.selectionAsync(),
}

// ── Screen shell ─────────────────────────────────────────────────────────────
export function Screen({
  children, scroll, bg = C.bg, style, contentStyle, refresh, refreshing, keyboard,
}: {
  children: React.ReactNode
  scroll?: boolean
  bg?: string
  style?: ViewStyle
  contentStyle?: ViewStyle
  refresh?: () => void
  refreshing?: boolean
  keyboard?: boolean
}) {
  const body = scroll ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[{ paddingBottom: 48 }, contentStyle]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        refresh ? <RefreshControl refreshing={!!refreshing} onRefresh={refresh} tintColor={C.primary} /> : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
  )
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: bg }, style]} edges={keyboard ? ['top'] : undefined}>
      {body}
    </SafeAreaView>
  )
}

// ── Header (custom in-screen) ────────────────────────────────────────────────
export function Header({
  title, subtitle, back, onBack, right, progress, tint = C.ink, dark = false, custom,
}: {
  title?: string
  subtitle?: string
  back?: boolean
  onBack?: () => void
  right?: React.ReactNode
  progress?: number
  tint?: string
  dark?: boolean
  custom?: React.ReactNode
}) {
  const router = useRouterNav()
  const go = onBack ?? router.back
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.header, { paddingTop: insets.top + SP.sm }, dark && { backgroundColor: C.primaryDeep }]}>
      <View style={styles.headerRow}>
        {back ? (
          <PressBtn onPress={go} hit={36} style={{ marginRight: SP.sm }}>
            <Icon name="back" size={22} color={dark ? C.white : tint} />
          </PressBtn>
        ) : (
          <BrandMark size={30} color={dark ? C.white : C.primary} />
        )}
        {custom ? (
          <View style={{ flex: 1 }}>{custom}</View>
        ) : (
          <View style={{ flex: 1 }}>
            {!!title && (
              <Text style={[styles.headerTitle, { color: dark ? C.white : tint }]} numberOfLines={1}>
                {title}
              </Text>
            )}
            {!!subtitle && <Text style={[styles.headerSub, { color: dark ? 'rgba(255,255,255,.7)' : C.inkSoft }]}>{subtitle}</Text>}
          </View>
        )}
        {right}
      </View>
      {typeof progress === 'number' && <ProgressBar value={progress} style={{ marginTop: SP.md }} />}
    </View>
  )
}

function useRouterNav() {
  return { back: () => require('expo-router').router.back() }
}

// ── Pressable with spring scale (button press micro-interaction) ────────────
export function PressBtn({
  children, onPress, style, hit = 40, haptic = 'light', disabled, onLongPress,
}: {
  children: React.ReactNode
  onPress?: () => void
  style?: any
  hit?: number
  haptic?: 'light' | 'medium' | 'none'
  disabled?: boolean
  onLongPress?: () => void
}) {
  const scale = useRef(new Animated.Value(1)).current
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 60, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 240, useNativeDriver: true }),
    ]).start()
  }
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPressIn={press}
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        hitSlop={hit > 40 ? { top: (hit - 40) / 2, bottom: (hit - 40) / 2, left: (hit - 40) / 2, right: (hit - 40) / 2 } : undefined}
        style={({ pressed }) => [{ opacity: disabled ? 0.45 : pressed ? 0.85 : 1 }]}
      >
        {children}
      </Pressable>
    </Animated.View>
  )
}

// ── Primary/secondary button ────────────────────────────────────────────────
export function Btn({
  label, onPress, variant = 'primary', icon, disabled, style, full = true,
}: {
  label: string
  onPress: () => void
  variant?: 'primary' | 'soft' | 'ghost' | 'danger' | 'white'
  icon?: IconName
  disabled?: boolean
  style?: any
  full?: boolean
}) {
  const palettes: Record<string, { bg: string; fg: string; border?: string }> = {
    primary: { bg: C.primary, fg: C.white },
    soft: { bg: C.primarySoft, fg: C.primary },
    ghost: { bg: 'transparent', fg: C.primary, border: C.line },
    danger: { bg: C.dangerBg, fg: C.danger },
    white: { bg: C.white, fg: C.primary },
  }
  const p = palettes[variant]
  return (
    <PressBtn onPress={onPress} disabled={disabled} haptic="medium" style={[{ width: full ? '100%' : 'auto' }, style]}>
      <View style={[styles.btn, { backgroundColor: p.bg, borderColor: p.border ?? 'transparent', borderWidth: p.border ? 1 : 0 }, full && { width: '100%' }]}>
        {!!icon && <Icon name={icon} size={19} color={p.fg} style={{ marginRight: SP.sm }} />}
        <Text style={[styles.btnLabel, { color: p.fg }]}>{label}</Text>
      </View>
    </PressBtn>
  )
}

// ── Icon-in-chip treatment ───────────────────────────────────────────────────
export function IconChip({
  name, color = C.primary, bg, size = 44, iconSize = 21, radius = RD.md, style,
}: {
  name: IconName
  color?: string
  bg?: string
  size?: number
  iconSize?: number
  radius?: number
  style?: any
}) {
  return (
    <View style={[{ width: size, height: size, borderRadius: radius, backgroundColor: bg ?? C.primarySoft, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Icon name={name} size={iconSize} color={color} />
    </View>
  )
}

// ── Selection card (spec: icon chip left, title+subtitle, radio right) ──────
export function SelCard({
  icon, title, subtitle, selected, onPress, badge, style,
}: {
  icon?: IconName
  title: string
  subtitle?: string
  selected?: boolean
  onPress?: () => void
  badge?: React.ReactNode
  style?: any
}) {
  return (
    <PressBtn onPress={onPress} style={style} haptic="light">
      <View style={[styles.selCard, selected && styles.selCardOn]}>
        {!!icon && <IconChip name={icon} size={42} iconSize={20} bg={selected ? C.primary : C.primarySoft} color={selected ? C.white : C.primary} style={{ marginRight: SP.md }} />}
        <View style={{ flex: 1 }}>
          <Text style={styles.selTitle}>{title}</Text>
          {!!subtitle && <Text style={styles.selSub}>{subtitle}</Text>}
        </View>
        {!!badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected && <Icon name="check" size={13} color={C.white} strokeWidth={3} />}
        </View>
      </View>
    </PressBtn>
  )
}

// ── Chip ─────────────────────────────────────────────────────────────────────
export function Chip({
  label, active, onPress, color, style,
}: {
  label: string
  active?: boolean
  onPress?: () => void
  color?: string
  style?: any
}) {
  const c = color ?? (active ? C.primary : C.inkSoft)
  return (
    <PressBtn onPress={onPress} hit={30} haptic="light" style={style}>
      <View style={[styles.chip, active && { backgroundColor: C.primarySoft, borderColor: C.primary }]}>
        <Text style={[styles.chipText, { color: c }]}>{label}</Text>
      </View>
    </PressBtn>
  )
}

// ── Segmented control with sliding pill ─────────────────────────────────────
export function Segmented({
  options, value, onChange, style,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  style?: any
}) {
  const [w, setW] = useState(0)
  const idx = Math.max(0, options.indexOf(value))
  const left = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.spring(left, { toValue: (w / options.length) * idx, friction: 9, tension: 120, useNativeDriver: true }).start()
  }, [idx, w])
  return (
    <View style={[styles.seg, style]} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      <Animated.View style={[styles.segPill, { width: w > 0 ? w / options.length - 3 : 'auto' } as any, { transform: [{ translateX: left }] }]} />
      {options.map((o) => (
        <Pressable
          key={o}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => { hap.light(); onChange(o) }}
        >
          <Text style={[styles.segText, { color: o === value ? C.primary : C.inkMute, fontWeight: o === value ? '700' : '500' }]}>
            {o}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

// ── Toggle switch ───────────────────────────────────────────────────────────
export function Toggle({ value, onChange, color = C.primary }: { value: boolean; onChange: (v: boolean) => void; color?: string }) {
  const off = useRef(new Animated.Value(value ? 1 : 0)).current
  useEffect(() => {
    Animated.timing(off, { toValue: value ? 1 : 0, duration: 180, useNativeDriver: true }).start()
  }, [value])
  return (
    <Pressable
      onPress={() => { hap.tick(); onChange(!value) }}
      style={[styles.toggle, { backgroundColor: value ? color : C.inkFaint }]}
    >
      <Animated.View
        style={{
          width: 22, height: 22, borderRadius: 11, backgroundColor: C.white,
          transform: [{ translateX: off.interpolate({ inputRange: [0, 1], outputRange: [2, 20] }) }],
        }}
      />
    </Pressable>
  )
}

// ── Slider with tick haptics ────────────────────────────────────────────────
export function Slider({
  min, max, step, value, onChange, ticks = true, format,
}: {
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  ticks?: boolean
  format?: (v: number) => string
}) {
  const [w, setW] = useState(0)
  const lastTick = useRef(value)
  const pos = ((value - min) / (max - min)) * (w - 24)
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => {
          const x = e.nativeEvent.locationX
          setFromX(x)
        },
        onPanResponderMove: (e) => {
          const x = e.nativeEvent.locationX
          setFromX(x)
        },
      }),
    [w, min, max, step]
  )
  const setFromX = (x: number) => {
    if (!w) return
    const ratio = Math.min(1, Math.max(0, x / w))
    const v = min + Math.round((ratio * (max - min)) / step) * step
    const clamped = Math.min(max, Math.max(min, v))
    if (clamped !== lastTick.current) {
      lastTick.current = clamped
      if (ticks) hap.tick()
      onChange(clamped)
    }
  }
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SP.sm }}>
        {ticks &&
          Array.from({ length: (max - min) / step + 1 }).map((_, i) => (
            <Text key={i} style={[styles.tickLabel, { color: min + i * step === value ? C.primary : C.inkFaint }]}>
              {format ? format(min + i * step) : min + i * step}
            </Text>
          ))}
      </View>
      <View
        style={styles.sliderTrack}
        onLayout={(e) => setW(e.nativeEvent.layout.width)}
        {...pan.panHandlers}
      >
        <View style={[styles.sliderFill, { width: pos }]} />
        <Animated.View style={[styles.sliderThumb, { left: pos }]} />
      </View>
    </View>
  )
}

// ── Progress bar (animated fill) ────────────────────────────────────────────
export function ProgressBar({ value, color = C.primary, style, track }: { value: number; color?: string; style?: any; track?: string }) {
  const [w, setW] = useState(0)
  const anim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(anim, { toValue: Math.min(1, value), duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start()
  }, [value])
  return (
    <View
      style={[{ height: 6, borderRadius: 3, backgroundColor: track ?? C.lineSoft, overflow: 'hidden' }, style]}
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
    >
      <Animated.View
        style={{
          height: '100%', borderRadius: 3, backgroundColor: color,
          width: anim.interpolate({ inputRange: [0, 1], outputRange: [0, w || 1] }),
        }}
      />
    </View>
  )
}

// ── Skeleton shimmer ────────────────────────────────────────────────────────
export function Skeleton({ w = '100%', h = 14, r = RD.sm, style }: { w?: any; h?: number; r?: number; style?: any }) {
  const x = useRef(new Animated.Value(-1)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(x, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    )
    loop.start()
    return () => loop.stop()
  }, [])
  return (
    <View style={[{ width: w, height: h, borderRadius: r, backgroundColor: C.lineSoft, overflow: 'hidden' }, style]}>
      <Animated.View
        style={{
          position: 'absolute', top: 0, bottom: 0, width: '60%',
          backgroundColor: 'rgba(255,255,255,.75)',
          transform: [{ translateX: x.interpolate({ inputRange: [-1, 1], outputRange: [-200, 260] }) }],
        }}
      />
    </View>
  )
}

// ── Empty state ─────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, body, action }: { icon: IconName; title: string; body: string; action?: React.ReactNode }) {
  const o = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(o, { toValue: 1, duration: 500, useNativeDriver: true }).start()
  }, [])
  return (
    <Animated.View style={{ alignItems: 'center', padding: SP.xxl, opacity: o, transform: [{ translateY: o.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
      <IconChip name={icon} size={72} iconSize={32} bg={C.primarySoft} radius={RD.xl} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={[styles.emptyBody, { textAlign: 'center' }]}>{body}</Text>
      {action}
    </Animated.View>
  )
}

// ── Swipe-to-delete row ─────────────────────────────────────────────────────
export function SwipeRow({ children, onDelete, onLongPress }: { children: React.ReactNode; onDelete: () => void; onLongPress?: () => void }) {
  const dx = useRef(new Animated.Value(0)).current
  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_, g) => dx.setValue(Math.max(-96, Math.min(0, g.dx))),
        onPanResponderRelease: (_, g) => {
          if (g.dx < -48) {
            hap.light()
            Animated.timing(dx, { toValue: -96, duration: 160, useNativeDriver: true }).start()
          } else {
            Animated.spring(dx, { toValue: 0, friction: 8, useNativeDriver: true }).start()
          }
        },
      }),
    []
  )
  return (
    <View style={{ overflow: 'hidden', borderRadius: RD.md }}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.swipeBg, { opacity: dx.interpolate({ inputRange: [-96, 0], outputRange: [1, 0] }) }]}>
        <PressBtn onPress={onDelete} hit={30} style={{ position: 'absolute', right: SP.lg, alignSelf: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="trash" size={19} color={C.white} />
            <Text style={{ color: C.white, fontWeight: '700', marginLeft: 6, fontSize: 13 }}>Delete</Text>
          </View>
        </PressBtn>
      </Animated.View>
      <Animated.View style={{ transform: [{ translateX: dx }] }} {...pan.panHandlers}>
        <Pressable onLongPress={onLongPress} delayLongPress={450}>
          {children}
        </Pressable>
      </Animated.View>
    </View>
  )
}

// ── Typing indicator dots ───────────────────────────────────────────────────
export function TypingDots({ color = C.inkSoft }: { color?: string }) {
  const a = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(0),
        Animated.timing(a, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(a, { toValue: 0, duration: 320, useNativeDriver: true }),
        Animated.delay(400),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [])
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: SP.xs }}>
      {[0, 1, 2].map((i) => (
        <Animated.View
          key={i}
          style={{
            width: 6, height: 6, borderRadius: 3, marginHorizontal: 2, backgroundColor: color,
            opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] }),
            transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) }],
          }}
        />
      ))}
    </View>
  )
}

// ── Chat bubble with entrance animation ─────────────────────────────────────
export function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const o = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(o, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start()
  }, [])
  return (
    <Animated.View
      style={{
        opacity: o,
        transform: [{ translateY: o.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
        alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
        maxWidth: '82%',
      }}
    >
      {children}
    </Animated.View>
  )
}

// ── Language badge (no flags) ───────────────────────────────────────────────
export function LangBadge({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' }) {
  const l = langOf(code)
  const d = size === 'sm' ? 22 : 30
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: d, height: d, borderRadius: d * 0.32, backgroundColor: l.color, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.white, fontWeight: '800', fontSize: size === 'sm' ? 10 : 13 }}>{l.code}</Text>
      </View>
      {size !== 'sm' && <Text style={{ marginLeft: 8, fontWeight: '600', color: C.ink }}>{l.name}</Text>}
    </View>
  )
}

// ── Bottom sheet (in-screen, for menus) ─────────────────────────────────────
export function Sheet({
  visible, onClose, title, children,
}: {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}) {
  const insets = useSafeAreaInsets()
  const y = useRef(new Animated.Value(600)).current
  const bg = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(y, { toValue: 0, friction: 9, tension: 110, useNativeDriver: true }),
        Animated.timing(bg, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start()
    } else {
      Animated.timing(y, { toValue: 600, duration: 220, useNativeDriver: true }).start()
      Animated.timing(bg, { toValue: 0, duration: 200, useNativeDriver: true }).start()
    }
  }, [visible])
  if (!visible) return null
  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(26,22,37,.45)', opacity: bg }]}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + SP.lg, transform: [{ translateY: y }] }]}>
        <View style={styles.sheetGrab} />
        {!!title && <Text style={styles.sheetTitle}>{title}</Text>}
        {children}
      </Animated.View>
    </View>
  )
}

// ── Search bar (expand/collapse) ────────────────────────────────────────────
export function SearchBar({
  value, onChange, onFocus, focused, style,
}: {
  value: string
  onChange: (v: string) => void
  onFocus?: () => void
  focused?: boolean
  style?: any
}) {
  const w = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(w, { toValue: focused ? 1 : 0, duration: 220, useNativeDriver: false }).start()
  }, [focused])
  return (
    <Animated.View
      style={[
        styles.search,
        { width: w.interpolate({ inputRange: [0, 1], outputRange: [44, '100%' as any] }) },
        focused && { borderColor: C.primary, backgroundColor: C.white },
        style,
      ]}
    >
      <Icon name="search" size={18} color={focused ? C.primary : C.inkMute} />
      <Animated.View style={{ flex: 1, opacity: w }}>
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          placeholder="Search your words…"
          placeholderTextColor={C.inkFaint}
          style={{ padding: 0, marginLeft: 8, fontSize: 15, color: C.ink, flex: 1 }}
          autoCapitalize="none"
        />
      </Animated.View>
    </Animated.View>
  )
}

// ── Toast / snackbar host (rendered once in root layout) ────────────────────
export function ToastHost() {
  const toast = useStore((s) => s.toast)
  const clear = useStore((s) => s.clearToast)
  const insets = useSafeAreaInsets()
  const y = useRef(new Animated.Value(90)).current
  useEffect(() => {
    if (toast) {
      hap.light()
      Animated.sequence([
        Animated.spring(y, { toValue: 0, friction: 8, tension: 140, useNativeDriver: true }),
        Animated.delay(1800),
        Animated.timing(y, { toValue: 90, duration: 250, useNativeDriver: true }),
      ]).start(() => clear())
    }
  }, [toast])
  if (!toast) return null
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end', alignItems: 'center' }]}>
      <Animated.View style={[styles.toast, { marginBottom: insets.bottom + 84, transform: [{ translateY: y }] }]}>
        <Icon name="check" size={16} color={C.white} strokeWidth={2.5} />
        <Text style={{ color: C.white, fontWeight: '600', fontSize: 14, marginLeft: 8 }}>{toast}</Text>
      </Animated.View>
    </View>
  )
}

// ── Section title ───────────────────────────────────────────────────────────
export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SP.sm }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!!action && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={{ color: C.primary, fontWeight: '600', fontSize: 13 }}>{action}</Text>
        </Pressable>
      )}
    </View>
  )
}

// ── Blur-on-scroll header backdrop (iOS pattern; UI-thread via reanimated) ──
export function BlurHeader({ scrollY, children }: { scrollY: SharedValue<number>; children: React.ReactNode }) {
  const bg = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 52], [0.25, 0.97], 'clamp'),
  }))
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
      <AnimatedRN.View style={[StyleSheet.absoluteFill, { backgroundColor: C.bg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line }, bg]} />
      {children}
    </View>
  )
}

// ── Inline colored stat pill (CapWords sentence-style) ─────────────────────
export function StatPill({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: RD.full, paddingHorizontal: 10, paddingVertical: 3, marginHorizontal: 2 }}>
      <Text style={{ color: fg, fontSize: 13, fontWeight: '800' }}>{label}</Text>
    </View>
  )
}

// ── 7-column day strip (CapWords calendar circles) ─────────────────────────
export function DayStrip({ days }: { days: { label: string; done?: boolean; today?: boolean }[] }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SP.xs }}>
      {days.map((d, i) => (
        <View key={`${d.label}-${i}`} style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: C.inkFaint }}>{d.label}</Text>
          <View
            style={[
              styles.dayCircle,
              d.done && { backgroundColor: C.primary },
              d.today && { borderWidth: 2, borderColor: C.flame, backgroundColor: d.done ? C.primary : C.card },
            ]}
          >
            {d.done && <Icon name="check" size={12} color={C.white} strokeWidth={3} />}
          </View>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: d.done ? C.flame : 'transparent', marginTop: 3 }} />
        </View>
      ))}
    </View>
  )
}

// ── Lexa avatar (AI) ────────────────────────────────────────────────────────
export function LexaAvatar({ size = 34, online }: { size?: number; online?: boolean }) {
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
        <BrandMark size={size * 0.72} />
      </View>
      {online && (
        <View style={{ position: 'absolute', right: 0, bottom: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: C.success, borderWidth: 2, borderColor: C.white }} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SP.lg, paddingTop: SP.sm, paddingBottom: SP.md },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  headerSub: { fontSize: 13, marginTop: 2 },
  btn: { height: 52, borderRadius: RD.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: SP.lg },
  btnLabel: { fontSize: 16, fontWeight: '700' },
  selCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md,
    borderWidth: 1.5, borderColor: C.line, padding: SP.md, marginBottom: SP.sm,
  },
  selCardOn: { borderColor: C.primary, backgroundColor: C.selected },
  selTitle: { fontSize: 15, fontWeight: '600', color: C.ink },
  selSub: { fontSize: 13, color: C.inkSoft, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: C.inkFaint, alignItems: 'center', justifyContent: 'center', marginLeft: SP.sm },
  radioOn: { backgroundColor: C.primary, borderColor: C.primary },
  badge: { backgroundColor: C.primarySoft, borderRadius: RD.sm, paddingHorizontal: 8, paddingVertical: 3, marginLeft: SP.sm },
  badgeText: { color: C.primary, fontSize: 11, fontWeight: '700' },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, paddingVertical: 7, borderRadius: RD.full, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, marginRight: SP.sm },
  chipText: { fontSize: 13, fontWeight: '600' },
  seg: { flexDirection: 'row', height: 44, backgroundColor: C.lineSoft, borderRadius: RD.md, padding: 3 },
  segPill: { position: 'absolute', top: 3, bottom: 3, left: 0, borderRadius: RD.sm, backgroundColor: C.white },
  segText: { fontSize: 14 },
  toggle: { width: 46, height: 26, borderRadius: 13, padding: 2 },
  dayCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 5 },
  sliderTrack: { height: 44, justifyContent: 'center' },
  sliderFill: { position: 'absolute', left: 0, height: 6, borderRadius: 3, backgroundColor: C.primary },
  sliderThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.white, borderWidth: 3, borderColor: C.primary, shadowColor: C.ink, shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  tickLabel: { fontSize: 12, fontWeight: '600' },
  swipeBg: { backgroundColor: C.danger, alignItems: 'center', flexDirection: 'row' },
  sheet: { backgroundColor: C.card, borderTopLeftRadius: RD.xl, borderTopRightRadius: RD.xl, padding: SP.lg },
  sheetGrab: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.inkFaint, alignSelf: 'center', marginBottom: SP.lg },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: SP.md },
  search: {
    height: 44, borderRadius: RD.md, backgroundColor: C.lineSoft, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, borderWidth: 1.5, borderColor: 'transparent',
  },
  toast: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.ink, paddingHorizontal: SP.lg, paddingVertical: 12,
    borderRadius: RD.full, shadowColor: C.ink, shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2, color: C.ink },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginTop: SP.lg, color: C.ink },
  emptyBody: { fontSize: 14, color: C.inkSoft, marginTop: 6, lineHeight: 20 },
})
