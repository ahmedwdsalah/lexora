import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, LayoutAnimation, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import ReAnimated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../../lib/theme'
import { Icon } from '../../../lib/icons'
import { BlurHeader, Btn, Chip, hap, Header, PressBtn, Skeleton } from '../../../components/ui'
import { Celebration } from '../../../components/celebrate'
import { useStore } from '../../../lib/store'
import type { Word } from '../../../lib/mock'

const EXTRACTED: Word[] = [
  { id: 'e1', term: 'kahvaltı yapmak', translation: 'to have breakfast', pronunciation: 'kah-vahl-TUH yahp-mahk', example: 'Her sabah kahvaltı yaparım.', exampleTr: 'I have breakfast every morning.', folderIds: ['f-verbs', 'f-food'], source: 'scan', addedAt: '', reps: 0, due: true, strength: 0.2 },
  { id: 'e2', term: 'yastık', translation: 'pillow', pronunciation: 'yahs-TUHk', example: 'Bir yastık daha lazım.', exampleTr: 'I need another pillow.', folderIds: ['f-travel'], source: 'scan', addedAt: '', reps: 0, due: true, strength: 0.2 },
  { id: 'e3', term: 'kayısı', translation: 'apricot', pronunciation: 'kah-YUH-suh', example: 'Kayısı olgunlaşmış.', exampleTr: 'The apricot is ripe.', folderIds: ['f-food'], source: 'scan', addedAt: '', reps: 0, due: true, strength: 0.2 },
  { id: 'e4', term: 'değerlendirmek', translation: 'to take advantage of', pronunciation: 'deh-er-len-DEER-mehk', example: 'Güzel havayı değerlendirelim.', exampleTr: "Let's make the most of the good weather.", folderIds: ['f-verbs'], source: 'scan', addedAt: '', reps: 0, due: true, strength: 0.2 },
]

