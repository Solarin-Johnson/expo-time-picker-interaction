import { useThemeColor } from "@/hooks/useThemeColor";
import { LucideProps } from "lucide-react-native";
import React, { ComponentType } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "../ThemedText";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SPRING_CONFIG } from "@/constants";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type FilterOptionProps = {
  index: number;
  icon: ComponentType<LucideProps>;
  label: string;
  value: string;
  valueComponent?: React.ReactNode;
  isSelected: boolean;
  onSelect: (value: number) => void;
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
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const foregroundColor = useThemeColor({}, "foreground");
  const text = useThemeColor({}, "text");
  const textFade = useThemeColor({}, "textFade");

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(isSelected ? 248 : 58, SPRING_CONFIG),
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
              size: 18,
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
        >
          {label}
        </ThemedText>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          {valueComponent ?? (
            <ThemedText
              style={[
                styles.label,
                {
                  color: value ? text : textFade,
                },
              ]}
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
            backgroundColor,
          },
          animatedChildrenStyle,
        ]}
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
    height: 180,
  },
});

export default FilterOption;
