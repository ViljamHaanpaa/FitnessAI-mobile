import { WorkoutGoal, FocusOption } from "./types";
import { muscleGainOptions } from "./constants/muscleGain";
import { weightLossOptions } from "./constants/weightLoss";
import { mobilityOptions } from "./constants/mobility";
import { strengthOptions } from "./constants/strength";
import { enduranceOptions } from "./constants/endurance";
console.log("Endurance options loaded:", enduranceOptions);
// Import other options...

export const WORKOUT_FOCUS_OPTIONS: Record<WorkoutGoal, FocusOption[]> = {
  "Muscle Gain": muscleGainOptions,
  "Weight Loss": weightLossOptions,
  Strength: strengthOptions,
  Endurance: enduranceOptions,
  Mobility: mobilityOptions,
};
