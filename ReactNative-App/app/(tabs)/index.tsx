import { useState, useRef, JSX, useEffect, useCallback } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { AutoReverseLottie } from "@/components/animations/AutoReverseLottie";
import { WorkoutPlanDisplay } from "@/components/WorkoutPlanDisplay";
import { useWorkout } from "../../contexts/WorkoutContext";
import { generateWorkoutPlan } from "../../assets/services/ai/deepseek";
import {
  WORKOUT_FOCUS_OPTIONS,
  WORKOUT_FOCUS_OPTIONS_SPORTS,
} from "../../assets/data/workouts/focusOptions";
import {
  WorkoutGoal,
  WORKOUT_GOALS_SPORTS,
  WorkoutGoalSport,
} from "@/types/workout";
import Slider from "@react-native-community/slider";
import { useFocusEffect } from "expo-router";
import { navigateToGoalSelection } from "@/utils/navigationHelpers";
import PagerView from "react-native-pager-view";
import colors from "../../styles/colors";
export default function HomeScreen() {
  const [duration, setDuration] = useState(60);
  const [selectedEquipment, setSelectedEquipment] = useState("No Equipment");
  const { updateWorkoutData, workoutData } = useWorkout();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const pagerRef = useRef<PagerView>(null);

  interface QuestionItem {
    id: string;
    component: JSX.Element;
  }
  useFocusEffect(
    useCallback(() => {
      // Reset states when screen comes into focus
      pagerRef.current?.setPage(0);
      setCurrentIndex(0);
      console.log("HomeScreen focused");
    }, [])
  );

  const equipment = [
    "No Equipment",
    "Home Gym Equipment",
    "Basic Gym Equipment ",
  ];

  const nextScreen = () => {
    if (currentIndex < questions.length - 1) {
      pagerRef.current?.setPage(currentIndex + 1);
      setCurrentIndex(currentIndex + 1);
    } else {
      generatePlan();
    }
  };
  const handleDurationChange = (value: number) => {
    setDuration(value);
    const formattedvalue = value.toFixed(0);
    updateWorkoutData({ duration: formattedvalue });
  };
  const handleEquipmentButtonPress = (equipment: string) => {
    setSelectedEquipment(equipment);
    updateWorkoutData({ equipment });
  };
  const getCurrentFocusOptions = () => {
    if (!workoutData.goal) return [];

    // Check if it's a sport goal
    if (WORKOUT_GOALS_SPORTS.includes(workoutData.goal as WorkoutGoalSport)) {
      return (
        WORKOUT_FOCUS_OPTIONS_SPORTS[workoutData.goal as WorkoutGoalSport] || []
      );
    }
    // Return regular fitness focus options
    return WORKOUT_FOCUS_OPTIONS[workoutData.goal as WorkoutGoal] || [];
  };
  let MAX_RETRIES = 3;

  const generatePlan = async () => {
    setLoading(true);
    try {
      if (!workoutData.goal || !workoutData.level) {
        throw new Error("Missing workout data");
      }
      setShowErrorMessage(false);
      for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          const generatedPlan = await generateWorkoutPlan(workoutData);
          if (generatedPlan) {
            console.log("Generated plan:", generatedPlan);
            updateWorkoutData({
              workoutGenerated: true,
              currentWorkoutPlan: generatedPlan,
            });
            return;
          }
        } catch (error) {
          console.error(`Attempt ${i + 1} failed:`, error);
          if (i === MAX_RETRIES - 1) {
            throw error;
          }
        }
      }
      throw new Error(
        "Failed to generate workout plan after multiple attempts"
      );
    } catch (error) {
      console.error("Error generating plan:", error);
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const questions: QuestionItem[] = [
    ...(workoutData.goal && !getCurrentFocusOptions().length
      ? []
      : [
          {
            id: "1",
            component: (
              <View>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    What are we{" "}
                    <TouchableOpacity onPress={navigateToGoalSelection}>
                      <Text
                        style={styles.titleGoal}
                        onPress={navigateToGoalSelection}
                      >
                        focusing
                      </Text>
                    </TouchableOpacity>{" "}
                    on today?
                  </Text>
                </View>
                <View style={styles.optionsContainer}>
                  {getCurrentFocusOptions().map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionButton,
                        workoutData.focus === option.title &&
                          styles.selectedButton,
                      ]}
                      onPress={() => updateWorkoutData({ focus: option.title })}
                    >
                      <View
                        style={{
                          height: 40,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={[styles.optionText]}>{option.title}</Text>
                      </View>
                      {option.image && (
                        <Image
                          source={option.image}
                          style={[styles.focusImage, { marginTop: 5 }]}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ),
          },
        ]),
    {
      id: "2",
      component: (
        <View style={{ alignContent: "center" }}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              What
              <Text style={{ color: colors.primary }}> equipment</Text> you have
              access to?
            </Text>
          </View>

          <View style={styles.equipmentContainer}>
            {equipment.map((equipment) => (
              <TouchableOpacity
                key={equipment}
                style={[
                  styles.equipmentButton,
                  {
                    backgroundColor:
                      selectedEquipment === equipment
                        ? colors.primary
                        : colors.secondary,
                  },
                ]}
                onPress={() => handleEquipmentButtonPress(equipment)}
              >
                <Text style={styles.equipmentButtonText}>{equipment}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      id: "3",
      component: (
        <View style={{ alignContent: "center" }}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Pick your training{" "}
              <Text style={{ color: colors.primary }}>time</Text> for today.
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              marginTop: 190,
              alignSelf: "center",
            }}
          >
            <Text style={styles.questionTitle}>
              Slide to choose how long you want to train.
            </Text>
            <View style={styles.sliderValues}>
              <Text style={styles.sliderValuesText}>15 min</Text>
              <Text style={styles.currentValue}>
                {Math.round(duration)} min
              </Text>
              <Text style={styles.sliderValuesText}>+90 min</Text>
            </View>
            <Slider
              style={{ width: 330, height: 40 }}
              minimumValue={15}
              maximumValue={105}
              minimumTrackTintColor={colors.primary}
              value={duration}
              onValueChange={handleDurationChange}
              tapToSeek={true}
            />
          </View>
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {!workoutData.currentWorkoutPlan && !loading ? (
        <>
          <PagerView
            style={{ flex: 1 }}
            initialPage={0}
            scrollEnabled={true}
            ref={pagerRef}
            onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}
          >
            {questions.map((item) => (
              <View key={item.id} style={{ flex: 1 }}>
                {item.component}
              </View>
            ))}
          </PagerView>
          <View style={styles.paginationDotsContainer}>
            {questions.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.paginationDots,
                  {
                    backgroundColor:
                      currentIndex === idx ? colors.primary : colors.secondary,
                    opacity: currentIndex === idx ? 1 : 0.7,
                  },
                ]}
              />
            ))}
          </View>
          <TouchableOpacity onPress={nextScreen} style={styles.generateButton}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttontitle}>
                {currentIndex === questions.length - 1 ? "Finish" : "Next"}
              </Text>
              <Icon name="chevron-right" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {loading ? (
            <View style={{ top: 200, alignItems: "center" }}>
              <AutoReverseLottie />
              <Text style={styles.loadingText}>Generating workout plan...</Text>
            </View>
          ) : (
            <WorkoutPlanDisplay
              plan={workoutData.currentWorkoutPlan}
              setCurrentIndex={setCurrentIndex}
            />
          )}
        </>
      )}
      {showErrorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error generating workout plan. Please try again.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignSelf: "center",
  },
  flatListContainer: {
    justifyContent: "center",
  },
  paginationDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    alignSelf: "center",
    bottom: 200,
    zIndex: 10,
  },
  paginationDots: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 6,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 70,
    width: 400,
    alignSelf: "center",
    alignItems: "center",
  },
  equipmentContainer: {
    width: 400,
    gap: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    top: 120,
  },
  questionTitle: {
    fontSize: 20,
    alignSelf: "center",
    textAlign: "left",
    color: "#FFFFFF",
    marginBottom: 20,
    fontWeight: 300,
    lineHeight: 25,
  },
  sliderValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 320,
  },
  sliderValuesText: {
    fontSize: 16,
    color: "#5D5F60",
  },
  currentValue: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "600",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 290,
  },
  optionButton: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 10,
    width: "31%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
    width: 100,
    fontWeight: "500",
    textAlign: "center",
  },
  selectedText: {
    color: "#000000",
    fontWeight: "600",
  },
  titleDescription: {
    fontSize: 18,
    top: 50,
    color: "#FFFFFF",
    textAlign: "left",
    width: 290,
    fontWeight: 300,
    lineHeight: 25,
  },
  backgroundImage: {
    width: "100%",
    height: "110%",
    position: "absolute",
    resizeMode: "cover",
  },
  equipmentButton: {
    width: 320,
    borderRadius: 20,
    borderCurve: "continuous",
    padding: 30,
    justifyContent: "center",
  },
  equipmentButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  buttontitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: 600,
    textAlign: "left",
    paddingLeft: 20,
  },
  title: {
    fontSize: 35,
    color: "#FFFFFF",
    textAlign: "left",
    width: 360,
    fontWeight: 400,
    letterSpacing: 1,
    lineHeight: 40,
  },
  titleGoal: {
    fontSize: 35,
    color: colors.textHighlight,
    fontWeight: 500,
    letterSpacing: 1,
    top: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  generateButton: {
    backgroundColor: colors.primary,
    width: 320,
    height: 75,
    bottom: 100,
    alignSelf: "center",
    position: "absolute",
    borderRadius: 20,
    borderCurve: "continuous",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  focusImage: {
    resizeMode: "cover",
    width: 100,
    height: 100,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textHighlight,
    textAlign: "center",
    fontWeight: "500",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4405F",
    padding: 20,
    borderRadius: 20,
    borderCurve: "continuous",
    marginTop: 70,
    alignSelf: "center",
  },
  errorText: {
    color: "white",
    fontSize: 18,
    fontWeight: "300",
    textAlign: "center",

    alignSelf: "center",
    justifyContent: "center",
  },
});
