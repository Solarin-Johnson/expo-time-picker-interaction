import { Stack } from "expo-router";
import {
  PixelRatio,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { X } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import FilterOption from "@/components/ui/FilterOption";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { allFilters } from "@/constants/filterConfigs";

export default function Index() {
  const backgroundColor = useThemeColor({}, "background");
  const [filters, setFilters] = useState(allFilters);
  const props = { ...{ filters, setFilters } };
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => <HeaderButton />,
          headerStyle: { backgroundColor },
        }}
      />
      <ThemedView style={styles.container}>
        <Filter {...props} />
        <FilterBar {...props} />
      </ThemedView>
    </>
  );
}

interface FilterProps {
  filters: typeof allFilters;
  setFilters: React.Dispatch<React.SetStateAction<typeof allFilters>>;
}

const Filter = ({ filters, setFilters }: FilterProps) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelected((prev) => (prev === index ? null : index));
  };

  const handleChange = (index: number, value: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter, i) =>
        i === index ? { ...filter, value } : filter
      )
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, width: "100%", maxWidth: 540, alignSelf: "center" }}
      contentContainerStyle={{
        gap: 12,
        padding: PixelRatio.getPixelSizeForLayoutSize(9),
        width: "100%",
      }}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {filters.map((filter, i) => (
        <FilterOption
          index={i}
          key={i}
          {...filter}
          isSelected={selected === i}
          onSelect={handleSelect}
          handleChange={handleChange}
          selected={selected}
        />
      ))}
    </ScrollView>
  );
};

const HeaderButton = () => {
  const textFade = useThemeColor({}, "textFade");
  const backgroundColor = useThemeColor({}, "foreground");

  return (
    <TouchableOpacity activeOpacity={0.5}>
      <ThemedView
        style={{
          marginRight: 8,
          backgroundColor,
          padding: 8,
          borderRadius: 50,
        }}
      >
        <X size={15} color={textFade} strokeWidth={3} />
      </ThemedView>
    </TouchableOpacity>
  );
};

const FilterBar = ({ setFilters }: FilterProps) => {
  const { bottom } = useSafeAreaInsets();
  const text = useThemeColor({}, "textFade");
  const accent = useThemeColor({}, "accent");

  const handleReset = () => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) => ({ ...filter, value: "" }))
    );
  };

  const handleApply = () => {
    setFilters(allFilters);
  };

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: bottom + 10,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.button]}
        activeOpacity={0.7}
        onPress={handleReset}
      >
        <ThemedText
          style={{
            color: text,
          }}
          type="subtitle"
        >
          Reset all
        </ThemedText>
      </TouchableOpacity>
      <View style={styles.buttonCover}>
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: accent,
              paddingHorizontal: 26,
            },
          ]}
          android_ripple={{
            color: "rgba(255, 255, 255, 0.1)",
          }}
          onPress={handleApply}
        >
          <ThemedText style={{ color: "white" }} type="subtitle">
            Apply Filters
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  bar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: PixelRatio.getPixelSizeForLayoutSize(9),
    paddingVertical: 10,
    maxWidth: 540,
  },
  buttonCover: {
    borderRadius: 50,
    overflow: "hidden",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    // backgroundColor: "red",
  },
});