export default function ScanReview() {
  const insets = useSafeAreaInsets()
  const scanImage = useStore((s) => s.scanImage)
  const setScan = useStore((s) => s.setScan)
  const commit = useStore((s) => s.commitScan)
  const folders = useStore((s) => s.folders)
  const toast = useStore((s) => s.toastMsg)
  const [loading, setLoading] = useState(true)
  const [words, setWords] = useState<Word[]>(EXTRACTED)
  const [included, setIncluded] = useState<Record<string, boolean>>({})
  const [editing, setEditing] = useState<string | null>(null)
  const [rot, setRot] = useState(0)
  const [celebrate, setCelebrate] = useState(false)
  const sv = useSharedValue(0)
  const onScroll = useAnimatedScrollHandler((e) => { sv.value = e.contentOffset.y })
  const entrances = useRef(words.map((_, i) => new Animated.Value(0))).current

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false)
      entrances.forEach((a, i) => {
        Animated.timing(a, { toValue: 1, duration: 320, delay: i * 90, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start()
      })
    }, 1600)
    return () => clearTimeout(t)
  }, [])

  const selected = words.filter((w) => included[w.id] !== false).length

  const saveAll = () => {
    const picked = words.filter((w) => included[w.id] !== false)
    hap.success()
    commit(picked)
    toast(`${picked.length} words added to vocabulary`)
    if (picked.length >= 3) {
      setCelebrate(true)
    } else {
      setScan(null, [])
      router.navigate('/vocabulary')
    }
  }

  const toggleFolder = (w: Word, fid: string) => {
    hap.light()
    setWords((ws) => ws.map((x) => (x.id === w.id ? { ...x, folderIds: x.folderIds.includes(fid) ? x.folderIds.filter((f) => f !== fid) : [...x.folderIds, fid] } : x)))
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BlurHeader scrollY={sv}>
        <Header
          back
          title="Review scan"
          subtitle={loading ? 'Extracting words…' : `${words.length} words extracted`}
          right={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: C.inkSoft, fontSize: 12, fontWeight: '700', marginRight: 10 }}>1 of 1</Text>
              <PressBtn onPress={() => { hap.light(); setScan(null, []); router.back() }} hit={36}>
                <View style={styles.discardBtn}>
                  <Icon name="close" size={18} color={C.danger} />
                </View>
              </PressBtn>
            </View>
          }
        />
      </BlurHeader>
      <ReAnimated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: SP.lg, paddingTop: insets.top + 80, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {scanImage ? (
          <Image source={{ uri: scanImage }} style={[styles.photo, { transform: [{ rotate: `${rot}deg` }] }]} resizeMode="cover" />
        ) : (
          <View style={styles.photo}>
            <View style={{ alignItems: 'center', opacity: 0.5 }}>
              <Icon name="scan" size={28} color={C.inkSoft} />
              <Text style={{ color: C.inkSoft, fontSize: 12, marginTop: 6 }}>notebook-madrid-01.jpg</Text>
            </View>
          </View>
        )}

        {!loading && (
          <View style={{ flexDirection: 'row', marginTop: SP.md, marginBottom: SP.sm }}>
            <PressBtn onPress={() => { hap.light(); router.back() }} style={{ flex: 1, marginRight: SP.sm }}>
              <View style={styles.secondaryBtn}>
                <Icon name="refresh" size={16} color={C.inkSoft} />
                <Text style={{ color: C.inkSoft, fontWeight: '700', fontSize: 13, marginLeft: 6 }}>Retake</Text>
              </View>
            </PressBtn>
            <PressBtn onPress={() => { hap.tick(); setRot((r) => (r + 90) % 360) }} style={{ flex: 1, marginRight: SP.sm }}>
              <View style={styles.secondaryBtn}>
                <Icon name="refresh" size={16} color={C.inkSoft} />
                <Text style={{ color: C.inkSoft, fontWeight: '700', fontSize: 13, marginLeft: 6 }}>Rotate</Text>
              </View>
            </PressBtn>
            <PressBtn onPress={() => { hap.light(); toast('Second page queued — tap Retake to photograph it') }} style={{ flex: 1, marginLeft: SP.sm }}>
              <View style={styles.secondaryBtn}>
                <Icon name="plus" size={16} color={C.inkSoft} />
                <Text style={{ color: C.inkSoft, fontWeight: '700', fontSize: 13, marginLeft: 6 }}>Add page</Text>
              </View>
            </PressBtn>
          </View>
        )}

        {!loading && (
          <View style={styles.toolbar}>
            {[
              { icon: 'sliders', label: 'Edit' },
              { icon: 'trash', label: 'Delete' },
              { icon: 'layers', label: 'Arrange' },
            ].map((t) => (
              <PressBtn key={t.label} onPress={() => { hap.light(); toast(`${t.label} tools — tap a word to edit it directly`) }} hit={30}>
                <View style={styles.toolItem}>
                  <Icon name={t.icon as any} size={19} color={C.inkSoft} />
                  <Text style={styles.toolLabel}>{t.label}</Text>
                </View>
              </PressBtn>
            ))}
          </View>
        )}

        {loading ? (
          <View style={{ marginTop: SP.lg }}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SP.md }}>
                <Skeleton w={40} h={40} r={RD.md} />
                <View style={{ flex: 1, marginLeft: SP.md }}>
                  <Skeleton w="55%" h={16} style={{ marginBottom: 6 }} />
                  <Skeleton w="75%" h={12} />
                </View>
              </View>
            ))}
            <Text style={{ textAlign: 'center', color: C.inkMute, fontSize: 12, marginTop: SP.sm }}>Reading handwriting — Turkish detected</Text>
          </View>
        ) : (
          <View style={{ marginTop: SP.md }}>
            <View style={styles.sortRow}>
              <Chip label="Auto-sorted into folders" active />
              <Text style={{ fontSize: 12, color: C.inkMute }}>tap a word to edit</Text>
            </View>
            {words.map((w, i) => (
              <Animated.View
                key={w.id}
                style={{ opacity: entrances[i], transform: [{ translateY: entrances[i].interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }}
              >
                <View style={[styles.wordCard, included[w.id] === false && { opacity: 0.4 }]}>
                  <View style={styles.wordTop}>
                    <PressBtn onPress={() => { hap.tick(); setIncluded((s) => ({ ...s, [w.id]: s[w.id] === false ? true : false })) }} hit={32}>
                      <View style={[styles.checkBox, included[w.id] !== false && styles.checkBoxOn]}>
                        {included[w.id] !== false && <Icon name="check" size={13} color={C.white} strokeWidth={3} />}
                      </View>
                    </PressBtn>
                    <View style={{ flex: 1, marginLeft: SP.sm }}>
                      <Text style={[styles.term, included[w.id] === false && { textDecorationLine: 'line-through' }]}>{w.term}</Text>
                      <Text style={styles.tr}>{w.translation}</Text>
                    </View>
                  </View>
                  {editing === w.id ? (
                    <View style={{ marginTop: SP.sm }}>
                      <TextInput value={w.translation} onChangeText={(t) => setWords((ws) => ws.map((x) => (x.id === w.id ? { ...x, translation: t } : x)))} style={styles.editInput} autoFocus onBlur={() => setEditing(null)} />
                      <TextInput value={w.example} onChangeText={(t) => setWords((ws) => ws.map((x) => (x.id === w.id ? { ...x, example: t } : x)))} style={styles.editInput} />
                      <View style={{ flexDirection: 'row', marginTop: SP.sm }}>
                        <Chip label="Done editing" active onPress={() => { hap.medium(); setEditing(null); LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut) }} />
                      </View>
                    </View>
                  ) : (
                    <PressBtn onPress={() => { setEditing(w.id); hap.light() }} hit={30}>
                      <View style={styles.expandRow}>
                        <Icon name="edit" size={14} color={C.inkFaint} />
                        <Text style={styles.expandText}>Edit translation & example</Text>
                      </View>
                    </PressBtn>
                  )}
                  <View style={styles.folderRow}>
                    {folders.slice(0, 5).map((f) => {
                      const on = w.folderIds.includes(f.id)
                      return (
                        <PressBtn key={f.id} onPress={() => toggleFolder(w, f.id)} hit={28} style={{ marginRight: 6, marginBottom: 4 }}>
                          <View style={[styles.folderTag, { backgroundColor: on ? f.color + '22' : C.bg, borderColor: on ? f.color : C.line }]}>
                            <Text style={{ color: on ? f.color : C.inkMute, fontSize: 11, fontWeight: '700' }}>{f.name}</Text>
                          </View>
                        </PressBtn>
                      )
                    })}
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        )}
      </ReAnimated.ScrollView>

      {!loading && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + SP.md }]}>
          <View style={styles.bottomRow}>
            <View style={{ flex: 1, marginRight: SP.md }}>
              <Text style={{ color: C.ink, fontWeight: '700', fontSize: 13 }}>{selected} of {words.length} selected</Text>
              <Text style={{ color: C.inkMute, fontSize: 11 }}>excluded words are skipped</Text>
            </View>
            <PressBtn onPress={saveAll} disabled={selected === 0} style={{ opacity: selected === 0 ? 0.45 : 1 }}>
              <View style={styles.saveBar}>
                <Icon name="vocab" size={16} color={C.white} />
                <Text style={{ color: C.white, fontWeight: '800', fontSize: 14, marginLeft: 6 }}>Add to vocabulary</Text>
              </View>
            </PressBtn>
          </View>
        </View>
      )}

      <Celebration
        visible={celebrate}
        onClose={() => { setCelebrate(false); setScan(null, []); router.navigate('/vocabulary') }}
        icon="scan"
        title="Notebook captured!"
        sub={`${words.length} words extracted and filed into your folders — they're already queued for review.`}
        badge="+3 words · first scan bonus"
        cta="See my vocabulary"
        onCta={() => { hap.medium(); setCelebrate(false); setScan(null, []); router.navigate('/vocabulary') }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  discardBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.dangerBg, alignItems: 'center', justifyContent: 'center' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.line, paddingVertical: 12 },
  toolbar: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, paddingVertical: SP.md, marginBottom: SP.md },
  toolItem: { alignItems: 'center' },
  toolLabel: { color: C.inkMute, fontSize: 10, fontWeight: '700', marginTop: 4 },
  photo: { height: 150, borderRadius: RD.md, backgroundColor: '#14141E', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.line },
  sortRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SP.md },
  wordCard: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md, marginBottom: SP.sm },
  wordTop: { flexDirection: 'row', alignItems: 'center' },
  checkBox: { width: 24, height: 24, borderRadius: 8, borderWidth: 1.5, borderColor: C.inkFaint, alignItems: 'center', justifyContent: 'center' },
  checkBoxOn: { backgroundColor: C.success, borderColor: C.success },
  term: { fontSize: 17, fontWeight: '700', color: C.ink },
  tr: { fontSize: 13, color: C.inkSoft, marginTop: 1 },
  editInput: { backgroundColor: C.bg, borderRadius: RD.sm, borderWidth: 1.5, borderColor: C.primary, paddingHorizontal: SP.md, paddingVertical: 9, fontSize: 14, color: C.ink, marginTop: 6 },
  expandRow: { flexDirection: 'row', alignItems: 'center', marginTop: SP.sm },
  expandText: { fontSize: 12, color: C.inkMute, marginLeft: 6, fontWeight: '600' },
  folderRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: SP.sm },
  folderTag: { borderRadius: RD.sm, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line, paddingHorizontal: SP.lg, paddingTop: SP.md },
  bottomRow: { flexDirection: 'row', alignItems: 'center' },
  saveBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary, borderRadius: RD.full, paddingHorizontal: 18, paddingVertical: 13 },
})
