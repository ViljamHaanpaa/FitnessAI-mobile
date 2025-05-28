import React, { useState, useRef, useEffect, useMemo } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";
import { useWorkout } from "@/contexts/WorkoutContext";
import { PaginationHeader } from "@/components/ui/paginationHeader";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Icon from "@expo/vector-icons/FontAwesome";

export default function WorkoutSessionScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const { workoutData } = useWorkout();

  const warmupExercises =
    workoutData?.currentWorkoutPlan?.warmup?.exercises || [];
  const mainExercises =
    workoutData?.currentWorkoutPlan?.mainWorkout?.exercises || [];
  const cooldownStretches =
    workoutData?.currentWorkoutPlan?.cooldown?.stretches || [];

  // Memoize allExercises to prevent unnecessary re-renders
  const allExercises = useMemo(
    () => [
      ...warmupExercises.map((e) => ({ ...e, section: "Warmup" })),
      ...mainExercises.map((e) => ({ ...e, section: "Main Workout" })),
      ...cooldownStretches.map((e) => ({ ...e, section: "Cooldown" })),
    ],
    [warmupExercises, mainExercises, cooldownStretches]
  );
  useEffect(() => {
    const duration = Number(allExercises[currentPage]?.duration) || 1;
    setProgress(0);
    setRemainingTime(duration);

    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);

      const timeLeft = Math.max(duration - Math.floor(elapsed), 0);
      setRemainingTime(timeLeft);

      if (percent >= 100) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [currentPage, allExercises]);

  const handlePageChange = (index: number) => {
    if (pagerRef.current) {
      pagerRef.current.setPage(index);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../assets/images/background1.png")}
        style={styles.backgroundImage}
        blurRadius={15}
      />
      <View style={styles.overlay} />
      <View style={styles.paginationHeaderContainer}>
        <PaginationHeader
          allExercises={allExercises}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </View>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        ref={pagerRef}
      >
        {allExercises.length === 0 ? (
          <View style={styles.page}>
            <Text style={styles.title}>No exercises found</Text>
          </View>
        ) : (
          allExercises.map((exercise, idx) => (
            <View key={idx} style={styles.page}>
              <Text style={styles.exerciseTitle}>{exercise.name}</Text>
              <Text style={styles.exerciseDuration}>
                <Icon name="clock-o" size={16} color="#bbb" />{" "}
                {Math.round(Number(exercise.duration) / 60)} min
              </Text>
              {idx === currentPage && (
                <View style={{ marginTop: 70 }}>
                  <AnimatedCircularProgress
                    size={280}
                    width={15}
                    fill={progress}
                    duration={Number(exercise.duration) * 1000}
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
                          {(remainingTime % 60).toString().padStart(2, "0")}
                        </Text>
                        <Text style={styles.remainingTimeText}>
                          Remaining Time
                        </Text>
                      </View>
                    )}
                  </AnimatedCircularProgress>
                </View>
              )}
            </View>
          ))
        )}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: "110%",
    position: "absolute",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  paginationHeaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 16,
  },
  pageButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    marginHorizontal: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activePageButton: {
    backgroundColor: "#007AFF",
  },
  pageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  activePageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pagerView: {
    flex: 1,
    marginTop: 150,
  },
  page: { alignItems: "center" },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  exerciseTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "semibold",
    marginBottom: 10,
  },
  exerciseDuration: {
    fontSize: 16,
    color: "#bbb",
    fontWeight: "regular",
    textAlign: "center",
  },
  remainingTimeText: {
    fontSize: 14,
    color: "#B2B2B2",
    fontWeight: "regular",
    textAlign: "center",
  },
  remainingTime: {
    fontSize: 50,
    color: "#fff",
    fontWeight: "regular",
    textAlign: "center",
    letterSpacing: 5,
  },
});
