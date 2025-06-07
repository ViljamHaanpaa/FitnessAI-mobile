import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, usePathname } from "expo-router";
import { useWorkout } from "../../contexts/WorkoutContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
export default function TabLayout() {
  const { workoutData } = useWorkout();
  const colorScheme = useColorScheme();
  const [playPressedOnce, setPlayPressedOnce] = useState(false);
  const shadowRadius = useSharedValue(20);
  const pathname = usePathname();
  const animatedShadowStyle = useAnimatedStyle(() => ({
    shadowRadius: shadowRadius.value,
  }));

  // 3. Start breathing animation on mount
  React.useEffect(() => {
    shadowRadius.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1200 }),
        withTiming(7, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);
  const handlePlayPress = () => {
    if (workoutData.workoutGenerated) {
      if (pathname === "/") {
        // If already on index, go straight to WorkoutSessionScreen
        router.push("/WorkoutSessionScreen");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            height: 80,
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="Profile"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={35}
              name="person.fill"
              color={color}
              style={{ marginTop: 10 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) =>
            !workoutData.workoutGenerated ? (
              <IconSymbol
                size={65}
                name="plus.circle.fill"
                color={focused ? "#FFA500" : color}
              />
            ) : (
              <TouchableOpacity onPress={handlePlayPress}>
                <Animated.View
                  style={[
                    {
                      shadowColor: "#00FF66",
                      shadowOpacity: focused ? 0.7 : 0.0,
                      borderRadius: 0,
                      shadowOffset: { width: 0, height: 0 },
                    },
                    animatedShadowStyle,
                  ]}
                >
                  <IconSymbol
                    size={75}
                    name="play.circle.fill"
                    color={focused ? "#00FF66" : "#006633"}
                  />
                </Animated.View>
              </TouchableOpacity>
            ),
        }}
      />

      <Tabs.Screen
        name="SavedWorkouts"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={35}
              name="bookmark.fill"
              color={color}
              style={{ marginTop: 10 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
