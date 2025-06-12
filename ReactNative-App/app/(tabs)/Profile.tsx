import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useWorkout } from "@/contexts/WorkoutContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  navigateToGoalSelection,
  navigateToLevelSelection,
} from "@/utils/navigationHelpers";
import colors from "@/styles/colors";
import {
  WORKOUT_GOALS_DISPLAY,
  WORKOUT_GOALS_SPORTS_DISPLAY,
} from "@/types/workout";

export default function Profile() {
  const { workoutData } = useWorkout();
  const screenWidth = Dimensions.get("window").width;
  let caption = "Welcome!";
  if (workoutData.userCreatedAt) {
    const created = new Date(workoutData.userCreatedAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMonths >= 1) {
      caption = `${diffMonths} month${diffMonths > 1 ? "s" : ""} and counting`;
    } else if (diffDays >= 1) {
      caption = `${diffDays} day${diffDays > 1 ? "s" : ""} and counting`;
    } else {
      caption = "Joined today";
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Trainee{"\n"} Overview</Text>
        <Text style={styles.caption}>{caption}</Text>

        <View style={styles.grid}>
          <TouchableOpacity onPress={navigateToLevelSelection}>
            <View style={styles.box}>
              <Text style={styles.levelText}>Experience Level</Text>
              <View style={styles.levelCircle}>
                <Text
                  style={[
                    styles.levelNumber,
                    workoutData.level &&
                    workoutData.level.toString().length >= 3
                      ? { fontSize: 25 }
                      : null,
                  ]}
                >
                  {workoutData.level}
                </Text>
              </View>
              <View style={styles.tapToUpdateContainer}>
                <Text style={styles.changeGoalText}>Tap to Update</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={16}
                  color="#007AFF"
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToGoalSelection}>
            <View style={styles.box}>
              <Text style={styles.levelText}>Current Goal</Text>
              <View
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.goalText}>
                  {WORKOUT_GOALS_DISPLAY[
                    workoutData.goal as keyof typeof WORKOUT_GOALS_DISPLAY
                  ] ||
                    WORKOUT_GOALS_SPORTS_DISPLAY[
                      workoutData.goal as keyof typeof WORKOUT_GOALS_SPORTS_DISPLAY
                    ] ||
                    workoutData.goal}
                </Text>
              </View>
              <View style={styles.tapToUpdateContainer}>
                <Text style={styles.changeGoalText}>Change goal</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={16}
                  color="#007AFF"
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
  container: { flex: 1, backgroundColor: colors.background },
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
    backgroundColor: colors.secondary,
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
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  levelText: {
    color: colors.textPrimary,
    fontWeight: "500",
    fontSize: 15,
    position: "absolute",
    top: 15,
  },
  levelNumber: {
    color: "white",
    fontSize: 30,
    fontWeight: "600",
  },
  goalLabel: {
    color: colors.primary,
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
  },
  goalText: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "600",
    width: 160,
    textAlign: "center",
    position: "absolute",
  },
  tapToUpdateContainer: {
    flexDirection: "row",
    position: "absolute",
    left: 5,
    right: 0,
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  changeGoalText: {
    color: "#007AFF",
    fontSize: 14,
  },
  chartBox: {
    backgroundColor: colors.secondary,
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
