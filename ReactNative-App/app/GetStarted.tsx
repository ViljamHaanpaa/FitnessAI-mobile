import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
} from "react-native";
import { useState, useRef, JSX, useEffect } from "react";
import { useWorkout } from "../contexts/WorkoutContext";
import Slider from "@react-native-community/slider";
import Icon from "@expo/vector-icons/FontAwesome";
import Animated, { FadeIn } from "react-native-reanimated";
import { ChoosePrimaryGoal } from "@/components/ChoosePrimaryGoal";
import { useLocalSearchParams, router } from "expo-router";
import colors from "../styles/colors";
interface QuestionItem {
  id: string;
  component: JSX.Element;
}
export default function IntroScreen() {
  const { updateWorkoutData } = useWorkout();
  const flatListRef = useRef<FlatList<QuestionItem>>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const GENDER_OPTIONS = ["Female", "Male", "Other"];
  const params = useLocalSearchParams();
  const initialIndex = params.index ? Number(params.index) - 1 : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  useEffect(() => {
    if (initialIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: initialIndex,
        animated: false,
      });
    }
  }, []);
  const nextScreen = () => {
    if (currentIndex < questions.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
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
    <View style={styles.container}>
      <Text style={styles.title}>
        {currentIndex === 0 ? (
          <>
            Just a few quick{" "}
            <Text style={{ color: colors.primary }}>questions</Text>
          </>
        ) : (
          <>
            Choose your primary{" "}
            <Text style={{ color: colors.primary }}>goal</Text>
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
        getItemLayout={getItemLayout}
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
    backgroundColor: colors.background,
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
