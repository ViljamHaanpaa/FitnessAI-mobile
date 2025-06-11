import React from "react";
import { Alert } from "react-native";
import { router, usePathname } from "expo-router";
export const StartWorkoutAlert = () => {
  Alert.alert(
    "Start Workout?",
    "Would you like to begin your workout session now?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Start",
        onPress: () => router.push("/WorkoutSessionScreen"),
      },
    ],
    { cancelable: true }
  );
};
