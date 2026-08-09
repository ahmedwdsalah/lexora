import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { useStore } from '../../lib/store'
import { OnboardShell, ContinueFooter } from '../../components/onboard'
import { SelCard } from '../../components/ui'
import type { IconName } from '../../lib/icons'

const OPTS: { id: string; label: string; sub: string; icon: IconName }[] = [
  { id: 'visual', label: 'Seeing & reading', sub: 'I remember words when I read them', icon: 'eye' },
  { id: 'auditory', label: 'Listening & repeating', sub: 'Sound sticks with me first', icon: 'phones' },
  { id: 'speaking', label: 'Speaking from day one', sub: 'I learn by producing, even badly', icon: 'mic' },
  { id: 'writing', label: 'Writing things down', sub: 'Notes and lists make it real', icon: 'keyboard' },
  { id: 'mixed', label: 'Mixing it all up', sub: 'Whatever works, whenever it works', icon: 'grid' },
]

export default function Style() {
  const setProfile = useStore((s) => s.setProfile)
  const [sel, setSel] = useState<string | null>(null)
  return (
    <OnboardShell
      step={1}
      total={5}
      prompt="First — how do you learn best? There's no wrong answer, and we'll adapt as we go."
      footer={<ContinueFooter onPress={() => { setProfile({ style: sel! }); router.push('/onboarding/time') }} disabled={!sel} />}
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
