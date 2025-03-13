import { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { WorkoutPlanDisplay } from "@/components/WorkoutPlanDisplay";
import { useWorkout } from "../../contexts/WorkoutContext";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { generateWorkoutPlan } from "../../assets/services/ai/deepseek";
export default function HomeScreen() {
  const { updateWorkoutData, workoutData } = useWorkout();
  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
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
    try {
      if (!workoutData.goal || !workoutData.level) {
        throw new Error("Missing workout data");
      }
      setShowErrorMessage(false);
      for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          const generatedPlan = await generateWorkoutPlan(workoutData);
          if (generatedPlan) {
            console.log("Generated plan:", generatedPlan);
            setPlan(generatedPlan);
            return;
          }
        } catch (error) {
          console.error(`Attempt ${i + 1} failed:`, error);
          if (i === MAX_RETRIES - 1) {
            throw error;
          }
        }
      }
      throw new Error(
        "Failed to generate workout plan after multiple attempts"
      );
    } catch (error) {
      console.error("Error generating plan:", error);
      setPlan(null);
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.title}> Generate Your Workout!</Text>
        </TouchableOpacity>

        {showErrorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Error generating workout plan. Please try again.
            </Text>
          </View>
        )}
        {loading ? (
          <View>
            <ActivityIndicator
              size="small"
              color="#FFA500"
              style={{ marginTop: 100 }}
            />
            <Text style={styles.loadingText}>Generating workout plan...</Text>
          </View>
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
    fontWeight: "800",
    color: "black",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  generateButton: {
    backgroundColor: "#FFA500",
    width: 200,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderCurve: "continuous",
    alignSelf: "center",
    marginBottom: 30,
    marginTop: 30,
    shadowColor: "#FFA500",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  reactLogo: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  loadingText: {
    color: "#FFA500",
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4405F",
    padding: 20,
    borderRadius: 20,
    borderCurve: "continuous",
    marginTop: 70,
  },
  errorText: {
    color: "white",
    fontSize: 18,
    fontWeight: "300",
    textAlign: "center",

    alignSelf: "center",
    justifyContent: "center",
  },
});
