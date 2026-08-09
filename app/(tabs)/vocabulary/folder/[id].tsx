import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import ReAnimated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../../../lib/theme'
import { Icon, type IconName } from '../../../../lib/icons'
import { BlurHeader, Chip, EmptyState, hap, Header, PressBtn, ProgressBar, Segmented, Sheet, SwipeRow } from '../../../../components/ui'
import { AddWordSheet, FolderDot, WordRow } from '../../../../components/vocab'
import { useStore } from '../../../../lib/store'

export default function FolderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const folders = useStore((s) => s.folders)
  const words = useStore((s) => s.words)
  const del = useStore((s) => s.deleteWord)
  const deleteFolder = useStore((s) => s.deleteFolder)
  const mergeFolders = useStore((s) => s.mergeFolders)
  const renameFolder = useStore((s) => s.renameFolder)
  const toast = useStore((s) => s.toastMsg)
  const [menu, setMenu] = useState(false)
  const [mergeOpen, setMergeOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [tab, setTab] = useState('Words')
  const [editingName, setEditingName] = useState(false)
  const insets = useSafeAreaInsets()
  const sv = useSharedValue(0)
  const onScroll = useAnimatedScrollHandler((e) => { sv.value = e.contentOffset.y })

  const folder = folders.find((f) => f.id === id)
  if (!folder) return null
  const inFolder = words.filter((w) => w.folderIds.includes(id))
  const due = inFolder.filter((w) => w.due).length
  const avg = inFolder.length ? Math.round((inFolder.reduce((a, w) => a + w.strength, 0) / inFolder.length) * 100) : 0

  const merge = (intoId: string) => {
    hap.medium()
    mergeFolders(id, intoId)
    toast('Folder merged')
    setMergeOpen(false)
    router.back()
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BlurHeader scrollY={sv}>
        <Header
          back
        custom={
          <View>
            {editingName ? (
              <TextInput
                value={folder.name}
                autoFocus
                onChangeText={(t) => renameFolder(id, t)}
                onBlur={() => { setEditingName(false); hap.light(); toast('Folder renamed') }}
                style={styles.nameInput}
                selectTextOnFocus
              />
            ) : (
              <PressBtn onPress={() => { hap.light(); setEditingName(true) }} hit={28}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{folder.name}</Text>
                  <Icon name="edit" size={14} color={C.inkFaint} />
                </View>
              </PressBtn>
            )}
            <Text style={styles.sub}>{inFolder.length} words · {folder.kind === 'auto' ? 'auto-sorted' : 'your folder'}</Text>
          </View>
        }
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.colorTag, { backgroundColor: folder.color }]} />
            <PressBtn onPress={() => setMenu(true)} hit={36} style={{ marginLeft: SP.sm }}>
              <Icon name="dots" size={20} color={C.ink} />
            </PressBtn>
          </View>
        }
      />
      </BlurHeader>
      <View style={{ paddingHorizontal: SP.lg, paddingTop: insets.top + 78, marginBottom: SP.sm }}>
        <Segmented options={['Words', 'Stats']} value={tab} onChange={(v) => { hap.light(); setTab(v) }} />
      </View>

      {tab === 'Stats' ? (
        <ReAnimated.ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SP.lg, paddingTop: SP.sm }} showsVerticalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16}>
          <View style={styles.statRow}>
            {[
              { v: `${inFolder.length}`, l: 'words' },
              { v: `${due}`, l: 'due today' },
              { v: `${avg}%`, l: 'avg strength' },
            ].map((s, i) => (
              <View key={s.l} style={[styles.stat, i < 2 && { marginRight: SP.sm }]}>
                <Text style={styles.statV}>{s.v}</Text>
                <Text style={styles.statL}>{s.l}</Text>
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, marginVertical: SP.md }}>Strength by word</Text>
          {inFolder.map((w) => (
            <View key={w.id} style={styles.strengthRow}>
              <Text style={{ width: 110, fontSize: 14, fontWeight: '600', color: C.ink }} numberOfLines={1}>{w.term}</Text>
              <View style={{ flex: 1 }}>
                <ProgressBar value={w.strength} color={w.strength > 0.6 ? C.success : w.strength > 0.35 ? C.gold : C.flame} style={{ height: 5 }} />
              </View>
              <Text style={{ width: 36, textAlign: 'right', fontSize: 11, fontWeight: '700', color: C.inkMute }}>{Math.round(w.strength * 100)}%</Text>
            </View>
          ))}
        </ReAnimated.ScrollView>
      ) : (
        <ReAnimated.ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SP.lg, paddingTop: SP.sm, paddingBottom: 96 }} showsVerticalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16}>
          {inFolder.map((w) => (
            <View key={w.id} style={{ marginBottom: SP.sm }}>
              <SwipeRow
                onDelete={() => { hap.medium(); del(w.id); toast(`"${w.term}" deleted`) }}
                onLongPress={() => { hap.medium(); router.push(`/vocabulary/word/${w.id}`) }}
              >
                <PressBtn onPress={() => router.push(`/vocabulary/word/${w.id}`)}>
                  <WordRow term={w.term} translation={w.translation} pronunciation={w.pronunciation} color={folder.color} />
                </PressBtn>
              </SwipeRow>
            </View>
          ))}
          {inFolder.length === 0 && (
            <EmptyState
              icon="folder"
              title="This folder is empty"
              body="Add a word you saved, or scan your notebook and let Lexa file new words here automatically."
              action={
                <View style={{ width: '100%', marginTop: SP.md }}>
                  <PressBtn onPress={() => { hap.light(); setAddOpen(true) }} style={{ marginBottom: SP.sm }}>
                    <View style={styles.emptyCtaPrimary}>
                      <Icon name="plus" size={16} color={C.white} strokeWidth={2.4} />
                      <Text style={{ color: C.white, fontWeight: '800', marginLeft: 6 }}>Add a word</Text>
                    </View>
                  </PressBtn>
                  <PressBtn onPress={() => { hap.medium(); router.push('/scan') }}>
                    <View style={styles.emptyCtaGhost}>
                      <Icon name="scan" size={16} color={C.primary} />
                      <Text style={{ color: C.primary, fontWeight: '800', marginLeft: 6 }}>Scan your notes</Text>
                    </View>
                  </PressBtn>
                </View>
              }
            />
          )}
        </ReAnimated.ScrollView>
      )}

      {inFolder.length > 0 && (
        <PressBtn onPress={() => { hap.medium(); router.push(`/practice/quiz?scope=folder&id=${folder.id}`) }} style={{ position: 'absolute', left: SP.lg, right: SP.lg, bottom: 28 }}>
          <View style={styles.practiceBtn}>
            <Icon name="target" size={17} color={C.white} />
            <Text style={{ color: C.white, fontWeight: '800', fontSize: 15, marginLeft: 8 }}>Practice this folder · {due} due</Text>
          </View>
        </PressBtn>
      )}

      <Sheet visible={menu} onClose={() => setMenu(false)} title={folder.name}>
        {[
          { icon: 'edit' as IconName, label: 'Rename folder', act: () => { setMenu(false); setEditingName(true) } },
          { icon: 'layers' as IconName, label: 'Merge into another folder…', act: () => { setMenu(false); setTimeout(() => setMergeOpen(true), 250) } },
          { icon: 'trash' as IconName, label: 'Delete folder', danger: true, act: () => { hap.medium(); deleteFolder(folder.id); toast('Folder deleted'); router.back() } },
        ].map((it) => (
          <PressBtn key={it.label} onPress={it.act} hit={30}>
            <View style={styles.menuRow}>
              <Icon name={it.icon} size={19} color={(it as any).danger ? C.danger : C.ink} />
              <Text style={[styles.menuLabel, { color: (it as any).danger ? C.danger : C.ink }]}>{it.label}</Text>
            </View>
          </PressBtn>
        ))}
      </Sheet>

      <Sheet visible={mergeOpen} onClose={() => setMergeOpen(false)} title="Merge into…">
        <Text style={{ fontSize: 13, color: C.inkSoft, marginBottom: SP.sm }}>Words move over; the folder disappears.</Text>
        {folders.filter((f) => f.id !== id).map((f) => (
          <PressBtn key={f.id} onPress={() => merge(f.id)} hit={30}>
            <View style={styles.menuRow}>
              <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: f.color + '1F', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="folder" size={18} color={f.color} />
              </View>
              <Text style={styles.menuLabel}>{f.name}</Text>
            </View>
          </PressBtn>
        ))}
      </Sheet>

      <AddWordSheet visible={addOpen} onClose={() => setAddOpen(false)} folderId={folder.id} />
    </View>
  )
}

const styles = StyleSheet.create({
  colorTag: { width: 14, height: 14, borderRadius: 7 },
  sub: { fontSize: 13, color: C.inkSoft, marginTop: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4, color: C.ink, marginRight: 6 },
  nameInput: { fontSize: 20, fontWeight: '800', color: C.primary, padding: 0, borderBottomWidth: 2, borderBottomColor: C.primary },
  statRow: { flexDirection: 'row' },
  stat: { flex: 1, backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, paddingVertical: SP.md, alignItems: 'center' },
  statV: { fontSize: 20, fontWeight: '800', color: C.ink },
  statL: { fontSize: 11, color: C.inkMute, marginTop: 2 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md, marginBottom: SP.sm },
  practiceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary, borderRadius: RD.full, paddingVertical: 16, shadowColor: C.primaryDeep, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  menuLabel: { fontSize: 15, fontWeight: '600', marginLeft: SP.md, color: C.ink },
  emptyCtaPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary, borderRadius: RD.md, paddingVertical: 14 },
  emptyCtaGhost: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.card, borderRadius: RD.md, paddingVertical: 14, borderWidth: 1.5, borderColor: C.primary },
})
