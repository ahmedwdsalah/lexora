import { GlassView } from "expo-glass-effect";
import {
  memo,
  useMemo,
  useRef,
  type ComponentProps,
  type FC,
  type FunctionComponent,
  type JSX,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MeasurementLayer } from "./components/measurement-layer";
import { PanelStack } from "./components/panel-stack";
import { TabToolbar } from "./components/tab-toolbar";
import { useCardMorph } from "./hooks/use-card-morph";
import { useDynamicLayout } from "./hooks/use-dynamic-layout";
import { useNavItems } from "./hooks/use-nav-items";
import { usePopupRenderer } from "./hooks/use-popup-renderer";
import { useViewTransition } from "./hooks/use-view-transition";
import type {
  IAnimatedTabBarProps,
  INavItem,
  IPalette,
} from "./typings/motion-tabs";
import { layoutStyles as styles } from "./utils/layout-styles";
import { palette } from "./utils/palette";
import { estimateToolbarWidth } from "./utils/toolbar-width";

const AnimatedTabBar: FC<IAnimatedTabBarProps> &
  FunctionComponent<IAnimatedTabBarProps> = memo<
  IAnimatedTabBarProps & ComponentProps<typeof AnimatedTabBar>
>(
  (
    props: IAnimatedTabBarProps & ComponentProps<typeof AnimatedTabBar>,
  ): (ReactNode & ReactElement & JSX.Element) | null => {
    const { descriptors, navigation, renderPopupBody, state } = props;
    const insets = useSafeAreaInsets();
    const scheme = (useColorScheme() ?? "light") as "light" | "dark";
    const colors = useMemo<IPalette>(() => palette(scheme), [scheme]);
    const popupRenderer = usePopupRenderer(renderPopupBody);
    const items = useNavItems({ descriptors, state });
    const layout = useDynamicLayout();
    const transition = useViewTransition(items);
    const toolbarTargetW = Math.max(
      layout.toolbarW,
      estimateToolbarWidth(items, transition.view),
    );
    const focusedKey = state.routes[state.index]?.key ?? "";
    const motion = useCardMorph({
      sizes: layout.sizes,
      toolbarH: layout.toolbarH,
      toolbarMinW: layout.toolbarMinW,
      toolbarW: toolbarTargetW,
      restW: estimateToolbarWidth(items, focusedKey) + 16,
      view: transition.view,
    });

    const lastTap = useRef<{ index: number; at: number } | null>(null);

    const handlePress = (item: INavItem, index: number): void => {
      const isFocused = state.index === index;
      const now = Date.now();
      const prev = lastTap.current;
      lastTap.current = { index, at: now };
      if (isFocused && prev && prev.index === index && now - prev.at < 300) {
        transition.setNextView(item);
        return;
      }
      if (!isFocused) {
        navigation.navigate(item.routeName);
        transition.close();
      }
    };

    const handleLongPress = (item: INavItem, index: number): void => {
      if (state.index !== index) navigation.navigate(item.routeName);
      transition.setNextView(item);
    };

    return (
      <View
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFill, styles.root]}
      >
        <MeasurementLayer
          colors={colors}
          items={items}
          onMeasure={layout.handleMeasure}
          renderPopupBody={popupRenderer}
        />
        {transition.view !== "default" && (
          <Pressable
            accessibilityLabel="Close menu"
            accessibilityRole="button"
            onPress={transition.close}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View
          pointerEvents="box-none"
          style={[styles.dock, { paddingBottom: Math.max(insets.bottom, 12) }]}
        >
          <Animated.View style={[styles.cardShadow, motion.cardStyle]}>
            <GlassView
              // intensity={60}
              glassEffectStyle={"regular"}
              style={[
                styles.card,
                {
                  borderColor: colors.border,
                  ...Platform.select({
                    android: {
                      backgroundColor: colors.surface,
                    },
                  }),
                },
              ]}
            >
              <PanelStack
                colors={colors}
                direction={transition.panelDirection}
                items={items}
                onMeasure={layout.handleMeasure}
                renderPopupBody={popupRenderer}
                view={transition.view}
              />
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.divider,
                  motion.dividerStyle,
                  { backgroundColor: colors.border },
                ]}
              />
              <TabToolbar
                colors={colors}
                items={items}
                focusedKey={state.routes[state.index]?.key}
                onLayout={layout.handleToolbarLayout}
                onPress={handlePress}
                onLongPress={handleLongPress}
                view={transition.view}
              />
            </GlassView>
          </Animated.View>
        </View>
      </View>
    );
  },
);

export { AnimatedTabBar };
