import { Stack } from 'expo-router'
import { C } from '../../lib/theme'

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        contentStyle: { backgroundColor: C.bg },
        animation: 'slide_from_right',
      }}
    />
  )
}
