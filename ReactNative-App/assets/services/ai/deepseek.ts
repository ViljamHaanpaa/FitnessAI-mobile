import type { WorkoutData } from "../../../contexts/WorkoutContext";
import { WORKOUT_PROMPT, formatWorkoutResponse } from "../../config/aiPrompts";
const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
const API_URL = "https://api.deepseek.com/v1/chat/completions";

export const generateWorkoutPlan = async (workoutData: WorkoutData) => {
  console.log("Generating workout plan...");

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
          content: `You are a gym fitness trainer creating a ${workoutData.goal} workout for ${workoutData.level},${workoutData.gender} level that lasts ${workoutData.duration} minutes with ${workoutData.equipment}.
            The workout must be adjusted based on the goal:
            - **Lose Weight**: High-intensity, short rest (30-45s), higher reps (12-20), compound and cardio-based exercises.
            - **Build Muscle**: Moderate intensity, hypertrophy-based (8-12 reps), controlled movements, 45-90s rest.
            - **Get Stronger**: Heavy weights, lower reps (3-6), longer rest (90-180s), focus on compound lifts.
            - **Stay Healthy**: Balanced training, moderate intensity, mix of strength and mobility, reps 10-15.
            
            Generate simple description for each exercise.
            Descriptions MUST be concise and clear. Easy to follow, step by step instructions.
            Descriptions MUST NOT contain line breaks or newlines.

            Return only VALID JSON.
            In main workout, exclude bodyweight training. Follow these JSON formatting rules strictly:
            1. ALL property names must be in double quotes: "name", "sets", "reps", "rest", "description"
            2. ALL string values must be in double quotes: "Exercise Name", "90s", "8-12"
            3. EVERYthing must be in double quotes: "8-12" not 8-12
            4. NO spaces in time values: "90s" not "90 s"
            5. NO spaces in rep ranges: "8-12" not "8 -12"
            6. NO single quotes
            7. NO curly quotes
            8. NO trailing commas 
            9. NO comments
            
            check again that every value is in double quotes and there are no spaces in time values or rep ranges.
            Return ONLY the JSON. Do NOT return any markdown, explanations, or extra text.`,
        },
        {
          role: "user",
          content: WORKOUT_PROMPT.replace("{goal}", workoutData.goal)
            .replace("{level}", workoutData.level)
            .replace("{duration}", workoutData.duration.toString())
            .replace("{warmupTime}", "10")
            .replace("{mainTime}", "40")
            .replace("{cooldownTime}", "10")
            .replace("{equipment}", workoutData.equipment),
        },
      ],
      temperature: 0.6,
      max_tokens: 3000,
      presence_penalty: 0.4,
      frequency_penalty: 0.35,
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

  if (!data.choices?.[0]?.message?.content) {
    console.error("Invalid API response structure:", data);
    throw new Error("Invalid response format from API");
  }

  const rawContent = data.choices[0].message.content;
  console.log("Content to format:", rawContent);

  try {
    const workoutPlan = formatWorkoutResponse(rawContent);
    console.log("Successfully formatted workout plan:", workoutPlan);
    return workoutPlan;
  } catch (formatError) {
    console.error("Error formatting workout plan:", formatError);
    console.error("Raw content that failed formatting:", rawContent);
    throw formatError;
  }
};
