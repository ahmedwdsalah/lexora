import { router } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { C, RD, SP } from '../../lib/theme'
import { Btn } from '../../components/ui'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Welcome() {
  const insets = useSafeAreaInsets()
  const me = useQuery(api.users.me)

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + SP.lg }]}>
      <View style={{ alignItems: 'center', marginBottom: SP.xl }}>
        <Text style={styles.logo}>Lexora</Text>
      </View>

      <View style={styles.card}>
        {me?.image ? (
          <Image source={me.image} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitials}>
              {(me?.name ?? '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.greet}>Welcome, {me?.name?.split(' ')[0] ?? 'friend'}!</Text>
        <Text style={styles.sub}>
          Your Google account is connected{me?.email ? ` (${me.email})` : ''}. Ready to build your Turkish vocabulary, one fold at a time?
        </Text>
      </View>

      <View style={{ paddingHorizontal: SP.lg }}>
        <Btn label="Start learning" onPress={() => router.push('/onboarding/language')} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg, justifyContent: 'space-between', paddingHorizontal: SP.lg },
  logo: { fontSize: 26, fontWeight: '800', letterSpacing: -0.6, color: C.ink },
  card: {
    backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line,
    padding: SP.xl, alignItems: 'center',
  },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: SP.lg },
  avatarFallback: { backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontSize: 28, fontWeight: '800', color: C.primary },
  greet: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4, color: C.ink, textAlign: 'center' },
  sub: { fontSize: 14, lineHeight: 20, color: C.inkSoft, textAlign: 'center', marginTop: SP.sm },
})
