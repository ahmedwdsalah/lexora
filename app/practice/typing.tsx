import { router } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { C, RD, SP } from '../../lib/theme'
import { Icon } from '../../lib/icons'
import { hap, Header, PressBtn, ProgressBar } from '../../components/ui'
import { useStore } from '../../lib/store'

export default function Typing() {
  const words = useStore((s) => s.words)
  const intensity = useStore((s) => s.intensity)
  const deck = useMemo(() => words.filter((w) => w.translation !== '—').slice(0, 6), [words])
  const [idx, setIdx] = useState(0)
  const [val, setVal] = useState('')
  const [state, setState] = useState<'idle' | 'right' | 'wrong'>('idle')
  const [hinted, setHinted] = useState(false)
  const [score, setScore] = useState(0)
  const shake = useRef(new Animated.Value(0)).current
  const w = deck[idx]

  useEffect(() => {
    setVal(''); setState('idle'); setHinted(false)
  }, [idx])

  if (!w) return null

  const check = () => {
    if (state !== 'idle') return
    const ok = val.trim().toLowerCase() === w.translation.toLowerCase()
    if (ok) {
      hap.success(); setState('right'); setScore((s) => s + 1)
    } else {
      hap.error(); setState('wrong')
      Animated.sequence([
        Animated.timing(shake, { toValue: 9, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -9, duration: 50, useNativeDriver: true }),
        Animated.spring(shake, { toValue: 0, friction: 5, useNativeDriver: true }),
      ]).start()
    }
  }

  const next = () => {
    if (idx + 1 >= deck.length) {
      router.push(`/practice/result?score=${score}&total=${deck.length}&type=Typing`)
    } else setIdx((i) => i + 1)
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header
        back title="Typing" subtitle={`Type the meaning · ${idx + 1} of ${deck.length}`}
        right={
          <View style={styles.scorePill}>
            <Icon name="keyboard" size={14} color={C.primary} />
            <Text style={{ fontWeight: '800', color: C.ink, marginLeft: 5 }}>{score}</Text>
          </View>
        }
      />
      <View style={{ paddingHorizontal: SP.lg }}>
        <ProgressBar value={(idx + 1) / deck.length} />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SP.lg }} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.term}>{w.term}</Text>
          {!!w.pronunciation && <Text style={styles.pron}>{w.pronunciation}</Text>}
        </View>

        <Animated.View style={{ transform: [{ translateX: shake }], marginTop: SP.lg }}>
          <View style={[styles.input, state === 'right' && styles.inputRight, state === 'wrong' && styles.inputWrong]}>
            {val.length === 0 ? (
              <Text style={{ color: C.inkFaint, fontSize: 15 }}>Type the meaning in English…</Text>
            ) : (
              <Text style={{ fontSize: 17 }}>
                {val.split('').map((ch, i) => {
                  const tg = w.translation.toLowerCase()
                  const ok = ch.toLowerCase() === (tg[i] ?? '')
                  return (
                    <Text key={i} style={{ color: ok ? C.success : C.danger, fontWeight: '700' }}>
                      {ch}
                    </Text>
                  )
                })}
                {val.length < w.translation.length && (
                  <Text style={{ color: C.inkFaint }}>{w.translation.slice(val.length, val.length + 1)}</Text>
                )}
              </Text>
            )}
            <TextInput
              value={val}
              onChangeText={setVal}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, color: 'transparent' }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={state !== 'right'}
              selectionColor="transparent"
              caretHidden
            />
          </View>
        </Animated.View>

        {state === 'idle' && val.length > 0 && (
          <Text style={{ color: C.inkMute, fontSize: 11, marginTop: 6, textAlign: 'center' }}>
            green = on track · red = off target · next char: “{w.translation[val.length] ?? 'done'}”
          </Text>
        )}

        {state === 'right' && (
          <View style={[styles.feedback, { backgroundColor: C.successBg }]}>
            <Icon name="check" size={16} color={C.success} strokeWidth={2.6} />
            <Text style={{ color: C.success, fontWeight: '700', marginLeft: 8 }}>Correct — “{w.translation}”</Text>
          </View>
        )}
        {state === 'wrong' && (
          <View style={[styles.feedback, { backgroundColor: C.dangerBg }]}>
            <Icon name="close" size={16} color={C.danger} />
            <Text style={{ color: C.danger, fontWeight: '700', marginLeft: 8 }}>Answer: {w.translation}</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', marginTop: SP.lg }}>
          {intensity === 'easy' && state === 'idle' && (
            <PressBtn onPress={() => { hap.tick(); setHinted(true) }} style={{ flex: 1, marginRight: SP.sm }}>
              <View style={styles.hintBtn}>
                <Icon name="bulb" size={17} color={C.attention} />
                <Text style={{ color: C.attention, fontWeight: '700', marginLeft: 6 }}>Hint</Text>
              </View>
            </PressBtn>
          )}
          {state === 'idle' ? (
            <PressBtn onPress={check} style={{ flex: intensity === 'easy' ? 1.6 : 1 }}>
              <View style={styles.checkBtn}>
                <Text style={{ color: C.white, fontWeight: '800', fontSize: 15 }}>Check</Text>
              </View>
            </PressBtn>
          ) : (
            <PressBtn onPress={next} style={{ flex: 1 }}>
              <View style={styles.nextBtn}>
                <Text style={{ color: C.white, fontWeight: '800', fontSize: 15 }}>{idx + 1 >= deck.length ? 'Finish' : 'Next word'}</Text>
                <Icon name="chevR" size={16} color={C.white} />
              </View>
            </PressBtn>
          )}
        </View>

        {hinted && state === 'idle' && (
          <Text style={{ color: C.attention, fontSize: 13, marginTop: SP.md, textAlign: 'center' }}>
            Starts with “{w.translation[0].toUpperCase()}”
          </Text>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scorePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: C.line },
  card: { backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, padding: SP.xl, alignItems: 'center' },
  term: { fontSize: 32, fontWeight: '800', letterSpacing: -0.7, color: C.ink },
  pron: { fontSize: 13, color: C.inkMute, marginTop: 4, fontStyle: 'italic' },
  input: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 2, borderColor: C.line, paddingHorizontal: SP.lg, paddingVertical: 16, fontSize: 17, color: C.ink, textAlign: 'center' },
  inputRight: { borderColor: C.success, backgroundColor: C.successBg },
  inputWrong: { borderColor: C.danger, backgroundColor: C.dangerBg },
  feedback: { flexDirection: 'row', alignItems: 'center', borderRadius: RD.md, padding: SP.md, marginTop: SP.md },
  hintBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.attentionBg, borderRadius: RD.md, paddingVertical: 15, borderWidth: 1, borderColor: '#F0D9B4' },
  checkBtn: { backgroundColor: C.primary, borderRadius: RD.md, paddingVertical: 15, alignItems: 'center' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary, borderRadius: RD.md, paddingVertical: 15 },
})
