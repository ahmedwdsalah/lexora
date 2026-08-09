import { router, Stack } from 'expo-router'
import { useMemo, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../../lib/theme'
import { Icon, type IconName } from '../../../lib/icons'
import { Chip, hap, PressBtn, SearchBar, SectionTitle, Sheet, SwipeRow } from '../../../components/ui'
import { AddWordSheet, FolderDot, WordRow } from '../../../components/vocab'
import { useStore } from '../../../lib/store'
import { SfProFont, useSfProFont } from '../../../hooks/useSfProFont'

export default function VocabularyIndex() {
  const insets = useSafeAreaInsets()
  const words = useStore((s) => s.words)
  const folders = useStore((s) => s.folders)
  const del = useStore((s) => s.deleteWord)
  const toast = useStore((s) => s.toastMsg)
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const [filter, setFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [menuWord, setMenuWord] = useState<string | null>(null)
  const dueCount = words.filter((w) => w.due).length

  const { loaded } = useSfProFont()
  const fontBold = loaded ? SfProFont.bold : undefined
  const fontMedium = loaded ? SfProFont.medium : undefined

  const menuW = words.find((w) => w.id === menuWord)
  const count = (fid: string) => words.filter((w) => w.folderIds.includes(fid)).length

  const filtered = useMemo(() => {
    let list = words
    if (filter === 'recent') list = [...words].sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1)).slice(0, 8)
    else if (filter !== 'all') list = words.filter((w) => w.folderIds.includes(filter))
    if (q.trim()) list = list.filter((w) => w.term.toLowerCase().includes(q.toLowerCase()) || w.translation.toLowerCase().includes(q.toLowerCase()))
    return list
  }, [words, filter, q])

  const openFolder = (id: string) => router.push(`/vocabulary/folder/${id}`)

  const chips = [
    { id: 'all', label: `All · ${words.length}` },
    { id: 'recent', label: 'Recent' },
    ...folders.map((f) => ({ id: f.id, label: `${f.name} · ${count(f.id)}` })),
  ]

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLargeTitleEnabled: true,
          title: 'Vocabulary',
          headerLargeTitleStyle: { fontFamily: fontBold },
          headerTitleStyle: { fontFamily: fontMedium },
          headerShadowVisible: false,
          unstable_headerRightItems: () => [
            {
              element: (
                <View style={styles.searchBtn}>
                  <Icon name={focused ? 'close' : 'search'} size={18} color={C.ink} />
                </View>
              ),
              onPress: () => { hap.light(); setFocused(!focused); if (!focused) setQ('') },
              type: 'custom',
            },
          ],
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: C.bg }}
        contentContainerStyle={{ paddingTop: SP.md, paddingBottom: 96 }}
        contentInsetAdjustmentBehavior="always"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => toast('Vocabulary is up to date')} tintColor={C.primary} />}
      >
        <View style={{ paddingHorizontal: SP.lg, marginBottom: SP.sm }}>
          <SearchBar value={q} onChange={setQ} onFocus={() => setFocused(true)} focused={focused} />
        </View>

        <View style={{ paddingHorizontal: SP.lg, marginBottom: SP.md }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
            {chips.map((c) => (
              <Chip key={c.id} label={c.label} active={filter === c.id} onPress={() => setFilter(c.id)} />
            ))}
          </ScrollView>
        </View>

        {!focused && (
          <View style={{ paddingHorizontal: SP.lg, marginBottom: SP.md }}>
            <PressBtn onPress={() => router.push('/review')} haptic="light">
              <View style={styles.reviewPromo}>
                <Text style={{ color: C.white, fontSize: 12, fontWeight: '600' }}>Your words stick best the day you meet them —</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Icon name="flame" size={16} color={C.gold} filled />
                  <Text style={{ color: C.white, fontWeight: '800', fontSize: 15, marginLeft: 6, flex: 1 }}>{dueCount} due right now</Text>
                  <View style={styles.promoBtn}>
                    <Text style={{ color: C.ink, fontWeight: '800', fontSize: 13 }}>Review now</Text>
                  </View>
                </View>
              </View>
            </PressBtn>

            <PressBtn onPress={() => setFilter('all')} haptic="light" style={{ marginTop: SP.sm }}>
              <View style={[styles.allItems, filter === 'all' && { borderColor: C.primary, backgroundColor: C.selected }]}>
                <View style={styles.allIcon}>
                  <Icon name="vocab" size={18} color={C.primary} />
                </View>
                <Text style={{ flex: 1, color: C.ink, fontWeight: '700', fontSize: 14, marginLeft: SP.md }}>All items</Text>
                <Text style={{ color: C.inkSoft, fontSize: 13, fontWeight: '600' }}>{words.length} words</Text>
                <Icon name="chevR" size={16} color={C.inkFaint} style={{ marginLeft: 4 }} />
              </View>
            </PressBtn>
          </View>
        )}

        {!focused && (
          <View style={{ paddingHorizontal: SP.lg, marginBottom: SP.md }}>
            <SectionTitle title="Collections" action="New folder" onAction={() => router.push('/folder-modal?mode=create')} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: SP.sm }}>
              {folders.map((f) => (
                <PressBtn key={f.id} onPress={() => openFolder(f.id)} haptic="light" style={{ width: '48.5%' }}>
                  <View style={styles.folderCard}>
                    <View style={[styles.folderIcon, { backgroundColor: (f.color || C.primary) + '1F' }]}>
                      <Icon name="folder" size={20} color={f.color || C.primary} />
                    </View>
                    <Text style={styles.folderName} numberOfLines={1}>{f.name}</Text>
                    <Text style={styles.folderCount}>{count(f.id)} words</Text>
                  </View>
                </PressBtn>
              ))}
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: SP.lg }}>
          {filtered.map((w) => {
            const f = folders.find((x) => w.folderIds.includes(x.id))
            return (
              <View key={w.id} style={{ marginBottom: SP.sm }}>
                <SwipeRow
                  onDelete={() => { hap.medium(); del(w.id); toast(`"${w.term}" deleted`) }}
                  onLongPress={() => { hap.medium(); setMenuWord(w.id) }}
                >
                  <PressBtn onPress={() => router.push(`/vocabulary/word/${w.id}`)}>
                    <WordRow
                      term={w.term}
                      translation={w.translation}
                      pronunciation={w.pronunciation}
                      color={f?.color ?? C.primary}
                    />
                  </PressBtn>
                </SwipeRow>
              </View>
            )
          })}
          {filtered.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Text style={{ color: C.inkSoft, fontSize: 14 }}>No words match "{q || 'this filter'}"</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <PressBtn onPress={() => { hap.medium(); setAddOpen(true) }} style={{ position: 'absolute', right: SP.lg, bottom: insets.bottom + SP.lg }}>
        <View style={styles.fab}>
          <Icon name="plus" size={24} color={C.white} strokeWidth={2.4} />
        </View>
      </PressBtn>

      <AddWordSheet visible={addOpen} onClose={() => setAddOpen(false)} />

      <Sheet visible={!!menuW} onClose={() => setMenuWord(null)} title={menuW?.term}>
        {[
          { icon: 'edit' as IconName, label: 'Edit word', act: () => router.push(`/vocabulary/word/${menuW!.id}`) },
          { icon: 'folder' as IconName, label: 'Move to folder…', act: () => { setMenuWord(null); setTimeout(() => router.push(`/vocabulary/word/${menuW!.id}`), 250) } },
          { icon: 'trash' as IconName, label: 'Delete', danger: true, act: () => { hap.medium(); del(menuW!.id); toast(`"${menuW!.term}" deleted`); setMenuWord(null) } },
        ].map((it) => (
          <PressBtn key={it.label} onPress={it.act} hit={30}>
            <View style={styles.menuRow}>
              <Icon name={it.icon} size={19} color={(it as any).danger ? C.danger : C.ink} />
              <Text style={[styles.menuLabel, { color: (it as any).danger ? C.danger : C.ink }]}>{it.label}</Text>
            </View>
          </PressBtn>
        ))}
      </Sheet>
    </>
  )
}

const styles = StyleSheet.create({
  searchBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  folderCard: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md, minHeight: 96 },
  folderIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  folderName: { fontSize: 13, fontWeight: '700', color: C.ink, marginTop: SP.sm },
  folderCount: { fontSize: 11, color: C.inkMute, marginTop: 1 },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', shadowColor: C.primaryDeep, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 6 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  menuLabel: { fontSize: 15, fontWeight: '600', marginLeft: SP.md },
  reviewPromo: { backgroundColor: C.primaryDeep, borderRadius: RD.lg, padding: SP.md, shadowColor: C.primaryDeep, shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  promoBtn: { backgroundColor: C.white, borderRadius: RD.full, paddingHorizontal: 14, paddingVertical: 8 },
  allItems: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.line, padding: SP.md },
  allIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
})
