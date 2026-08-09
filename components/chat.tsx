import React, { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../lib/theme'
import { Icon } from '../lib/icons'
import { Bubble, hap, LexaAvatar, PressBtn, TypingDots } from './ui'
import { useStore, type ChatMsg } from '../lib/store'

export function ChatView({
  msgs, typing, onSend, placeholder, header, context, newWords, avatar = true, suggestions,
}: {
  msgs: ChatMsg[]
  typing: boolean
  onSend: (text: string) => void
  placeholder?: string
  header?: React.ReactNode
  context?: React.ReactNode
  newWords?: string[]
  avatar?: boolean
  suggestions?: string[]
}) {
  const [input, setInput] = React.useState('')
  const [popWord, setPopWord] = useState<string | null>(null)
  const scroll = useRef<ScrollView>(null)
  const words = useStore((s) => s.words)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    scroll.current?.scrollToEnd({ animated: true })
  }, [msgs, typing])

  const send = () => {
    const t = input.trim()
    if (!t || typing) return
    setInput('')
    onSend(t)
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {header}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {context}
        <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ padding: SP.lg }} showsVerticalScrollIndicator={false}>
          {msgs.map((m, i) => (
            <View key={m.id} style={{ marginBottom: SP.sm }}>
              {m.role === 'assistant' && avatar && <LexaAvatar size={26} />}
              <View style={{ marginTop: m.role === 'assistant' ? 4 : 0 }}>
                <Bubble role={m.role}>
                  <View style={[styles.bubble, m.role === 'user' ? styles.userB : styles.aiB]}>
                    <Text style={{ color: m.role === 'user' ? C.white : C.ink, fontSize: 15, lineHeight: 21 }}>{m.text}</Text>
                  </View>
                </Bubble>
              </View>
              {!!m.newWords?.length && (
                <View style={{ marginTop: 6, flexDirection: 'row', flexWrap: 'wrap' }}>
                  {m.newWords.map((w) => (
                    <PressBtn key={w} onPress={() => { hap.light(); setPopWord(w) }} hit={28} style={{ marginRight: 6, marginBottom: 4 }}>
                      <View style={styles.newWordChip}>
                        <Icon name="sparkle" size={11} color={C.primary} />
                        <Text style={styles.newWordText}>{w}</Text>
                      </View>
                    </PressBtn>
                  ))}
                </View>
              )}
            </View>
          ))}
          {typing && (
            <Bubble role="assistant">
              <View style={[styles.bubble, styles.aiB]}>
                <TypingDots />
              </View>
            </Bubble>
          )}
        </ScrollView>

        {!!suggestions && (
          <View style={{ paddingHorizontal: SP.lg, paddingBottom: 4 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestions.map((s) => (
                <PressBtn key={s} onPress={() => onSend(s)} haptic="light" style={{ marginRight: SP.sm }}>
                  <View style={styles.suggPill}>
                    <Icon name="sparkle" size={13} color={C.primary} />
                    <Text style={{ color: C.ink, fontWeight: '600', fontSize: 13, marginLeft: 6 }}>{s}</Text>
                  </View>
                </PressBtn>
              ))}
            </ScrollView>
          </View>
        )}

        {popWord && (
          <View style={styles.popover}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: C.ink }}>{popWord}</Text>
              <Text style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>
                {words.find((w) => w.term === popWord)?.translation ?? '— new word, translation comes with the real model'}
              </Text>
            </View>
            <PressBtn onPress={() => setPopWord(null)} hit={28}>
              <Icon name="close" size={15} color={C.inkFaint} />
            </PressBtn>
          </View>
        )}

        <View style={[styles.inputRow, { paddingBottom: 56 + insets.bottom }]}>
          <View style={styles.inputBox}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={placeholder ?? 'Message Lexa…'}
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
  bubble: { borderRadius: RD.lg, paddingHorizontal: SP.md, paddingVertical: 10 },
  aiB: { backgroundColor: C.card, borderTopLeftRadius: 4, borderWidth: 1, borderColor: C.lineSoft },
  userB: { backgroundColor: C.primary, borderTopRightRadius: 4 },
  newWordChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primarySoft, borderRadius: RD.full, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 4 },
  newWordText: { color: C.primary, fontSize: 12, fontWeight: '700', marginLeft: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: SP.lg, paddingTop: SP.sm, paddingBottom: SP.sm, backgroundColor: C.bg },
  inputBox: { flex: 1, backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, paddingHorizontal: SP.md, paddingVertical: 8 },
  input: { fontSize: 15, color: C.ink, maxHeight: 100, paddingTop: 6 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  suggPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.full, borderWidth: 1, borderColor: C.line, paddingHorizontal: 14, paddingVertical: 9 },
  popover: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.primary, padding: SP.md, marginHorizontal: SP.lg, marginBottom: 6 },
})
