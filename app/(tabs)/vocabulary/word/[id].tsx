import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, LayoutAnimation, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import ReAnimated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../../../lib/theme'
import { Icon, type IconName } from '../../../../lib/icons'
import { BlurHeader, Chip, hap, Header, IconChip, PressBtn } from '../../../../components/ui'
import { useStore } from '../../../../lib/store'

function EditField({ label, value, onChange, mono }: { label: string; value: string; onChange: (v: string) => void; mono?: boolean }) {
  const [editing, setEditing] = useState(false)
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editing ? (
        <TextInput
          value={value}
          onChangeText={onChange}
          autoFocus
          onBlur={() => { setEditing(false); hap.light(); LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut) }}
          style={[styles.fieldInput, mono && { fontStyle: 'italic' }]}
          onSubmitEditing={() => setEditing(false)}
        />
      ) : (
        <PressBtn onPress={() => setEditing(true)} hit={24}>
          <View style={styles.fieldValueRow}>
            <Text style={[styles.fieldValue, mono && { fontStyle: 'italic' }, !value && { color: C.inkFaint }]}>
              {value || 'Tap to add…'}
            </Text>
            <Icon name="edit" size={14} color={C.inkFaint} />
          </View>
        </PressBtn>
      )}
    </View>
  )
}

