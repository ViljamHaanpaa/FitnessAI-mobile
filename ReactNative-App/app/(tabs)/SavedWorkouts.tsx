import React, { useState, useCallback } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { WorkoutPlan } from "@/types/workout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { CollapsibleWorkout } from "@/components/CollapsibleWorkout";
import colors from "@/styles/colors";

export default function SavedWorkouts() {
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutPlan[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchSavedWorkouts = async () => {
        try {
          const workouts = await AsyncStorage.getItem("SavedWorkouts");
          if (workouts) {
            const parsedWorkouts: WorkoutPlan[] = JSON.parse(workouts);

            console.log("Parsed workouts:", parsedWorkouts);
            setSavedWorkouts(
              Array.isArray(parsedWorkouts) ? parsedWorkouts : [parsedWorkouts]
            );
          }
        } catch (error) {
          console.error("Error fetching saved workouts:", error);
        }
      };

      fetchSavedWorkouts();
    }, [])
  );
  const renderWorkout = ({ item }: { item: WorkoutPlan }) => (
    <CollapsibleWorkout workout={item} />
  );

  return (
    <View style={styles.container}>
      {savedWorkouts.length === 0 ? (
        <Text style={styles.noWorkouts}>No saved workouts yet</Text>
      ) : (
        <FlatList
          ListHeaderComponent={
            <Text style={styles.title}>
              Saved Workouts ({savedWorkouts.length})
            </Text>
          }
          data={savedWorkouts}
          renderItem={renderWorkout}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    gap: 30,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    marginBottom: 50,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  noWorkouts: {
    color: "#FFA500",
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
  Headersection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
