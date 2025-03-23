import React, { useEffect } from "react";
import TimeFlow from "./TimeFlow";
import { runOnUI, useSharedValue } from "react-native-reanimated";

interface TimeValueProps {
  value?: number;
}

export const TimeValue: React.FC<TimeValueProps> = ({ value = 0 }) => {
  const minutes = useSharedValue(0);
  useEffect(() => {
    runOnUI(() => {
      minutes.value = value;
    })();
  }, [value]);
  return <TimeFlow minutes={minutes} />;
};
