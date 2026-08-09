import { router } from 'expo-router'
import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { BrandMark, GoogleLogo } from '../../lib/icons'
import { C, RD } from '../../lib/theme'
import { PressBtn } from '../../components/ui'
import { useStore } from '../../lib/store'
import { useAuthActions, useConvexAuth } from '@convex-dev/auth/react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'

export default function Splash() {
  const insets = useSafeAreaInsets()
  const toast = useStore((s) => s.toastMsg)
  const { signIn } = useAuthActions()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/onboarding/welcome')
  }, [isAuthenticated, isLoading])

  const onGoogle = async () => {
    if (busy) return
    setBusy(true)
    try {
      const res = await signIn('google', { redirectTo: 'lexora://' })
      if (res?.redirect) {
        const result = await WebBrowser.openAuthSessionAsync(res.redirect.toString(), 'lexora://')
        if (result.type === 'success' && result.url) {
          const code = Linking.parse(result.url).queryParams?.code
          if (typeof code === 'string' && code) await signIn(undefined as never, { code })
        } else if (result.type === 'cancel' || result.type === 'dismiss') toast('Google sign-in was cancelled')
      }
    } catch {
      toast('Google sign-in failed — try again')
    } finally {
      setBusy(false)
    }
  }

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + SP }]}>
      <View style={{ alignItems: 'center' }}>
        <BrandMark size={88} />
        <Text style={styles.name}>Lexora</Text>
        <Text style={styles.tag}>Your vocabulary. Your pace. One fold at a time.</Text>
      </View>
      <View style={{ paddingHorizontal: 24 }}>
        <PressBtn onPress={onGoogle} haptic="medium">
          <View style={styles.googleBtn}>
            {busy ? (
              <ActivityIndicator color={C.ink} size="small" />
            ) : (
              <>
                <GoogleLogo size={20} />
                <Text style={styles.googleLabel}>Sign in with Google</Text>
              </>
            )}
          </View>
        </PressBtn>
      </View>
    </View>
  )
}

const SP = 24
const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg, justifyContent: 'space-between', paddingTop: 120 },
  name: { fontSize: 34, fontWeight: '800', letterSpacing: -0.8, color: C.ink, marginTop: 20 },
  tag: { fontSize: 15, color: C.inkSoft, marginTop: 8, textAlign: 'center' },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.white, borderRadius: RD.md, borderWidth: 1, borderColor: C.line,
    paddingVertical: 14,
  },
  googleLabel: { fontSize: 15, fontWeight: '700', color: C.ink, marginLeft: 10 },
})
