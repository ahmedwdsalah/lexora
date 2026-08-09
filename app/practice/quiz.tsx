import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { C, RD, SP } from '../../lib/theme'
import { Icon } from '../../lib/icons'
import { hap, Header, PressBtn, ProgressBar } from '../../components/ui'
import { useStore } from '../../lib/store'

type QA = { term: string; answer: string; options: string[] }

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function Quiz() {
  const { kind, scope, id } = useLocalSearchParams<{ kind?: string; scope?: string; id?: string }>()
  const mode = kind === 'game' ? 'game' : kind === 'match' ? 'match' : 'mc'
  const words = useStore((s) => s.words)
  const bank = useMemo(() => {
    let list = words.filter((w) => w.translation && w.translation !== '—')
    if (scope === 'folder' && id) list = list.filter((w) => w.folderIds.includes(id))
    if (scope === 'due') list = list.filter((w) => w.due)
    return list.slice(0, 7)
  }, [words, scope, id])

  const qas = useMemo<QA[]>(
    () =>
      bank.map((w) => ({
        term: w.term,
        answer: w.translation,
        options: shuffle([w.translation, ...shuffle(bank.filter((b) => b.id !== w.id).map((b) => b.translation)).slice(0, 3)]),
      })),
    [bank]
  )

  if (mode === 'match') return <MatchQuiz qas={qas} />
  return <McQuiz qas={qas} mode={mode} />
}

function McQuiz({ qas, mode }: { qas: QA[]; mode: 'mc' | 'game' }) {
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const shake = useRef(new Animated.Value(0)).current
  const q = qas[idx]

  useEffect(() => {
    if (mode !== 'game' || picked || !q) return
    const t = setInterval(() => setTimeLeft((s) => s - 0.1), 100)
    return () => clearInterval(t)
  }, [idx, picked, mode])

  useEffect(() => {
    if (mode === 'game' && timeLeft <= 0 && !picked) pick('')
  }, [timeLeft])

  const pick = (opt: string) => {
    if (picked) return
    const ok = opt === q.answer
    setPicked(opt)
    if (ok) {
      hap.success()
      setScore((s) => s + 1)
    } else {
      hap.error()
      Animated.sequence([
        Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.spring(shake, { toValue: 0, friction: 5, useNativeDriver: true }),
      ]).start()
    }
  }

  const advance = (wasRight: boolean) => {
    if (idx + 1 >= qas.length) {
      router.push(`/practice/result?score=${score + (wasRight ? 1 : 0)}&total=${qas.length}&type=${mode === 'game' ? 'Games' : 'Quiz'}`)
    } else {
      setIdx((i) => i + 1); setPicked(null); setTimeLeft(15)
    }
  }

  if (!q) return null

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header
        back
        title={mode === 'game' ? 'Games · beat the clock' : 'Quiz'}
        subtitle={`${idx + 1} of ${qas.length}`}
        right={
          <View style={styles.scorePill}>
            <Icon name="star" size={14} color={C.gold} filled />
            <Text style={{ color: C.ink, fontWeight: '800', fontSize: 14, marginLeft: 5 }}>{score}</Text>
          </View>
        }
      />
      <View style={{ paddingHorizontal: SP.lg }}>
        <ProgressBar value={(idx + 1) / qas.length} color={mode === 'game' ? C.flame : C.primary} />
      </View>

      {mode === 'game' && (
        <View style={{ paddingHorizontal: SP.lg, marginTop: SP.md }}>
          <View style={styles.timerTrack}>
            <View style={[styles.timerFill, { width: `${(timeLeft / 15) * 100}%`, backgroundColor: timeLeft < 5 ? C.danger : C.flame }]} />
          </View>
          <Text style={{ color: C.inkMute, fontSize: 12, marginTop: 4, textAlign: 'right', fontWeight: '700' }}>{Math.ceil(timeLeft)}s</Text>
        </View>
      )}

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: SP.lg }}>
        <Animated.View style={{ transform: [{ translateX: shake }] }}>
          <View style={styles.qCard}>
            <Text style={styles.qLabel}>What does this mean?</Text>
            <Text style={styles.qTerm}>{q.term}</Text>
          </View>
        </Animated.View>
        <View style={{ marginTop: SP.lg }}>
          {q.options.map((o) => {
            const isAns = o === q.answer
            const isPick = picked === o
            const showRight = !!picked && isAns
            const showWrong = !!picked && isPick && !isAns
            return (
              <View key={o} style={{ marginBottom: SP.sm }}>
                <PressableOpt label={o} disabled={!!picked} onPress={() => pick(o)} picked={picked} isRight={showRight} isWrong={showWrong} />
              </View>
            )
          })}
        </View>
        {picked && (
          <View style={[styles.resultBar, picked === q.answer ? { backgroundColor: C.successBg } : { backgroundColor: C.dangerBg }]}>
            <Icon name={picked === q.answer ? 'check' : 'close'} size={16} color={picked === q.answer ? C.success : C.danger} strokeWidth={2.6} />
            <Text style={{ flex: 1, color: picked === q.answer ? C.success : C.danger, fontWeight: '700', fontSize: 13, marginLeft: 8 }}>
              {picked === q.answer ? 'Correct!' : `Incorrect · Correct answer: ${q.answer}`}
            </Text>
            {picked !== q.answer && <Icon name="flag" size={14} color={C.danger} />}
          </View>
        )}
        {picked && (
          <PressBtn onPress={() => advance(picked === q.answer)} style={{ marginTop: SP.md }}>
            <View style={[styles.contBtn, { backgroundColor: picked === q.answer ? C.success : C.danger }]}>
              <Text style={{ color: C.white, fontWeight: '800', fontSize: 15 }}>
                {idx + 1 >= qas.length ? 'See results' : 'Continue'}
              </Text>
            </View>
          </PressBtn>
        )}
      </View>
    </View>
  )
}

