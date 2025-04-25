import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
} from "react-native";
import { useState, useRef } from "react";
import { useWorkout } from "../contexts/WorkoutContext";
import { router } from "expo-router";
import Slider from "@react-native-community/slider";
import Icon from "@expo/vector-icons/FontAwesome";
import Animated, { FadeIn } from "react-native-reanimated";
import { WORKOUT_GOALS } from "@/types/workout";
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
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null
  );

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
      updateWorkoutData({
        goal: selectedGoal || "",
        equipment: selectedEquipment || "",
        duration: duration.toString(),
        level: "0", // Add state for this if needed
      });

      router.push("/(tabs)");
    }
  };

  const handleGoalButtonPress = (goal: string) => {
    setSelectedGoal(goal);
    updateWorkoutData({ goal });
  };
  const handleEquipmentButtonPress = (equipment: string) => {
    setSelectedEquipment(equipment);
    updateWorkoutData({ equipment });
  };
  const handleDurationChange = (value: number) => {
    setDuration(value);
    updateWorkoutData({ duration: value.toString() });
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
          <View style={{ width: 350, alignItems: "center", gap: 50 }}>
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
                style={{ width: 300, height: 40 }}
                minimumValue={15}
                maximumValue={105}
                minimumTrackTintColor="#FFA31A"
                value={duration}
                onValueChange={handleDurationChange}
                tapToSeek={true}
              />
            </View>
          </View>
        </Animated.View>
      ),
    },
    {
      id: "2",
      component: (
        <Animated.View entering={FadeIn}>
          <View style={{ width: 350, alignItems: "center", gap: 50 }}>
            <View>
              <Text style={styles.questionTitle}>
                What’s your long time goal?
              </Text>
              <View style={styles.goalsContainer}>
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
                    onPress={() => handleGoalButtonPress(goal)} // Fix is here
                  >
                    <Text style={styles.goalButtonText}>{goal}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View>
              <Text style={styles.questionTitle}>
                What equipment do you have access to?
              </Text>
              <View style={styles.goalsContainer}>
                {equipment.map((equipment) => (
                  <TouchableOpacity
                    key={equipment}
                    style={[
                      styles.equipmentButton,
                      {
                        backgroundColor:
                          selectedEquipment === equipment
                            ? "#FFA31A"
                            : "#1E2022",
                      },
                    ]}
                    onPress={() => handleEquipmentButtonPress(equipment)} // Fix is here
                  >
                    <Text style={styles.equipmentButtonText}>{equipment}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Just a few quick <Text style={{ color: "#FFA31A" }}> questions</Text>
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
    height: 400,
    top: 150,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 290,
  },
  title: {
    fontSize: 40,
    color: "#FFFFFF",
    top: 100,
    textAlign: "left",
    width: 330,
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
  equipmentButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  questionTitle: {
    fontSize: 20,
    alignSelf: "center",
    textAlign: "left",
    color: "#FFFFFF",
    marginBottom: 20,
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
