import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useWorkout } from "../contexts/WorkoutContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function IndexPage() {
  const { workoutData } = useWorkout();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const savedData = await AsyncStorage.getItem("workoutData");
        setIsFirstLaunch(!savedData);
      } catch (error) {
        console.error("Error checking first launch:", error);
        setIsFirstLaunch(true);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    // Still loading
    return null;
  }

  return isFirstLaunch ? (
    <Redirect href="/intro" />
  ) : (
    <Redirect href="/(tabs)" />
  );
}
