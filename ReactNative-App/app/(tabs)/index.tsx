import { useState, useRef, JSX, useEffect, use } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
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
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp,
  withSpring,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
export default function HomeScreen() {
  const [duration, setDuration] = useState(60);
  const [selectedEquipment, setSelectedEquipment] = useState("No Equipment");
  const { updateWorkoutData, workoutData } = useWorkout();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showWorkoutPlan, setShowWorkoutPlan] = useState(false);
  const flatListRef = useRef<FlatList<QuestionItem>>(null);

  interface QuestionItem {
    id: string;
    component: JSX.Element;
  }
  const equipment = [
    "No Equipment",
    "Home Gym Equipment",
    "Basic Gym Equipment ",
  ];

  const nextScreen = () => {
    if (currentIndex < questions.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      // Save all data before navigation
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
    setShowWorkoutPlan(true);
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
            setPlan(generatedPlan);
            updateWorkoutData({
              workoutGenerated: true,
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
      setPlan(null);
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };
  const getItemLayout = (_: any, index: number) => ({
    length: 350,
    offset: 350 * index,
    index,
  });
  const renderItem = ({ item }: { item: QuestionItem }) => item.component;
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
                    Ready to improve your{" "}
                    <Text style={{ color: "#FFA31A" }}>{workoutData.goal}</Text>{" "}
                    today?
                  </Text>
                  <Text style={styles.titleDescription}>
                    What are we working on today?
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
                        <Text
                          style={[
                            styles.optionText,
                            workoutData.focus === option.title &&
                              styles.selectedText,
                          ]}
                        >
                          {option.title}
                        </Text>
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
              <Text style={{ color: "#FFA31A" }}> equipment</Text> You have
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
                      selectedEquipment === equipment ? "#FFA31A" : "#1E2022",
                  },
                ]}
                onPress={() => handleEquipmentButtonPress(equipment)} // Fix is here
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
              Pick your training <Text style={{ color: "#FFA31A" }}>time</Text>{" "}
              for today.
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              width: 400,
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
              minimumTrackTintColor="#FFA31A"
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
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        source={require("../../assets/images/background2.png")}
        style={styles.backgroundImage}
      />
      {!showWorkoutPlan ? (
        <>
          <Animated.FlatList<QuestionItem>
            ref={flatListRef}
            data={questions}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            getItemLayout={getItemLayout}
            keyExtractor={(item) => item.id}
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={styles.flatListContainer}
          />
          <TouchableOpacity
            onPress={() => {
              nextScreen();
            }}
            style={styles.generateButton}
          >
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
            <View style={{ top: 300, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#FFA500" style={{}} />
              <Text style={styles.loadingText}>Generating workout plan...</Text>
            </View>
          ) : (
            <WorkoutPlanDisplay
              plan={plan}
              setShowWorkoutPlan={setShowWorkoutPlan}
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
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 20,
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
    top: 100,
  },
  questionTitle: {
    fontSize: 20,
    alignSelf: "center",
    textAlign: "left",
    color: "#FFFFFF",
    marginBottom: 20,
    width: 330,
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
    color: "#FFA31A",
    fontWeight: "600",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 290,
  },
  optionButton: {
    backgroundColor: "#1E2022",
    padding: 16,
    borderRadius: 10,
    width: "31%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#FFA31A",
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
    top: 10,
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
    width: 300,
    borderRadius: 10,
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
    width: 350,
    fontWeight: 400,
    letterSpacing: 1,
    lineHeight: 40,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  generateButton: {
    backgroundColor: "#FFA31A",
    width: 320,
    height: 75,
    bottom: 100,
    alignSelf: "center",
    position: "absolute",
    borderRadius: 20,
    borderCurve: "continuous",
    justifyContent: "center",
    shadowColor: "#FFA31A",
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
    color: "#FFA500",
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
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
