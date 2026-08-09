import { ConvexReactClient } from "convex/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export const tokenStorage = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};
