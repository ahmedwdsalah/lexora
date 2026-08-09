import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { useStore } from '../../lib/store'
import { OnboardShell, ContinueFooter, TileGrid } from '../../components/onboard'
import type { IconName } from '../../lib/icons'

const REASONS: { id: string; label: string; icon: IconName }[] = [
  { id: 'Everyday life', label: 'Everyday life', icon: 'home' },
  { id: 'Study', label: 'Study', icon: 'grad' },
  { id: 'Work', label: 'Work', icon: 'layers' },
  { id: 'Travel', label: 'Travel', icon: 'send' },
  { id: 'Personal interest', label: 'Personal interest', icon: 'sparkle' },
  { id: 'Movies & TV', label: 'Movies & TV', icon: 'film' },
  { id: 'Music', label: 'Music', icon: 'note' },
  { id: 'Gaming', label: 'Gaming', icon: 'dice' },
  { id: 'Reading', label: 'Reading', icon: 'vocab' },
  { id: 'Family', label: 'Family', icon: 'heart' },
  { id: 'Other', label: 'Other', icon: 'dots' },
]

export default function Reason() {
  const setProfile = useStore((s) => s.setProfile)
  const [sel, setSel] = useState<string[]>([])
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  return (
    <OnboardShell
      prompt="Why are you learning? Pick all that apply — this shapes every example I show you."
      footer={
        <ContinueFooter
          onPress={() => { setProfile({ reason: sel.join(', ') }); router.push('/onboarding/branch') }}
          disabled={sel.length === 0}
        />
      }
      onBack={() => router.back()}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <TileGrid items={REASONS} value={sel} onChange={toggle} multi />
      </ScrollView>
    </OnboardShell>
  )
}
