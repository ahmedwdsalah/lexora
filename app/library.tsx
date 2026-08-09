import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import ReAnimated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP, LANG } from '../lib/theme'
import { Icon } from '../lib/icons'
import { BlurHeader, hap, Header, PressBtn } from '../components/ui'
import { useStore } from '../lib/store'

const GROUPS: { title: string; codes: string[] }[] = [
  { title: 'Available now', codes: ['TR'] },
]

export default function Library() {
  const profile = useStore((s) => s.profile)
  const toast = useStore((s) => s.toastMsg)
  const insets = useSafeAreaInsets()
  const sv = useSharedValue(0)
  const onScroll = useAnimatedScrollHandler((e) => { sv.value = e.contentOffset.y })
  const [mine, setMine] = useState<string[]>([profile.language])
  const [q, setQ] = useState('')

  const add = (code: string) => {
    if (mine.includes(code)) return
    hap.medium()
    setMine([...mine, code])
    const l = LANG.find((x) => x.code === code)
    toast(`${l?.name} added to your library — words will start fresh`)
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BlurHeader scrollY={sv}>
        <Header back title="Language library" subtitle="Turkish only — more languages coming soon" />
      </BlurHeader>
      <ReAnimated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: SP.lg, paddingTop: insets.top + 76, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.mineCard}>
          <Text style={styles.mineTitle}>Your languages</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: SP.sm }}>
            {mine.map((c) => {
              const l = LANG.find((x) => x.code === c)!
              return (
                <View key={c} style={[styles.mineChip, { backgroundColor: l.color }]}>
                  <Text style={{ color: C.white, fontWeight: '800', fontSize: 12 }}>{l.code}</Text>
                  <Text style={{ color: C.white, fontSize: 12, marginLeft: 6, fontWeight: '600' }}>{l.name}</Text>
                  {c === profile.language && <Text style={{ color: 'rgba(255,255,255,.85)', fontSize: 10, marginLeft: 6, fontWeight: '700' }}>ACTIVE</Text>}
                </View>
              )
            })}
          </View>
        </View>

        <View style={styles.search}>
          <Icon name="search" size={16} color={C.inkMute} />
          <TextInput value={q} onChangeText={setQ} placeholder="Search languages…" placeholderTextColor={C.inkFaint} style={styles.searchInput} />
        </View>

        {GROUPS.map((g) => {
          const codes = q.trim() ? g.codes.filter((c) => LANG.find((x) => x.code === c)!.name.toLowerCase().includes(q.toLowerCase())) : g.codes
          if (codes.length === 0) return null
          return (
          <View key={g.title}>
            <Text style={styles.groupTitle}>{g.title}</Text>
            {codes.map((code) => {
              const l = LANG.find((x) => x.code === code)!
              const has = mine.includes(code)
              return (
                <PressBtn key={code} onPress={() => add(code)} disabled={has} haptic="light" style={{ marginBottom: SP.sm }}>
                  <View style={[styles.row, has && styles.rowOn]}>
                    <View style={[styles.badge, { backgroundColor: l.color }]}>
                      <Text style={{ color: C.white, fontWeight: '800', fontSize: 13 }}>{l.code}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: SP.md }}>
                      <Text style={{ color: C.ink, fontWeight: '700', fontSize: 15 }}>{l.name}</Text>
                      <Text style={{ color: C.inkMute, fontSize: 12 }}>{l.native}</Text>
                    </View>
                    {has ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="check" size={16} color={C.success} strokeWidth={2.6} />
                        <Text style={{ color: C.success, fontWeight: '700', fontSize: 12, marginLeft: 4 }}>Added</Text>
                        {code !== profile.language && (
                          <View style={styles.progressTag}>
                            <Text style={{ color: C.attention, fontSize: 10, fontWeight: '800' }}>IN PROGRESS</Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View style={styles.addBtn}>
                        <Icon name="plus" size={15} color={C.primary} />
                      </View>
                    )}
                  </View>
                </PressBtn>
              )
            })}
          </View>
          )
        })}

        <View style={styles.foot}>
          <Icon name="info" size={15} color={C.inkMute} />
          <Text style={{ color: C.inkSoft, fontSize: 12, marginLeft: 8, flex: 1, lineHeight: 17 }}>
            Turkish is the only supported language right now. More will come later.
          </Text>
        </View>
      </ReAnimated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mineCard: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.lg, marginBottom: SP.lg },
  mineTitle: { fontSize: 13, fontWeight: '800', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.5 },
  mineChip: { flexDirection: 'row', alignItems: 'center', borderRadius: RD.full, paddingHorizontal: 12, paddingVertical: 7, marginRight: 8, marginBottom: 8 },
  groupTitle: { fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: SP.sm, marginTop: SP.md },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.line, padding: SP.md },
  rowOn: { borderColor: C.success, backgroundColor: '#F0FAF6' },
  badge: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  addBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, paddingHorizontal: SP.md, marginBottom: SP.md },
  searchInput: { flex: 1, paddingVertical: 11, fontSize: 14, color: C.ink, marginLeft: SP.sm },
  progressTag: { backgroundColor: C.attentionBg, borderRadius: RD.sm, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 },
  foot: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md, marginTop: SP.lg },
})
