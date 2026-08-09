import { AnimatedTabBar } from '@/components/motion-tabs/animated-tab-bar'
import { TabIcon } from '@/components/tab-icon'
import { ExamplePopupBody } from '@/components/motion-tabs/examples/example-popup-body'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Tabs } from 'expo-router'
import type { ReactElement } from 'react'
import { Platform } from 'react-native'

export default function TabsLayout() {
  return (
    <Tabs
      detachInactiveScreens={Platform.OS !== 'ios'}
      initialRouteName="home"
      screenOptions={{
        animation: 'shift',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: 0,
          position: 'absolute',
        },
      }}
      tabBar={(props): ReactElement => (
        <AnimatedTabBar {...(props as unknown as BottomTabBarProps)} renderPopupBody={ExamplePopupBody} />
      )}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon color={color as string} name="home" size={size} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon color={color as string} name="library" size={size} />,
          tabBarLabel: 'Vocabulary',
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon color={color as string} name="screenshot" size={size} />,
          tabBarLabel: 'Scan',
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon color={color as string} name="messages" size={size} />,
          tabBarLabel: 'Chat',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon color={color as string} name="profile" size={size} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  )
}
