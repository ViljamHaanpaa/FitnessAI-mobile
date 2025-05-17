import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { WorkoutGoalSport } from "@/types/workout";
import { useWorkout } from "@/contexts/WorkoutContext";
import { WORKOUT_FOCUS_OPTIONS_SPORTS } from "../../assets/data/workouts/focusOptions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { navigateToGoalSelection } from "@/utils/navigationHelpers";
export default function Profile() {
  const { workoutData } = useWorkout();
  const screenWidth = Dimensions.get("window").width;
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
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/background2.png")}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Trainee{"\n"} Overview</Text>
        <Text style={styles.caption}>3 Months and Counting</Text>

        <View style={styles.grid}>
          <View style={styles.box}>
            <View style={styles.levelCircle}>
              <Text style={styles.levelText}>Level</Text>
              <Text style={styles.levelNumber}>{workoutData.level}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={navigateToGoalSelection}>
            <View style={styles.box}>
              <Text style={styles.goalLabel}>Current Goal {"  "}</Text>

              {focusImage && (
                <Image source={focusImage} style={styles.focusImage} />
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text style={styles.goalText}>{workoutData.goal}</Text>
                <MaterialCommunityIcons
                  name="pencil"
                  size={17}
                  color="grey"
                  style={{ left: 5 }}
                />
              </View>
            </View>
          </TouchableOpacity>
          <View style={[styles.chartBox, { width: screenWidth * 0.9 }]}>
            <Text style={styles.chartText}>Not enough data</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.metricLabel}>avg</Text>
            <Text style={styles.metricMain}>Session length</Text>
            <Text style={styles.metricValue}>52 min</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.streakText}>🔥 3-Day Streak</Text>
            <Text style={styles.lastSeen}>Last seen</Text>
            <Text style={styles.lastSeenDate}>Yesterday</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    width: "100%",
    height: "110%",
    position: "absolute",
    resizeMode: "cover",
  },
  focusImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    alignSelf: "center",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    paddingTop: 0,
  },
  title: {
    fontSize: 30,
    width: 300,
    fontWeight: "400",
    textAlign: "center",
    color: "#FFFFFF",
  },
  caption: {
    fontSize: 18,
    color: "gray",
    marginBottom: 40,
  },
  grid: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  box: {
    backgroundColor: "#101213",
    width: 170,
    height: 170,
    borderRadius: 15,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  levelCircle: {
    borderWidth: 8,
    borderColor: "limegreen",
    borderRadius: 100,
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  levelText: {
    color: "white",
    fontSize: 16,
  },
  levelNumber: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  goalLabel: {
    color: "white",
    fontSize: 17,
    marginBottom: 10,
    textAlign: "center",
  },
  goalText: {
    color: "orange",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    alignSelf: "center",
    left: 5,
  },
  chartBox: {
    backgroundColor: "#101213",
    height: 170,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  chartText: {
    color: "gray",
    fontSize: 14,
  },
  metricLabel: {
    color: "gray",
    fontSize: 12,
  },
  metricMain: {
    color: "white",
    fontSize: 14,
  },
  metricValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  streakText: {
    color: "orange",
    fontSize: 14,
    fontWeight: "bold",
  },
  lastSeen: {
    color: "gray",
    fontSize: 12,
    marginTop: 5,
  },
  lastSeenDate: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
