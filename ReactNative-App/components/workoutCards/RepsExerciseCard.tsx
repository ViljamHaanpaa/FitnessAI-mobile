import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Icon from "@expo/vector-icons/FontAwesome";

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
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(Number(exercise.rest));
  const [restStart, setRestStart] = useState<number | null>(null);
  const [setsCompleted, setSetsCompleted] = useState(0);

  // Handle rest timer
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

  const handleStart = () => setPhase("inProgress");

  const handleReady = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          tintColor="#00FF66"
          backgroundColor="#333"
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
                <Text style={styles.goText}>Ready?</Text>
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
            style={[styles.doneButton, { backgroundColor: "#00FF66" }]}
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
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: "#343535" }]}
            onPress={handleReady}
          >
            <Text style={styles.doneButtonText}>Done</Text>
            <Icon
              name="check"
              size={18}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        )}

        {phase === "rest" && isResting && (
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: "#343535" }]}
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
            style={[styles.doneButton, { backgroundColor: "#2F80ED" }]}
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
    color: "#aaa",
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
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: 600,
    textAlign: "left",
    paddingLeft: 20,
  },
});
