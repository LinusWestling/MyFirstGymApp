import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Exercise = {
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

export default function WorkoutEditor() {
  const { theme } = useTheme();
  const { name } = useLocalSearchParams();
  const workoutName = Array.isArray(name) ? name[0] : name;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newSets, setNewSets] = useState("");
  const [newReps, setNewReps] = useState("");
  const [newWeight, setNewWeight] = useState("");

  // --- Load workout ---
  const loadWorkout = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("workout-schemas");
      if (!data) return;

      const parsed = JSON.parse(data);
      const raw = parsed[workoutName] || [];

      const normalized: Exercise[] = raw.map((e: any) => ({
        name: e.name ?? "",
        sets: e.sets ?? 0,
        reps: e.reps ?? 0,
        weight: e.weight ?? 0,
      }));

      setExercises(normalized);
    } catch {
      setExercises([]);
    }
  }, [workoutName]);

  useEffect(() => {
    loadWorkout();
  }, [loadWorkout]);

  // --- Save workout ---
  const saveWorkout = useCallback(
    async (updated: Exercise[]) => {
      setExercises(updated);

      const raw = await AsyncStorage.getItem("workout-schemas");
      const parsed = raw ? JSON.parse(raw) : {};

      parsed[workoutName] = updated;

      await AsyncStorage.setItem("workout-schemas", JSON.stringify(parsed));
    },
    [workoutName]
  );

  // --- Update exercise ---
  function updateExercise(index: number, changes: Partial<Exercise>) {
    LayoutAnimation.easeInEaseOut();
    const updated = exercises.map((ex, i) =>
      i === index ? { ...ex, ...changes } : ex
    );
    saveWorkout(updated);
  }

  // --- Delete exercise ---
  function deleteExercise(index: number) {
    LayoutAnimation.easeInEaseOut();
    const updated = exercises.filter((_, i) => i !== index);
    saveWorkout(updated);
  }

  // --- Add exercise ---
  function addExercise() {
    if (!newExerciseName.trim()) return;

    const ex: Exercise = {
      name: newExerciseName.trim(),
      sets: parseInt(newSets || "0", 10),
      reps: parseInt(newReps || "0", 10),
      weight: parseFloat(newWeight || "0"),
    };

    const updated = [...exercises, ex];
    saveWorkout(updated);

    setNewExerciseName("");
    setNewSets("");
    setNewReps("");
    setNewWeight("");
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Back Button */}
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={[styles.backText, { color: theme.text }]}>← Back</Text>
      </Pressable>

      {/* Title */}
      <Text style={[styles.title, { color: theme.text }]}>{workoutName}</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Exercises in this workout
      </Text>

      {/* Exercise List */}
      <FlatList
        data={exercises}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.row,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <View style={{ flex: 1 }}>
              {/* Exercise Name */}
              <TextInput
                style={[
                  styles.input,
                  {
                    marginVertical: 0,
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                value={item.name}
                autoCapitalize="words"
                onChangeText={(v) => updateExercise(index, { name: v })}
              />

              {/* Sets / Reps / Weight */}
              <View style={styles.metricRowContainer}>
                {/* Sets */}
                <MetricControl
                  label="Sets"
                  value={item.sets}
                  onChange={(v) => updateExercise(index, { sets: v })}
                />

                {/* Reps */}
                <MetricControl
                  label="Reps"
                  value={item.reps}
                  onChange={(v) => updateExercise(index, { reps: v })}
                />

                {/* Weight */}
                <MetricControl
                  label="Weight"
                  value={item.weight}
                  onChange={(v) => updateExercise(index, { weight: v })}
                />
              </View>
            </View>

            {/* Delete */}
            <Pressable
              style={[styles.deleteButton, { backgroundColor: theme.border }]}
              onPress={() => deleteExercise(index)}
            >
              <Text style={[styles.deleteText, { color: theme.text }]}>×</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No exercises yet. Add one below.
          </Text>
        }
      />

      {/* Add Exercise */}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.card, borderColor: theme.border, color: theme.text },
        ]}
        placeholder="Exercise name (e.g. Squat)"
        placeholderTextColor={theme.textSecondary}
        value={newExerciseName}
        onChangeText={setNewExerciseName}
      />

      <View style={styles.addRow}>
        <SmallInput
          placeholder="Sets"
          value={newSets}
          onChange={setNewSets}
          theme={theme}
        />
        <SmallInput
          placeholder="Reps"
          value={newReps}
          onChange={setNewReps}
          theme={theme}
        />
        <SmallInput
          placeholder="Weight"
          value={newWeight}
          onChange={setNewWeight}
          theme={theme}
        />
      </View>

      <Pressable
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={addExercise}
      >
        <Text style={styles.addButtonText}>Add Exercise</Text>
      </Pressable>
    </View>
  );
}

/* --- Reusable Metric Control --- */
function MetricControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.metric}>
      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>

      <View style={styles.metricRow}>
        <Pressable
          onPress={() => onChange(Math.max(value - 1, 0))}
          style={[styles.smallButton, { backgroundColor: theme.border }]}
        >
          <Text style={{ color: theme.text }}>-</Text>
        </Pressable>

        <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>

        <Pressable
          onPress={() => onChange(value + 1)}
          style={[styles.smallButton, { backgroundColor: theme.border }]}
        >
          <Text style={{ color: theme.text }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* --- Reusable Small Input --- */
function SmallInput({
  placeholder,
  value,
  onChange,
  theme,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  theme: any;
}) {
  return (
    <TextInput
      style={[
        styles.input,
        {
          flex: 1,
          backgroundColor: theme.card,
          borderColor: theme.border,
          color: theme.text,
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor={theme.textSecondary}
      keyboardType="numeric"
      value={value}
      onChangeText={onChange}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backButton: { marginBottom: 10, alignSelf: "flex-start" },
  backText: { fontSize: 18 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  listContent: { paddingBottom: 40 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteText: { fontSize: 22, fontWeight: "600" },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  metricRowContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  metric: { flex: 1 },
  metricLabel: { fontSize: 12 },
  metricRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  smallButton: { padding: 8, borderRadius: 6 },
  metricValue: {
    marginHorizontal: 8,
    minWidth: 24,
    textAlign: "center",
    fontSize: 16,
  },
  addRow: { flexDirection: "row", gap: 8 },
  addButton: {
    marginTop: 10,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
  },
});