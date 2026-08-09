import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { useStore } from '../../lib/store'
import { OnboardShell, ContinueFooter, TileGrid } from '../../components/onboard'
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
  const [sel, setSel] = useState<string[]>([])
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  return (
    <OnboardShell
      step={1}
      total={5}
      prompt="First — how do you learn best? Pick all that fit. There's no wrong answer, and we'll adapt as we go."
      footer={<ContinueFooter onPress={() => { setProfile({ style: sel.join(', ') }); router.push('/onboarding/time') }} disabled={sel.length === 0} />}
      onBack={() => router.back()}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 0 }} showsVerticalScrollIndicator={false}>
        <TileGrid items={OPTS} value={sel} onChange={toggle} multi />
      </ScrollView>
    </OnboardShell>
  )
}
