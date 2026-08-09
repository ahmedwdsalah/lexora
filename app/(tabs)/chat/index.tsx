import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StyleSheet, Text, View } from 'react-native'
import { C, RD, SP } from '../../../lib/theme'
import { Icon } from '../../../lib/icons'
import { hap, LexaAvatar, PressBtn } from '../../../components/ui'
import { ChatView } from '../../../components/chat'
import { CHAT_MODE_META } from '../../../lib/mock'
import { useStore } from '../../../lib/store'

const SUGGESTIONS = [
  'Order a coffee in Spanish',
  'Explain “tener ganas de”',
  'Quiz me on this week’s words',
  'Plan a weekend in Madrid',
]

export default function ChatScreen() {
  const insets = useSafeAreaInsets()
  const msgs = useStore((s) => s.chat)
  const typing = useStore((s) => s.typing)
  const send = useStore((s) => s.sendChat)
  const mode = useStore((s) => s.chatMode)
  const words = useStore((s) => s.words)
  const meta = CHAT_MODE_META[mode]
  const empty = msgs.length <= 1

  return (
    <ChatView
      msgs={msgs}
      typing={typing}
      onSend={send}
      placeholder="Message Lexa in Spanish…"
      suggestions={empty ? SUGGESTIONS : undefined}
      header={
        <View style={{ paddingTop: insets.top + SP.sm, paddingHorizontal: SP.lg, paddingBottom: SP.sm }}>
          <View style={styles.topRow}>
            <LexaAvatar size={38} online />
            <View style={{ flex: 1, marginLeft: SP.md }}>
              <Text style={styles.name}>Lexa</Text>
              <Text style={styles.sub}>vocabulary-aware · knows your {words.length} words</Text>
            </View>
            <PressBtn onPress={() => router.push('/modes')} haptic="light">
              <View style={styles.modeChip}>
                <Icon name="sliders" size={15} color={C.primary} />
                <Text style={{ color: C.primary, fontWeight: '700', fontSize: 12, marginLeft: 5 }}>{meta.label}</Text>
              </View>
            </PressBtn>
          </View>
          <View style={{ flexDirection: 'row', marginTop: SP.sm }}>
            <PressBtn onPress={() => { hap.light(); router.push('/chat/simulation') }} hit={30} style={{ marginRight: SP.sm }}>
              <View style={styles.simChip}>
                <Icon name="pin" size={14} color={C.success} />
                <Text style={{ color: C.success, fontWeight: '700', fontSize: 12, marginLeft: 5 }}>Real-life simulation</Text>
              </View>
            </PressBtn>
            <View style={[styles.simChip, { backgroundColor: C.bg }]}>
              <Text style={{ color: C.inkSoft, fontWeight: '600', fontSize: 12 }}>{meta.ratio}</Text>
            </View>
          </View>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '700', color: C.ink },
  sub: { fontSize: 12, color: C.inkSoft, marginTop: 1 },
  modeChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primarySoft, borderRadius: RD.full, paddingHorizontal: 12, paddingVertical: 7 },
  simChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.successBg, borderRadius: RD.full, paddingHorizontal: 12, paddingVertical: 6 },
})
