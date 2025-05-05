import { ImageSourcePropType } from "react-native";
export interface FocusOption {
  id: string;
  title: string;
  image?: ImageSourcePropType;
}
export type WorkoutGoal =
  | "Weight Loss"
  | "Muscle Gain"
  | "Strength"
  | "Endurance"
  | "Mobility";

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
