import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { useState, useRef, JSX, useEffect } from "react";
import { useWorkout } from "../contexts/WorkoutContext";
import Slider from "@react-native-community/slider";
import Icon from "@expo/vector-icons/FontAwesome";
import Animated, { FadeIn } from "react-native-reanimated";
import { ChoosePrimaryGoal } from "@/components/ChoosePrimaryGoal";
import { useLocalSearchParams, router } from "expo-router";
import PagerView from "react-native-pager-view";

import colors from "../styles/colors";
interface QuestionItem {
  id: string;
  component: JSX.Element;
}
export default function IntroScreen() {
  const { updateWorkoutData } = useWorkout();
  const flatListRef = useRef<PagerView>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const GENDER_OPTIONS = ["Female", "Male", "Other"];
  const params = useLocalSearchParams();
  const initialIndex = params.index ? Number(params.index) - 1 : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const { workoutData } = useWorkout();

  const nextScreen = () => {
    if (currentIndex < questions.length - 1) {
      flatListRef.current?.setPage(currentIndex + 1);
      setCurrentIndex(currentIndex + 1);
    } else {
      if (!workoutData.goal || workoutData.goal === "") {
        Alert.alert(
          "Choose a goal",
          "Please select a primary goal to continue.",
          [{ text: "OK" }]
        );
        return;
      }
      if (workoutData.userCreatedAt === null) {
        updateWorkoutData({ userCreatedAt: new Date().toISOString() });
      }
      router.push("/(tabs)");
    }
  };
  const handleGenderButtonPress = (gender: string) => {
    setSelectedGender(gender);
    updateWorkoutData({ gender });
  };
  const getItemLayout = (_: any, index: number) => ({
    length: 350,
    offset: 350 * index,
    index,
  });
  const handleLevelChange = (value: number) => {
    const formattedValue = value.toFixed(1);
    updateWorkoutData({ level: formattedValue });
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
              marginTop: 20,
            }}
          >
            <Text style={styles.title}>
              Just a few quick{" "}
              <Text style={{ color: colors.primary }}>questions</Text>
            </Text>
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
                value={Number(workoutData.level)}
                minimumTrackTintColor={colors.primary}
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
                          selectedGender === gender
                            ? colors.primary
                            : colors.secondary,
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
          <ChoosePrimaryGoal />
        </Animated.View>
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <PagerView
        style={{ flex: 1, width: 350 }}
        initialPage={currentIndex}
        scrollEnabled={true}
        onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}
        ref={flatListRef}
      >
        {questions.map((item, idx) => (
          <View key={item.id} style={styles.flatListContainer}>
            {renderItem({ item })}
          </View>
        ))}
      </PagerView>

      <TouchableOpacity style={styles.button} onPress={nextScreen}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
          </Text>
          <Icon name="chevron-right" size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.background,
  },
  flatListContainer: {
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
    textAlign: "left",
    alignSelf: "center",
    marginTop: 10,
    fontWeight: 400,
    letterSpacing: 1,
    lineHeight: 40,
  },
  sliderValuesText: {
    fontSize: 15,
    color: colors.greyPrimary,
  },
  sliderValues: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
  },
  currentValue: {
    fontSize: 15,
    color: colors.primary,
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
    overflow: "hidden",
  },
  goalButton: {
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
  },
  goalButtonText: {
    color: colors.textPrimary,
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
    backgroundColor: colors.primary,
    width: 320,
    height: 75,
    bottom: 60,
    position: "absolute",
    borderRadius: 20,
    borderCurve: "continuous",
    justifyContent: "center",
    shadowColor: colors.primary,
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
