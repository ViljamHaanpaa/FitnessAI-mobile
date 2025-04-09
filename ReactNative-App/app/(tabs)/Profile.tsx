import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useWorkout } from "@/contexts/WorkoutContext";

export default function Profile() {
  const { workoutData } = useWorkout();

  return (
    <View style={styles.container}>
      <View style={styles.Headersection}>
        <Image
          source={require("../../assets/images/ProfileAvatars/Male1.png")}
          style={styles.reactLogo}
        />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Trainee Infromation</Text>
        <View style={styles.infoContainersWrapper}>
          <Text style={styles.infoboxTitle}>Skill level</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}> {workoutData.level}</Text>
          </View>
          <Text style={styles.infoboxTitle}>Equipment</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}> {workoutData.equipment}</Text>
          </View>

          <Text style={styles.infoboxTitle}>Gender</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}> {workoutData.gender}</Text>
          </View>
          <Text style={styles.infoboxTitle}>Fitness goal</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}> {workoutData.goal}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "#101213",
    height: 800,
    marginTop: 70,
    borderRadius: 50,
    borderCurve: "continuous",
  },
  infoboxTitle: {
    color: "#5D5F60",
    fontSize: 16,
    fontWeight: "300",
    marginTop: 20,
    marginBottom: 2,
    left: 15,
  },
  infoContainer: {
    padding: 20,
    borderWidth: 2,
    borderColor: "#1B1D1E",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderCurve: "continuous",
  },
  infoContainersWrapper: {
    width: 330,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
  },

  titleText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#1A1C20",
    marginBottom: 50,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  infoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  Headersection: {
    width: 180,
    height: 180,
    alignSelf: "center",
    top: 65,
    justifyContent: "center",
  },
  title: {
    marginTop: 50,
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 16,
    color: "#FFFFFF",
    alignSelf: "center",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  generateButton: {
    backgroundColor: "#FFA500",
    width: 200,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderCurve: "continuous",
    alignSelf: "center",
    marginBottom: 30,
    marginTop: 30,
    shadowColor: "#FFA500",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  reactLogo: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
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
