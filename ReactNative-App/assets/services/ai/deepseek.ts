import { WorkoutData } from "@/types/workout";
const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
const API_URL = "https://api.deepseek.com/v1/chat/completions";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getRecentWorkoutHistory = async (count = 5) => {
  const completedWorkoutsString = await AsyncStorage.getItem(
    "CompletedWorkouts"
  );
  if (!completedWorkoutsString) return [];
  const completedWorkouts = JSON.parse(completedWorkoutsString);
  return completedWorkouts.slice(-count).map((w: any) => {
    let completedExercises: string[] = [];
    if (
      w.completedExercises &&
      typeof w.completedExercises === "object" &&
      !Array.isArray(w.completedExercises)
    ) {
      completedExercises = Object.entries(w.completedExercises)
        .filter(
          ([name, done]) =>
            done && typeof name === "string" && isNaN(Number(name))
        )
        .map(([name]) => name);
    } else if (Array.isArray(w.completedExercises)) {
      // fallback for legacy/bad data
      completedExercises = (w.completedExercises as string[]).filter(
        (v: string) => typeof v === "string" && isNaN(Number(v))
      );
    }
    return {
      title: w.title,
      date: w.completedAt,
      completedExercises,
    };
  });
};

export const generateWorkoutPlan = async (workoutData: WorkoutData) => {
  console.log("Generating workout plan...");
  const recentHistory = await getRecentWorkoutHistory(5);
  console.log("Recent workout history:", recentHistory);
  const toolSchema = {
    type: "function",
    function: {
      name: "get_workout_plan",
      description: "Generate a structured workout plan in JSON format",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Workout title" },
          duration: {
            type: "string",
            description: "Duration in seconds (e.g. '120')",
          },
          gender: { type: "string" },
          equipment: { type: "string" },
          timestamp: { type: "string" },
          warmup: {
            type: "object",
            properties: {
              duration: {
                type: "string",
                description: "Duration in seconds (e.g. '120')",
              },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    type: {
                      type: "string",
                      description: "Exercise type: 'time' or 'reps'",
                    },
                    duration: {
                      type: "string",
                      description: "Duration in seconds (e.g. '120')",
                    },
                    description: { type: "string" },
                    instructions: {
                      type: "object",
                      description:
                        "Step-by-step instructions for the exercise. Each key is step1, step2, etc.",
                      properties: {
                        step1: {
                          type: "string",
                          description: "Short, clear instruction for step 1",
                        },
                        step2: {
                          type: "string",
                          description: "Short, clear instruction for step 2",
                        },
                      },
                      additionalProperties: true,
                    },
                    wikihow: {
                      type: "string",
                      description:
                        "WikiHow link for the exercise, if available",
                    },
                  },
                  required: [
                    "name",
                    "type",
                    "duration",
                    "description",
                    "instructions",
                    "wikihow",
                  ],
                },
              },
            },
            required: ["duration", "exercises"],
          },
          mainWorkout: {
            type: "object",
            properties: {
              duration: {
                type: "string",
                description: "Duration in seconds (e.g. '120')",
              },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    type: {
                      type: "string",
                      description: "Exercise type: 'time' or 'reps'",
                    },
                    sets: { type: "number" },
                    reps: { type: "string" },
                    rest: { type: "string" },
                    duration: {
                      type: "string",
                      description:
                        "Duration in seconds (for time-based exercises)",
                    },
                    description: { type: "string" },
                    instructions: {
                      type: "object",
                      description:
                        "Step-by-step instructions for the exercise. Each key is step1, step2, etc.",
                      properties: {
                        step1: {
                          type: "string",
                          description: "Short, clear instruction for step 1",
                        },
                        step2: {
                          type: "string",
                          description: "Short, clear instruction for step 2",
                        },
                      },
                      additionalProperties: true,
                    },
                    wikihow: {
                      type: "string",
                      description:
                        "WikiHow link for the exercise, if available",
                    },
                  },
                  required: [
                    "name",
                    "type",
                    "sets",
                    "reps",
                    "rest",
                    "description",
                    "instructions",
                    "wikihow",
                  ],
                },
              },
            },
            required: ["duration", "exercises"],
          },
          cooldown: {
            type: "object",
            properties: {
              duration: {
                type: "string",
                description: "Duration in seconds (e.g. '120')",
              },
              stretches: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    type: {
                      type: "string",
                      description: "Exercise type: 'time' or 'reps'",
                    },
                    duration: {
                      type: "string",
                      description: "Duration in seconds (e.g. '120')",
                    },
                    description: { type: "string" },
                    instructions: {
                      type: "object",
                      description:
                        "Step-by-step instructions for the exercise. Each key is step1, step2, etc.",
                      properties: {
                        step1: {
                          type: "string",
                          description: "Short, clear instruction for step 1",
                        },
                        step2: {
                          type: "string",
                          description: "Short, clear instruction for step 2",
                        },
                      },
                      additionalProperties: true,
                    },
                    wikihow: {
                      type: "string",
                      description: "WikiHow link for the stretch, if available",
                    },
                  },
                  required: [
                    "name",
                    "type",
                    "duration",
                    "description",
                    "instructions",
                    "wikihow",
                  ],
                },
              },
            },
            required: ["duration", "stretches"],
          },
        },
        required: [
          "title",
          "duration",
          "gender",
          "equipment",
          "timestamp",
          "warmup",
          "mainWorkout",
          "cooldown",
        ],
      },
    },
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful fitness assistant that returns strictly structured JSON based on tool definitions.",
        },
        {
          role: "user",
          content: `Create a personalized workout plan with the following specifications:
           - Primary Focus: ${workoutData.focus || "General"}
            If the user has selected a primary focus (e.g., speed, strength, agility), make sure that at least 85% of the generated workouts primarily develop this chosen focus area. If no focus is selected, the program can be more general.
            - Goal: ${workoutData.goal}
            - Experience Level: ${
              workoutData.level
            }/10 (1 being very beginner, 10 being advanced trainer almost ready for competition)
            - Gender: ${workoutData.gender}
            - Available Equipment: ${
              workoutData.equipment || "Bodyweight only"
            } (if gym equipment is available, please include more of them example dumbbells, barbell, cable machine, Barbell, leg press etc. of course use them according to the goal)
            - Duration: ${workoutData.duration || "45"} minutes
            - Session Type: Progressive workout targeting ${workoutData.goal}
            - Timestamp: ${new Date().toISOString()}

            Recent workout history (for variety and progression): (try not to repeat these exercises too much)
            ${JSON.stringify(recentHistory, null, 2)}
            
             IMPORTANT:
            - All durations must be given as a string representing the number of seconds (e.g. "120"), NOT as text like "2 minutes".
            - Keep the warm-up and cooldown sections brief (no more th

            For each exercise, include:
            - a short, clear instruction string (e.g. "Stand shoulder-width apart. Hinge at the hips, back straight. Hold dumbbells with palms in. Pull elbows back, squeeze shoulder blades.")

            Please structure the workout with proper warm-up, main exercises, and cool-down sections.`,
        },
      ],
      tools: [toolSchema],
      tool_choice: { type: "function", function: { name: "get_workout_plan" } },
      temperature: 0.9,
      max_tokens: 3000,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Details:", {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    });
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  console.log("Raw API Response:", data);

  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall?.function?.arguments) {
    console.error("Invalid tool response:", data);
    throw new Error("No tool function arguments returned");
  }

  try {
    const workoutPlan = JSON.parse(toolCall.function.arguments);
    console.log("Successfully parsed structured workout plan:", workoutPlan);
    return workoutPlan;
  } catch (err) {
    console.error("Error parsing tool function arguments:", err);
    throw err;
  }
};
