import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { WorkoutPlan } from "@/types/workout";
import colors from "@/styles/colors";
import Icon from "@expo/vector-icons/FontAwesome";
import { useWorkout } from "@/contexts/WorkoutContext";
import { router } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
export const WorkoutPlanDisplay = ({ plan }: { plan: WorkoutPlan | null }) => {
  const { updateWorkoutData, workoutData } = useWorkout();
  if (!plan) return null;

  const startWorkout = () => {
    console.log("Start Workout pressed");
    updateWorkoutData({
      workoutGenerated: true,
      currentWorkoutPlan: plan,
    });
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Warmup ({Math.round(Number(plan.warmup.duration) / 60)} min)
        </Text>
        {plan.warmup.exercises.map((exercise, index) => (
          <View key={index} style={styles.exercise}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDuration}>
              {Math.round(Number(exercise.duration) / 60)} min
            </Text>
            <Text style={styles.exerciseDescription}>
              {exercise.description}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Main Workout ({Math.round(Number(plan.mainWorkout.duration) / 60)}{" "}
          min)
        </Text>
        {plan.mainWorkout.exercises.map((exercise, index) => (
          <View key={index} style={styles.exercise}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDuration}>
              Sets: {exercise.sets} | Reps: {exercise.reps} | Rest:{" "}
              {Math.round(Number(exercise.rest) / 60)} min
            </Text>
            <Text style={styles.exerciseDescription}>
              {exercise.description}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Cooldown ({Math.round(Number(plan.cooldown.duration) / 60)} min)
        </Text>
        {plan.cooldown.stretches.map((stretch, index) => (
          <View key={index} style={styles.exercise}>
            <Text style={styles.exerciseName}>{stretch.name}</Text>
            <Text style={styles.exerciseDuration}>
              {Math.round(Number(stretch.duration) / 60)} min
            </Text>
            <Text style={styles.exerciseDescription}>
              {stretch.description}
            </Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.generateButton} onPress={startWorkout}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttontitle}> Use this Workout</Text>
          <Icon name="chevron-right" size={20} color={colors.highlight} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 30,
  },

  Headersection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  section: {
    gap: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  exercise: {
    padding: 12,
    backgroundColor: colors.tertiary,
    gap: 4,
    borderRadius: 20,
    borderCurve: "continuous",
  },
  exerciseDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "300",
  },
  exerciseDuration: {
    color: "#FFA500",
    fontSize: 14,
    fontWeight: "400",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  saveButton: {
    bottom: 20,
    left: 10,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 290,
  },
  buttontitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: 600,
    textAlign: "left",
    paddingLeft: 20,
  },
  generateButton: {
    backgroundColor: colors.primary,
    width: 320,
    height: 75,
    alignSelf: "center",

    borderRadius: 20,
    borderCurve: "continuous",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
});
