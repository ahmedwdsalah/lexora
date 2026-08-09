import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { useStore } from '../../lib/store'
import { OnboardShell, ContinueFooter, InsightCallout, TileGrid } from '../../components/onboard'
import type { IconName } from '../../lib/icons'

const OPTS: { id: string; label: string; sub: string; icon: IconName }[] = [
  { id: 'Remembering words', label: 'Remembering words', sub: 'I learn them, then they vanish', icon: 'refresh' },
  { id: 'Pronunciation', label: 'Pronunciation', sub: 'I sound wrong and know it', icon: 'mic' },
  { id: 'Understanding natives', label: 'Understanding natives', sub: 'Everyone talks too fast', icon: 'phones' },
  { id: 'Grammar', label: 'Grammar', sub: 'Verb endings, genders, cases…', icon: 'keyboard' },
  { id: 'Finding time', label: 'Finding time', sub: 'The day fills up before I start', icon: 'clock' },
  { id: 'Staying motivated', label: 'Staying motivated', sub: 'I quit right after the honeymoon', icon: 'flame' },
]

export default function Struggle() {
  const setProfile = useStore((s) => s.setProfile)
  const [sel, setSel] = useState<string[]>([])
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  return (
    <OnboardShell
      step={5}
      total={5}
      prompt="Last one — what trips you up the most? Pick all that apply. I will shape the plan around them."
      footer={
        <ContinueFooter
          onPress={() => {
            setProfile({ struggle: sel.join(', '), planSource: 'quiz' })
            router.push('/onboarding/generating')
          }}
          disabled={sel.length === 0}
        />
      }
      onBack={() => router.back()}
    >
      <InsightCallout
        kind="attention"
        title="Good to know"
        body="“Understanding natives” usually improves fastest with short listening reps — your plan will front-load those."
        visible={sel.length > 0}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 0 }} showsVerticalScrollIndicator={false}>
        <TileGrid items={OPTS} value={sel} onChange={toggle} multi />
      </ScrollView>
    </OnboardShell>
  )
}
