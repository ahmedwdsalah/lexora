import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { C, RD, SP } from '../../lib/theme'
import { Icon, type IconName } from '../../lib/icons'
import { Btn, hap, Header, PressBtn } from '../../components/ui'
import { useStore } from '../../lib/store'

const LEVELS: { id: string; icon: IconName; title: string; desc: string; examples: string[]; color: string }[] = [
  { id: 'easy', icon: 'target', title: 'Easy', desc: 'Hints everywhere, multiple choice, no pressure. Warm-up mode.', examples: ['MC with hints', 'No typing', 'Extra time'], color: '#3E9B6E' },
  { id: 'balanced', icon: 'layers', title: 'Balanced', desc: 'A healthy mix of recognition and recall. The default.', examples: ['MC + typing', 'Short listening', 'Sentence building'], color: '#534AB7' },
  { id: 'hard', icon: 'bolt', title: 'Hard', desc: 'Active recall first: you produce, not recognize.', examples: ['Type everything', 'Native-speed audio', 'No hints'], color: '#C89B3C' },
  { id: 'expert', icon: 'crown', title: 'Expert', desc: 'Near-native conversation with minimal scaffolding.', examples: ['Free-form speaking', 'Idioms & speed', 'No mercy'], color: '#C43E4E' },
]

export default function Intensity() {
  const intensity = useStore((s) => s.intensity)
  const setIntensity = useStore((s) => s.setIntensity)
  const [sel, setSel] = useState(intensity)

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title="Study intensity" subtitle="How hard should the exercises push you?" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SP.lg }} showsVerticalScrollIndicator={false}>
        <View style={styles.rec}>
          <Icon name="sparkle" size={16} color={C.primary} />
          <Text style={{ flex: 1, color: C.inkSoft, fontSize: 13, marginLeft: 8 }}>
            Lexa recommends <Text style={{ fontWeight: '800', color: C.primary }}>Balanced</Text> — you aced 76% of your last recall checks.
          </Text>
        </View>
        {LEVELS.map((l) => {
          const on = sel === l.id
          return (
            <PressBtn key={l.id} onPress={() => { hap.light(); setSel(l.id) }} haptic="light" style={{ marginBottom: SP.md }}>
              <View style={[styles.card, on && styles.cardOn]}>
                <View style={[styles.icon, { backgroundColor: l.color + '1F' }]}>
                  <Icon name={l.icon} size={21} color={l.color} />
                </View>
                <View style={{ flex: 1, marginLeft: SP.md }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.title}>{l.title}</Text>
                    {on && (
                      <View style={styles.onBadge}>
                        <Icon name="check" size={11} color={C.white} strokeWidth={3} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.desc}>{l.desc}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                    {l.examples.map((e) => (
                      <View key={e} style={styles.exTag}>
                        <Text style={{ color: l.color, fontSize: 10, fontWeight: '700' }}>{e}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </PressBtn>
          )
        })}
      </ScrollView>
      <View style={{ padding: SP.lg }}>
        <Btn label={`Continue with ${LEVELS.find((l) => l.id === sel)?.title}`} onPress={() => { hap.medium(); setIntensity(sel); router.push('/practice/hub') }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  rec: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primarySoft, borderRadius: RD.md, padding: SP.md, marginBottom: SP.lg },
  card: { flexDirection: 'row', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1.5, borderColor: C.line, padding: SP.md },
  cardOn: { borderColor: C.primary, backgroundColor: C.selected },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: C.ink },
  onBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  desc: { fontSize: 13, color: C.inkSoft, marginTop: 3, lineHeight: 18 },
  exTag: { backgroundColor: C.bg, borderRadius: RD.sm, paddingHorizontal: 8, paddingVertical: 3, marginRight: 6, marginTop: 4 },
})
