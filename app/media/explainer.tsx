import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import ReAnimated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../lib/theme'
import { Icon } from '../../lib/icons'
import { BlurHeader, Chip, hap, Header, IconChip, PressBtn } from '../../components/ui'
import { useStore } from '../../lib/store'

export default function Explainer() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const clips = useStore((s) => s.clips)
  const saveWords = useStore((s) => s.saveWordsFromMedia)
  const toast = useStore((s) => s.toastMsg)
  const clip = clips.find((c) => c.id === id)
  const insets = useSafeAreaInsets()
  const sv = useSharedValue(0)
  const onScroll = useAnimatedScrollHandler((e) => { sv.value = e.contentOffset.y })
  const [saved, setSaved] = useState(false)

  if (!clip) return null

  const idiom = clip.idiom ? {
    phrase: clip.content.replace(/[“”]/g, ''),
    literal: clip.content.includes('siembra') ? 'Who sows winds, reaps storms.' : clip.content.includes('bajar') ? 'Stop the world, I want to get off.' : 'Word-by-word it does not translate.',
    meaning: clip.content.includes('siembra') ? 'Your actions have consequences — you reap what you sow. Often said with dark humor when a plan backfires.' : clip.content.includes('bajar') ? "A joke about feeling overwhelmed by modern life. Quino's Mafalda says it, exhausted by the world." : 'A set phrase locals use for the situation in the clip.',
    usage: clip.content.includes('siembra') ? 'Casual warning: “Cuidado, que el que siembra vientos…”' : 'Usually said as a sigh, half-serious: “Paro el mundo, que me quiero bajar.”',
    whyFunny: clip.content.includes('siembra') ? 'The drama: everyone knows the storm is coming except the person sowing.' : 'The absurdity of treating the world like a bus you can exit.',
  } : null

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BlurHeader scrollY={sv}>
        <Header back title="Cultural context" subtitle={clip.source} />
      </BlurHeader>
      <ReAnimated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: SP.lg, paddingTop: insets.top + 76, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.quoteCard}>
          <Icon name="quote" size={22} color={C.primary} />
          <Text style={styles.quote}>{clip.content}</Text>
          <Text style={styles.note}>{clip.note}</Text>
        </View>

        {idiom && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>The breakdown</Text>
            <Row label="Literal" value={idiom.literal} />
            <Row label="Real meaning" value={idiom.meaning} />
            <Row label="When you'd say it" value={idiom.usage} />
            <View style={styles.humorBox}>
              <Icon name="sparkle" size={16} color={C.attention} />
              <View style={{ flex: 1, marginLeft: SP.sm }}>
                <Text style={{ color: C.attentionTitle, fontWeight: '700', fontSize: 13 }}>Why it's funny</Text>
                <Text style={{ color: C.attention, fontSize: 13, marginTop: 2, lineHeight: 18 }}>{idiom.whyFunny}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Words worth saving</Text>
          {clip.words.map((w) => (
            <Chip key={w} label={w} onPress={() => { hap.light(); saveWords([w]); toast(`"${w}" added to your vocabulary`) }} style={{ marginBottom: 6 }} />
          ))}
          {clip.words.length === 0 && <Text style={{ color: C.inkSoft, fontSize: 13 }}>No new words flagged in this one — but the phrasing itself is gold.</Text>}
          {clip.words.length > 0 && !saved && (
            <PressBtn onPress={() => { hap.medium(); clip.words.forEach((w) => saveWords([w])); setSaved(true); toast(`${clip.words.length} words saved to vocabulary`) }} style={{ marginTop: SP.sm }}>
              <View style={styles.saveAll}>
                <Icon name="plus" size={16} color={C.white} />
                <Text style={{ color: C.white, fontWeight: '800', marginLeft: 6 }}>Save all {clip.words.length} words</Text>
              </View>
            </PressBtn>
          )}
          {saved && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SP.sm }}>
              <Icon name="check" size={15} color={C.success} strokeWidth={2.6} />
              <Text style={{ color: C.success, fontWeight: '700', marginLeft: 6 }}>Saved — they'll show up in your next review</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why culture matters</Text>
          <Text style={{ color: C.inkSoft, fontSize: 13, lineHeight: 20 }}>
            Idioms carry a culture's shortcuts and humor. Learn the literal words and you translate; learn the why and you belong. This clip is now in your media library.
          </Text>
        </View>
      </ReAnimated.ScrollView>
    </View>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  quoteCard: { backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, padding: SP.lg, alignItems: 'center' },
  quote: { fontSize: 19, fontWeight: '700', color: C.ink, textAlign: 'center', lineHeight: 27, marginTop: SP.sm },
  note: { fontSize: 13, color: C.inkSoft, marginTop: SP.md, textAlign: 'center', lineHeight: 18 },
  section: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.lg, marginTop: SP.md },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: SP.md },
  row: { marginBottom: SP.md },
  rowLabel: { fontSize: 11, fontWeight: '800', color: C.inkMute, letterSpacing: 0.4 },
  rowValue: { fontSize: 14, color: C.ink, marginTop: 3, lineHeight: 20 },
  humorBox: { flexDirection: 'row', backgroundColor: C.attentionBg, borderRadius: RD.md, padding: SP.md },
  saveAll: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary, borderRadius: RD.md, paddingVertical: 13 },
})
