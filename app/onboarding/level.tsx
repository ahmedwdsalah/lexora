import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { useStore } from '../../lib/store'
import { OnboardShell, ContinueFooter } from '../../components/onboard'
import { SelCard } from '../../components/ui'
import type { IconName } from '../../lib/icons'

const OPTS: { id: string; label: string; sub: string; icon: IconName }[] = [
  { id: 'beginner', label: 'Just starting', sub: 'Zero to a little — I need the basics', icon: 'target' },
  { id: 'basics', label: 'I know the basics', sub: 'Greetings and travel phrases, roughly', icon: 'star' },
  { id: 'intermediate', label: 'Intermediate', sub: 'I can hold a slow conversation', icon: 'layers' },
  { id: 'advanced', label: 'Advanced', sub: 'I want nuance, slang, and speed', icon: 'bolt' },
]

export default function Level() {
  const setProfile = useStore((s) => s.setProfile)
  const [sel, setSel] = useState<string | null>(null)
  return (
    <OnboardShell
      step={3}
      total={5}
      prompt="Where are you today? Challenge is tuned to stretch you — not to break you."
      footer={<ContinueFooter onPress={() => { setProfile({ level: sel! }); router.push('/onboarding/motivation') }} disabled={!sel} />}
      onBack={() => router.back()}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {OPTS.map((o) => (
          <SelCard key={o.id} icon={o.icon} title={o.label} subtitle={o.sub} selected={sel === o.id} onPress={() => setSel(o.id)} />
        ))}
      </ScrollView>
    </OnboardShell>
  )
}
