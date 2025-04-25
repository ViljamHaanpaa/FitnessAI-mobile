import { WorkoutData } from "@/types/workout";
const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
const API_URL = "https://api.deepseek.com/v1/chat/completions";

export const generateWorkoutPlan = async (workoutData: WorkoutData) => {
  console.log("Generating workout plan...");

  const toolSchema = {
    type: "function",
    function: {
      name: "get_workout_plan",
      description: "Generate a structured workout plan in JSON format",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Workout title" },
          duration: { type: "string" },
          gender: { type: "string" },
          equipment: { type: "string" },
          timestamp: { type: "string" },
          warmup: {
            type: "object",
            properties: {
              duration: { type: "string" },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    duration: { type: "string" },
                    description: { type: "string" },
                  },
                  required: ["name", "duration", "description"],
                },
              },
            },
            required: ["duration", "exercises"],
          },
          mainWorkout: {
            type: "object",
            properties: {
              duration: { type: "string" },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    sets: { type: "number" },
                    reps: { type: "string" },
                    rest: { type: "string" },
                    description: { type: "string" },
                  },
                  required: ["name", "sets", "reps", "rest", "description"],
                },
              },
            },
            required: ["duration", "exercises"],
          },
          cooldown: {
            type: "object",
            properties: {
              duration: { type: "string" },
              stretches: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    duration: { type: "string" },
                    description: { type: "string" },
                  },
                  required: ["name", "duration", "description"],
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
          content: `
          Generate ${workoutData.focus}focused workout for a ${workoutData.goal} ${workoutData.level} level ${workoutData.gender} using ${workoutData.equipment} trying to achieve ${workoutData.goal}.
          `,
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
