import React, { useState, useRef, useMemo, useEffect, use } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import PagerView from "react-native-pager-view";
import { useRouter } from "expo-router";
import { useWorkout } from "@/contexts/WorkoutContext";
import { SaveCompletedWorkout } from "@/contexts/WorkoutContext";
import { PaginationHeader } from "@/components/ui/paginationHeader";
import { TimeExerciseCard } from "@/components/workoutCards/TimeExerciseCard";
import { RepsExerciseCard } from "@/components/workoutCards/RepsExerciseCard";
import { InstructionsModal } from "@/components/ui/instructionsModal";
export default function WorkoutSessionScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const { workoutData } = useWorkout();
  const router = useRouter();
  const [instructionsVisible, setInstructionsVisible] = useState(false);
  const [instructionsExercise, setInstructionsExercise] = useState<any>(null);
  const warmupExercises =
    workoutData?.currentWorkoutPlan?.warmup?.exercises || [];
  const mainExercises =
    workoutData?.currentWorkoutPlan?.mainWorkout?.exercises || [];
  const cooldownStretches =
    workoutData?.currentWorkoutPlan?.cooldown?.stretches || [];

  const allExercises = useMemo(
    () => [
      ...warmupExercises.map((e) => ({ ...e, section: "Warmup" })),
      ...mainExercises.map((e) => ({ ...e, section: "Main Workout" })),
      ...cooldownStretches.map((e) => ({ ...e, section: "Cooldown" })),
    ],
    [warmupExercises, mainExercises, cooldownStretches]
  );

  const handlePageChange = (index: number) => {
    if (pagerRef.current) {
      pagerRef.current.setPage(index);
    }
  };
  const nextPage = () => {
    if (currentPage < allExercises.length - 1) {
      handlePageChange(currentPage + 1);
    }
  };
  const handleFinishWorkout = () => {
    Alert.alert(
      "Finish Workout",
      "Are you sure you want to finish this workout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Finish",
          onPress: () => {
            if (workoutData.currentWorkoutPlan) {
              SaveCompletedWorkout(workoutData.currentWorkoutPlan);
            }
            router.push("/(tabs)");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleInstructionsOpen = (exercise: any) => {
    setInstructionsExercise(exercise);
    setInstructionsVisible(true);
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
          handleFinishWorkout={handleFinishWorkout}
          onOpenInstructions={(exercise) => {
            handleInstructionsOpen(exercise);
          }}
        />
      </View>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        ref={pagerRef}
      >
        {allExercises.map((exercise, idx) => (
          <View key={idx}>
            {exercise.type === "time" ? (
              <TimeExerciseCard
                exercise={exercise}
                onComplete={nextPage}
                isLastExercise={currentPage === allExercises.length - 1}
                onFinishWorkout={handleFinishWorkout}
              />
            ) : (
              <RepsExerciseCard exercise={exercise} onComplete={nextPage} />
            )}
          </View>
        ))}
      </PagerView>

      <InstructionsModal
        exercise={instructionsExercise}
        visible={instructionsVisible}
        onClose={() => setInstructionsVisible(false)}
      />
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
  pagerView: {
    flex: 1,
    marginTop: 150,
  },
});
