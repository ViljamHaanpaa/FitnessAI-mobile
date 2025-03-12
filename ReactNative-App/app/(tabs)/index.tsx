import { useState, useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { WorkoutPlanDisplay } from "@/components/WorkoutPlanDisplay";
import { useWorkout } from "../../contexts/WorkoutContext";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { generateWorkoutPlan } from "../../assets/services/ai/deepseek";
export default function HomeScreen() {
  const { updateWorkoutData, workoutData } = useWorkout();
  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
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
  let MAX_RETRIES = 3;
  const generatePlan = async () => {
    setLoading(true);
    if (!workoutData.goal || !workoutData.level) return;

    for (let i = 0; i < MAX_RETRIES; i++) {
      const generatedPlan = await generateWorkoutPlan(workoutData);

      if (generatedPlan) {
        console.log("Generated plan:", generatedPlan);
        setPlan(generatedPlan);
        setLoading(false);
        return;
      } else {
        console.log(`Attempt ${i + 1} failed. Retrying...`);
      }
    }
    setLoading(false);
    console.log("Failed to generate workout plan after multiple attempts.");
  };

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "black", dark: "black" }}
        headerImage={
          <Image
            source={require("@/assets/images/background.jpg")}
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
          <Text style={styles.title}> Generate your workout!</Text>
        </TouchableOpacity>

        {loading ? (
          <Text style={styles.loadingText}>Generating workout plan...</Text>
        ) : (
          <WorkoutPlanDisplay plan={plan} />
        )}
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "400",
    color: "#FFFFFF",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  generateButton: {
    backgroundColor: "black",
    width: 200,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderCurve: "continuous",
    alignSelf: "center",
    marginBottom: 30,
    marginTop: 30,
  },
  reactLogo: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
