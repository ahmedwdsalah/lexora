import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { ToastHost } from '../components/ui'
import { C } from '../lib/theme'
import { useStore } from '../lib/store'
import { useEffect } from 'react'
import { ConvexAuthProvider, useAuthActions } from '@convex-dev/auth/react'
import { convex, tokenStorage } from '../lib/convex'
import * as Linking from 'expo-linking'

function AuthCodeHandler() {
  const { signIn } = useAuthActions()
  useEffect(() => {
    const handle = (e: { url: string }) => {
      const code = Linking.parse(e.url).queryParams?.code
      if (typeof code === 'string' && code) signIn(undefined as never, { code })
    }
    Linking.getInitialURL().then((url) => url && handle({ url }))
    const sub = Linking.addEventListener('url', handle)
    return () => sub.remove()
  }, [signIn])
  return null
}

export default function RootLayout() {
  const setHydrated = useStore((s) => s.setHydrated)
  useEffect(() => { setHydrated() }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexAuthProvider client={convex} storage={tokenStorage}>
        <AuthCodeHandler />
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            contentStyle: { backgroundColor: C.bg },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="folder-modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="media/add" options={{ presentation: 'modal' }} />
          <Stack.Screen name="practice/result" options={{ presentation: 'modal' }} />
        </Stack>
        <ToastHost />
      </ConvexAuthProvider>
    </GestureHandlerRootView>
  )
}
