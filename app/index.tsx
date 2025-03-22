import { Stack } from "expo-router";
import { PixelRatio, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { X } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { allFilters } from "@/constants";
import FilterOption from "@/components/ui/FilterOption";
import { useState } from "react";

export default function Index() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <>
      <Stack.Screen
        options={{
          title: "Filters",
          headerRight: () => <HeaderButton />,
          headerTitleStyle: { fontFamily: "InterSemiBold" },
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor },
        }}
      />
      <ThemedView style={styles.container}>
        <Filter />
      </ThemedView>
    </>
  );
}

const Filter = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelected((prev) => (prev === index ? null : index));
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        maxWidth: 540,
        gap: 12,
        padding: PixelRatio.getPixelSizeForLayoutSize(10),
      }}
    >
      {allFilters.map((filter, i) => (
        <FilterOption
          index={i}
          key={i}
          {...filter}
          isSelected={selected === i}
          onSelect={handleSelect}
        />
      ))}
    </View>
  );
};

const HeaderButton = () => {
  const textFade = useThemeColor({}, "textFade");
  const backgroundColor = useThemeColor({}, "foreground");

  return (
    <TouchableOpacity activeOpacity={0.5}>
      <ThemedView
        style={{
          marginRight: 15,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
