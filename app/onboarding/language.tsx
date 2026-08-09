import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { LANG, C, SP } from '../../lib/theme'
import { useStore } from '../../lib/store'
import { OnboardShell, ContinueFooter } from '../../components/onboard'
import { SelCard } from '../../components/ui'

export default function Language() {
  const setProfile = useStore((s) => s.setProfile)
  const [sel, setSel] = useState<string | null>(null)
  return (
    <OnboardShell
      prompt="What do you want to learn? Pick one — you can add more later in your library."
      footer={<ContinueFooter onPress={() => { setProfile({ language: sel! }); router.push('/onboarding/reason') }} disabled={!sel} />}
      onBack={() => router.back()}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: SP.lg, paddingBottom: SP.xl }} showsVerticalScrollIndicator={false}>
        {LANG.map((l) => (
          <SelCard
            key={l.code}
            title={`${l.name}`}
            subtitle={l.native}
            selected={sel === l.code}
            onPress={() => setSel(l.code)}
            style={undefined}
            badge={
              <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: l.color, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: C.white, fontWeight: '800', fontSize: 13 }}>{l.code}</Text>
              </View>
            }
          />
        ))}
      </ScrollView>
    </OnboardShell>
  )
}
