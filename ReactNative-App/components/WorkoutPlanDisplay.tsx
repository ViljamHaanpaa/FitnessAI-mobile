import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import LottieView from "lottie-react-native";
import { WorkoutPlan, WorkoutGoalSport } from "@/types/workout";
import { useWorkout, SaveWorkout } from "@/contexts/WorkoutContext";
import { WORKOUT_FOCUS_OPTIONS_SPORTS } from "../assets/data/workouts/focusOptions";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import colors from "@/styles/colors";
import { fetchSavedWorkouts } from "@/assets/services/storage/workoutStorage";

interface WorkoutPlanDisplayProps {
  plan: WorkoutPlan | null;
  setCurrentIndex: (index: number) => void;
}
export const WorkoutPlanDisplay = ({
  plan,
  setCurrentIndex,
}: WorkoutPlanDisplayProps) => {
  const { updateWorkoutData, workoutData } = useWorkout();
  const [showLottie, setShowLottie] = useState(false);
  const lottieRef = useRef<LottieView>(null);
  const overlayOpacity = useSharedValue(0);
  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!plan) return;
      const savedWorkouts = await fetchSavedWorkouts();
      // Example: compare by title and duration (customize as needed)
      const alreadySaved = savedWorkouts.some(
        (w) => w.title === plan.title && w.duration === plan.duration
      );
      setHasSaved(alreadySaved);
    };
    checkIfSaved();
  }, [plan]);

  const getFocusImage = () => {
    if (!workoutData.goal || !workoutData.focus) return null;

    const focusOptions =
      WORKOUT_FOCUS_OPTIONS_SPORTS[workoutData.goal as WorkoutGoalSport] || [];
    const selectedFocus = focusOptions.find(
      (option) => option.title === workoutData.focus
    );
    return selectedFocus?.image;
  };
  const focusImage = getFocusImage();
  if (!plan) return null;

  const handleBackPress = () => {
    console.log(hasSaved);
    if (hasSaved) {
      setCurrentIndex(0);
      updateWorkoutData({
        workoutGenerated: false,
        focus: "",
        duration: "",
        equipment: "",
        currentWorkoutPlan: null,
      });
    } else {
      Alert.alert(
        "Discard Workout",
        "Are you sure you want to discard this workout?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              updateWorkoutData({
                workoutGenerated: false,
                focus: "",
                duration: "",
                equipment: "",
                currentWorkoutPlan: null,
              });
              setCurrentIndex(0);
            },
          },
        ],
        { cancelable: true }
      );
    }
  };
  const handleSave = async () => {
    if (hasSaved) return;
    setShowLottie(true);
    await SaveWorkout(plan);
    setHasSaved(true);
    overlayOpacity.value = withTiming(1, { duration: 300 });
    setTimeout(() => {
      overlayOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) runOnJS(setShowLottie)(false);
      });
    }, 2000);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.saveButton}
            >
              <Text style={{ color: "red", fontSize: 16 }}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveButton}
              disabled={hasSaved}
            >
              <Text
                style={{
                  color: colors.greenPrimary,
                  fontSize: 16,
                  opacity: hasSaved ? 0.5 : 1,
                }}
              >
                {hasSaved ? "Saved" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
          {focusImage && (
            <Image source={focusImage} style={styles.focusImage} />
          )}
        </View>
        <View style={styles.Headersection}>
          <Text style={styles.title}>{plan.title}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Warmup
            <Text style={{ color: "#FFA500", fontWeight: 600 }}>
              {"  "}
              {Math.round(Number(plan.warmup.duration) / 60)} min
            </Text>
          </Text>
          {plan.warmup.exercises.map((exercise, index) => (
            <View key={index} style={styles.exercise}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDuration}>
                {Math.round(Number(exercise.duration) / 60)} min
              </Text>
              <Text style={styles.exerciseDescription}>
                {exercise.description}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Main Workout
            <Text style={{ color: "#FFA500", fontWeight: 600 }}>
              {"  "}
              {Math.round(Number(plan.mainWorkout.duration) / 60)} min
            </Text>
          </Text>
          {plan.mainWorkout.exercises.map((exercise, index) => (
            <View key={index} style={styles.exercise}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDuration}>
                Sets: {exercise.sets} | Reps: {exercise.reps} | Rest:{" "}
                {Math.round(Number(exercise.rest) / 60)} min
              </Text>
              <Text style={styles.exerciseDescription}>
                {exercise.description}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.lastSection}>
          <Text style={styles.sectionTitle}>
            Cooldown
            <Text style={{ color: "#FFA500", fontWeight: 600 }}>
              {"  "}
              {Math.round(Number(plan.cooldown.duration) / 60)} min
            </Text>
          </Text>
          {plan.cooldown.stretches.map((stretch, index) => (
            <View key={index} style={styles.exercise}>
              <Text style={styles.exerciseName}>{stretch.name}</Text>
              <Text style={styles.exerciseDuration}>
                {Math.round(Number(stretch.duration) / 60)} min
              </Text>
              <Text style={styles.exerciseDescription}>
                {stretch.description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      {showLottie && (
        <Animated.View style={[styles.lottieOverlay, animatedOverlayStyle]}>
          <LottieView
            ref={lottieRef}
            source={require("../assets/lottie/SavingWorkout.json")}
            autoPlay={true}
            loop={false}
            style={styles.lottie}
            resizeMode="cover"
            speed={1.5}
            onAnimationFinish={() => {
              overlayOpacity.value = withTiming(
                0,
                { duration: 300 },
                (finished) => {
                  if (finished) runOnJS(setShowLottie)(false);
                }
              );
            }}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 30,
  },
  lottieOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)", // optional: dim background
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  lottie: {
    width: 200,
    height: 200,
    zIndex: 1000,
  },
  backgroundImage: {
    width: "110%",
    height: "110%",
    position: "absolute",
    resizeMode: "cover",
    zIndex: 10,
  },
  title: {
    fontSize: 25,
    width: 300,
    fontWeight: "400",
    marginBottom: 16,
    color: "#FFFFFF",
    alignSelf: "center",
    textAlign: "center",
  },
  focusImage: {
    width: 200,
    height: 200,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: "center",
  },
  Headersection: {
    alignItems: "center",
  },
  section: {
    gap: 15,
  },
  lastSection: {
    gap: 15,
    marginBottom: 60,
  },
  sectionTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 16,
  },
  exercise: {
    padding: 12,
    backgroundColor: colors.secondary,

    gap: 4,
    borderRadius: 20,
    borderCurve: "continuous",
  },
  exerciseDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "300",
  },
  exerciseDuration: {
    color: "#FFA500",
    fontSize: 14,
    fontWeight: "400",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  saveButton: {},
});
