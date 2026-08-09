import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../lib/theme'
import { Icon } from '../../lib/icons'
import { Btn, Chip, hap, PressBtn } from '../../components/ui'
import { useStore } from '../../lib/store'

const KINDS = [
  { id: 'subtitle', label: 'Subtitle' },
  { id: 'quote', label: 'Quote' },
  { id: 'song', label: 'Song line' },
  { id: 'scene', label: 'Scene' },
]

export default function AddClip() {
  const insets = useSafeAreaInsets()
  const add = useStore((s) => s.addClip)
  const toast = useStore((s) => s.toastMsg)
  const [kind, setKind] = useState('subtitle')
  const [source, setSource] = useState('')
  const [content, setContent] = useState('')
  const [note, setNote] = useState('')

  const save = () => {
    if (!content.trim()) return
    hap.medium()
    add({ kind: kind as any, source: source.trim() || 'Unsaved clip', content: content.trim(), note: note.trim() || 'Saved while watching — Lexa will explain it.', words: [], idiom: content.includes('que') && content.split(' ').length < 12, lang: 'ES' })
    toast('Clip saved — words will surface in review')
    router.back()
  }

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + SP.lg }]}>
      <View style={styles.grab} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SP.lg }}>
        <Text style={styles.title}>Add media clip</Text>
        <PressBtn onPress={() => router.back()} hit={36}>
          <Icon name="close" size={20} color={C.inkSoft} />
        </PressBtn>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>What is it?</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {KINDS.map((k) => (
            <Chip key={k.id} label={k.label} active={kind === k.id} onPress={() => { hap.light(); setKind(k.id) }} style={{ marginBottom: SP.sm }} />
          ))}
        </View>

        <Text style={styles.label}>Source</Text>
        <TextInput value={source} onChangeText={setSource} placeholder="e.g. Casa en llamas · S1E3" placeholderTextColor={C.inkFaint} style={styles.input} />

        <Text style={styles.label}>The line / scene</Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Paste the quote or line in Spanish…"
          placeholderTextColor={C.inkFaint}
          style={[styles.input, styles.area]}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Your note (optional)</Text>
        <TextInput value={note} onChangeText={setNote} placeholder="Why did this moment stick with you?" placeholderTextColor={C.inkFaint} style={[styles.input, styles.areaSmall]} multiline textAlignVertical="top" />
      </ScrollView>

      <View style={{ marginTop: SP.md }}>
        <Btn label="Save clip" onPress={save} disabled={!content.trim()} />
        <Text style={{ fontSize: 11, color: C.inkMute, textAlign: 'center', marginTop: SP.sm }}>
          Lexa will flag idioms and cultural references for explanation
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.card, borderTopLeftRadius: RD.xl, borderTopRightRadius: RD.xl, padding: SP.lg, paddingTop: SP.md },
  grab: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.inkFaint, alignSelf: 'center', marginBottom: SP.lg },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4, color: C.ink },
  label: { fontSize: 12, fontWeight: '700', color: C.inkMute, marginBottom: 6, marginTop: SP.md },
  input: { backgroundColor: C.bg, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.line, paddingHorizontal: SP.md, paddingVertical: 12, fontSize: 15, color: C.ink },
  area: { minHeight: 90, paddingTop: 12 },
  areaSmall: { minHeight: 60, paddingTop: 12 },
})
