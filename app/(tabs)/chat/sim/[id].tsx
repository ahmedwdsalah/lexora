import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../../../lib/theme'
import { Icon } from '../../../../lib/icons'
import { Btn, hap, PressBtn, Sheet, TypingDots } from '../../../../components/ui'
import { SIMS } from '../../../../lib/mock'
import { useStore } from '../../../../lib/store'

export default function SimConversation() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const sim = SIMS.find((s) => s.id === id) ?? SIMS[0]
  const msgs = useStore((s) => s.simMsgs[sim.id] ?? [])
  const typing = useStore((s) => s.typing)
  const send = useStore((s) => s.sendSim)
  const reset = useStore((s) => s.resetSim)
  const words = useStore((s) => s.words)
  const toast = useStore((s) => s.toastMsg)
  const [input, setInput] = useState('')
  const [recording, setRecording] = useState(false)
  const [summary, setSummary] = useState(false)
  const [hintOn, setHintOn] = useState(false)
  const scroll = useRef<ScrollView>(null)
  const loopRef = useRef<Animated.CompositeAnimation | null>(null)
  const pulse = useRef(new Animated.Value(1)).current
  const userCount = msgs.filter((m) => m.role === 'user').length

  const starter = msgs.length ? msgs : [{ id: 'seed', role: 'assistant' as const, text: sim.starter }]
  const simWords = words.slice(0, 3).map((w) => w.term)

  useEffect(() => {
    scroll.current?.scrollToEnd({ animated: true })
  }, [msgs, typing])

  const doSend = (t: string) => {
    if (!t.trim()) return
    setInput('')
    send(sim.id, t.trim())
    if (userCount + 1 >= 5) setTimeout(() => setSummary(true), 1600)
  }

  const holdStart = () => {
    hap.medium()
    setRecording(true)
    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.3, duration: 420, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 420, useNativeDriver: true }),
      ])
    )
    loopRef.current.start()
  }

  const holdEnd = () => {
    loopRef.current?.stop()
    pulse.setValue(1)
    setRecording(false)
    hap.medium()
    doSend(sim.cue.split('“')[1]?.split('”')[0] ?? 'Vale, de acuerdo.')
  }

  const sceneColor = sim.color

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={[styles.scene, { backgroundColor: sceneColor + '14' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + SP.sm, paddingHorizontal: SP.lg, paddingBottom: SP.md }}>
          <PressBtn onPress={() => router.back()} hit={36}>
            <Icon name="back" size={22} color={C.ink} />
          </PressBtn>
          <View style={{ flex: 1, marginLeft: SP.sm }}>
            <Text style={styles.title}>{sim.name}</Text>
            <Text style={styles.sub}>{sim.level} · scored on your known words</Text>
          </View>
          <PressBtn onPress={() => { hap.light(); reset(sim.id) }} hit={34}>
            <View style={styles.restart}>
              <Icon name="refresh" size={16} color={C.primary} />
              <Text style={{ color: C.primary, fontWeight: '700', fontSize: 12, marginLeft: 4 }}>Restart</Text>
            </View>
          </PressBtn>
        </View>
        <View style={[styles.sceneCard, { backgroundColor: sceneColor + '1F' }]}>
          <Icon name={sim.icon} size={22} color={sceneColor} />
          <Text style={{ color: C.ink, fontWeight: '700', fontSize: 14, marginLeft: SP.md, flex: 1 }} numberOfLines={2}>
            {sim.desc}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={{ padding: SP.lg }} showsVerticalScrollIndicator={false}>
          {starter.map((m) => {
            const isUser = m.role === 'user'
            return (
              <View key={m.id} style={{ marginBottom: SP.md, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                {isUser ? (
                  <View style={styles.userBubble}>
                    <Text style={{ color: C.white, fontSize: 15, lineHeight: 21 }}>{m.text}</Text>
                  </View>
                ) : (
                  <View style={styles.aiCard}>
                    <Text style={{ color: C.white, fontSize: 15, lineHeight: 21 }}>{m.text}</Text>
                    <View style={styles.aiIcons}>
                      <PressBtn onPress={() => { hap.light(); setHintOn(true) }} hit={26}>
                        <Icon name="eye" size={15} color="rgba(255,255,255,.8)" />
                      </PressBtn>
                      <PressBtn onPress={() => { hap.light(); setHintOn(true) }} hit={26}>
                        <Icon name="globe" size={15} color="rgba(255,255,255,.8)" />
                      </PressBtn>
                      <PressBtn onPress={() => { hap.tick(); toast('Audio replay — native TTS comes with the voice pass') }} hit={26}>
                        <Icon name="volume" size={15} color="rgba(255,255,255,.8)" />
                      </PressBtn>
                    </View>
                  </View>
                )}
              </View>
            )
          })}
          {typing && (
            <View style={styles.aiCard}>
              <TypingDots color="rgba(255,255,255,.7)" />
            </View>
          )}
          {hintOn && (
            <View style={styles.hintCard}>
              <Text style={{ color: 'rgba(255,255,255,.6)', fontSize: 10, fontWeight: '800', letterSpacing: 0.6 }}>HINT</Text>
              <Text style={{ color: C.white, fontSize: 13, marginTop: 3, lineHeight: 18 }}>{sim.cue}</Text>
              <PressBtn onPress={() => { hap.tick(); setHintOn(false) }} hit={24} style={{ alignSelf: 'flex-start', marginTop: 6 }}>
                <Text style={{ color: 'rgba(255,255,255,.6)', fontSize: 11, fontWeight: '700' }}>Hide hint</Text>
              </PressBtn>
            </View>
          )}
          {userCount === 0 && (
            <PressBtn onPress={() => setHintOn(!hintOn)} hit={30} style={{ alignSelf: 'center', marginTop: SP.sm }}>
              <View style={[styles.hintPill, hintOn && { backgroundColor: C.primary }]}>
                <Icon name="bulb" size={13} color={hintOn ? C.white : C.attention} />
                <Text style={{ color: hintOn ? C.white : C.attention, fontWeight: '800', fontSize: 12, marginLeft: 5 }}>Hints {hintOn ? 'ON' : 'OFF'}</Text>
              </View>
            </PressBtn>
          )}
        </ScrollView>

        <View style={{ paddingHorizontal: SP.lg, paddingBottom: insets.bottom + SP.sm, flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.inputBox}>
            <TextInput value={input} onChangeText={setInput} placeholder="Type in Turkish…" placeholderTextColor={C.inkFaint} style={styles.input} onSubmitEditing={() => doSend(input)} />
          </View>
          <Pressable onPress={() => doSend(input)} onPressIn={holdStart} onPressOut={holdEnd} style={{ marginLeft: SP.sm }}>
            <View style={[styles.micBtn, { backgroundColor: input.trim() ? C.primary : sceneColor }]}>
              {recording ? (
                <Animated.View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.white, transform: [{ scale: pulse }] }} />
              ) : (
                <Icon name={input.trim() ? 'send' : 'mic'} size={19} color={C.white} />
              )}
            </View>
          </Pressable>
        </View>
        <Text style={{ textAlign: 'center', color: C.inkMute, fontSize: 11, paddingBottom: insets.bottom + 4 }}>
          {recording ? 'Listening… release to send' : 'Hold the mic to answer by voice'}
        </Text>
      </KeyboardAvoidingView>

      <Sheet visible={summary} onClose={() => setSummary(false)} title={`Scenario complete · ${sim.name}`}>
        <Text style={{ fontSize: 13, color: C.inkSoft, lineHeight: 19, marginBottom: SP.md }}>
          Great job! Words that came up in this scenario — most already in your deck:
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {simWords.map((w) => (
            <View key={w} style={styles.sumWord}>
              <Icon name="sparkle" size={11} color={C.primary} />
              <Text style={{ color: C.primary, fontWeight: '700', fontSize: 13, marginLeft: 4 }}>{w}</Text>
            </View>
          ))}
        </View>
        <View style={{ marginTop: SP.lg }}>
          <Btn label="Practice these words" onPress={() => { hap.medium(); setSummary(false); router.push('/practice/quiz') }} />
          <PressBtn onPress={() => { hap.light(); setSummary(false); reset(sim.id) }} hit={30} style={{ marginTop: SP.sm }}>
            <Text style={{ textAlign: 'center', color: C.inkMute, fontSize: 13, fontWeight: '700' }}>Run it again</Text>
          </PressBtn>
        </View>
      </Sheet>
    </View>
  )
}

