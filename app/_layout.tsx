import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { ToastHost } from '../components/ui'
import { C } from '../lib/theme'
import { useStore } from '../lib/store'
import { useEffect } from 'react'

export default function RootLayout() {
  const setHydrated = useStore((s) => s.setHydrated)
  useEffect(() => { setHydrated() }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  )
}
