import {
  type ComponentProps,
  type FC,
  type FunctionComponent,
  type JSX,
  memo,
  type ReactElement,
  type ReactNode,
} from "react";
import { View } from "react-native";

import type { ITabToolbarProps } from "../typings/motion-tabs";
import { layoutStyles as styles } from "../utils/layout-styles";
import { MorphTab } from "./morph-tab";

const TabToolbar: FC<ITabToolbarProps> & FunctionComponent<ITabToolbarProps> =
  memo<ITabToolbarProps & ComponentProps<typeof TabToolbar>>(
    ({
      colors,
      items,
      focusedKey,
      onLayout,
      onPress,
      onLongPress,
      view,
    }: ITabToolbarProps & ComponentProps<typeof TabToolbar>):
      | (ReactNode & ReactElement & JSX.Element)
      | null => {
      return (
        <View style={styles.toolbarRow} onLayout={onLayout}>
          {items.map((item, index) => (
            <MorphTab
              key={item.key}
              active={view === item.key || focusedKey === item.key}
              colors={colors}
              item={item}
              onPress={() => onPress(item, index)}
              onLongPress={() => onLongPress?.(item, index)}
            />
          ))}
        </View>
      );
    },
  );

export { TabToolbar };
