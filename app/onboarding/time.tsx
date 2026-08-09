import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { View, Text } from 'react-native'
import Slider from '@expo/ui/community/slider'
import { C, SP } from '../../lib/theme'
import { useStore } from '../../lib/store'
import { OnboardShell, ContinueFooter } from '../../components/onboard'
import { hap } from '../../components/ui'

export default function Time() {
  const setProfile = useStore((s) => s.setProfile)
  const lastTick = useRef(10)
  const [mins, setMins] = useState(10)
  const onChange = (v: number) => {
    setMins(v)
    const r = Math.round(v)
    if (r !== lastTick.current) {
      lastTick.current = r
      hap.tick()
    }
  }
  return (
    <OnboardShell
      step={2}
      total={5}
      prompt="How much time can you really give each day? Be honest — 10 solid minutes beats 60 skipped ones."
      footer={
        <ContinueFooter
          label={`Continue with ${Math.round(mins)} min/day`}
          onPress={() => { setProfile({ minutes: Math.round(mins) }); router.push('/onboarding/level') }}
        />
      }
      onBack={() => router.back()}
    >
      <View style={{ paddingHorizontal: SP.lg, paddingTop: SP.xl }}>
        <View style={{ alignItems: 'center', marginBottom: SP.xl }}>
          <Text style={{ fontSize: 52, fontWeight: '800', letterSpacing: -1.5, color: C.primary }}>{Math.round(mins)}</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: C.inkSoft }}>minutes per day</Text>
        </View>
        <Slider
          minimumValue={1} maximumValue={120} value={mins}
          onValueChange={onChange}
          minimumTrackTintColor={C.primary}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: SP.sm }}>
          <Text style={{ fontSize: 12, color: C.inkFaint }}>1m</Text>
          <Text style={{ fontSize: 12, color: C.inkFaint }}>120m</Text>
        </View>
        <Text style={{ marginTop: SP.lg, fontSize: 13, color: C.inkMute, textAlign: 'center' }}>
          {mins <= 10 ? 'Great — short daily sessions build real streaks.' : mins <= 20 ? 'Solid pace. You will outpace most courses.' : 'Ambitious! We will make it count.'}
        </Text>
      </View>
    </OnboardShell>
  )
}