function PressableOpt({ label, onPress, disabled, picked, isRight, isWrong }: { label: string; onPress: () => void; disabled: boolean; picked: string | null; isRight: boolean; isWrong: boolean }) {
  return (
    <PressableOptBtn label={label} onPress={onPress} disabled={disabled} isRight={isRight} isWrong={isWrong} />
  )
}

function PressableOptBtn({ label, onPress, disabled, isRight, isWrong }: { label: string; onPress: () => void; disabled: boolean; isRight: boolean; isWrong: boolean }) {
  const s = useRef(new Animated.Value(1)).current
  return (
    <Animated.View style={{ transform: [{ scale: s }] }}>
      <Pressable
        disabled={disabled}
        onPressIn={() => Animated.timing(s, { toValue: 0.97, duration: 60, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(s, { toValue: 1, friction: 5, useNativeDriver: true }).start()}
        onPress={onPress}
        style={[
          styles.optInner,
          isRight && styles.optRight,
          isWrong && styles.optWrong,
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.optText, (isRight || isWrong) && { opacity: 0.75 }]}>{label}</Text>
          {isRight && <Icon name="check" size={16} color={C.success} strokeWidth={2.6} style={{ position: 'absolute', right: -20 }} />}
          {isWrong && <Icon name="close" size={16} color={C.danger} strokeWidth={2.6} style={{ position: 'absolute', right: -20 }} />}
        </View>
      </Pressable>
    </Animated.View>
  )
}

function MatchQuiz({ qas }: { qas: QA[] }) {
  const [left, setLeft] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})
  const terms = qas.map((q) => q.term)
  const answers = shuffle(qas.map((q) => q.answer))

  const tapTerm = (term: string) => {
    if (matched[term]) return
    hap.light()
    setLeft(term === left ? null : term)
  }

  const tapAnswer = (ans: string) => {
    if (Object.values(matched).includes(ans)) return
    if (!left) { hap.error(); return }
    const correct = qas.find((q) => q.term === left)?.answer === ans
    if (correct) {
      hap.success()
      const next = { ...matched, [left]: ans }
      setMatched(next)
      setLeft(null)
      if (Object.keys(next).length === qas.length) {
        setTimeout(() => router.push(`/practice/result?score=${qas.length}&total=${qas.length}&type=Matching`), 400)
      }
    } else {
      hap.error()
      setLeft(null)
    }
  }

  const col = (label: string, isSelected: boolean, done: boolean, dim: boolean, action: () => void) => (
    <Pressable onPress={action} disabled={dim} style={[styles.matchCell, isSelected && styles.matchCellOn, done && styles.matchCellDone, dim && { opacity: 0.35 }]}>
      <Text style={[styles.matchText, done && { color: C.success, fontWeight: '800' }]}>{label}</Text>
    </Pressable>
  )

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title="Matching" subtitle="Tap a word, then its meaning" />
      <View style={{ paddingHorizontal: SP.lg }}>
        <ProgressBar value={Object.keys(matched).length / qas.length} color={C.success} />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SP.lg }} showsVerticalScrollIndicator={false}>
        <View style={styles.matchGrid}>
          <View style={{ flex: 1 }}>
            {terms.map((t) => (
              <View key={t} style={{ marginBottom: SP.sm }}>
                {col(t, left === t, !!matched[t], !!matched[t] && left !== t, () => tapTerm(t))}
              </View>
            ))}
          </View>
          <View style={{ width: 14 }} />
          <View style={{ flex: 1 }}>
            {answers.map((a) => {
              const done = Object.values(matched).includes(a)
              return (
                <View key={a} style={{ marginBottom: SP.sm }}>
                  {col(a, false, done, done, () => tapAnswer(a))}
                </View>
              )
            })}
          </View>
        </View>
        <Text style={{ color: C.inkMute, fontSize: 12, textAlign: 'center', marginTop: SP.sm }}>
          {left ? 'Now tap its meaning on the right' : `${Object.keys(matched).length} of ${qas.length} matched`}
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scorePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: C.line },
  timerTrack: { height: 6, borderRadius: 3, backgroundColor: C.lineSoft, overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: 3 },
  qCard: { backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, padding: SP.xl, alignItems: 'center' },
  qLabel: { fontSize: 12, fontWeight: '700', color: C.inkMute },
  qTerm: { fontSize: 34, fontWeight: '800', letterSpacing: -0.8, color: C.ink, marginTop: SP.sm, textAlign: 'center' },
  qPron: { fontSize: 13, color: C.inkMute, fontStyle: 'italic', marginTop: 4 },
  opt: { borderRadius: RD.md, borderWidth: 2, borderColor: 'transparent' },
  optRight: { borderColor: C.success, backgroundColor: C.successBg, borderStyle: 'dashed' },
  optWrong: { borderColor: C.danger, backgroundColor: C.dangerBg },
  optInner: { backgroundColor: C.card, borderRadius: RD.md, paddingVertical: 15, paddingHorizontal: SP.lg, borderWidth: 1.5, borderColor: C.line, alignItems: 'center' },
  optText: { fontSize: 15, fontWeight: '600', color: C.ink },
  resultBar: { flexDirection: 'row', alignItems: 'center', borderRadius: RD.md, padding: SP.md, marginTop: SP.sm },
  contBtn: { borderRadius: RD.md, paddingVertical: 15, alignItems: 'center' },
  matchGrid: { flexDirection: 'row' },
  matchCell: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.line, paddingVertical: 14, paddingHorizontal: SP.sm, alignItems: 'center', minHeight: 50, justifyContent: 'center' },
  matchCellOn: { borderColor: C.primary, backgroundColor: C.selected },
  matchCellDone: { borderColor: C.success, backgroundColor: C.successBg },
  matchText: { fontSize: 14, fontWeight: '600', color: C.ink, textAlign: 'center' },
})
