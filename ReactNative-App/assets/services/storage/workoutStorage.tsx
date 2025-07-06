import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutPlan } from "@/types/workout";

export const fetchSavedWorkouts = async (): Promise<WorkoutPlan[]> => {
  try {
    const workouts = await AsyncStorage.getItem("SavedWorkouts");
    if (workouts) {
      const parsedWorkouts: WorkoutPlan[] = JSON.parse(workouts);
      return Array.isArray(parsedWorkouts) ? parsedWorkouts : [parsedWorkouts];
    }
    return [];
  } catch (error) {
    console.error("Error fetching saved workouts:", error);
    return [];
  }
};

export const fetchCompletedWorkouts = async (): Promise<WorkoutPlan[]> => {
  try {
    const workouts = await AsyncStorage.getItem("CompletedWorkouts");
    if (workouts) {
      const parsedWorkouts: WorkoutPlan[] = JSON.parse(workouts);
      return Array.isArray(parsedWorkouts) ? parsedWorkouts : [parsedWorkouts];
    }
    return [];
  } catch (error) {
    console.error("Error fetching completed workouts:", error);
    return [];
  }
};
