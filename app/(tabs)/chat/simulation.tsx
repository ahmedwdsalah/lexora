import { router } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { C, RD, SP } from '../../../lib/theme'
import { Icon } from '../../../lib/icons'
import { hap, Header, IconChip, PressBtn } from '../../../components/ui'
import { SIMS } from '../../../lib/mock'

export default function SimulationPicker() {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title="Real-life simulations" subtitle="Practice the conversations you'll actually have" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: SP.sm, paddingHorizontal: SP.lg - 4 }}>
        {SIMS.map((s) => (
          <PressBtn
            key={s.id}
            onPress={() => { hap.medium(); router.push(`/chat/sim/${s.id}`) }}
            haptic="light"
            style={{ width: '48.5%' }}
          >
            <View style={styles.card}>
              <IconChip name={s.icon} size={46} iconSize={21} bg={s.color + '1F'} color={s.color} />
              <Text style={styles.name}>{s.name}</Text>
              <Text style={styles.desc} numberOfLines={3}>{s.desc}</Text>
              <View style={[styles.level, { backgroundColor: s.color + '14' }]}>
                <Text style={{ color: s.color, fontSize: 10, fontWeight: '800' }}>{s.level}</Text>
              </View>
            </View>
          </PressBtn>
        ))}
      </View>
      <View style={{ paddingHorizontal: SP.xl, marginTop: 'auto', paddingBottom: SP.lg }}>
        <View style={styles.hint}>
          <Icon name="info" size={15} color={C.inkMute} />
          <Text style={{ color: C.inkSoft, fontSize: 12, marginLeft: 8, flex: 1 }}>
            Each scenario is scored on how many of your known words you use. Lexa nudges you into the rest.
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: RD.lg, borderWidth: 1, borderColor: C.line, padding: SP.md, minHeight: 168 },
  name: { fontSize: 15, fontWeight: '700', color: C.ink, marginTop: SP.sm },
  desc: { fontSize: 12, color: C.inkSoft, marginTop: 4, lineHeight: 16 },
  level: { alignSelf: 'flex-start', borderRadius: RD.full, paddingHorizontal: 8, paddingVertical: 3, marginTop: SP.sm },
  hint: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: C.card, borderRadius: RD.md, borderWidth: 1, borderColor: C.line, padding: SP.md },
})
