import { useThemeColor } from "@/hooks/useThemeColor";
import { LucideProps } from "lucide-react-native";
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

type FilterOptionProps = {
  index: number;
  icon?: ComponentType<LucideProps>;
  label: string;
  value?: string;
  valueComponent?: ComponentType;
  valueComponentProps?: Record<string, any>;
  isSelected: boolean;
  onSelect: (value: number) => void;
  handleChange?: (index: number, value: string) => void;
  children?: React.ReactNode;
};

const FilterOption: React.FC<FilterOptionProps> = ({
  index,
  label,
  value,
  valueComponent,
  isSelected,
  onSelect,
  icon,
  children,
  valueComponentProps,
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const foregroundColor = useThemeColor({}, "foreground");
  const text = useThemeColor({}, "text");
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
  }, [isSelected, children]);

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
      <Pressable
        style={styles.contentContainer}
        onPress={() => onSelect(index)}
      >
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
          type="subtitle"
        >
          {label}
        </ThemedText>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          {value && valueComponent ? (
            React.createElement(valueComponent, valueComponentProps)
          ) : (
            <ThemedText
              style={[
                styles.label,
                {
                  color: value ? text : textFade,
                },
              ]}
              type={value ? "default" : "subtitle"}
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
            backgroundColor: backgroundColor + "99",
          },
          animatedChildrenStyle,
        ]}
        onLayout={onLayout}
      >
        {children}
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
    height: 120,
  },
});

export default FilterOption;
