import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
} from "react-native";
import { useState, useRef, JSX } from "react";
import { useWorkout } from "../contexts/WorkoutContext";
import { router } from "expo-router";
import Slider from "@react-native-community/slider";
import Icon from "@expo/vector-icons/FontAwesome";
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
import { WORKOUT_GOALS, WORKOUT_GOALS_SPORTS } from "@/types/workout";
interface QuestionItem {
  id: string;
  component: JSX.Element;
}
export default function IntroScreen() {
  const { updateWorkoutData } = useWorkout();
  const [duration, setDuration] = useState(15);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<QuestionItem>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const GENDER_OPTIONS = ["Female", "Male", "Other"];
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null
  );
  const [showFitnessGoals, setShowFitnessGoals] = useState(false);
  const [showSportsGoals, setShowSportsGoals] = useState(false);
  const fitnessHeight = useSharedValue(0);
  const sportsHeight = useSharedValue(0);
  const toggleFitnessMenu = () => {
    if (showSportsGoals) {
      sportsHeight.value = withTiming(0, { duration: 300 });
      setShowSportsGoals(false);
    }

    fitnessHeight.value = withTiming(showFitnessGoals ? 0 : 120, {
      duration: 300,
    });
    setShowFitnessGoals(!showFitnessGoals);
  };
  const toggleSportsMenu = () => {
    if (showFitnessGoals) {
      fitnessHeight.value = withTiming(0, { duration: 300 });
      setShowFitnessGoals(false);
    }

    sportsHeight.value = withTiming(showSportsGoals ? 0 : 180, {
      duration: 300,
    });
    setShowSportsGoals(!showSportsGoals);
  };

  const fitnessAnimatedStyle = useAnimatedStyle(() => ({
    height: fitnessHeight.value,
    opacity: withTiming(fitnessHeight.value === 0 ? 0 : 1),
    overflow: "hidden",
  }));

  const sportsAnimatedStyle = useAnimatedStyle(() => ({
    height: sportsHeight.value,
    opacity: withTiming(sportsHeight.value === 0 ? 0 : 1),
    overflow: "hidden",
  }));
  const nextScreen = () => {
    if (currentIndex < questions.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      // Save all data before navigation
      updateWorkoutData({
        goal: selectedGoal || "",
        equipment: selectedEquipment || "",
        duration: duration.toString(),
        level: "0", // Add state for this if needed
        gender: selectedGender || "",
      });

      router.push("/(tabs)");
    }
  };
  const handleGenderButtonPress = (gender: string) => {
    setSelectedGender(gender);
    updateWorkoutData({ gender });
  };
  const handleGoalButtonPress = (goal: string) => {
    setSelectedGoal(goal);
    updateWorkoutData({ goal });
  };

  const handleLevelChange = (value: number) => {
    updateWorkoutData({ level: value.toString() });
  };

  const renderItem = ({ item }: { item: QuestionItem }) => item.component;
  const questions: QuestionItem[] = [
    {
      id: "1",
      component: (
        <Animated.View entering={FadeIn}>
          <View
            style={{
              width: 350,
              alignItems: "center",
              gap: 50,
              height: 400,
            }}
          >
            <View>
              <Text style={styles.questionTitle}>
                How would you rate your fitness experience?
              </Text>
              <View style={styles.sliderValues}>
                <Text style={styles.sliderValuesText}>Beginner </Text>
                <Text style={styles.sliderValuesText}>Expert</Text>
              </View>
              <Slider
                style={{ width: 300, height: 40 }}
                minimumValue={0}
                maximumValue={10}
                minimumTrackTintColor="#FFA31A"
                tapToSeek={true}
                onValueChange={handleLevelChange}
              />
            </View>
            <View>
              <Text style={styles.questionTitle}>
                What gender do you identify as?
              </Text>

              <View style={styles.genderContainer}>
                {GENDER_OPTIONS.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.goalButton,
                      {
                        backgroundColor:
                          selectedGender === gender ? "#FFA31A" : "#1E2022",
                      },
                    ]}
                    onPress={() => handleGenderButtonPress(gender)}
                  >
                    <Text style={styles.goalButtonText}>{gender}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      ),
    },
    {
      id: "2",
      component: (
        <Animated.View entering={FadeIn}>
          <View
            style={{
              width: 350,
              alignItems: "center",
              gap: 50,

              height: 400,
            }}
          >
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginVertical: 15,
                }}
                onPress={toggleFitnessMenu}
              >
                <Text style={styles.questionTitle}>Fitness? </Text>
                <Icon
                  name={showFitnessGoals ? "chevron-down" : "chevron-right"}
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              <Animated.View
                style={[styles.goalsContainer, fitnessAnimatedStyle]}
              >
                {WORKOUT_GOALS.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.goalButton,
                      {
                        backgroundColor:
                          selectedGoal === goal ? "#FFA31A" : "#1E2022",
                      },
                    ]}
                    onPress={() => handleGoalButtonPress(goal)}
                  >
                    <Text style={styles.goalButtonText}>{goal}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginVertical: 15,
                }}
                onPress={toggleSportsMenu}
              >
                <Text style={styles.questionTitle}>Sport performance?</Text>
                <Icon
                  name={showSportsGoals ? "chevron-down" : "chevron-right"}
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <Animated.View
                style={[styles.goalsContainer, sportsAnimatedStyle]}
              >
                {WORKOUT_GOALS_SPORTS.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[
                      styles.goalButton,
                      {
                        backgroundColor:
                          selectedGoal === goal ? "#FFA31A" : "#1E2022",
                      },
                    ]}
                    onPress={() => handleGoalButtonPress(goal)}
                  >
                    <Text style={styles.goalButtonText}>{goal}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </View>
          </View>
        </Animated.View>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {currentIndex === 0 ? (
          <>
            Just a few quick <Text style={{ color: "#FFA31A" }}>questions</Text>
          </>
        ) : (
          <>
            Choose your primary <Text style={{ color: "#FFA31A" }}>goal</Text>
          </>
        )}
      </Text>
      <Animated.FlatList<QuestionItem>
        ref={flatListRef}
        data={questions}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        style={{ flex: 1, width: 350 }}
        contentContainerStyle={styles.flatListContainer}
      />

      <TouchableOpacity style={styles.button} onPress={nextScreen}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
          </Text>
          <Icon name="chevron-right" size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101213",
  },
  flatListContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 290,
  },
  title: {
    fontSize: 40,
    color: "#FFFFFF",
    position: "absolute",
    textAlign: "left",
    width: 330,
    top: 100,
    fontWeight: 400,
    letterSpacing: 1,
    lineHeight: 40,
  },
  sliderValuesText: {
    fontSize: 15,
    color: "#5D5F60",
  },
  sliderValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
  },
  currentValue: {
    fontSize: 15,
    color: "#FFA31A",
    fontWeight: "600",
  },
  goalsContainer: {
    flexDirection: "row",
    width: 350,
    flexWrap: "wrap",
    gap: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Add this
  },
  goalButton: {
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
  },
  goalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  equipmentButton: {
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
  },
  genderContainer: {
    flexDirection: "row",
    width: 350,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  equipmentButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  questionTitle: {
    fontSize: 22,
    alignSelf: "center",
    textAlign: "left",
    color: "#FFFFFF",
    marginBottom: 20,
    marginTop: 20,
    width: 300,
    fontWeight: 300,
    lineHeight: 25,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
  },
  button: {
    backgroundColor: "#FFA31A",
    width: 320,
    height: 75,
    bottom: 60,
    position: "absolute",
    borderRadius: 20,
    borderCurve: "continuous",
    justifyContent: "center",
    shadowColor: "#FFA31A",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: 600,
    textAlign: "left",
    paddingLeft: 20,
  },
});
