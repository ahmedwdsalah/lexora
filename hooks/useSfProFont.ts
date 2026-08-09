import { useFonts } from "expo-font";

export const SfProFont = {
  regular: "SFProRounded-Regular",
  medium: "SFProRounded-Medium",
  bold: "SFProRounded-Bold",
} as const;

const fontMap = {
  [SfProFont.regular]: require("../assets/fonts/sf-pro-rounded/SF-Pro-Rounded-Regular.otf"),
  [SfProFont.medium]: require("../assets/fonts/sf-pro-rounded/SF-Pro-Rounded-Medium.otf"),
  [SfProFont.bold]: require("../assets/fonts/sf-pro-rounded/SF-Pro-Rounded-Bold.otf"),
};

export function useSfProFont() {
  const [loaded, error] = useFonts(fontMap);
  return { loaded, error };
}
