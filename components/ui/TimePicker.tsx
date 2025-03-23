import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ChildProps } from "./FilterOption";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CircleCheck } from "lucide-react-native";
import { SPRING_CONFIG } from "@/constants";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const options = ["Single time", "Time range"];

export default function TimePicker({ handleChange }: ChildProps) {
  return (
    <View style={styles.container}>
      <TimeSelectPane />
      <Text>TimePicker</Text>
    </View>
  );
}

const TimeSelectPane = () => {
  const [selected, setSelected] = useState<number | null>(0);

  const handleSelect = (index: number) => {
    setSelected(index);
  };

  return (
    <View style={styles.pane}>
      {options.map((value, i) => (
        <Selector
          key={i}
          label={value}
          isSelected={selected === i}
          onSelect={() => handleSelect(i)}
        />
      ))}
    </View>
  );
};

type SelectorProps = {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
};

const Selector: React.FC<SelectorProps> = ({ label, onSelect, isSelected }) => {
  const accent = useThemeColor({}, "accent");
  const foreground = useThemeColor({}, "foreground");

  const checkAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isSelected ? 1 : 0, SPRING_CONFIG),
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.selectorCover,
        {
          borderColor: foreground,
        },
      ]}
    >
      <Pressable
        style={styles.selector}
        android_ripple={{
          color: "#ffffff08",
        }}
        onPress={onSelect}
      >
        {isSelected && (
          <Animated.View style={checkAnimationStyle}>
            <CircleCheck color={foreground} size={16} fill={accent} />
          </Animated.View>
        )}

        <ThemedText
          type="subtitle"
          style={{
            fontSize: 14,
            pointerEvents: "none",
            paddingHorizontal: 5,
            opacity: 0.9,
          }}
        >
          {label}
        </ThemedText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
  },
  pane: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
  },
  selectorCover: {
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
  },
  selector: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
    alignItems: "center",
  },
});
