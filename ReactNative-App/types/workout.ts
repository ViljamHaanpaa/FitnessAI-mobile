export interface WorkoutData {
  gender: string;
  goal: string;
  level: string;
  duration: string;
  equipment: string;
  focus: string;
}
export type WorkoutGoal =
  | "Endurance"
  | "Muscle Gain"
  | "Weight Loss"
  | "Strength"
  | "Mobility";

export const WORKOUT_GOALS: WorkoutGoal[] = [
  "Endurance",
  "Muscle Gain",
  "Weight Loss",
  "Strength",
  "Mobility",
];

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  duration: string;
  description: string;
}

export interface WorkoutPlan {
  title: string;
  duration: string;
  timestamp: string;
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
