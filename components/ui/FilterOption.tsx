import { useThemeColor } from "@/hooks/useThemeColor";
import React, { ComponentType, useState } from "react";
import { View, StyleSheet, Pressable, LayoutChangeEvent } from "react-native";
import { ThemedText } from "../ThemedText";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SPRING_CONFIG } from "@/constants";
import { FilterItem } from "@/constants/filterConfigs";

type FilterOptionProps = FilterItem & {
  index: number;
  isSelected: boolean;
  onSelect: (value: number) => void;
  handleChange?: (index: number, value: string) => void;
};

export type ChildProps = {
  handleChange: (value: string) => void;
  value: number | string;
};

export type ValueComponentProps = {
  value: number | string;
};

const FilterOption: React.FC<FilterOptionProps> = ({
  index,
  label,
  value,
  valueComponent,
  isSelected,
  onSelect,
  icon,
  valueComponentProps,
  child,
  childProps,
  handleChange,
}) => {
  const backgroundFade = useThemeColor({}, "backgroundFade");
  const foregroundColor = useThemeColor({}, "foreground");
  const text = useThemeColor({}, "text");
  const [pendingUpdate, setPendingUpdate] = useState<string>(value);
  const textFade = useThemeColor({}, "textFade");

  const measuredHeight = useSharedValue(0);

  const onLayout = (event: LayoutChangeEvent) => {
    measuredHeight.value = event.nativeEvent.layout.height;
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(
        isSelected ? measuredHeight.value + 58 + 10 : 58,
        SPRING_CONFIG
      ),
    };
  }, [isSelected]);

  const animatedChildrenStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isSelected ? 1 : 0, {
        duration: 250,
      }),
    };
  }, [isSelected, child]);

  const handlePress = () => {
    if (pendingUpdate && isSelected && handleChange) {
      handleChange(index, pendingUpdate);
    }
    onSelect(index);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: foregroundColor,
        },
        animatedContainerStyle,
      ]}
    >
      <Pressable style={styles.contentContainer} onPress={handlePress}>
        {icon && (
          <View style={styles.iconContainer}>
            {React.createElement(icon, {
              size: 19,
              strokeWidth: 1.9,
              color: textFade,
            })}
          </View>
        )}
        <ThemedText
          style={[
            styles.label,
            {
              color: textFade,
            },
          ]}
          type="default"
        >
          {label}
        </ThemedText>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          {value && valueComponent ? (
            React.createElement(
              valueComponent as ComponentType<ValueComponentProps>,
              {
                ...valueComponentProps,
                value,
              }
            )
          ) : (
            <ThemedText
              style={[
                styles.label,
                {
                  color: value ? text : textFade,
                },
              ]}
              type={"default"}
            >
              {value || `All ${label.toLowerCase()}`}
            </ThemedText>
          )}
        </View>
      </Pressable>
      <View
        style={[
          styles.childrenContainer,
          {
            backgroundColor: backgroundFade,
          },
          animatedChildrenStyle,
        ]}
        onLayout={onLayout}
      >
        {child &&
          React.createElement(child as ComponentType<ChildProps>, {
            ...childProps,
            handleChange: (value: string) => setPendingUpdate(value),
            value,
          })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cover: {},
  container: {
    borderRadius: 14,
    overflow: "hidden",
    // flexGrow: 1,
  },
  selected: {
    // backgroundColor: "#007AFF",
    // height: 150,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    minHeight: 58,
    // flexGrow
  },
  label: {
    fontSize: 14,
    marginLeft: 3,
  },
  selectedText: {
    color: "white",
  },
  iconContainer: {
    marginRight: 4,
  },
  childrenContainer: {
    margin: 5,
    borderRadius: 10,
    minHeight: 120,
    overflow: "hidden",
  },
});

export default FilterOption;
