import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { C, RD, SP } from '../lib/theme'
import { Icon } from '../lib/icons'
import { Btn, hap, Header, PressBtn } from '../components/ui'
import { CHAT_MODE_META, type ChatMode } from '../lib/mock'
import { useStore } from '../lib/store'

const ORDER: ChatMode[] = ['comfort', 'growth', 'challenge']

export default function ChatModes() {
  const mode = useStore((s) => s.chatMode)
  const setMode = useStore((s) => s.setChatMode)
  const toast = useStore((s) => s.toastMsg)
  const [sel, setSel] = useState<ChatMode>(mode)

  const choose = (m: ChatMode) => {
    hap.medium()
    setMode(m)
    setSel(m)
    toast(`${CHAT_MODE_META[m].label} mode active`)
    setTimeout(() => router.back(), 300)
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title="Chat mode" subtitle="How much new vocabulary Lexa introduces" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SP.lg }} showsVerticalScrollIndicator={false}>
        <View style={styles.segTrack}>
          {ORDER.map((m, i) => {
            const on = sel === m
            return (
              <PressBtn key={m} onPress={() => { hap.light(); setSel(m) }} style={{ flex: 1 }} hit={34}>
                <View style={[styles.segItem, on && styles.segItemOn, i < ORDER.length - 1 && { marginRight: 6 }]}>
                  <Text style={[styles.segText, { color: on ? C.primary : C.inkMute }]}>{CHAT_MODE_META[m].label}</Text>
                </View>
              </PressBtn>
            )
          })}
        </View>

        {ORDER.map((m) => {
          const on = sel === m
          const meta = CHAT_MODE_META[m]
          return (
            <PressBtn key={m} onPress={() => choose(m)} haptic="light" style={{ marginBottom: SP.md }}>
              <View style={[styles.card, on && styles.cardOn]}>
                <View style={[styles.radio, on && styles.radioOn]}>
                  {on && <Icon name="check" size={13} color={C.white} strokeWidth={3} />}
                </View>
                <View style={{ flex: 1, marginLeft: SP.md }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.cardTitle}>{meta.label}</Text>
                    <View style={styles.ratioBadge}>
                      <Text style={{ color: C.primary, fontSize: 10, fontWeight: '800' }}>{meta.ratio}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardSub}>{meta.blurb}</Text>
                  <View style={styles.demoBubble}>
                    <Text style={{ color: C.ink, fontSize: 12, lineHeight: 17 }}>
                      {m === 'comfort' && '“Sabah kahvemi çok severim.” (all words you know)'}
                      {m === 'growth' && '“Günü değerlendir — pratik yapalım mı?” (+1 new word: değerlendirmek)'}
                      {m === 'challenge' && '“Yine de, yaklaşımı biraz netleştirmek gerek.” (native pace)'}
                    </Text>
                  </View>
                </View>
              </View>
            </PressBtn>
          )
        })}
      </ScrollView>
      <View style={{ padding: SP.lg, paddingBottom: SP.xl }}>
        <Btn label={`Use ${CHAT_MODE_META[sel].label} mode`} onPress={() => choose(sel)} />
        <Text style={{ textAlign: 'center', color: C.inkMute, fontSize: 12, marginTop: SP.sm }}>tapping a card applies it immediately</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  segTrack: { flexDirection: 'row', backgroundColor: C.lineSoft, borderRadius: RD.md, padding: 4, marginBottom: SP.lg },
  segItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: RD.sm },
  segItemOn: { backgroundColor: C.white },
  segText: { fontSize: 14, fontWeight: '700' },
  card: { flexDirection: 'row', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.line, padding: SP.md },
  cardOn: { borderColor: C.primary, backgroundColor: C.selected },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: C.inkFaint, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioOn: { backgroundColor: C.primary, borderColor: C.primary },
  cardTitle: { fontSize: 16, fontWeight: '700', color: C.ink },
  ratioBadge: { backgroundColor: C.primarySoft, borderRadius: RD.full, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  cardSub: { fontSize: 13, color: C.inkSoft, marginTop: 4, lineHeight: 18 },
  demoBubble: { backgroundColor: C.bg, borderRadius: RD.sm, padding: SP.sm, marginTop: SP.sm },
})
