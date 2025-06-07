import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutPlan, WorkoutData } from "@/types/workout";

interface WorkoutContextType {
  workoutData: WorkoutData;
  updateWorkoutData: (data: Partial<WorkoutData>) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const SaveCompletedWorkout = async (plan: WorkoutPlan) => {
  try {
    const completedWorkoutsString = await AsyncStorage.getItem(
      "CompletedWorkouts"
    );
    let completedWorkouts: WorkoutPlan[] = [];
    if (completedWorkoutsString) {
      completedWorkouts = JSON.parse(completedWorkoutsString);
      if (!Array.isArray(completedWorkouts)) {
        completedWorkouts = [completedWorkouts];
      }
    }
    completedWorkouts.push({
      ...plan,
    });
    await AsyncStorage.setItem(
      "CompletedWorkouts",
      JSON.stringify(
        completedWorkouts.map((p, idx) =>
          idx === completedWorkouts.length - 1
            ? { ...p, completedAt: new Date().toISOString() }
            : p
        )
      )
    );
    await AsyncStorage.setItem(
      "CompletedWorkouts",
      JSON.stringify(completedWorkouts)
    );
  } catch (error) {
    console.error("Error saving completed workout:", error);
    throw error;
  }
};
export const SaveWorkout = async (plan: WorkoutPlan) => {
  try {
    const savedWorkoutsString = await AsyncStorage.getItem("SavedWorkouts");
    let savedWorkouts: WorkoutPlan[] = [];
    if (savedWorkoutsString) {
      savedWorkouts = JSON.parse(savedWorkoutsString);
      if (!Array.isArray(savedWorkouts)) {
        savedWorkouts = [savedWorkouts];
      }
    }
    savedWorkouts.push(plan);
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
    duration: "60",
    equipment: "",
    focus: "",
    workoutGenerated: false,
    currentWorkoutPlan: null,
  });

  // Load saved workout data on mount
  useEffect(() => {
    const loadWorkoutData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("workoutData");
        if (savedData) {
          setWorkoutData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Error loading workout data:", error);
      }
    };

    loadWorkoutData();
  }, []);

  // Update workout data and save to AsyncStorage
  const updateWorkoutData = async (newData: Partial<WorkoutData>) => {
    try {
      const updatedData = { ...workoutData, ...newData };
      setWorkoutData(updatedData);
      await AsyncStorage.setItem("workoutData", JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error saving workout data:", error);
    }
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
