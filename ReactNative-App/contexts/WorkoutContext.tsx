import { createContext, useContext, useState, ReactNode } from "react";

export interface WorkoutData {
  gender: string;
  goal: string;
  level: string;
  duration: string;
  equipment: string;
}

interface WorkoutContextType {
  workoutData: WorkoutData;
  updateWorkoutData: (data: Partial<WorkoutData>) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    gender: "",
    goal: "",
    level: "",
    duration: "",
    equipment: "",
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
