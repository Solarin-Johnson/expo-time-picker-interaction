import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import * as NavigationBar from "expo-navigation-bar";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Head from "expo-router/head";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
    InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
    InterBold: require("../assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    const setNavBar = async () => {
      try {
        if (Platform.OS === "android") {
          await SplashScreen.preventAutoHideAsync();
          await NavigationBar.setPositionAsync("absolute");
          await NavigationBar.setBackgroundColorAsync("#00000000");
        }
      } catch (e) {
        console.warn("Error setting navigation bar:", e);
      } finally {
        if (loaded) {
          await SplashScreen.hideAsync();
        }
      }
    };

    setNavBar();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Head>
        <meta data-rh="true" name="color-scheme" content="light dark" />
      </Head>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Filters",
              headerTitleStyle: { fontFamily: "InterSemiBold" },
              headerTitleAlign: "center",
              headerShadowVisible: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
