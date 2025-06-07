import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Icon from "@expo/vector-icons/FontAwesome";

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
  const [paused, setPaused] = useState(true);
  const [isTimerCompleted, setIsTimerCompleted] = useState(false);

  // Reset timer when exercise changes
  useEffect(() => {
    setRemainingTime(Number(exercise.duration) || 0);
    setProgress(0);
    setIsTimerCompleted(false);
    setPaused(true);
  }, [exercise]);

  // Timer effect
  useEffect(() => {
    if (paused || isTimerCompleted) return;

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
        setPaused(true);
        if (isLastExercise && onFinishWorkout) {
          onFinishWorkout();
        } else if (onComplete) {
          onComplete();
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [paused, isTimerCompleted, exercise, remainingTime]);

  const handlePress = () => {
    if (isTimerCompleted) {
      if (isLastExercise && onFinishWorkout) {
        onFinishWorkout();
      } else if (onComplete) {
        onComplete();
      }
    } else if (paused) {
      setPaused(false);
    } else {
      setRemainingTime(0);
      setProgress(100);
      setIsTimerCompleted(true);
      setPaused(true);
    }
  };

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.exerciseTitle}>{exercise.name}</Text>
      <Text style={styles.exerciseDuration}>
        <Icon name="clock-o" size={16} color="#bbb" />{" "}
        {Math.round(Number(exercise.duration) / 60)} min
      </Text>
      <View style={{ marginTop: 70 }}>
        <AnimatedCircularProgress
          size={280}
          width={15}
          fill={progress}
          tintColor="#00FF66"
          backgroundColor="#333"
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
                ? "#00FF66"
                : paused
                ? "#00FF66"
                : "#333",
              marginLeft: 10,
            },
          ]}
          onPress={handlePress}
        >
          {isTimerCompleted ? (
            <Text style={styles.buttonText}>
              {isLastExercise ? "Finish!" : "Next"}
            </Text>
          ) : paused ? (
            <Text style={styles.buttonText}>Start</Text>
          ) : (
            <Text style={styles.buttonText}>Skip</Text>
          )}
          <Icon
            name={
              isTimerCompleted
                ? "step-forward"
                : paused
                ? "play"
                : "step-forward"
            }
            size={16}
            color="#FFFFFF"
          />
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
    fontWeight: 600,
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
  pauseButton: {
    flexDirection: "row",
    backgroundColor: "#333",
    borderRadius: 20,
    width: 150,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
