import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
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
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={65}
              name="plus.circle.fill"
              color={focused ? "#FFA500" : color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="SavedWorkouts"
        options={{
          title: "",
          tabBarIcon: ({ color, style }) => (
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
