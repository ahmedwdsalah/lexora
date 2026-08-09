import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { C, RD, SP } from '../lib/theme'
import { Icon } from '../lib/icons'
import { Btn, Chip, hap, Sheet } from './ui'
import { useStore } from '../lib/store'

export function FolderDot({ color, size = 10 }: { color: string; size?: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
}

export function WordRow({ term, translation, pronunciation, color, onPress }: { term: string; translation: string; pronunciation?: string; color: string; onPress?: () => void }) {
  return (
    <View style={styles.row}>
      <View style={[styles.rowChip, { backgroundColor: color + '1F' }]}>
        <FolderDot color={color} size={8} />
      </View>
      <View style={{ flex: 1, marginLeft: SP.md }}>
        <Text style={styles.term}>{term}</Text>
        <Text style={styles.tr} numberOfLines={1}>{translation}</Text>
        {!!pronunciation && <Text style={styles.pron}>{pronunciation}</Text>}
      </View>
      {onPress && <Icon name="chevR" size={18} color={C.inkFaint} />}
    </View>
  )
}

export function AddWordSheet({ visible, onClose, folderId }: { visible: boolean; onClose: () => void; folderId?: string | null }) {
  const folders = useStore((s) => s.folders)
  const addWord = useStore((s) => s.addWord)
  const toast = useStore((s) => s.toastMsg)
  const [term, setTerm] = useState('')
  const [tr, setTr] = useState('')
  const [fid, setFid] = useState<string | null>(folderId ?? null)

  const save = () => {
    if (!term.trim()) return
    hap.medium()
    addWord({
      term: term.trim(),
      translation: tr.trim() || '—',
      pronunciation: '',
      example: '',
      exampleTr: '',
      folderIds: fid ? [fid] : [],
      source: 'manual',
    })
    toast(`"${term.trim()}" added to your vocabulary`)
    setTerm(''); setTr(''); setFid(folderId ?? null)
    onClose()
  }

  return (
    <Sheet visible={visible} onClose={onClose} title="Add a word">
      <Text style={styles.label}>Word</Text>
      <TextInput value={term} onChangeText={setTerm} placeholder="e.g. la biblioteca" placeholderTextColor={C.inkFaint} style={styles.input} autoFocus />
      <Text style={styles.label}>Translation</Text>
      <TextInput value={tr} onChangeText={setTr} placeholder="e.g. library" placeholderTextColor={C.inkFaint} style={styles.input} />
      <Text style={styles.label}>Folder</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {folders.map((f) => (
          <Chip key={f.id} label={f.name} active={fid === f.id} onPress={() => { hap.light(); setFid(f.id) }} style={{ marginBottom: SP.sm }} />
        ))}
      </View>
      <Btn label="Save word" onPress={save} disabled={!term.trim()} style={{ marginTop: SP.sm }} />
    </Sheet>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md },
  rowChip: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  term: { fontSize: 16, fontWeight: '700', color: C.ink },
  tr: { fontSize: 13, color: C.inkSoft, marginTop: 1 },
  pron: { fontSize: 11, color: C.inkFaint, marginTop: 1 },
  label: { fontSize: 12, fontWeight: '700', color: C.inkMute, marginBottom: 6, marginTop: SP.md },
  input: { backgroundColor: C.bg, borderRadius: RD.sm, borderWidth: 1, borderColor: C.line, paddingHorizontal: SP.md, paddingVertical: 12, fontSize: 15, color: C.ink },
})
