import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../lib/theme'
import { Icon } from '../../lib/icons'
import { Bubble, Btn, LexaAvatar, PressBtn, TypingDots } from '../../components/ui'
import { useStore } from '../../lib/store'

type M = { id: string; role: 'user' | 'assistant'; text: string }

const REPLIES = [
  'That helps a lot. So — how much time can you give it every day, honestly?',
  'Got it. And what trips you up the most when you try? Speed? Words? Motivation?',
  'Perfect. I think I have enough to shape your plan — give me a second to fold it together.',
]

export default function OnboardChat() {
  const insets = useSafeAreaInsets()
  const [msgs, setMsgs] = useState<M[]>([
    { id: 'm0', role: 'assistant', text: 'Merhaba! I\'m Lexa. Tell me about yourself as a learner — why this language, what you want to do with it, what keeps failing. Free-form, no right answer.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scroll = useRef<ScrollView>(null)
  const sent = useRef(0)

  const send = () => {
    const t = input.trim()
    if (!t || typing) return
    setMsgs((m) => [...m, { id: `m${Date.now()}`, role: 'user', text: t }])
    setInput('')
    setTyping(true)
    const i = sent.current
    sent.current += 1
    setTimeout(() => {
      setMsgs((m) => [...m, { id: `m${Date.now()}`, role: 'assistant', text: REPLIES[Math.min(i, REPLIES.length - 1)] }])
      setTyping(false)
    }, 1300)
  }

  useEffect(() => {
    scroll.current?.scrollToEnd({ animated: true })
  }, [msgs, typing])

  const canGenerate = msgs.length >= 6

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top + SP.sm }}>
      <View style={styles.top}>
        <PressBtn onPress={() => router.back()} hit={36}>
          <Icon name="back" size={22} color={C.ink} />
        </PressBtn>
        <View style={{ flex: 1, marginLeft: SP.md }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: C.ink }}>Chat with Lexa</Text>
          <Text style={{ fontSize: 12, color: C.inkSoft }}>Onboarding · no wrong answers</Text>
        </View>
        <LexaAvatar size={30} online />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ padding: SP.lg }} showsVerticalScrollIndicator={false}>
          {msgs.map((m) => (
            <Bubble key={m.id} role={m.role}>
              <View style={[styles.bubble, m.role === 'user' ? styles.userB : styles.aiB]}>
                <Text style={{ color: m.role === 'user' ? C.white : C.ink, fontSize: 15, lineHeight: 21 }}>{m.text}</Text>
              </View>
            </Bubble>
          ))}
          {typing && (
            <Bubble role="assistant">
              <View style={[styles.bubble, styles.aiB]}>
                <TypingDots />
              </View>
            </Bubble>
          )}
          {canGenerate && !typing && (
            <Bubble role="assistant">
              <View style={{ marginTop: SP.sm }}>
                <Btn label="Generate my plan" icon="sparkle" onPress={() => router.push('/onboarding/generating')} />
              </View>
            </Bubble>
          )}
        </ScrollView>

        <View style={[styles.inputRow, { paddingBottom: insets.bottom + SP.sm }]}>
          <View style={styles.inputBox}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Tell Lexa about yourself…"
              placeholderTextColor={C.inkFaint}
              style={styles.input}
              multiline
              onSubmitEditing={send}
            />
          </View>
          <PressBtn onPress={send} haptic="medium" style={{ marginLeft: SP.sm }}>
            <View style={[styles.sendBtn, { backgroundColor: input.trim() ? C.primary : C.inkFaint }]}>
              <Icon name="send" size={19} color={C.white} />
            </View>
          </PressBtn>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SP.lg, paddingVertical: SP.sm },
  bubble: { borderRadius: RD.lg, paddingHorizontal: SP.md, paddingVertical: 10 },
  aiB: { backgroundColor: C.card, borderTopLeftRadius: 4, borderWidth: 1, borderColor: C.lineSoft },
  userB: { backgroundColor: C.primary, borderTopRightRadius: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: SP.lg, paddingTop: SP.sm },
  inputBox: { flex: 1, backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, paddingHorizontal: SP.md, paddingVertical: 8 },
  input: { fontSize: 15, color: C.ink, maxHeight: 100, paddingTop: 6 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
})
