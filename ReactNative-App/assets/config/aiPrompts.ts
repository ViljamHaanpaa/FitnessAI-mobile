export const WORKOUT_PROMPT = `Return only a JSON object with NO additional text, NO markdown, NO explanations.

Strict JSON Formatting Rules:
- Use ONLY double quotes for all keys and string values.
- Do NOT include trailing commas.
- Ensure all numeric values (e.g., sets) are valid numbers.
- Ensure all string values (e.g., durations) follow the format ("30s", "2min").
-"You MUST use only double quotes (\") for all JSON properties and values. Do NOT use single quotes (')."
-"You MUST enclose all string values in double quotes (\"). Do NOT return any unquoted strings."


The JSON should match the exact structure below:

{
  "title": "{goal} Workout - {level} Level",
  "duration": "{duration}",
  "gender": "{gender}",
  "equipment": "{equipment}",
  "warmup": {
    "duration": "{warmupTime}",
    "exercises": [
      {
        "name": "exercise1",
        "duration": "2min",
        "description": "Perform a simple warm-up exercise to prepare your body for training."
      }
    ]
  },
  "mainWorkout": {
    "duration": "{mainTime}",
    "exercises": [
      {
        "name": "exercise1",
        "sets": 3,
        "reps": "8-12",
        "rest": "60s",
        "description": "Maintain proper form. Engage your core while performing this movement."
      }
    ]
  },
  "cooldown": {
    "duration": "{cooldownTime}",
    "stretches": [
      {
        "name": "stretch1",
        "duration": "30s",
         "description": "Hold this stretch to relax the muscles and improve flexibility."
      }
    ]
  }
}`;

export const formatWorkoutResponse = (response: string) => {
  // STEP 1: Remove markdown artifacts and trim
  let cleanJson = response
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .trim();

  // STEP 2: Extract JSON block safely
  const jsonStart = cleanJson.indexOf("{");
  const jsonEnd = cleanJson.lastIndexOf("}") + 1;
  cleanJson = cleanJson.slice(jsonStart, jsonEnd);

  // STEP 3: Fix common issues
  cleanJson = cleanJson
    // Fix curly and wrong quotes
    .replace(/[“”„]/g, '"')
    .replace(/[‘’]/g, "'")
    // Ensure all keys are double quoted: name: => "name":
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
    // Fix unquoted string values like name: Squat => name: "Squat"
    .replace(/:\s*([a-zA-Z][a-zA-Z0-9 _\-\/]*)/g, ': "$1"')
    // Add missing commas between key-value pairs (look for "value""key")
    .replace(/"(\s*)("[a-zA-Z])/g, '",$1$2')
    // Add missing commas between object blocks }{
    .replace(/}(\s*){/g, "},$1{")
    // Add missing commas between arrays ]{ or ]"key"
    .replace(/](\s*){/g, "],$1{")
    .replace(/](\s*)"/g, '],$1"')
    // Remove trailing commas before closing brackets/braces
    .replace(/,(\s*[}\]])/g, "$1");

  // STEP 4: Final cleanup and trim
  cleanJson = cleanJson.trim();

  // Debugging: See cleaned JSON before parsing
  console.log("Cleaned JSON:", cleanJson);

  // STEP 5: Safe parsing
  let parsedJson;
  try {
    parsedJson = JSON.parse(cleanJson);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    throw new Error(
      "Invalid JSON format. Please check the AI response for structural issues."
    );
  }

  // STEP 6: Safe structured response (fallback defaults)
  const formattedPlan = {
    title: parsedJson.title || "",
    duration: parsedJson.duration || "60",
    gender: parsedJson.gender || "unknown",
    equipment: parsedJson.equipment || "none",
    warmup: {
      duration: parsedJson.warmup?.duration || "10",
      exercises: (parsedJson.warmup?.exercises || []).map((ex: any) => ({
        name: ex.name || "Warmup Exercise",
        duration: ex.duration || "2min",
        description:
          ex.description || `Perform ${ex.name || "exercise"} to warm up.`,
      })),
    },
    mainWorkout: {
      duration: parsedJson.mainWorkout?.duration || "40",
      exercises: (parsedJson.mainWorkout?.exercises || []).map((ex: any) => ({
        name: ex.name || "Exercise",
        sets: Number(ex.sets) || 3,
        reps: ex.reps || "8-12",
        rest: ex.rest || "60s",
        description:
          ex.description ||
          `Perform ${ex.name || "exercise"} with proper form.`,
      })),
    },
    cooldown: {
      duration: parsedJson.cooldown?.duration || "10",
      stretches: (parsedJson.cooldown?.stretches || []).map((stretch: any) => ({
        name: stretch.name || "Stretch",
        duration: stretch.duration || "30s",
        description:
          stretch.description ||
          `Hold ${stretch.name || "stretch"} to relax muscles.`,
      })),
    },
  };

  return formattedPlan;
};
