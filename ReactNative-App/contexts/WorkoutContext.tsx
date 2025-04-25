import { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutPlan, WorkoutData } from "@/types/workout";

interface WorkoutContextType {
  workoutData: WorkoutData;
  updateWorkoutData: (data: Partial<WorkoutData>) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const SaveWorkout = async (plan: WorkoutPlan) => {
  try {
    // Get existing workouts
    const savedWorkoutsString = await AsyncStorage.getItem("SavedWorkouts");
    let savedWorkouts: WorkoutPlan[] = [];

    if (savedWorkoutsString) {
      // Parse existing workouts if any
      savedWorkouts = JSON.parse(savedWorkoutsString);
      // Ensure it's an array
      if (!Array.isArray(savedWorkouts)) {
        savedWorkouts = [savedWorkouts];
      }
    }

    // Add new workout to array
    savedWorkouts.push(plan);

    // Save updated array back to storage
    await AsyncStorage.setItem("SavedWorkouts", JSON.stringify(savedWorkouts));
    console.log("Workout saved successfully");
  } catch (error) {
    console.error("Error saving workout:", error);
    throw error;
  }
};

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    gender: "",
    goal: "",
    level: "",
    duration: "",
    equipment: "",
    focus: "",
  });

  const updateWorkoutData = (newData: Partial<WorkoutData>) => {
    setWorkoutData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <WorkoutContext.Provider value={{ workoutData, updateWorkoutData }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};
