import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../lib/theme'
import { Icon, type IconName } from '../lib/icons'
import { Btn, LexaAvatar, PressBtn, ProgressBar } from './ui'

export function OnboardShell({
  step, total, prompt, children, footer, onBack,
}: {
  step?: number
  total?: number
  prompt: string
  children: React.ReactNode
  footer?: React.ReactNode
  onBack?: () => void
}) {
  const insets = useSafeAreaInsets()
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top + SP.md }}>
      <View style={{ paddingHorizontal: SP.lg, flexDirection: 'row', alignItems: 'center' }}>
        {onBack ? (
          <PressBtn onPress={onBack} hit={36} style={{ marginRight: SP.sm }}>
            <Icon name="back" size={22} color={C.ink} />
          </PressBtn>
        ) : (
          <View style={{ width: 30 }} />
        )}
        <View style={{ flex: 1, marginLeft: SP.sm }}>
          {typeof step === 'number' && total ? (
            <ProgressBar value={step / total} style={{ height: 5 }} />
          ) : (
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.inkMute, letterSpacing: 1.2 }}>LEXORA</Text>
          )}
        </View>
        <Text style={{ width: 30, textAlign: 'right', fontSize: 13, fontWeight: '700', color: C.inkMute }}>
          {typeof step === 'number' ? `${step}/${total}` : ''}
        </Text>
      </View>

      <View style={styles.bubbleRow}>
        <LexaAvatar size={36} />
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{prompt}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>{children}</View>
      {footer && <View style={{ paddingHorizontal: SP.lg, paddingBottom: insets.bottom + SP.md }}>{footer}</View>}
    </View>
  )
}

export function InsightCallout({
  kind, title, body, visible,
}: {
  kind: 'success' | 'attention'
  title: string
  body: string
  visible: boolean
}) {
  const o = useRef(new Animated.Value(0)).current
  const h = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(o, { toValue: 1, duration: 320, useNativeDriver: false }),
        Animated.timing(h, { toValue: 1, duration: 320, useNativeDriver: false }),
      ]).start()
    }
  }, [visible])
  const isS = kind === 'success'
  return (
    <Animated.View
      style={{
        height: h.interpolate({ inputRange: [0, 1], outputRange: [0, 96] }),
        opacity: o,
        overflow: 'hidden',
        marginHorizontal: SP.lg,
        marginBottom: SP.md,
      }}
    >
      <View style={[styles.callout, { backgroundColor: isS ? C.successBg : C.attentionBg }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Icon name={isS ? 'bulb' : 'alert'} size={16} color={isS ? C.successTitle : C.attentionTitle} />
          <Text style={[styles.calloutTitle, { color: isS ? C.successTitle : C.attentionTitle }]}>{title}</Text>
        </View>
        <Text style={[styles.calloutBody, { color: isS ? C.success : C.attention }]}>{body}</Text>
      </View>
    </Animated.View>
  )
}

export function ContinueFooter({ onPress, label = 'Continue', disabled }: { onPress: () => void; label?: string; disabled?: boolean }) {
  return <Btn label={label} onPress={onPress} disabled={disabled} />
}

export function TileGrid({
  items, value, onChange, cols = 2,
}: {
  items: { id: string; label: string; icon: IconName; color?: string }[]
  value: string | null
  onChange: (id: string) => void
  cols?: 2 | 3
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: SP.lg - 4 }}>
      {items.map((it) => {
        const on = value === it.id
        const w = cols === 2 ? '48.5%' : '31.5%'
        return (
          <PressBtn key={it.id} onPress={() => onChange(it.id)} style={{ width: w, margin: 4 }} haptic="light">
            <View style={[styles.tile, on && styles.tileOn, cols === 3 && { minHeight: 96 }]}>
              <IconChipTile name={it.icon} color={it.color ?? C.primary} on={on} />
              <Text style={[styles.tileLabel, { color: on ? C.primary : C.ink }]} numberOfLines={2}>
                {it.label}
              </Text>
            </View>
          </PressBtn>
        )
      })}
    </View>
  )
}

function IconChipTile({ name, color, on }: { name: IconName; color: string; on: boolean }) {
  return (
    <View style={[styles.tileChip, on && { backgroundColor: C.primary }]}>
      <Icon name={name} size={20} color={on ? C.white : color} />
    </View>
  )
}

const styles = StyleSheet.create({
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: SP.lg, paddingTop: SP.xl, paddingBottom: SP.lg },
  bubble: {
    flex: 1, marginLeft: SP.sm, backgroundColor: C.card, borderRadius: RD.md, borderTopLeftRadius: 4,
    paddingHorizontal: SP.lg, paddingVertical: 12, borderWidth: 1, borderColor: C.lineSoft,
  },
  bubbleText: { fontSize: 15, lineHeight: 21, color: C.ink, fontWeight: '500' },
  callout: { borderRadius: RD.md, padding: SP.md, borderWidth: 1, borderColor: 'transparent' },
  calloutTitle: { fontSize: 13, fontWeight: '700', marginLeft: 6 },
  calloutBody: { fontSize: 13, lineHeight: 18 },
  tile: {
    backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.line,
    padding: SP.md, minHeight: 104, justifyContent: 'space-between',
  },
  tileOn: { borderColor: C.primary, backgroundColor: C.selected },
  tileChip: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  tileLabel: { fontSize: 13, fontWeight: '600', marginTop: SP.sm },
})
