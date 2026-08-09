import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../lib/theme'
import { Icon } from '../lib/icons'
import { Btn, hap, PressBtn, Sheet } from '../components/ui'
import { useStore } from '../lib/store'

const COLORS = ['#534AB7', '#C43E4E', '#2E5FA3', '#3E9B6E', '#C89B3C', '#D85A30']

export default function FolderModal() {
  const { mode, id } = useLocalSearchParams<{ mode: string; id?: string }>()
  const insets = useSafeAreaInsets()
  const folders = useStore((s) => s.folders)
  const add = useStore((s) => s.addFolder)
  const rename = useStore((s) => s.renameFolder)
  const toast = useStore((s) => s.toastMsg)
  const existing = folders.find((f) => f.id === id)
  const [name, setName] = useState(existing?.name ?? '')
  const [color, setColor] = useState(existing?.color ?? COLORS[0])
  const [colorOpen, setColorOpen] = useState(false)
  const [custom, setCustom] = useState(false)

  const save = () => {
    if (!name.trim()) return
    hap.medium()
    if (mode === 'rename' && existing) {
      rename(existing.id, name.trim())
      toast('Folder renamed')
    } else {
      add(name.trim(), color)
      toast(`Folder "${name.trim()}" created`)
    }
    router.back()
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(26,22,37,.45)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: SP.xl }}>
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{mode === 'rename' ? 'Rename folder' : 'Create new folder'}</Text>
          <PressBtn onPress={() => router.back()} hit={36}>
            <Icon name="close" size={18} color={C.inkSoft} />
          </PressBtn>
        </View>

        <Text style={styles.label}>TITLE</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={mode === 'rename' ? 'Folder name' : 'e.g. Work emails'}
            placeholderTextColor={C.inkFaint}
            style={styles.input}
            autoFocus
          />
        </View>

        <Text style={styles.label}>COLOR</Text>
        <PressBtn onPress={() => { hap.light(); setColorOpen(true) }} hit={30}>
          <View style={styles.swatchRow}>
            <Text style={{ color: C.ink, fontWeight: '600', fontSize: 14 }}>Folder color</Text>
            <View style={styles.swatchPreview}>
              <View style={[styles.swatchDot, { backgroundColor: color }]} />
              <Icon name="chevR" size={15} color={C.inkFaint} style={{ marginLeft: 8 }} />
            </View>
          </View>
        </PressBtn>

        <Btn label="Create folder" onPress={save} disabled={!name.trim()} style={{ marginTop: SP.lg }} />
      </View>

      <Sheet visible={colorOpen} onClose={() => setColorOpen(false)} title="Select a folder color">
        <Text style={{ fontSize: 12, fontWeight: '700', color: C.inkMute, marginBottom: SP.sm }}>
          Current: {color === '#534AB7' ? 'Deep violet' : color === '#C43E4E' ? 'Tomato' : color === '#2E5FA3' ? 'Ocean blue' : color === '#3E9B6E' ? 'Forest' : color === '#C89B3C' ? 'Gold' : 'Ember'}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {COLORS.map((c) => (
            <PressBtn key={c} onPress={() => { hap.light(); setColor(c) }} hit={34} style={{ marginRight: SP.md, marginBottom: SP.md }}>
              <View style={[styles.pickDot, { backgroundColor: c }, color === c && styles.pickDotOn]}>
                {color === c && <Icon name="check" size={14} color={C.white} strokeWidth={3} />}
              </View>
            </PressBtn>
          ))}
        </View>
        <Text style={{ fontSize: 12, fontWeight: '700', color: C.inkMute, marginBottom: SP.sm }}>CUSTOM</Text>
        <PressBtn onPress={() => { hap.tick(); setCustom(!custom) }} hit={30}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.pickDot, { backgroundColor: custom ? '#7A4EC6' : C.inkFaint, borderColor: custom ? '#7A4EC6' : C.line }]}>
              <Icon name="check" size={13} color={C.white} strokeWidth={3} />
            </View>
            <Text style={{ color: C.ink, fontWeight: '600', marginLeft: SP.sm }}>Custom gradient picker</Text>
          </View>
        </PressBtn>
        {custom && <GradientBar onPick={(c) => { hap.light(); setColor(c) }} />}
        <Btn label="Save color" onPress={() => { hap.medium(); setColorOpen(false) }} style={{ marginTop: SP.md }} />
      </Sheet>
    </View>
  )
}

function GradientBar({ onPick }: { onPick: (c: string) => void }) {
  return (
    <View style={styles.gradWrap}>
      {['#E03131', '#E8590C', '#F08C00', '#40C057', '#1971C2', '#5F3DC4', '#862E9C', '#C2255C'].map((c, i) => (
        <PressBtn key={c} onPress={() => onPick(c)} hit={26} style={{ flex: 1, marginHorizontal: 1 }}>
          <View style={[styles.gradCell, { backgroundColor: c }]} />
        </PressBtn>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { width: '100%', backgroundColor: C.card, borderRadius: RD.lg, padding: SP.lg },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SP.md },
  title: { fontSize: 17, fontWeight: '800', color: C.ink, letterSpacing: -0.3 },
  label: { fontSize: 11, fontWeight: '800', color: C.inkMute, letterSpacing: 0.6, marginBottom: 6, marginTop: SP.md },
  inputWrap: { backgroundColor: C.bg, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.line },
  input: { paddingHorizontal: SP.md, paddingVertical: 12, fontSize: 15, color: C.ink },
  swatchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.bg, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.line, paddingHorizontal: SP.md, paddingVertical: 12 },
  swatchPreview: { flexDirection: 'row', alignItems: 'center' },
  swatchDot: { width: 22, height: 22, borderRadius: 11 },
  pickDot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  pickDotOn: { borderColor: C.ink, transform: [{ scale: 1.1 }] },
  gradWrap: { flexDirection: 'row', marginTop: SP.md, marginBottom: SP.sm },
  gradCell: { height: 34, borderRadius: 8 },
})
