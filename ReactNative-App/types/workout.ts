export interface WorkoutData {
  gender: string;
  goal: string;
  level: string;
  duration: string;
  equipment: string;
  focus: string;
  workoutGenerated: boolean;
  currentWorkoutPlan: WorkoutPlan | null;
}
export type WorkoutGoal =
  | "Endurance"
  | "Muscle Gain"
  | "Weight Loss"
  | "Strength"
  | "Mobility"
  | "Calisthenics";

export type WorkoutGoalSport =
  | "Golf"
  | "Running"
  | "Swimming"
  | "Football"
  | "Basketball"
  | "Baseball"
  | "Ice Hockey"
  | "Volleyball"
  | "Cycling";

export const WORKOUT_GOALS: WorkoutGoal[] = [
  "Endurance",
  "Muscle Gain",
  "Weight Loss",
  "Strength",
  "Mobility",
  "Calisthenics",
];

export const WORKOUT_GOALS_SPORTS: WorkoutGoalSport[] = [
  "Golf",
  "Running",
  "Swimming",
  "Football",
  "Basketball",
  "Baseball",
  "Ice Hockey",
  "Volleyball",
  "Cycling",
];

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  duration: string;
  description: string;
  type: string;
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
