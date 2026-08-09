import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { LANG, C, SP } from '../../lib/theme'
import { useStore } from '../../lib/store'
import { OnboardShell, ContinueFooter, TileGrid } from '../../components/onboard'

export default function Language() {
  const setProfile = useStore((s) => s.setProfile)
  const [sel, setSel] = useState<string | null>(null)
  return (
    <OnboardShell
      prompt="What do you want to learn? Pick one — you can add more later in your library."
      footer={<ContinueFooter onPress={() => { setProfile({ language: sel! }); router.push('/onboarding/reason') }} disabled={!sel} />}
      onBack={() => router.back()}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: SP.xl }} showsVerticalScrollIndicator={false}>
        <TileGrid
          items={LANG.map((l) => ({
            id: l.code,
            label: l.name,
            sub: l.native,
            badge: (
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: l.color, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: C.white, fontWeight: '800', fontSize: 13 }}>{l.code}</Text>
              </View>
            ),
          }))}
          value={sel}
          onChange={setSel}
        />
      </ScrollView>
    </OnboardShell>
  )
}
