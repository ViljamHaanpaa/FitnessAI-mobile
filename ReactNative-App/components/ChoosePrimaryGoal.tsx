import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useWorkout } from "@/contexts/WorkoutContext";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import Icon from "@expo/vector-icons/FontAwesome";
import {
  WORKOUT_GOALS,
  WORKOUT_GOALS_SPORTS,
  WORKOUT_GOALS_DISPLAY,
  WORKOUT_GOALS_SPORTS_DISPLAY,
} from "@/types/workout";
import colors from "../styles/colors";

export const ChoosePrimaryGoal = () => {
  const { workoutData, updateWorkoutData } = useWorkout();
  const [showFitnessGoals, setShowFitnessGoals] = useState(false);
  const [showSportsGoals, setShowSportsGoals] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleGoalButtonPress = (goal: string) => {
    setSelectedGoal(goal);
    updateWorkoutData({ goal, focus: "" });
  };
  // Initialize shared values
  const fitnessHeight = useSharedValue(0);
  const sportsHeight = useSharedValue(0);

  // Create animated styles
  const fitnessAnimatedStyle = useAnimatedStyle(() => ({
    height: fitnessHeight.value,
    opacity: withTiming(fitnessHeight.value === 0 ? 0 : 1),
    overflow: "hidden",
  }));

  const sportsAnimatedStyle = useAnimatedStyle(() => ({
    height: sportsHeight.value,
    opacity: withTiming(sportsHeight.value === 0 ? 0 : 1),
    overflow: "hidden",
  }));

  const toggleFitnessMenu = () => {
    if (showSportsGoals) {
      sportsHeight.value = withTiming(0);
      setShowSportsGoals(false);
    }
    fitnessHeight.value = withTiming(showFitnessGoals ? 0 : 180);
    setShowFitnessGoals(!showFitnessGoals);
  };

  const toggleSportsMenu = () => {
    if (showFitnessGoals) {
      fitnessHeight.value = withTiming(0);
      setShowFitnessGoals(false);
    }
    sportsHeight.value = withTiming(showSportsGoals ? 0 : 300);
    setShowSportsGoals(!showSportsGoals);
  };

  return (
    <View
      style={{
        width: 350,
        alignItems: "center",
        gap: 50,
        height: 400,
        marginTop: 20,
      }}
    >
      <Text style={styles.title}>
        Choose your primary <Text style={{ color: colors.primary }}>goal</Text>
      </Text>
      <View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginVertical: 15,
          }}
          onPress={toggleFitnessMenu}
        >
          <Text style={styles.questionTitle}>💪 Fitness </Text>
          <Icon
            name={showFitnessGoals ? "chevron-down" : "chevron-right"}
            size={20}
            color={colors.highlight}
          />
        </TouchableOpacity>
        <Animated.View style={[fitnessAnimatedStyle]}>
          <ScrollView
            style={{ maxHeight: 180, width: "100%" }}
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
            }}
            showsVerticalScrollIndicator={false}
          >
            {WORKOUT_GOALS.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalButton,
                  {
                    backgroundColor:
                      selectedGoal === goal ? colors.primary : colors.secondary,
                  },
                ]}
                onPress={() => handleGoalButtonPress(goal)}
              >
                <Text style={styles.goalButtonText}>
                  {" "}
                  {WORKOUT_GOALS_DISPLAY[goal]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginVertical: 15,
          }}
          onPress={toggleSportsMenu}
        >
          <Text style={styles.questionTitle}>🏅 Sport performance</Text>
          <Icon
            name={showSportsGoals ? "chevron-down" : "chevron-right"}
            size={20}
            color={colors.highlight}
          />
        </TouchableOpacity>

        <Animated.View style={[sportsAnimatedStyle]}>
          <ScrollView
            style={{ maxHeight: 300, width: "100%" }}
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
            }}
            showsVerticalScrollIndicator={false}
          >
            {WORKOUT_GOALS_SPORTS.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalButton,
                  {
                    backgroundColor:
                      selectedGoal === goal ? colors.primary : colors.secondary,
                  },
                ]}
                onPress={() => handleGoalButtonPress(goal)}
              >
                <Text style={styles.goalButtonText}>
                  {WORKOUT_GOALS_SPORTS_DISPLAY[goal]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary,
  },
  flatListContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 290,
  },
  title: {
    fontSize: 40,
    color: "#FFFFFF",
    textAlign: "left",
    alignSelf: "center",
    marginTop: 10,
    fontWeight: 400,
    letterSpacing: 1,
    lineHeight: 40,
  },
  sliderValuesText: {
    fontSize: 15,
    color: "#5D5F60",
  },
  sliderValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
  },
  currentValue: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "600",
  },
  goalsContainer: {
    flexDirection: "row",
    width: 350,
    flexWrap: "wrap",
    gap: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  goalButton: {
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
  },
  goalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  equipmentButton: {
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
  },
  genderContainer: {
    flexDirection: "row",
    width: 350,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  equipmentButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  questionTitle: {
    fontSize: 22,
    alignSelf: "center",
    textAlign: "left",
    color: colors.textPrimary,
    marginBottom: 20,
    marginTop: 20,
    width: 300,
    fontWeight: 300,
    lineHeight: 25,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
  },
  button: {
    backgroundColor: colors.primary,
    width: 320,
    height: 75,
    bottom: 60,
    position: "absolute",
    borderRadius: 20,
    borderCurve: "continuous",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: 600,
    textAlign: "left",
    paddingLeft: 20,
  },
});
