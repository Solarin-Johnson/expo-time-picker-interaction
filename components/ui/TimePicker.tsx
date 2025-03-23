import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ChildProps } from "./FilterOption";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CircleCheck } from "lucide-react-native";
import { MINUTES, minutesTo12HourFormat } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import Clock from "./Clock";

const isWeb = Platform.OS === "web";

const options = ["Single time", "Time range"];
const TIME_VIEW_HEIGHT = 36;
const VIEWABLE_LENGTH = 4.5;

export default function TimePicker({ handleChange, value }: ChildProps) {
  const scrollY = useSharedValue(Number(value));

  const derivedMinutes = useDerivedValue(() => {
    return Math.round(scrollY.value / 30) * 30;
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
          padding: 12,
          paddingBottom: 16,
          paddingTop: 0,
        }}
      >
        <Clock timeInMinutes={derivedMinutes} />
        <TimeSelector scrollY={scrollY} />
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
        {isSelected && <CircleCheck color={accent} size={16} />}

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

const TimeSelector = ({ scrollY }: { scrollY: SharedValue<number> }) => {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const bgFade = useThemeColor({}, "backgroundFade");

  const isScrolling = useRef(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onMomentumEnd: (event) => {
      scrollY.value = Math.round(event.contentOffset.y / TIME_VIEW_HEIGHT) * 30;
      isScrolling.current = false;
    },
    onScroll: (event) => {
      if (isWeb) {
        if (!isScrolling.current) {
          isScrolling.current = true;
          scrollY.value = event.contentOffset.y;
        }

        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(() => {
          scrollY.value =
            Math.round(event.contentOffset.y / TIME_VIEW_HEIGHT) * 30;
        }, 50);
      }
    },
  });

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
            (TIME_VIEW_HEIGHT / 2) * (VIEWABLE_LENGTH - 5 / VIEWABLE_LENGTH),
          paddingHorizontal: 12,
        }}
        style={styles.timeSelector}
        showsVerticalScrollIndicator={false}
        snapToInterval={TIME_VIEW_HEIGHT}
        nestedScrollEnabled={true}
        decelerationRate="normal"
        onScroll={scrollHandler}
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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
});
