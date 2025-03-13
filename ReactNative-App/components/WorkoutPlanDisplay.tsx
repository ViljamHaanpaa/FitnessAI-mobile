import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  rest?: string;
  duration?: string;
  description: string;
}

interface WorkoutPlan {
  title: string;
  duration: string;
  warmup: {
    duration: string;
    exercises: Exercise[];
  };
  mainWorkout: {
    duration: string;
    exercises: Exercise[];
  };
  cooldown: {
    duration: string;
    stretches: Exercise[];
  };
}

export const WorkoutPlanDisplay = ({ plan }: { plan: WorkoutPlan | null }) => {
  if (!plan) return null;

  return (
    <View style={styles.container}>
      <View style={styles.Headersection}>
        <Text style={styles.title}>{plan.title}</Text>
        <TouchableOpacity onPress={() => {}} style={styles.saveButton}>
          <Icon name="plus-circle" size={30} color="#FFA500" />
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Warmup ({plan.warmup.duration})</Text>
        {plan.warmup.exercises.map((exercise, index) => (
          <View key={index} style={styles.exercise}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
            <Text style={styles.exerciseDescription}>
              {exercise.description}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Main Workout ({plan.mainWorkout.duration})
        </Text>
        {plan.mainWorkout.exercises.map((exercise, index) => (
          <View key={index} style={styles.exercise}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDuration}>
              Sets: {exercise.sets} | Reps: {exercise.reps} | Rest:{" "}
              {exercise.rest}
            </Text>
            <Text style={styles.exerciseDescription}>
              {exercise.description}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Cooldown ({plan.cooldown.duration}) min
        </Text>
        {plan.cooldown.stretches.map((stretch, index) => (
          <View key={index} style={styles.exercise}>
            <Text style={styles.exerciseName}>{stretch.name}</Text>
            <Text style={styles.exerciseDuration}>{stretch.duration}</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 16,
    color: "#FFFFFF",
    alignSelf: "center",
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
    color: "#FFA500",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  exercise: {
    padding: 12,
    backgroundColor: "#3b3b3b",

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
