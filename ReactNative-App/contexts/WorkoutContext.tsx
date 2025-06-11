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
  completedExercises: { [exerciseName: string]: boolean };
  markExerciseCompleted: (exerciseName: string, completed?: boolean) => void;
  resetCompletedExercises: () => void; // <-- add this
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const SaveCompletedWorkout = async (
  plan: WorkoutPlan & {
    completedExercises: { [exerciseName: string]: boolean };
  }
) => {
  try {
    const completedWorkoutsString = await AsyncStorage.getItem(
      "CompletedWorkouts"
    );

    let completedWorkouts: any[] = [];
    if (completedWorkoutsString) {
      completedWorkouts = JSON.parse(completedWorkoutsString);
      if (!Array.isArray(completedWorkouts)) {
        completedWorkouts = [completedWorkouts];
      }
    }
    completedWorkouts.push({
      ...plan,
      completedAt: new Date().toISOString(),
    });
    await AsyncStorage.setItem(
      "CompletedWorkouts",
      JSON.stringify(completedWorkouts)
    );

    console.log("Completed workout saved successfully", completedWorkouts);
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
  const [completedExercises, setCompletedExercises] = useState<{
    [exerciseName: string]: boolean;
  }>({});

  const resetCompletedExercises = () => setCompletedExercises({});
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    gender: "",
    goal: "",
    level: "",
    duration: "60",
    equipment: "",
    focus: "",
    workoutGenerated: false,
    currentWorkoutPlan: null,
    workoutActive: false,
  });

  // Load saved workout data on mount
  useEffect(() => {
    const loadWorkoutData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("workoutData");
        if (savedData) {
          setWorkoutData(JSON.parse(savedData));
        }
        const savedCompleted = await AsyncStorage.getItem("completedExercises");
        if (savedCompleted) {
          setCompletedExercises(JSON.parse(savedCompleted));
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

  const markExerciseCompleted = (exerciseName: string, completed = true) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [exerciseName]: completed,
    }));

    console.log(
      `Exercise ${exerciseName} marked as ${
        completed ? "completed" : "not completed"
      }`
    );
  };
  return (
    <WorkoutContext.Provider
      value={{
        workoutData,
        updateWorkoutData,
        completedExercises,
        markExerciseCompleted,
        resetCompletedExercises,
      }}
    >
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
