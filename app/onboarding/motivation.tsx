import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { useStore } from '../../lib/store'
import { OnboardShell, ContinueFooter, InsightCallout } from '../../components/onboard'
import { SelCard } from '../../components/ui'
import type { IconName } from '../../lib/icons'

const OPTS: { id: string; label: string; sub: string; icon: IconName }[] = [
  { id: 'Career', label: 'Career', sub: 'Promotions, clients, or a new market', icon: 'crown' },
  { id: 'Travel', label: 'Travel', sub: 'Real trips, real conversations', icon: 'send' },
  { id: 'Family & friends', label: 'Family & friends', sub: 'Talk to people who matter', icon: 'heart' },
  { id: 'Culture & media', label: 'Culture & media', sub: 'Films, music, books, memes', icon: 'film' },
  { id: 'Brain training', label: 'Brain training', sub: 'Keep the mind sharp on purpose', icon: 'bulb' },
  { id: 'Moving abroad', label: 'Moving abroad', sub: 'Build a life in the language', icon: 'pin' },
]

export default function Motivation() {
  const setProfile = useStore((s) => s.setProfile)
  const [sel, setSel] = useState<string | null>(null)
  return (
    <OnboardShell
      step={4}
      total={5}
      prompt="What is pulling you forward? When days get busy, this is what brings you back."
      footer={<ContinueFooter onPress={() => { setProfile({ motivation: sel! }); router.push('/onboarding/struggle') }} disabled={!sel} />}
      onBack={() => router.back()}
    >
      <InsightCallout
        kind="success"
        title="Insight"
        body="Learners who tie practice to a concrete goal keep their streak 2.3× longer past day 30."
        visible={!!sel}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {OPTS.map((o) => (
          <SelCard key={o.id} icon={o.icon} title={o.label} subtitle={o.sub} selected={sel === o.id} onPress={() => setSel(o.id)} />
        ))}
      </ScrollView>
    </OnboardShell>
  )
}
