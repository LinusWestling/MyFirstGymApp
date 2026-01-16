export type ExerciseDefinition = {
  name: string;
  icon: string; // emoji for now, can be replaced with SVG later
  category: "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core" | "Other";
};

export const exerciseLibrary: ExerciseDefinition[] = [
  { name: "Bench Press", icon: "🏋️‍♂️", category: "Chest" },
  { name: "Incline Bench Press", icon: "📈", category: "Chest" },
  { name: "Chest Fly", icon: "🪽", category: "Chest" },

  { name: "Deadlift", icon: "🦾", category: "Back" },
  { name: "Barbell Row", icon: "📦", category: "Back" },
  { name: "Lat Pulldown", icon: "⬇️", category: "Back" },

  { name: "Squat", icon: "🦵", category: "Legs" },
  { name: "Leg Press", icon: "🛠️", category: "Legs" },
  { name: "Lunges", icon: "🚶‍♂️", category: "Legs" },

  { name: "Shoulder Press", icon: "🎯", category: "Shoulders" },
  { name: "Lateral Raise", icon: "🪽", category: "Shoulders" },

  { name: "Bicep Curl", icon: "💪", category: "Arms" },
  { name: "Tricep Pushdown", icon: "↘️", category: "Arms" },

  { name: "Plank", icon: "🧘‍♂️", category: "Core" },
  { name: "Crunches", icon: "🔥", category: "Core" },

  { name: "Custom Exercise", icon: "➕", category: "Other" },
];