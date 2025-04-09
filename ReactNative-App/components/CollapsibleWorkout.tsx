import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { WorkoutPlan } from "@/types/workout";
import Icon from "@expo/vector-icons/FontAwesome";
import { WorkoutPlanDisplay } from "@/components/WorkoutPlanDisplaySaved";

interface CollapsibleWorkoutProps {
  workout: WorkoutPlan;
}

export const CollapsibleWorkout = ({ workout }: CollapsibleWorkoutProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Ei päivämäärää";
    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString("fi-FI", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("fi-FI", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${formattedDate} ${formattedTime}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Virheellinen päivämäärä";
    }
  };

  return (
    <View>
      <Text style={styles.date}>{formatDate(workout.timestamp)}</Text>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{workout.title}</Text>
          <Icon
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#FFA500"
          />
        </View>

        {isExpanded && <WorkoutPlanDisplay plan={workout} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#101213",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  date: {
    color: "#808080",
    fontSize: 14,
    marginBottom: 8,
  },
});
