import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { useStore } from '../../lib/store'
import { OnboardShell, ContinueFooter, TileGrid } from '../../components/onboard'
import type { IconName } from '../../lib/icons'

const OPTS: { id: string; label: string; sub: string; icon: IconName }[] = [
  { id: 'beginner', label: 'Just starting', sub: 'Zero to a little — I need the basics', icon: 'target' },
  { id: 'basics', label: 'I know the basics', sub: 'Greetings and travel phrases, roughly', icon: 'star' },
  { id: 'intermediate', label: 'Intermediate', sub: 'I can hold a slow conversation', icon: 'layers' },
  { id: 'advanced', label: 'Advanced', sub: 'I want nuance, slang, and speed', icon: 'bolt' },
]

export default function Level() {
  const setProfile = useStore((s) => s.setProfile)
  const [sel, setSel] = useState<string[]>([])
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  return (
    <OnboardShell
      step={3}
      total={5}
      prompt="Where are you today? Pick all that fit. Challenge is tuned to stretch you — not to break you."
      footer={<ContinueFooter onPress={() => { setProfile({ level: sel.join(', ') }); router.push('/onboarding/motivation') }} disabled={sel.length === 0} />}
      onBack={() => router.back()}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 0 }} showsVerticalScrollIndicator={false}>
        <TileGrid items={OPTS} value={sel} onChange={toggle} multi />
      </ScrollView>
    </OnboardShell>
  )
}
