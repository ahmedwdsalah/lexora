import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { C } from '@/lib/theme'

const bg = { contentStyle: { backgroundColor: C.bg } }

export default function TabsLayout() {
  return (
    <NativeTabs tintColor={C.primary}>
      <NativeTabs.Trigger name="home" {...bg}>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="vocabulary" {...bg}>
        <NativeTabs.Trigger.Label>Vocabulary</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="books.vertical.fill" md="library_books" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="scan" {...bg}>
        <NativeTabs.Trigger.Label>Scan</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="camera.viewfinder" md="document_scanner" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="chat" {...bg}>
        <NativeTabs.Trigger.Label>Chat</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="message.fill" md="chat_bubble" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile" {...bg}>
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.crop.circle.fill" md="account_circle" />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
