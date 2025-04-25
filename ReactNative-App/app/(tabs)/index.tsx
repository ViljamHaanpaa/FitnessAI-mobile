import { useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { WorkoutPlanDisplay } from "@/components/WorkoutPlanDisplay";
import { useWorkout } from "../../contexts/WorkoutContext";
import { generateWorkoutPlan } from "../../assets/services/ai/deepseek";
import { WORKOUT_FOCUS_OPTIONS } from "../../assets/data/workouts/focusOptions";
import { WorkoutData, WorkoutGoal } from "@/types/workout";
export default function HomeScreen() {
  const { updateWorkoutData, workoutData } = useWorkout();

  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showWorkoutPlan, setShowWorkoutPlan] = useState(false);
  const getCurrentFocusOptions = () => {
    if (!workoutData.goal) return [];
    console.log(
      "Current focus options:",
      workoutData.goal,
      WORKOUT_FOCUS_OPTIONS[workoutData.goal as WorkoutGoal] || []
    );
    return WORKOUT_FOCUS_OPTIONS[workoutData.goal as WorkoutGoal] || [];
  };
  let MAX_RETRIES = 3;

  const generatePlan = async () => {
    setShowWorkoutPlan(true);
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
    <SafeAreaView style={{ flex: 1 }}>
      {!showWorkoutPlan ? (
        <>
          <Image
            source={require("../../assets/images/background2.png")}
            style={styles.backgroundImage}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              What would you like to{" "}
              <Text style={{ color: "#FFA31A" }}>focus on</Text> today?
            </Text>
            <Text style={styles.titleDescription}>
              Tell us what you're training today and we'll generate{" "}
              <Text style={{ color: "#FFA31A" }}>a perfect workout.</Text>
            </Text>
          </View>
          <View style={styles.optionsContainer}>
            {getCurrentFocusOptions().map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  workoutData.focus === option.title && styles.selectedButton,
                ]}
                onPress={() => updateWorkoutData({ focus: option.title })}
              >
                <Text
                  style={[
                    styles.optionText,
                    workoutData.focus === option.title && styles.selectedText,
                  ]}
                >
                  {option.title}
                </Text>
                {option.image && (
                  <Image
                    source={option.image}
                    style={[styles.focusImage, { marginTop: 5 }]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => {
              generatePlan();
            }}
            style={styles.generateButton}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttontitle}> Generate Your Workout!</Text>
              <Icon name="chevron-right" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <>
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
        </>
      )}
      {showErrorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error generating workout plan. Please try again.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignSelf: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 290,
  },
  optionButton: {
    backgroundColor: "#1E2022",
    padding: 15,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#FFA31A",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  selectedText: {
    color: "#000000",
    fontWeight: "600",
  },
  titleDescription: {
    fontSize: 18,
    top: 10,
    color: "#FFFFFF",
    textAlign: "left",
    width: 290,
    fontWeight: 300,
    lineHeight: 25,
  },
  backgroundImage: {
    width: "100%",
    height: "110%",
    position: "absolute",
    resizeMode: "cover",
  },
  buttontitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: 600,
    textAlign: "left",
    paddingLeft: 20,
  },
  title: {
    fontSize: 35,
    color: "#FFFFFF",
    textAlign: "left",
    width: 350,
    fontWeight: 400,
    letterSpacing: 1,
    lineHeight: 40,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  generateButton: {
    backgroundColor: "#FFA31A",
    width: 320,
    height: 75,
    bottom: 100,
    alignSelf: "center",
    position: "absolute",
    borderRadius: 20,
    borderCurve: "continuous",
    justifyContent: "center",
    shadowColor: "#FFA31A",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  focusImage: {
    resizeMode: "cover",
    width: 100,
    height: 100,
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
