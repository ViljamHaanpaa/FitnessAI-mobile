import { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";

import { useWorkout } from "../../contexts/WorkoutContext";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { generateWorkoutPlan } from "../../assets/services/ai/deepseek";
export default function HomeScreen() {
  const { updateWorkoutData, workoutData } = useWorkout();
  const [plan, setPlan] = useState<any | null>(null);

  const handleSetFields = () => {
    updateWorkoutData({
      gender: "male",
      goal: "Build Muscle Workout",
      level: "advanced Level",
      duration: "45",
      equipment: "full_gym",
    });
  };
  useEffect(() => {
    handleSetFields();
  }, []);

  const generatePlan = async () => {
    if (!workoutData.goal || !workoutData.level) return;

    for (let i = 0; i < MAX_RETRIES; i++) {
      const generatedPlan = await generateWorkoutPlan(workoutData);

      if (generatedPlan) {
        console.log("Generated plan:", generatedPlan);
        setPlan(generatedPlan);

        return;
      } else {
        console.log(`Attempt ${i + 1} failed. Retrying...`);
      }
    }

    console.log("Failed to generate workout plan after multiple attempts.");
  };

  let MAX_RETRIES = 3;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <TouchableOpacity
        onPress={() => {
          generatePlan();
        }}
        style={styles.generateButton}
      >
        <Text> jemppaisen konne</Text>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  generateButton: {
    backgroundColor: "#FFD700",
    padding: 100,
    borderRadius: 600,
    alignSelf: "center",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
