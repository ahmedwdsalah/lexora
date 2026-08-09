import { router } from 'expo-router'
import { useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import ReAnimated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../lib/theme'
import { Icon, type IconName } from '../../lib/icons'
import { BlurHeader, EmptyState, hap, Header, IconChip, PressBtn, SwipeRow } from '../../components/ui'
import { useStore } from '../../lib/store'

const KIND_META: Record<string, { icon: IconName; label: string; bg: string; color: string }> = {
  subtitle: { icon: 'film', label: 'Subtitle', bg: '#E8F0FB', color: '#2E5FA3' },
  quote: { icon: 'quote', label: 'Quote', bg: '#FAEEDA', color: '#854F0B' },
  song: { icon: 'note', label: 'Song', bg: '#FBE9F0', color: '#B33951' },
  scene: { icon: 'camera', label: 'Scene', bg: '#E1F5EE', color: '#0F6E56' },
}

export default function MediaIndex() {
  const insets = useSafeAreaInsets()
  const clips = useStore((s) => s.clips)
  const del = useStore((s) => s.deleteClip)
  const toast = useStore((s) => s.toastMsg)
  const sv = useSharedValue(0)
  const onScroll = useAnimatedScrollHandler((e) => { sv.value = e.contentOffset.y })
  const [fade, setFade] = useState(false)

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BlurHeader scrollY={sv}>
        <Header
          back
          title="Media collector"
          subtitle={`${clips.length} saved moments · words pushed to review`}
          right={
            <PressBtn onPress={() => router.push('/media/add')} hit={36}>
              <View style={styles.addBtn}>
                <Icon name="plus" size={18} color={C.white} strokeWidth={2.4} />
              </View>
            </PressBtn>
          }
        />
      </BlurHeader>
      {clips.length === 0 ? (
        <EmptyState
          icon="film"
          title="No clips yet"
          body="Save subtitles, quotes, and scenes you love. Lexa explains what they really mean and turns them into study words."
          action={
            <PressBtn onPress={() => router.push('/media/add')} style={{ marginTop: SP.lg }}>
              <View style={styles.emptyBtn}>
                <Text style={{ color: C.white, fontWeight: '800' }}>Add your first clip</Text>
              </View>
            </PressBtn>
          }
        />
      ) : (
        <ReAnimated.ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: SP.lg, paddingTop: insets.top + 80, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => toast('Media library up to date')} tintColor={C.primary} />}
        >
          {clips.map((c) => {
            const m = KIND_META[c.kind]
            return (
              <View key={c.id} style={{ marginBottom: SP.sm }}>
                <SwipeRow onDelete={() => { hap.medium(); del(c.id); toast('Clip removed') }}>
                  <PressBtn onPress={() => { hap.light(); c.idiom && router.push(`/media/explainer?id=${c.id}`) }}>
                    <View style={styles.card}>
                      <IconChip name={m.icon} size={42} iconSize={19} bg={m.bg} color={m.color} />
                      <View style={{ flex: 1, marginLeft: SP.md }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={styles.source}>{c.source}</Text>
                          {c.idiom && (
                            <View style={styles.idiomBadge}>
                              <Icon name="bulb" size={10} color={C.attention} />
                              <Text style={{ color: C.attention, fontSize: 9, fontWeight: '800', marginLeft: 3 }}>IDIOM</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.content} numberOfLines={2}>{c.content}</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                          {c.words.slice(0, 3).map((w) => (
                            <View key={w} style={styles.wordChip}>
                              <Text style={{ color: C.primary, fontSize: 10, fontWeight: '700' }}>{w}</Text>
                            </View>
                          ))}
                          {c.words.length > 3 && (
                            <View style={styles.wordChip}>
                              <Text style={{ color: C.inkMute, fontSize: 10, fontWeight: '700' }}>+{c.words.length - 3}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      {c.idiom ? (
                        <Icon name="chevR" size={18} color={C.inkFaint} />
                      ) : (
                        <View style={styles.langChip}>
                          <Text style={{ color: C.inkSoft, fontSize: 9, fontWeight: '800' }}>{c.lang}</Text>
                        </View>
                      )}
                    </View>
                  </PressBtn>
                </SwipeRow>
              </View>
            )
          })}
        </ReAnimated.ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  addBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  emptyBtn: { backgroundColor: C.primary, borderRadius: RD.full, paddingHorizontal: 24, paddingVertical: 13 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md },
  source: { fontSize: 12, fontWeight: '700', color: C.inkMute },
  idiomBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.attentionBg, borderRadius: RD.sm, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 },
  content: { fontSize: 15, fontWeight: '600', color: C.ink, marginTop: 4, lineHeight: 20 },
  words: { fontSize: 11, color: C.inkMute, marginTop: 4 },
  wordChip: { backgroundColor: C.primarySoft, borderRadius: RD.sm, paddingHorizontal: 7, paddingVertical: 3, marginRight: 5, marginBottom: 3 },
  langChip: { backgroundColor: C.bg, borderRadius: RD.sm, paddingHorizontal: 7, paddingVertical: 3 },
})
