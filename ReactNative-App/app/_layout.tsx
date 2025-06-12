import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // reset AsyncStorage for development purposes
  //useEffect(() => {
  //  const resetAsyncStorage = async () => {
  //    await AsyncStorage.clear();
  //  };
  //  resetAsyncStorage();
  //}, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <WorkoutProvider>
        <Slot />
      </WorkoutProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
