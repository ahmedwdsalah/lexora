import { Redirect } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP, langOf } from '../../lib/theme'
import { Icon, type IconName } from '../../lib/icons'
import { Btn, IconChip, LangBadge } from '../../components/ui'
import { useStore } from '../../lib/store'

const LEVELS: Record<string, string> = { beginner: 'Just starting', basics: 'I know the basics', intermediate: 'Intermediate', advanced: 'Advanced' }

export default function Ready() {
  const insets = useSafeAreaInsets()
  const profile = useStore((s) => s.profile)
  const complete = useStore((s) => s.completeOnboarding)
  const onboarded = useStore((s) => s.onboarded)

  if (onboarded) return <Redirect href="/home" />

  const rows: { icon: IconName; label: string; value: string; chip?: React.ReactNode }[] = [
    { icon: 'globe', label: 'Language', value: langOf(profile.language).name, chip: <LangBadge code={profile.language} size="sm" /> },
    { icon: 'target', label: 'Daily goal', value: `${profile.minutes} minutes a day` },
    { icon: 'bolt', label: 'Challenge level', value: LEVELS[profile.level] ?? profile.level },
    { icon: 'sparkle', label: 'Focus', value: profile.motivation || profile.reason || 'Conversation' },
  ]

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + SP.lg }]}>
      <View>
        <View style={{ alignItems: 'center', marginBottom: SP.xl }}>
          <View style={styles.check}>
            <Icon name="check" size={30} color={C.white} strokeWidth={3} />
          </View>
          <Text style={styles.title}>Your plan is ready</Text>
          <Text style={styles.sub}>Here's what Lexora will build around — you can change any of it later.</Text>
        </View>
        <View style={{ paddingHorizontal: SP.lg }}>
          {rows.map((r) => (
            <View key={r.label} style={styles.row}>
              <IconChip name={r.icon} size={40} iconSize={19} />
              <View style={{ flex: 1, marginLeft: SP.md }}>
                <Text style={styles.rowLabel}>{r.label}</Text>
                <Text style={styles.rowValue}>{r.value}</Text>
              </View>
              {r.chip}
            </View>
          ))}
        </View>
      </View>
      <View style={{ paddingHorizontal: SP.lg }}>
        <Btn label="Start learning" onPress={complete} />
        <Text style={{ textAlign: 'center', fontSize: 12, color: C.inkMute, marginTop: SP.md }}>
          First session is already seeded: 8 words, 12 minutes, one coffee.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg, justifyContent: 'space-between', paddingTop: 80 },
  check: { width: 64, height: 64, borderRadius: 32, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginBottom: SP.lg },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5, color: C.ink },
  sub: { fontSize: 14, color: C.inkSoft, marginTop: 6, textAlign: 'center', paddingHorizontal: SP.xl, lineHeight: 20 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md, marginBottom: SP.sm },
  rowLabel: { fontSize: 12, color: C.inkMute, fontWeight: '600' },
  rowValue: { fontSize: 15, fontWeight: '700', color: C.ink, marginTop: 2 },
})
