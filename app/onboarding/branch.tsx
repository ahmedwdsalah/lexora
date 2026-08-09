import { router } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { C, RD, SP } from '../../lib/theme'
import { OnboardShell } from '../../components/onboard'
import { IconChip, PressBtn } from '../../components/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Branch() {
  const insets = useSafeAreaInsets()
  return (
    <OnboardShell
      prompt="Two ways to build your plan. Which fits you right now?"
      onBack={() => router.back()}
    >
      <View style={{ paddingHorizontal: SP.lg, gap: SP.md }}>
        <PressBtn onPress={() => router.push('/onboarding/style')} haptic="medium">
          <View style={styles.card}>
            <IconChip name="clock" size={48} iconSize={22} />
            <View style={{ flex: 1, marginLeft: SP.md }}>
              <Text style={styles.title}>Quick quiz</Text>
              <Text style={styles.sub}>5 short questions · about 2 minutes</Text>
            </View>
            <Text style={styles.meta}>2 min</Text>
          </View>
        </PressBtn>
        <PressBtn onPress={() => router.push('/onboarding/chat')} haptic="medium">
          <View style={styles.card}>
            <IconChip name="chat" size={48} iconSize={22} bg="#E1F5EE" color={C.success} />
            <View style={{ flex: 1, marginLeft: SP.md }}>
              <Text style={styles.title}>Chat with Lexa</Text>
              <Text style={styles.sub}>Describe yourself freely — I build the plan from our talk</Text>
            </View>
            <Text style={styles.meta}>Free-form</Text>
          </View>
        </PressBtn>
      </View>
      <View style={[styles.hint, { marginBottom: insets.bottom + SP.lg }]}>
        <Text style={styles.hintText}>Either way, you get the same plan — it's about what feels natural to you.</Text>
      </View>
    </OnboardShell>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.lg,
    borderWidth: 1.5, borderColor: C.line, padding: SP.lg, minHeight: 110,
  },
  title: { fontSize: 17, fontWeight: '700', color: C.ink },
  sub: { fontSize: 13, color: C.inkSoft, marginTop: 4, lineHeight: 18 },
  meta: { fontSize: 12, fontWeight: '700', color: C.inkMute, marginLeft: SP.sm },
  hint: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: SP.lg },
  hintText: { fontSize: 13, color: C.inkSoft, textAlign: 'center', lineHeight: 18 },
})
