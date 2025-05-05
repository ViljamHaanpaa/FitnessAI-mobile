import { WorkoutGoal, FocusOption, WorkoutGoalSport } from "./types";
import { muscleGainOptions } from "./constants/Fitness/muscleGain/muscleGain";
import { weightLossOptions } from "./constants/Fitness/weightLoss/weightLoss";
import { mobilityOptions } from "./constants/Fitness/mobility/mobility";
import { strengthOptions } from "./constants/Fitness/strength/strength";
import { enduranceOptions } from "./constants/Fitness/endurance/endurance";

import { golfOptions } from "./constants/sportPerformance/golf/golf";
import { basketballOptions } from "./constants/sportPerformance/basketball/basketball";
import { baseballOptions } from "./constants/sportPerformance/baseball/baseball";
import { icehockeyOptions } from "./constants/sportPerformance/icehockey/icehockey";
import { footballOptions } from "./constants/sportPerformance/football/football";
import { volleyballOptions } from "./constants/sportPerformance/volleyball/volleyball";
import { cyclingOptions } from "./constants/sportPerformance/cycling/cycling";
import { runningOptions } from "./constants/sportPerformance/running/running";
import { swimmingOptions } from "./constants/sportPerformance/swimming/swiming";

export const WORKOUT_FOCUS_OPTIONS: Record<WorkoutGoal, FocusOption[]> = {
  "Muscle Gain": muscleGainOptions,
  "Weight Loss": weightLossOptions,
  Strength: strengthOptions,
  Endurance: enduranceOptions,
  Mobility: mobilityOptions,
};

export const WORKOUT_FOCUS_OPTIONS_SPORTS: Record<
  WorkoutGoalSport,
  FocusOption[]
> = {
  Golf: golfOptions,
  Running: runningOptions,
  Swimming: swimmingOptions,
  Football: footballOptions,
  Basketball: basketballOptions,
  Baseball: baseballOptions,
  "Ice Hockey": icehockeyOptions,
  Volleyball: volleyballOptions,
  Cycling: cyclingOptions,
};
