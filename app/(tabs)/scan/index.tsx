import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../../lib/theme'
import { Icon } from '../../../lib/icons'
import { hap, PressBtn } from '../../../components/ui'
import { useStore } from '../../../lib/store'

export default function Scanner() {
  const insets = useSafeAreaInsets()
  const [perm, request] = useCameraPermissions()
  const cam = useRef<CameraView>(null)
  const setScan = useStore((s) => s.setScan)
  const toast = useStore((s) => s.toastMsg)
  const [capturing, setCapturing] = useState(false)
  const [flash, setFlash] = useState(false)
  const [pages, setPages] = useState(1)
  const flashAnim = useRef(new Animated.Value(0)).current
  const sweep = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sweep, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(sweep, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [])

  const toReview = (uri: string) => {
    setScan(uri, [])
    router.push('/scan/review')
  }

  const shoot = async () => {
    if (!cam.current || capturing) return
    setCapturing(true)
    hap.medium()
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 90, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start()
    const photo = await cam.current.takePictureAsync({ quality: 0.7 }).catch(() => null)
    setTimeout(() => {
      setCapturing(false)
      if (photo) toReview(photo.uri)
    }, 400)
  }

  const pickLibrary = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 }).catch(() => null)
    if (res?.assets?.[0]?.uri) {
      hap.medium()
      toReview(res.assets[0].uri)
    }
  }

  if (!perm?.granted) {
    return (
      <View style={[styles.wrap, { paddingTop: insets.top + 80, padding: SP.xl }]}>
        <View style={styles.lockChip}>
          <Icon name="lock" size={26} color={C.primary} />
        </View>
        <Text style={styles.permTitle}>Camera access</Text>
        <Text style={styles.permBody}>
          Lexora photographs your handwritten notes and turns them into vocabulary. The photo never leaves your device until you approve the extraction.
        </Text>
        <PressBtn onPress={request} style={{ alignSelf: 'center', marginTop: SP.lg }}>
          <View style={styles.permBtn}>
            <Text style={{ color: C.white, fontWeight: '700', fontSize: 15 }}>Allow camera</Text>
          </View>
        </PressBtn>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#10101A' }}>
      <CameraView ref={cam} style={StyleSheet.absoluteFill} facing="back" enableTorch={flash} />

      {/* floating header: close, page counter, flash toggle */}
      <View style={{ position: 'absolute', top: insets.top + SP.md, left: SP.lg, right: SP.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <PressBtn onPress={() => router.back()} hit={36}>
          <View style={styles.headerBtn}>
            <Icon name="close" size={18} color={C.white} />
          </View>
        </PressBtn>
        <View style={styles.pagePill}>
          <Text style={{ color: C.white, fontWeight: '800', fontSize: 13 }}>Page {pages}</Text>
        </View>
        <PressBtn onPress={() => { hap.tick(); setFlash(!flash) }} hit={36}>
          <View style={[styles.headerBtn, flash && { backgroundColor: C.gold }]}>
            <Icon name="bolt" size={18} color={flash ? C.ink : C.white} filled={flash} />
          </View>
        </PressBtn>
      </View>

      {/* animated edge-detection frame + scan sweep */}
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="none">
        <View style={styles.finder}>
          {['tl', 'tr', 'bl', 'br'].map((c) => (
            <Animated.View
              key={c}
              style={[
                styles.corner,
                styles[`corner${c}` as keyof typeof styles],
                { opacity: sweep.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.55, 1, 0.55] }) },
              ]}
            />
          ))}
          <Animated.View
            style={[
              styles.sweepLine,
              { transform: [{ translateY: sweep.interpolate({ inputRange: [0, 1], outputRange: [14, 326] }) }] },
            ]}
          />
        </View>
      </View>

      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: C.white, opacity: flashAnim }]} pointerEvents="none" />

      {/* bottom bar: gallery, shutter, add page */}
      <View style={{ position: 'absolute', bottom: insets.bottom + 36, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <PressBtn onPress={pickLibrary} haptic="light" style={{ position: 'absolute', left: SP.xl }}>
          <View style={styles.sideBtn}>
            <Icon name="grid" size={20} color={C.white} />
          </View>
        </PressBtn>
        <PressBtn onPress={shoot} haptic="medium">
          <View style={styles.shutterRing}>
            <View style={[styles.shutter, capturing && { backgroundColor: C.primary }]} />
          </View>
        </PressBtn>
        <PressBtn onPress={() => { hap.light(); setPages((p) => p + 1); toast('Page queued — next capture appends to this scan') }} haptic="light" style={{ position: 'absolute', right: SP.xl }}>
          <View style={styles.sideBtn}>
            <Icon name="plus" size={20} color={C.white} strokeWidth={2.4} />
          </View>
        </PressBtn>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg },
  lockChip: { width: 56, height: 56, borderRadius: 18, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  permTitle: { fontSize: 20, fontWeight: '800', color: C.ink, textAlign: 'center', marginTop: SP.lg },
  permBody: { fontSize: 14, color: C.inkSoft, textAlign: 'center', marginTop: SP.sm, lineHeight: 20 },
  permBtn: { backgroundColor: C.primary, borderRadius: RD.full, paddingHorizontal: 28, paddingVertical: 14 },
  headerBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(16,16,26,.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,.25)', alignItems: 'center', justifyContent: 'center' },
  pagePill: { backgroundColor: 'rgba(16,16,26,.55)', borderRadius: RD.full, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,.25)' },
  finder: { width: 280, height: 360 },
  corner: { position: 'absolute', width: 28, height: 28, borderColor: C.white, borderWidth: 3 },
  cornertl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 8 },
  cornertr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 8 },
  cornerbl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 8 },
  cornerbr: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 8 },
  sweepLine: { position: 'absolute', left: 10, right: 10, height: 2, backgroundColor: 'rgba(255,255,255,.85)', borderRadius: 1, shadowColor: C.white, shadowOpacity: 0.6, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
  shutterRing: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: 'rgba(255,255,255,.9)', alignItems: 'center', justifyContent: 'center' },
  shutter: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.white, borderWidth: 2, borderColor: 'rgba(255,255,255,.6)' },
  sideBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,.28)', alignItems: 'center', justifyContent: 'center' },
})
