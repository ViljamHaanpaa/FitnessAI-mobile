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
