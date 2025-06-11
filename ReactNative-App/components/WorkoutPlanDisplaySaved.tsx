import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { WorkoutPlan } from "@/types/workout";
import colors from "@/styles/colors";
export const WorkoutPlanDisplay = ({ plan }: { plan: WorkoutPlan | null }) => {
  if (!plan) return null;

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
    marginTop: 30,
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
});
