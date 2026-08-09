import { router } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { BrandMark } from '../../lib/icons'
import { C } from '../../lib/theme'
import { Btn } from '../../components/ui'
import { useStore } from '../../lib/store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Splash() {
  const insets = useSafeAreaInsets()
  const toast = useStore((s) => s.toastMsg)
  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + SP }]}>
      <View style={{ alignItems: 'center' }}>
        <BrandMark size={88} />
        <Text style={styles.name}>Lexora</Text>
        <Text style={styles.tag}>Your vocabulary. Your pace. One fold at a time.</Text>
      </View>
      <View style={{ paddingHorizontal: 24 }}>
        <Btn label="Get started" onPress={() => router.push('/onboarding/language')} />
        <Btn
          label="I already have an account"
          variant="ghost"
          onPress={() => toast('Accounts arrive with the backend — for now, just begin.')}
          style={{ marginTop: 8 }}
        />
      </View>
    </View>
  )
}

const SP = 24
const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg, justifyContent: 'space-between', paddingTop: 120 },
  name: { fontSize: 34, fontWeight: '800', letterSpacing: -0.8, color: C.ink, marginTop: 20 },
  tag: { fontSize: 15, color: C.inkSoft, marginTop: 8, textAlign: 'center' },
})
