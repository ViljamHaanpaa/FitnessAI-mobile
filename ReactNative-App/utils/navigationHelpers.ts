import { router } from "expo-router";

export const navigateToGoalSelection = () => {
  router.push({
    pathname: "/GetStarted",
    params: { index: 2 },
  });
};

export const navigateToLevelSelection = () => {
  router.push({
    pathname: "/GetStarted",
    params: { index: 1 },
  });
};