export default function WordDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const words = useStore((s) => s.words)
  const folders = useStore((s) => s.folders)
  const update = useStore((s) => s.updateWord)
  const del = useStore((s) => s.deleteWord)
  const move = useStore((s) => s.moveWord)
  const toast = useStore((s) => s.toastMsg)
  const [playing, setPlaying] = useState(false)
  const eq = useRef(new Animated.Value(0)).current

  const insets = useSafeAreaInsets()
  const sv = useSharedValue(0)
  const onScroll = useAnimatedScrollHandler((e) => { sv.value = e.contentOffset.y })

  const w = words.find((x) => x.id === id)
  if (!w) return null

  const play = () => {
    hap.medium()
    setPlaying(true)
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(eq, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(eq, { toValue: 0.2, duration: 280, useNativeDriver: true }),
      ])
    )
    loop.start()
    setTimeout(() => { loop.stop(); setPlaying(false); eq.setValue(0) }, 1800)
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BlurHeader scrollY={sv}>
        <Header
          back
          title="Word"
          right={
            <PressBtn onPress={() => { hap.medium(); del(w.id); toast(`"${w.term}" deleted`); router.back() }} hit={36}>
              <Icon name="trash" size={20} color={C.danger} />
            </PressBtn>
          }
        />
      </BlurHeader>
      <ReAnimated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: SP.lg, paddingTop: insets.top + 76, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.termCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.term}>{w.term}</Text>
            <PressBtn onPress={play} hit={40} style={{ marginLeft: SP.md }}>
              <View style={[styles.playBtn, playing && { backgroundColor: C.primary }]}>
                {playing ? (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 18 }}>
                    {[0.9, 0.5, 1, 0.7].map((h, i) => (
                      <Animated.View
                        key={i}
                        style={{
                          width: 3, marginHorizontal: 1.5, borderRadius: 1.5, backgroundColor: C.white,
                          height: eq.interpolate({ inputRange: [0, 1], outputRange: [6, 16 * h + 4] }),
                        }}
                      />
                    ))}
                  </View>
                ) : (
                  <Icon name="volume" size={18} color={C.primary} />
                )}
              </View>
            </PressBtn>
          </View>
          {!!w.pronunciation && (
            <View style={styles.phonPill}>
              <Text style={{ color: C.inkSoft, fontSize: 12, fontStyle: 'italic' }}>{w.pronunciation}</Text>
            </View>
          )}
          <Text style={styles.tr}>{w.translation}</Text>
          <View style={[styles.actRow, { gap: 18 }]}>
            {[
              { icon: 'heart' as IconName, color: '#B33951' },
              { icon: 'bookmark' as IconName, color: C.gold },
              { icon: 'share' as IconName, color: C.inkSoft },
            ].map((a) => (
              <PressBtn key={a.icon} onPress={() => { hap.light(); toast(a.icon === 'heart' ? 'Favorited' : a.icon === 'bookmark' ? 'Saved for later' : 'Share link copied') }} hit={32}>
                <Icon name={a.icon} size={19} color={a.color} />
              </PressBtn>
            ))}
          </View>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{(w.source as string).toUpperCase()}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{w.reps} reps</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>added {w.addedAt}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Example</Text>
          <Text style={styles.example}>
            {w.example.split(w.term).map((part, i, arr) => (
              <Text key={i}>
                {part}
                {i < arr.length - 1 && <Text style={{ color: C.primary, fontWeight: '700' }}>{w.term}</Text>}
              </Text>
            ))}
          </Text>
          <Text style={styles.exampleTr}>{w.exampleTr}</Text>
          {!w.example && <Text style={{ color: C.inkFaint, fontSize: 13 }}>No example yet — tap below to write one.</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Folders</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {folders.map((f) => (
              <Chip
                key={f.id}
                label={f.name}
                active={w.folderIds.includes(f.id)}
                onPress={() => { hap.light(); move(w.id, f.id) }}
                style={{ marginBottom: SP.sm }}
              />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Edit</Text>
          <EditField label="Translation" value={w.translation} onChange={(v) => update(w.id, { translation: v })} />
          <EditField label="Pronunciation" value={w.pronunciation} onChange={(v) => update(w.id, { pronunciation: v })} mono />
          <EditField label="Example sentence" value={w.example} onChange={(v) => update(w.id, { example: v })} />
          <EditField label="Example translation" value={w.exampleTr} onChange={(v) => update(w.id, { exampleTr: v })} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Memory strength</Text>
          <View style={styles.strengthTrack}>
            <View style={[styles.strengthFill, { width: `${Math.round(w.strength * 100)}%` }]} />
          </View>
          <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 6 }}>
            {w.strength < 0.4 ? 'Needs reps — it will appear in review soon.' : w.strength < 0.7 ? 'Steady — keep it warm.' : 'Solid. Spaced review will keep it that way.'}
          </Text>
        </View>

        <View style={{ marginTop: SP.lg }}>
          <IconChip name="sparkle" size={30} iconSize={14} bg={C.primarySoft} color={C.primary} />
          <Text style={{ fontSize: 13, color: C.inkSoft, marginTop: 6, lineHeight: 18 }}>
            This word was learned from your notebook. Lexora will fold it into quizzes and conversations over the next days.
          </Text>
        </View>
      </ReAnimated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  termCard: { backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, padding: SP.xl, marginBottom: SP.md },
  term: { fontSize: 32, fontWeight: '800', letterSpacing: -0.8, color: C.ink },
  phonPill: { alignSelf: 'flex-start', backgroundColor: C.bg, borderRadius: RD.sm, paddingHorizontal: 10, paddingVertical: 4, marginTop: SP.sm, borderWidth: 1, borderColor: C.line },
  tr: { fontSize: 18, fontWeight: '600', color: C.primary, marginTop: SP.sm },
  actRow: { flexDirection: 'row', alignItems: 'center', marginTop: SP.md, marginBottom: 2 },
  playBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.primary },
  badges: { flexDirection: 'row', marginTop: SP.md, flexWrap: 'wrap' },
  badge: { backgroundColor: C.bg, borderRadius: RD.sm, paddingHorizontal: 8, paddingVertical: 3, marginRight: 6, marginBottom: 4 },
  badgeText: { fontSize: 10, fontWeight: '700', color: C.inkSoft },
  card: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.lg, marginBottom: SP.md },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: SP.sm },
  example: { fontSize: 16, lineHeight: 23, color: C.ink },
  exampleTr: { fontSize: 13, color: C.inkSoft, marginTop: 4 },
  field: { marginBottom: SP.md },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: C.inkMute, marginBottom: 4 },
  fieldValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  fieldValue: { fontSize: 15, color: C.ink, flex: 1, marginRight: SP.sm },
  fieldInput: { backgroundColor: C.bg, borderRadius: RD.sm, borderWidth: 1.5, borderColor: C.primary, paddingHorizontal: SP.md, paddingVertical: 10, fontSize: 15, color: C.ink },
  strengthTrack: { height: 8, borderRadius: 4, backgroundColor: C.lineSoft, overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 4, backgroundColor: C.primary },
})
