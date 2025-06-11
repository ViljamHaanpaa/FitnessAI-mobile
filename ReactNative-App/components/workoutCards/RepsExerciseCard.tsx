import React, { useState, useEffect, use } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Icon from "@expo/vector-icons/FontAwesome";
import { useWorkout } from "@/contexts/WorkoutContext";
import colors from "../../styles/colors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
export const RepsExerciseCard = ({
  exercise,
  onComplete,
}: {
  exercise: any;
  onComplete?: () => void;
}) => {
  const [phase, setPhase] = useState<
    "start" | "inProgress" | "rest" | "completed"
  >("start");
  const MIN_DURATION_BEFORE_READY = 10000;
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(Number(exercise.rest));
  const [restStart, setRestStart] = useState<number | null>(null);
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [buttonAnimStarted, setButtonAnimStarted] = useState(false);
  const buttonColor = useSharedValue(colors.secondary);
  const { markExerciseCompleted, completedExercises } = useWorkout();
  const [markedCompleted, setMarkedCompleted] = useState(false);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: buttonColor.value,
  }));

  useEffect(() => {
    const isCompleted = !!completedExercises[exercise.name];
    if (isCompleted) setPhase("completed");
    else setPhase("start");
  }, [completedExercises, exercise.name]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (phase === "rest" && isResting && restStart !== null) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - restStart) / 1000;
        const remaining = Math.max(Number(exercise.rest) - elapsed, 0);
        setRestTime(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          setIsResting(false);
          if (setsCompleted + 1 < exercise.sets) {
            setSetsCompleted((prev) => prev + 1);
            setPhase("inProgress");
          } else {
            setPhase("completed");
          }
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [
    phase,
    isResting,
    restStart,
    exercise.rest,
    setsCompleted,
    exercise.sets,
  ]);

  const handleStart = () => {
    const now = Date.now();
    setStartTime(now);
    setPhase("inProgress");
    buttonColor.value = withTiming(colors.primary, {
      duration: MIN_DURATION_BEFORE_READY,
    });
  };
  useEffect(() => {
    if (phase !== "inProgress") {
      buttonColor.value = colors.secondary;
      setButtonAnimStarted(false);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "completed" && !markedCompleted) {
      markExerciseCompleted(exercise.name, true);
      setMarkedCompleted(true);
    }
    if (phase !== "completed" && markedCompleted) {
      setMarkedCompleted(false);
    }
  }, [phase, exercise.name, markExerciseCompleted, markedCompleted]);

  const handleReady = () => {
    if (!startTime) {
      return;
    }
    if (Date.now() - startTime < MIN_DURATION_BEFORE_READY) {
      Alert.alert(
        "Are you really that quick?",
        "",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              if (setsCompleted + 1 < exercise.sets) {
                setPhase("rest");
              } else {
                setSetsCompleted((prev) => prev + 1);
                setPhase("completed");
              }
            },
          },
        ],
        { cancelable: true }
      );
      return;
    }
    if (setsCompleted + 1 < exercise.sets) {
      setPhase("rest");
    } else {
      setSetsCompleted((prev) => prev + 1);

      setPhase("completed");
    }
  };

  const handleRestStart = () => {
    setIsResting(true);
    setRestStart(Date.now());
    setRestTime(Number(exercise.rest));
  };

  useEffect(() => {
    if (phase === "rest") handleRestStart();
  }, [phase]);

  const handleSkipRest = () => {
    setIsResting(false);
    if (setsCompleted + 1 < exercise.sets) {
      setSetsCompleted((prev) => prev + 1);
      setPhase("inProgress");
    } else {
      setSetsCompleted((prev) => prev + 1);
      setPhase("completed");
    }
  };

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.exerciseTitle}>{exercise.name}</Text>
      <Text style={styles.exerciseSubtitle}>
        Sets {exercise.sets} | Reps {exercise.reps} | Rest{" "}
        {Number(exercise.rest) >= 60
          ? `${Math.round(Number(exercise.rest) / 60)} min`
          : `${exercise.rest}s`}
      </Text>

      <View style={{ marginTop: 40 }}>
        <AnimatedCircularProgress
          size={280}
          width={15}
          fill={
            phase === "start"
              ? 0
              : phase === "rest" && isResting
              ? (restTime / Number(exercise.rest)) * 100
              : 100
          }
          tintColor={colors.greenPrimary}
          backgroundColor={colors.secondary}
          rotation={220}
          arcSweepAngle={280}
          lineCap="round"
        >
          {() => (
            <>
              {phase === "rest" && isResting ? (
                <>
                  <Text style={styles.exerciseTitle}> Rest</Text>
                  <Text style={styles.remainingTime}>
                    {`${Math.floor(restTime / 60)}:${(Math.floor(restTime) % 60)
                      .toString()
                      .padStart(2, "0")}`}
                  </Text>
                </>
              ) : phase === "start" ? (
                <Text style={[styles.goText, { color: colors.primary }]}>
                  Ready?
                </Text>
              ) : phase === "inProgress" ? (
                <Text style={styles.goText}>Go!</Text>
              ) : phase === "completed" ? (
                <Text style={styles.goText}>Done!</Text>
              ) : null}
              <Text style={styles.setsLabel}>
                Set{" "}
                {phase === "completed"
                  ? exercise.sets
                  : Math.min(setsCompleted + 1, exercise.sets)}{" "}
                of {exercise.sets}
              </Text>
            </>
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
        {phase === "start" && (
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: colors.primary }]}
            onPress={handleStart}
          >
            <Text style={styles.doneButtonText}>Start</Text>
            <Icon
              name="play"
              size={18}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        )}

        {phase === "inProgress" && (
          <Animated.View style={[styles.doneButton, animatedButtonStyle]}>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={handleReady}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Done?</Text>
              <Icon
                name="check"
                size={18}
                color="#fff"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </Animated.View>
        )}

        {phase === "rest" && isResting && (
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: colors.secondary }]}
            onPress={handleSkipRest}
          >
            <Text style={[styles.doneButtonText]}>Skip Rest</Text>
            <Icon
              name="step-forward"
              size={18}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        )}
        {phase === "completed" && (
          <TouchableOpacity
            style={[
              styles.doneButton,
              { backgroundColor: colors.greenPrimary },
            ]}
            onPress={onComplete}
          >
            <Text style={styles.doneButtonText}>Next</Text>
            <Icon
              name="step-forward"
              size={18}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: { alignItems: "center", flex: 1 },
  exerciseTitle: {
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  exerciseSubtitle: {
    fontSize: 16,
    color: "#bbb",
    marginBottom: 20,
  },
  goText: {
    fontSize: 45,
    color: "#00FF66",
    fontWeight: "semibold",
    textAlign: "center",
  },
  remainingTime: {
    fontSize: 50,
    fontWeight: "semibold",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 5,
  },
  setsLabel: {
    fontSize: 16,
    color: "#aaa",
    marginTop: 12,
  },
  instructionsContainer: {
    marginBottom: 40,
    alignItems: "flex-start",
  },
  instructionText: {
    fontSize: 16,
    color: "#00FF66",
  },
  doneButton: {
    flexDirection: "row",
    borderRadius: 20,
    width: 320,
    height: 75,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderCurve: "continuous",
  },
  doneButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 600,
    textAlign: "left",
    paddingLeft: 20,
  },
});
