import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { X } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

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
      <ThemedView style={styles.container}></ThemedView>
    </>
  );
}

const HeaderButton = () => {
  const text = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <ThemedView
      style={{
        marginRight: 15,
        backgroundColor: text + "10",
        padding: 8,
        borderRadius: 50,
      }}
    >
      <X size={14} color={text + "cd"} strokeWidth={2.5} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
