import { Redirect } from 'expo-router'
import { View, Text } from 'react-native'
import { BrandMark } from '../lib/icons'
import { C } from '../lib/theme'
import { useStore } from '../lib/store'

export default function Index() {
  const hydrated = useStore((s) => s.hydrated)
  const onboarded = useStore((s) => s.onboarded)

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
        <BrandMark size={64} />
        <Text style={{ marginTop: 16, fontSize: 24, fontWeight: '800', letterSpacing: -0.5, color: C.ink }}>Lexora</Text>
      </View>
    )
  }
  if (!onboarded) return <Redirect href="/onboarding/splash" />
  return <Redirect href="/home" />
}
