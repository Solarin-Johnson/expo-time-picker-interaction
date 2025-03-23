import React from "react";
import { View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  SharedValue,
  withSpring,
} from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SPRING_CONFIG_BOUNCE } from "@/constants";

const RADIUS = 70;
const CENTER = RADIUS + 10;
const CENTER_CIRCLE_SIZE = 8;
const CLOCK_NUMBER_OFFSET = 10;

const HOUR_HAND_LENGTH = 30;
const MINUTE_HAND_LENGTH = 50;

const HOUR_HAND_WIDTH = 3.5;
const MINUTE_HAND_WIDTH = 1.8;

const HOUR_HAND_TRANSLATE_Y = 15;
const MINUTE_HAND_TRANSLATE_Y = 25;

interface ClockProps {
  timeInMinutes: SharedValue<number>;
}

const Clock: React.FC<ClockProps> = ({ timeInMinutes }) => {
  const hourAngle = useDerivedValue(() => {
    return ((timeInMinutes.value % 720) / 720) * 360;
  });

  const minuteAngle = useDerivedValue(() => {
    return (timeInMinutes.value % 60) * 6;
  });

  const hourHandStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: HOUR_HAND_TRANSLATE_Y },
        { rotate: withSpring(`${hourAngle.value}deg`, SPRING_CONFIG_BOUNCE) },
        { translateY: -HOUR_HAND_TRANSLATE_Y },
      ],
    };
  });

  const minuteHandStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: MINUTE_HAND_TRANSLATE_Y },
        { rotate: withSpring(`${minuteAngle.value}deg`, SPRING_CONFIG_BOUNCE) },
        { translateY: -MINUTE_HAND_TRANSLATE_Y },
      ],
    };
  });

  const foreground = useThemeColor({}, "foreground");
  const textFade = useThemeColor({}, "textFade");
  const text = useThemeColor({}, "text");

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={CENTER * 2} height={CENTER * 2}>
        {/* Clock Face */}
        <Circle cx={CENTER} cy={CENTER} r={RADIUS} fill={foreground} />

        {/* Clock numbers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = CENTER + Math.sin(angle) * (RADIUS - CLOCK_NUMBER_OFFSET);
          const y = CENTER - Math.cos(angle) * (RADIUS - CLOCK_NUMBER_OFFSET);
          return (
            <Line
              key={i}
              x1={CENTER}
              y1={CENTER - RADIUS + 8}
              x2={CENTER}
              y2={CENTER - RADIUS + 17}
              stroke={textFade}
              opacity={0.25}
              strokeWidth={1.8}
              transform={`rotate(${i * 30}, ${CENTER}, ${CENTER})`}
            />
          );
        })}
      </Svg>

      {/* Hour Hand */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: HOUR_HAND_WIDTH,
            height: HOUR_HAND_LENGTH,
            backgroundColor: text,
            top: CENTER / 2 + 10,
            left: CENTER - HOUR_HAND_WIDTH / 2,
            borderRadius: 3,
            zIndex: 1,
          },
          hourHandStyle,
        ]}
      />

      {/* Minute Hand */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: MINUTE_HAND_WIDTH,
            height: MINUTE_HAND_LENGTH,
            backgroundColor: text,
            top: CENTER / 2 - 10,
            left: CENTER - MINUTE_HAND_WIDTH / 2,
            opacity: 0.8,
            borderRadius: 2,
            zIndex: 2,
          },
          minuteHandStyle,
        ]}
      />

      {/* Center Circle (on top of hands) */}
      <View
        style={{
          position: "absolute",
          width: CENTER_CIRCLE_SIZE,
          height: CENTER_CIRCLE_SIZE,
          backgroundColor: text,
          borderRadius: CENTER_CIRCLE_SIZE / 2,
          top: CENTER - CENTER_CIRCLE_SIZE / 2,
          left: CENTER - CENTER_CIRCLE_SIZE / 2,
          zIndex: 3,
        }}
      />
    </View>
  );
};

export default Clock;
