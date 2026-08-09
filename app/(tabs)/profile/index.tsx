import { router, Stack } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP, langOf } from '../../../lib/theme'
import { Icon, type IconName } from '../../../lib/icons'
import { hap, LangBadge, PressBtn, Toggle } from '../../../components/ui'
import { useStore } from '../../../lib/store'
import { CHAT_MODE_META } from '../../../lib/mock'
import { SfProFont, useSfProFont } from '../../../hooks/useSfProFont'

export default function Profile() {
  const profile = useStore((s) => s.profile)
  const words = useStore((s) => s.words)
  const streak = useStore((s) => s.streak)
  const settings = useStore((s) => s.settings)
  const toggle = useStore((s) => s.toggle)
  const toast = useStore((s) => s.toastMsg)
  const lang = langOf(profile.language)
  const insets = useSafeAreaInsets()
  const chatMode = useStore((s) => s.chatMode)
  const meta = CHAT_MODE_META[chatMode]

  const { loaded } = useSfProFont()
  const fontBold = loaded ? SfProFont.bold : undefined
  const fontMedium = loaded ? SfProFont.medium : undefined

  const links: { icon: IconName; label: string; sub: string; to: string; color: string }[] = [
    { icon: 'flame', label: 'Streak & stats', sub: 'Heatmap, milestones, weekly rhythm', to: '/stats', color: C.flame },
    { icon: 'globe', label: 'Language library', sub: 'Add a language or regional variety', to: '/library', color: C.primary },
    { icon: 'bolt', label: 'Study intensity', sub: 'Current: Balanced', to: '/practice', color: C.gold },
    { icon: 'film', label: 'Saved media', sub: 'Clips, quotes, cultural notes', to: '/media', color: '#B33951' },
  ]

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLargeTitleEnabled: true,
          title: 'Profile',
          headerLargeTitleStyle: { fontFamily: fontBold },
          headerTitleStyle: { fontFamily: fontMedium },
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: C.bg }}
        contentContainerStyle={{ padding: SP.lg, paddingBottom: 32 }}
        contentInsetAdjustmentBehavior="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AH</Text>
          </View>
          <View style={{ flex: 1, marginLeft: SP.md }}>
            <Text style={styles.name}>Ahmed</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <LangBadge code={profile.language} size="sm" />
              <Text style={{ color: C.inkSoft, fontSize: 12, marginLeft: 8 }}>learning for {profile.motivation || 'Travel'}</Text>
            </View>
          </View>
          <PressBtn onPress={() => toast('Profile editing comes with accounts')} hit={34}>
            <View style={styles.editBtn}>
              <Icon name="edit" size={16} color={C.primary} />
            </View>
          </PressBtn>
        </View>

        <View style={styles.statsRow}>
          {[
            { v: `${words.length}`, l: 'words' },
            { v: `${streak}`, l: 'day streak' },
            { v: '45m', l: 'this week' },
          ].map((s, i) => (
            <View key={s.l} style={[styles.stat, i < 2 && { marginRight: SP.sm }]}>
              <Text style={styles.statV}>{s.v}</Text>
              <Text style={styles.statL}>{s.l}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Explore</Text>
        {links.map((l) => (
          <PressBtn key={l.label} onPress={() => router.push(l.to as any)} haptic="light" style={{ marginBottom: SP.sm }}>
            <View style={styles.linkRow}>
              <View style={[styles.linkIcon, { backgroundColor: l.color + '1F' }]}>
                <Icon name={l.icon} size={18} color={l.color} />
              </View>
              <View style={{ flex: 1, marginLeft: SP.md }}>
                <Text style={{ color: C.ink, fontWeight: '700', fontSize: 15 }}>{l.label}</Text>
                <Text style={{ color: C.inkMute, fontSize: 12, marginTop: 1 }}>{l.sub}</Text>
              </View>
              <Icon name="chevR" size={18} color={C.inkFaint} />
            </View>
          </PressBtn>
        ))}

        <Text style={styles.section}>Learning</Text>
        <View style={styles.settingsCard}>
          <ValueRow icon="sliders" label="Chat mode" value={meta.label} onPress={() => router.push('/modes')} />
          <ValueRow icon="clock" label="Daily goal" value="15 min" onPress={() => toast('Change it in onboarding settings')} />
          <ValueRow icon="bell" label="Study reminder" value={settings.reminder ? '9:00 PM' : 'Off'} onPress={() => toggle('reminder')} />
        </View>

        <Text style={styles.section}>Audio & haptics</Text>
        <View style={styles.settingsCard}>
          <ToggleRow label="Pronunciation feedback" sub="Phoneme-level scoring" value={settings.pronunciation} onChange={() => toggle('pronunciation')} />
          <ToggleRow label="Haptics" sub="Taps, ticks, celebration buzzes" value={settings.haptics} onChange={() => toggle('haptics')} />
          <ToggleRow label="Daily reminder" sub="Nudge at your chosen time" value={settings.reminder} onChange={() => toggle('reminder')} />
        </View>

        <Text style={styles.section}>Learning experience</Text>
        <View style={styles.settingsCard}>
          <ToggleRow label="Cultural context mode" sub="Explain idioms, jokes, sarcasm" value={settings.cultural} onChange={() => toggle('cultural')} />
          <ToggleRow label="Location-based learning" sub="Adapt content to your country" value={settings.location} onChange={() => toggle('location')} />
        </View>

        <Text style={styles.section}>Account</Text>
        <View style={styles.settingsCard}>
          <ValueRow icon="user" label="Personal details" value="Ahmed · a***@gmail.com" onPress={() => toast('Profile editing comes with accounts')} />
          <ValueRow icon="globe" label="Languages" value={lang.native} onPress={() => router.push('/library')} />
        </View>
        <Text style={styles.section}>About</Text>
        <View style={styles.settingsCard}>
          <ValueRow icon="info" label="Privacy policy" value="›" onPress={() => toast('Opens in browser')} />
          <ValueRow icon="lock" label="Terms of service" value="›" onPress={() => toast('Opens in browser')} />
        </View>

        <PressBtn onPress={() => { hap.light(); toast('Signed out — see you tomorrow') }} hit={30} style={{ marginTop: SP.xl }}>
          <View style={styles.signOut}>
            <Icon name="exit" size={17} color={C.danger} />
            <Text style={{ color: C.danger, fontWeight: '700', fontSize: 14, marginLeft: 8 }}>Sign out</Text>
          </View>
        </PressBtn>
        <Text style={{ textAlign: 'center', color: C.inkFaint, fontSize: 11, marginTop: SP.lg }}>
          Lexora v0.1 mock · no account needed yet
        </Text>
      </ScrollView>
    </>
  )
}

function ValueRow({ icon, label, value, onPress }: { icon: IconName; label: string; value: string; onPress: () => void }) {
  return (
    <PressBtn onPress={onPress} hit={30}>
      <View style={[styles.toggleRow, { borderBottomWidth: 1, borderBottomColor: C.lineSoft }]}>
        <View style={styles.valueIcon}>
          <Icon name={icon} size={16} color={C.primary} />
        </View>
        <Text style={{ flex: 1, color: C.ink, fontWeight: '600', fontSize: 14, marginLeft: SP.md }}>{label}</Text>
        <Text style={{ color: C.inkSoft, fontSize: 13, fontWeight: '600', marginRight: 4 }} numberOfLines={1}>{value}</Text>
        <Icon name="chevR" size={15} color={C.inkFaint} />
      </View>
    </PressBtn>
  )
}

function ToggleRow({ label, sub, value, onChange }: { label: string; sub: string; value: boolean; onChange: () => void }) {
  return (
    <View style={[styles.toggleRow, { borderBottomWidth: 1, borderBottomColor: C.lineSoft }]}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: C.ink, fontWeight: '600', fontSize: 14 }}>{label}</Text>
        <Text style={{ color: C.inkMute, fontSize: 12, marginTop: 1 }}>{sub}</Text>
      </View>
      <Toggle value={value} onChange={onChange} />
    </View>
  )
}

const styles = StyleSheet.create({
  identity: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, padding: SP.lg },
  avatar: { width: 56, height: 56, borderRadius: 18, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: C.white, fontWeight: '800', fontSize: 20 },
  name: { fontSize: 19, fontWeight: '800', color: C.ink, letterSpacing: -0.3 },
  editBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', marginTop: SP.md },
  stat: { flex: 1, backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, paddingVertical: SP.md, alignItems: 'center' },
  statV: { fontSize: 20, fontWeight: '800', color: C.ink },
  statL: { fontSize: 11, color: C.inkMute, marginTop: 2 },
  section: { fontSize: 13, fontWeight: '800', color: C.inkMute, letterSpacing: 0.6, textTransform: 'uppercase', marginTop: SP.xl, marginBottom: SP.sm },
  linkRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md },
  linkIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingsCard: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, paddingHorizontal: SP.md },
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  valueIcon: { width: 30, height: 30, borderRadius: 9, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  signOut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: SP.md },
})
