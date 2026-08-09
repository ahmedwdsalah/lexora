import { router, Stack } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C, RD, SP } from '../../../lib/theme'
import { Icon, type IconName } from '../../../lib/icons'
import { DayStrip, hap, IconChip, PressBtn, SectionTitle, StatPill } from '../../../components/ui'
import { Celebration } from '../../../components/celebrate'
import { useStore } from '../../../lib/store'
import { SfProFont, useSfProFont } from '../../../hooks/useSfProFont'

export default function Home() {
  const insets = useSafeAreaInsets()
  const words = useStore((s) => s.words)
  const streak = useStore((s) => s.streak)
  const bump = useStore((s) => s.bumpStreak)
  const folders = useStore((s) => s.folders)
  const chat = useStore((s) => s.chat)
  const profile = useStore((s) => s.profile)
  const toast = useStore((s) => s.toastMsg)
  const [refreshing, setRefreshing] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const flame = useRef(new Animated.Value(1)).current
  const due = words.filter((w) => w.due)
  const lastAi = [...chat].reverse().find((m) => m.role === 'assistant')
  const reason = profile.motivation || 'Travel'

  const { loaded } = useSfProFont()
  const fontBold = loaded ? SfProFont.bold : undefined
  const fontMedium = loaded ? SfProFont.medium : undefined

  const onStreak = () => {
    hap.success()
    Animated.sequence([
      Animated.spring(flame, { toValue: 1.25, friction: 3, tension: 200, useNativeDriver: true }),
      Animated.spring(flame, { toValue: 1, friction: 3, tension: 200, useNativeDriver: true }),
    ]).start()
    bump()
    if (streak > 0 && streak % 7 === 0) {
      setTimeout(() => setCelebrate(true), 500)
    }
  }

  const onRefresh = () => {
    hap.light()
    setRefreshing(true)
    setTimeout(() => {
      toast('Fresh — your plan is still on track')
      setRefreshing(false)
    }, 900)
  }

  const mastering = folders.filter((f) => words.some((w) => w.folderIds.includes(f.id) && w.strength > 0.7))

  const tiles: { icon: IconName; label: string; sub: string; to: any; bg: string; color: string }[] = [
    { icon: 'scan', label: 'Scan notes', sub: 'Photograph your notebook', to: '/scan', bg: '#16283F', color: '#2F6FD6' },
    { icon: 'chat', label: 'AI Chat', sub: 'Talk with Lexa', to: '/chat', bg: '#262145', color: C.primary },
    { icon: 'target', label: 'Practice', sub: 'Quizzes & games', to: '/practice/hub', bg: '#3A2416', color: '#D9772F' },
    { icon: 'pin', label: 'Simulations', sub: 'Real-life scenes', to: '/chat/simulation', bg: '#12312A', color: '#15956C' },
  ]

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLargeTitleEnabled: true,
          title: 'Home',
          headerLargeTitleStyle: { fontFamily: fontBold },
          headerTitleStyle: { fontFamily: fontMedium },
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: C.bg }}
        contentContainerStyle={{ paddingBottom: 32 }}
        contentInsetAdjustmentBehavior="always"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
      >
        <View style={{ paddingHorizontal: SP.lg, paddingTop: SP.md }}>
          {/* CapWords-style sentence stat line with inline colored pills */}
          <View style={styles.sentenceCard}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
              <Text style={styles.sentence}>This week you learned </Text>
              <StatPill label={`${words.length} words`} bg="#FBEED0" fg={C.attentionTitle} />
              <Text style={styles.sentence}> at a </Text>
              <StatPill label="75% rate" bg={C.successBg} fg={C.success} />
              <Text style={styles.sentence}>. Got it! </Text>
              <StatPill label="3" bg={C.primarySoft} fg={C.primary} />
              <Text style={styles.sentence}>& Needs review </Text>
              <StatPill label="1" bg="#FBE9E7" fg={C.danger} />
              <Text style={styles.sentence}>.</Text>
            </View>
            <PressBtn onPress={() => router.push('/review')} style={{ marginTop: SP.md }}>
              <View style={styles.reviewPill}>
                <Text style={{ color: C.white, fontWeight: '800', fontSize: 15 }}>Review again</Text>
              </View>
            </PressBtn>
          </View>

          {/* CapWords weekly day strip — today outlined, active days dotted */}
          <View style={styles.dayCard}>
            <DayStrip
              days={[
                { label: 'S', done: true },
                { label: 'M', done: true },
                { label: 'T', done: true },
                { label: 'W', done: true },
                { label: 'T', done: true },
                { label: 'F' },
                { label: 'S', today: true },
              ]}
            />
          </View>

          {/* Today's session hero */}
          <View style={styles.hero}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="crown" size={18} color={C.white} />
              <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '700', letterSpacing: 0.6, marginLeft: 6 }}>
                TODAY'S SESSION
              </Text>
            </View>
            <Text style={styles.heroTitle}>Smart Review</Text>
            <Text style={styles.heroSub}>{due.length} words due · ~12 min · your {reason} goal</Text>
            <PressBtn onPress={() => router.push('/review')} style={{ marginTop: SP.md }}>
              <View style={styles.heroCta}>
                <Text style={{ color: C.primaryDeep, fontWeight: '800', fontSize: 15 }}>Start session</Text>
              </View>
            </PressBtn>
          </View>

          {/* Review-due strip with real count + preview word chips */}
          {due.length > 0 && (
            <View style={{ marginTop: SP.xl }}>
              <SectionTitle title="Due soon" action="Review all" onAction={() => router.push('/review')} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: SP.lg }}>
                {due.map((w) => (
                  <PressBtn key={w.id} onPress={() => router.push(`/vocabulary/word/${w.id}`)} haptic="light" style={{ marginRight: SP.sm }}>
                    <View style={styles.dueChip}>
                      <Text style={styles.dueTerm}>{w.term}</Text>
                      <Text style={styles.dueTr}>{w.translation}</Text>
                    </View>
                  </PressBtn>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Quick actions grid */}
          <View style={{ marginTop: SP.xl }}>
            <SectionTitle title="Quick actions" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: SP.sm }}>
              {tiles.map((t) => (
                <PressBtn key={t.label} onPress={() => router.push(t.to)} haptic="light" style={{ width: '48.5%' }}>
                  <View style={styles.tile}>
                    <IconChip name={t.icon} bg={t.bg} color={t.color} />
                    <Text style={styles.tileLabel}>{t.label}</Text>
                    <Text style={styles.tileSub}>{t.sub}</Text>
                  </View>
                </PressBtn>
              ))}
            </View>
          </View>

          {/* Continue where you left off */}
          {lastAi && (
            <View style={{ marginTop: SP.xl }}>
              <SectionTitle title="Continue where you left off" />
              <PressBtn onPress={() => router.push('/chat')} haptic="light">
                <View style={styles.chatCard}>
                  <Icon name="chat" size={20} color={C.primary} />
                  <View style={{ flex: 1, marginLeft: SP.md }}>
                    <Text style={styles.chatTitle}>Pick up the conversation</Text>
                    <Text style={styles.chatSub} numberOfLines={1}>{lastAi.text}</Text>
                  </View>
                  <Icon name="chevR" size={17} color={C.inkFaint} />
                </View>
              </PressBtn>
            </View>
          )}

          {/* Close to mastering */}
          {mastering.length > 0 && (
            <View style={{ marginTop: SP.xl }}>
              <SectionTitle title="Close to mastering" action="All folders" onAction={() => router.push('/vocabulary')} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: SP.lg }}>
                {mastering.map((f) => (
                  <PressBtn key={f.id} onPress={() => router.push(`/vocabulary/folder/${f.id}`)} haptic="light" style={{ marginRight: SP.sm }}>
                    <View style={styles.masterCard}>
                      <View style={[styles.masterDot, { backgroundColor: f.color }]} />
                      <Text style={styles.masterName}>{f.name}</Text>
                      <Text style={styles.masterSub}>
                        {words.filter((w) => w.folderIds.includes(f.id) && w.strength > 0.7).length} almost there
                      </Text>
                    </View>
                  </PressBtn>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <Celebration
        visible={celebrate}
        onClose={() => setCelebrate(false)}
        icon="flame"
        title={`${streak} day streak!`}
        sub={`${streak} days in a row — your plan is compounding. Keep the streak alive!`}
        badge={`Milestone · day ${streak}`}
        cta="Keep going"
        onCta={() => { hap.medium(); setCelebrate(false) }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  sentenceCard: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.lg },
  sentence: { fontSize: 15, lineHeight: 26, color: C.ink },
  reviewPill: { backgroundColor: C.ink, borderRadius: RD.full, paddingVertical: 13, alignItems: 'center' },
  dayCard: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md, marginTop: SP.sm },
  hero: { backgroundColor: C.primary, borderRadius: RD.lg, padding: SP.lg, marginTop: SP.lg },
  heroTitle: { color: C.white, fontSize: 30, fontWeight: '800', letterSpacing: -0.8, marginTop: 6 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  heroCta: { backgroundColor: C.white, borderRadius: RD.full, paddingVertical: 12, alignItems: 'center' },
  dueChip: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, paddingHorizontal: SP.md, paddingVertical: SP.sm, minWidth: 110 },
  dueTerm: { fontSize: 15, fontWeight: '800', color: C.ink },
  dueTr: { fontSize: 12, color: C.inkSoft, marginTop: 2 },
  tile: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md },
  tileLabel: { fontSize: 14, fontWeight: '700', color: C.ink, marginTop: SP.sm },
  tileSub: { fontSize: 11, color: C.inkMute, marginTop: 2 },
  chatCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md },
  chatTitle: { fontSize: 14, fontWeight: '700', color: C.ink },
  chatSub: { fontSize: 12, color: C.inkMute, marginTop: 2 },
  masterCard: { backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md, minWidth: 140 },
  masterDot: { width: 10, height: 10, borderRadius: 5 },
  masterName: { fontSize: 13, fontWeight: '700', color: C.ink, marginTop: 6 },
  masterSub: { fontSize: 11, color: C.inkMute, marginTop: 2 },
})
