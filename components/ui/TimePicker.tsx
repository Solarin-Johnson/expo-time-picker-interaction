import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ChildProps } from "./FilterOption";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CircleCheck } from "lucide-react-native";
import { MINUTES, minutesTo12HourFormat, SPRING_CONFIG } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import Clock from "./Clock";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const options = ["Single time", "Time range"];
const TIME_VIEW_HEIGHT = 42;
const VIEWABLE_LENGTH = 4.5;

export default function TimePicker({ handleChange, value }: ChildProps) {
  const scrollY = useSharedValue(Number(value));

  const derivedMinutes = useDerivedValue(() => {
    return Math.round(((scrollY.value / TIME_VIEW_HEIGHT) * 30) / 30) * 30;
  });

  useAnimatedReaction(
    () => derivedMinutes.value,
    (value) => runOnJS(handleChange)(value.toString())
  );

  return (
    <View style={styles.container}>
      <TimeSelectPane />
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          padding: 16,
          paddingTop: 0,
        }}
      >
        <Clock timeInMinutes={derivedMinutes} />
        <TimeSelector scrollY={scrollY} value={value} />
      </View>
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
          color: "#ffffff04",
          borderless: true,
        }}
        onPress={onSelect}
      >
        {isSelected && (
          <Animated.View style={checkAnimationStyle}>
            <CircleCheck color={accent} size={16} />
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

const TimeSelector = ({
  scrollY,
  value,
}: {
  scrollY: SharedValue<number>;
  value: string | number;
}) => {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const bgFade = useThemeColor({}, "backgroundFade");

  const handleSnap = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  // const scrollToPosition = (y: number) => {
  //   scrollRef.current?.scrollTo({ y, animated: true });
  // };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: (scrollY.value * TIME_VIEW_HEIGHT) / 30,
      animated: false,
    });
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingVertical:
            (TIME_VIEW_HEIGHT * VIEWABLE_LENGTH) / 2 -
            (TIME_VIEW_HEIGHT / VIEWABLE_LENGTH) * 2.5,
          paddingHorizontal: 12,
        }}
        style={styles.timeSelector}
        showsVerticalScrollIndicator={false}
        snapToInterval={TIME_VIEW_HEIGHT}
        nestedScrollEnabled={true}
        onMomentumScrollEnd={handleSnap}
      >
        {MINUTES.map((minute, index) => (
          <TimeView key={index} item={minute.toString()} />
        ))}
      </Animated.ScrollView>
      <LinearGradient
        colors={[
          bgFade,
          bgFade + "cd",
          "transparent",
          "transparent",
          bgFade + "cd",
          bgFade,
        ]}
        style={styles.overlay}
      />
    </View>
  );
};

const TimeView = ({ item }: { item: string }) => {
  return (
    <View
      style={{
        height: TIME_VIEW_HEIGHT,
        justifyContent: "center",
      }}
    >
      <ThemedText style={{ textAlign: "center" }} type="large">
        {minutesTo12HourFormat(parseInt(item))}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: "auto",
    flexGrow: 1,
    justifyContent: "flex-start",
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
  timeSelector: {
    maxHeight: TIME_VIEW_HEIGHT * VIEWABLE_LENGTH,
    // height: 250,
    // maxHeight: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
});
