import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Icon from "@expo/vector-icons/FontAwesome";
import colors from "../../styles/colors";
import { useWorkout } from "@/contexts/WorkoutContext";

export const TimeExerciseCard = ({
  exercise,
  onComplete,
  isLastExercise = false,
  onFinishWorkout,
}: {
  exercise: any;
  onComplete?: () => void;
  isLastExercise?: boolean;
  onFinishWorkout?: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(
    Number(exercise.duration) || 0
  );
  const [isTimerCompleted, setIsTimerCompleted] = useState(false);
  const { markExerciseCompleted, completedExercises } = useWorkout();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    console.log("TimeExerciseCard rendered with exercise:", exercise);
    console.log("TimeExerciseCard rendered with exercise:", exercise.name);
    setRemainingTime(Number(exercise.duration) || 0);
    setProgress(0);
    setIsTimerCompleted(false);
  }, [exercise]);
  // Set completed state from context
  useEffect(() => {
    const isCompleted = !!completedExercises[exercise.name];
    setIsTimerCompleted(isCompleted);
    if (isCompleted) {
      setProgress(100);
      setRemainingTime(0);
    }
  }, [completedExercises, exercise.name]);

  // Timer effect
  useEffect(() => {
    if (isTimerCompleted || !hasStarted) return;

    const duration = Number(exercise.duration) || 1;
    const start = Date.now() - (duration - remainingTime) * 1000;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);

      const timeLeft = Math.max(duration - elapsed, 0);
      setRemainingTime(timeLeft);

      if (percent >= 100) {
        clearInterval(interval);
        setIsTimerCompleted(true);
        setProgress(100);
        setRemainingTime(0);
        markExerciseCompleted(exercise.name, true);
        if (isLastExercise && onFinishWorkout) {
          onFinishWorkout();
        } else if (onComplete) {
          onComplete();
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isTimerCompleted, hasStarted, exercise, remainingTime]);

  const handlePress = () => {
    if (!hasStarted) {
      setHasStarted(true);
      return;
    }
    if (isTimerCompleted) {
      if (isLastExercise && onFinishWorkout) {
        onFinishWorkout();
      } else if (onComplete) {
        onComplete();
      }
    } else {
      Alert.alert(
        "Skip Exercise",
        "Are you sure you want to skip this exercise?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Skip",
            onPress: () => {
              setRemainingTime(0);
              setProgress(100);
              setIsTimerCompleted(true);
              markExerciseCompleted(exercise.name, true);
              if (isLastExercise && onFinishWorkout) {
                onFinishWorkout();
              } else if (onComplete) {
                onComplete();
              }
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.exerciseTitle}>{exercise.name}</Text>
      <Text style={styles.exerciseDuration}>
        <Icon name="clock-o" size={16} color="#bbb" />{" "}
        {Math.round(Number(exercise.duration) / 60)} min
      </Text>
      <View style={{ marginTop: 110, position: "absolute" }}>
        <AnimatedCircularProgress
          size={280}
          width={15}
          fill={progress}
          tintColor={colors.greenPrimary}
          backgroundColor={colors.secondary}
          rotation={220}
          arcSweepAngle={280}
          lineCap="round"
        >
          {() => (
            <View style={{ bottom: 10 }}>
              <Text style={styles.remainingTime}>
                {Math.floor(remainingTime / 60)}:
                {(Math.floor(remainingTime) % 60).toString().padStart(2, "0")}
              </Text>
              <Text style={styles.remainingTimeText}>Remaining Time</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>
      <Text style={styles.descriptionText}>{exercise.description}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          position: "absolute",
          bottom: 50,
        }}
      >
        <TouchableOpacity
          style={[
            styles.skipButton,
            {
              backgroundColor: isTimerCompleted
                ? colors.greenPrimary
                : colors.primary,
              marginLeft: 10,
            },
          ]}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>
            {!hasStarted
              ? "Start"
              : isTimerCompleted
              ? isLastExercise
                ? "Finish!"
                : "Next"
              : "Skip"}
          </Text>
          <Icon name="step-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: { alignItems: "center", flex: 1 },
  exerciseTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "400",
    width: 220,
    bottom: 250,
    position: "absolute",
  },
  exerciseDuration: {
    fontSize: 16,
    color: "#bbb",
    textAlign: "center",
  },
  remainingTime: {
    fontSize: 50,
    color: "#fff",
    textAlign: "center",
    letterSpacing: 5,
    fontWeight: "semibold",
  },
  remainingTimeText: {
    fontSize: 14,
    color: "#B2B2B2",
    textAlign: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "left",
    paddingLeft: 20,
  },
  skipButton: {
    flexDirection: "row",
    width: 320,
    height: 75,
    borderRadius: 20,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
});
