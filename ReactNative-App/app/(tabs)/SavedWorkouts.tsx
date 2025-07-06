import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, SafeAreaView } from "react-native";
import { useFocusEffect } from "expo-router";
import { WorkoutPlan } from "@/types/workout";
import { CollapsibleWorkout } from "@/components/CollapsibleWorkout";
import colors from "@/styles/colors";
import { fetchSavedWorkouts } from "@/assets/services/storage/workoutStorage";
export default function SavedWorkouts() {
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutPlan[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadSavedWorkouts = async () => {
        try {
          const workouts = await fetchSavedWorkouts();
          // Sort by timestamp or completedAt, newest first
          const sorted = workouts.slice().sort((a, b) => {
            const timeA = new Date(a.timestamp || 0).getTime();
            const timeB = new Date(b.timestamp || 0).getTime();
            return timeB - timeA; // Newest first
          });
          setSavedWorkouts(sorted);
        } catch (error) {
          console.error("Error loading saved workouts:", error);
        }
      };

      loadSavedWorkouts();
    }, [])
  );

  const renderWorkout = ({ item }: { item: WorkoutPlan }) => (
    <CollapsibleWorkout workout={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {savedWorkouts.length === 0 ? (
        <Text style={styles.noWorkouts}>No saved workouts yet...</Text>
      ) : (
        <FlatList
          ListHeaderComponent={<Text style={styles.title}>My Plans </Text>}
          data={savedWorkouts}
          renderItem={renderWorkout}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
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
    gap: 10,
  },
  noWorkouts: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
  },
  Headersection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    width: 300,
    fontWeight: "400",
    textAlign: "center",
    color: "#FFFFFF",
    alignSelf: "center",
    marginBottom: 20,
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
