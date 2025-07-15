import { ImageSourcePropType } from "react-native";
export interface FocusOption {
  id: string;
  title: string;
  image?: ImageSourcePropType;
  prompt?: string;
}
export type WorkoutGoal =
  | "Weight Loss"
  | "Muscle Gain"
  | "Strength"
  | "Endurance"
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
  | "Cycling"
  | "Practical Shooting";
