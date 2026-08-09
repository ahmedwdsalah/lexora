import { Ionicons } from "@expo/vector-icons";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type {
  ComponentProps,
  FC,
  FunctionComponent,
  JSX,
  ReactElement,
  ReactNode,
} from "react";
import { Platform } from "react-native";

export type TIconName =
  | "home"
  | "search"
  | "bell"
  | "note"
  | "voice"
  | "screenshot"
  | "filter"
  | "trending"
  | "messages"
  | "alerts"
  | "library"
  | "stats"
  | "profile";

type TSfName = SymbolViewProps["name"];
type TIonName = keyof typeof Ionicons.glyphMap;

const SF_MAP: Record<TIconName, TSfName> = {
  home: "house.fill",
  search: "magnifyingglass",
  bell: "bell.fill",
  note: "square.and.pencil",
  voice: "mic.fill",
  screenshot: "camera.fill",
  filter: "line.3.horizontal.decrease",
  trending: "flame.fill",
  messages: "message.fill",
  alerts: "exclamationmark.bubble.fill",
  library: "books.vertical.fill",
  stats: "chart.bar.fill",
  profile: "person.crop.circle.fill",
};

const ION_MAP: Record<TIconName, TIonName> = {
  home: "home",
  search: "search",
  bell: "notifications",
  note: "create-outline",
  voice: "mic",
  screenshot: "camera",
  filter: "filter",
  trending: "trending-up",
  messages: "chatbubble-ellipses",
  alerts: "alert-circle",
  library: "library",
  stats: "stats-chart",
  profile: "person-circle",
};

interface ITabIconProps {
  name: TIconName;
  size?: number;
  color: string;
}

const TabIcon: FC<ITabIconProps> & FunctionComponent<ITabIconProps> = ({
  name,
  size = 22,
  color,
}: ITabIconProps & ComponentProps<typeof TabIcon>):
  | (ReactNode & ReactElement & JSX.Element)
  | null => {
  if (Platform.OS === "ios") {
    return (
      <SymbolView
        name={SF_MAP[name]}
        size={size}
        tintColor={color}
        resizeMode="scaleAspectFit"
      />
    );
  }
  return <Ionicons name={ION_MAP[name]} size={size} color={color} />;
};

export { TabIcon };