const styles = StyleSheet.create({
  scene: { paddingBottom: SP.sm },
  title: { fontSize: 17, fontWeight: '700', color: C.ink },
  sub: { fontSize: 12, color: C.inkSoft, marginTop: 1 },
  restart: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.full, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: C.line },
  sceneCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: SP.lg, borderRadius: RD.md, padding: SP.md, borderWidth: 1, borderColor: 'transparent' },
  aiCard: { maxWidth: '84%', backgroundColor: 'rgba(26,22,37,.92)', borderRadius: RD.lg, borderTopLeftRadius: 4, paddingHorizontal: SP.md, paddingVertical: 10 },
  aiIcons: { flexDirection: 'row', marginTop: 6, gap: 14 },
  userBubble: { maxWidth: '84%', backgroundColor: C.primary, borderRadius: RD.lg, borderTopRightRadius: 4, paddingHorizontal: SP.md, paddingVertical: 10 },
  hintCard: { maxWidth: '84%', backgroundColor: 'rgba(26,22,37,.92)', borderRadius: RD.md, padding: SP.md, marginTop: SP.sm },
  hintPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.attentionBg, borderRadius: RD.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#F0D9B4' },
  inputBox: { flex: 1, backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, paddingHorizontal: SP.md, paddingVertical: 8 },
  input: { fontSize: 15, color: C.ink, paddingTop: 6 },
  micBtn: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  sumWord: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primarySoft, borderRadius: RD.full, paddingHorizontal: 12, paddingVertical: 7, marginRight: 8, marginBottom: 8 },
})
