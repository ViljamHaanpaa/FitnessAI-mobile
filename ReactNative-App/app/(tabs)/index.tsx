import { useState, useRef, JSX, useEffect, useCallback } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import {
  AutoReverseLottie,
  LoadingTextCarousel,
} from "@/components/animations/AutoReverseLottie";
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
    "No Equipment 🏃‍♂️",
    "Home Gym Equipment 🏠🏋️",
    "Basic Gym Equipment 🏋️‍♂️",
    "Sport-Specific Equipment 🏌️‍♂️⚽️",
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

    if (WORKOUT_GOALS_SPORTS.includes(workoutData.goal as WorkoutGoalSport)) {
      return (
        WORKOUT_FOCUS_OPTIONS_SPORTS[workoutData.goal as WorkoutGoalSport] || []
      );
    }

    return WORKOUT_FOCUS_OPTIONS[workoutData.goal as WorkoutGoal] || [];
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      if (!workoutData.goal || !workoutData.level) {
        throw new Error("Missing workout data");
      }
      setShowErrorMessage(false);

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
        throw error;
      }

      throw new Error(
        "Failed to generate workout plan after multiple attempts"
      );
    } catch (error) {
      console.error("Error generating plan:", error);
      showErrorAlert();
    } finally {
      setLoading(false);
    }
  };

  const showErrorAlert = () => {
    Alert.alert(
      "Error",
      "Failed to generate workout plan. Please try again.",
      [
        {
          text: "OK",
          onPress: () => {
            updateWorkoutData({ currentWorkoutPlan: null });
          },
        },
      ],
      { cancelable: false }
    );
  };
  const questions: QuestionItem[] = [
    ...(workoutData.goal && !getCurrentFocusOptions().length
      ? []
      : [
          {
            id: "1",
            component: (
              <ScrollView
                contentContainerStyle={{ paddingBottom: 190 }}
                showsVerticalScrollIndicator={false}
              >
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
                      onPress={() =>
                        updateWorkoutData({
                          focus: option.title,
                          focusPrompt: option.prompt,
                        })
                      }
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
              </ScrollView>
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
              Select your workout duration
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
          <View
            style={{
              position: "absolute",
              bottom: 75,
              width: "100%",
              height: 100,
            }}
          >
            <BlurView
              intensity={20}
              tint="dark"
              style={{
                ...StyleSheet.absoluteFillObject,
              }}
            />
            <LinearGradient
              colors={[
                "rgba(9,21,33,0.0)", // ylhäällä täysin läpinäkyvä
                "rgba(9,21,33,0.05)", // kevyttä sävyä
                "rgba(9,21,33,0.1)", // vähän enemmän
                "rgba(9,21,33,0.15)", // alhaalla "sumuisin"
              ]}
              style={StyleSheet.absoluteFill}
            />
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
              <LoadingTextCarousel />

              <AutoReverseLottie />
              <Text style={styles.loadingText}>
                Hold on a sec! Your workout’s loading — don’t close the app.
              </Text>
            </View>
          ) : (
            <WorkoutPlanDisplay
              plan={workoutData.currentWorkoutPlan}
              setCurrentIndex={setCurrentIndex}
            />
          )}
        </>
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
    fontSize: 15,
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
    width: 250,
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
