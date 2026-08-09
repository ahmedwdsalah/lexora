import { router } from 'expo-router'
import { useState } from 'react'
import { View, Text } from 'react-native'
import { C, SP } from '../../lib/theme'
import { useStore } from '../../lib/store'
import { OnboardShell, ContinueFooter } from '../../components/onboard'
import { Slider } from '../../components/ui'

export default function Time() {
  const setProfile = useStore((s) => s.setProfile)
  const [mins, setMins] = useState(10)
  return (
    <OnboardShell
      step={2}
      total={5}
      prompt="How much time can you really give each day? Be honest — 10 solid minutes beats 60 skipped ones."
      footer={
        <ContinueFooter
          label={`Continue with ${mins} min/day`}
          onPress={() => { setProfile({ minutes: mins }); router.push('/onboarding/level') }}
        />
      }
      onBack={() => router.back()}
    >
      <View style={{ paddingHorizontal: SP.lg, paddingTop: SP.xl }}>
        <View style={{ alignItems: 'center', marginBottom: SP.xl }}>
          <Text style={{ fontSize: 52, fontWeight: '800', letterSpacing: -1.5, color: C.primary }}>{mins}</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: C.inkSoft }}>minutes per day</Text>
        </View>
        <Slider min={5} max={30} step={5} value={mins} onChange={setMins} format={(v) => `${v}m`} />
        <Text style={{ marginTop: SP.lg, fontSize: 13, color: C.inkMute, textAlign: 'center' }}>
          {mins <= 10 ? 'Great — short daily sessions build real streaks.' : mins <= 20 ? 'Solid pace. You will outpace most courses.' : 'Ambitious! We will make it count.'}
        </Text>
      </View>
    </OnboardShell>
  )
}
