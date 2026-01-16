import PrimaryButton from "@/components/PrimaryButton";
import Screen from "@/components/Screen";
import WorkoutCard from "@/components/WorkoutCard";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [workouts, setWorkouts] = useState<string[]>([]);
  const [newWorkoutName, setNewWorkoutName] = useState("");

  // Load workouts from storage
  const loadWorkouts = useCallback(async () => {
    const data = await AsyncStorage.getItem("workout-schemas");

    if (!data) {
      setWorkouts([]);
      return;
    }

    const parsed = JSON.parse(data);

    // Migrate old array format → object format
    if (Array.isArray(parsed)) {
      const migrated = Object.fromEntries(parsed.map((name) => [name, []]));
      await AsyncStorage.setItem("workout-schemas", JSON.stringify(migrated));
      setWorkouts(Object.keys(migrated).sort());
      return;
    }

    setWorkouts(Object.keys(parsed).sort());
  }, []);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  // Save workouts back to storage
  const saveWorkouts = useCallback(async (names: string[]) => {
    const data = await AsyncStorage.getItem("workout-schemas");
    const parsed = data ? JSON.parse(data) : {};

    const updated = Object.fromEntries(
      names.map((name) => [name, parsed[name] || []])
    );

    await AsyncStorage.setItem("workout-schemas", JSON.stringify(updated));
  }, []);

  const addWorkout = () => {
    const trimmed = newWorkoutName.trim();
    if (!trimmed) return;

    const updated = [...workouts, trimmed].sort();
    setWorkouts(updated);
    saveWorkouts(updated);

    setNewWorkoutName("");
    Keyboard.dismiss();
  };

  const deleteWorkout = (index: number) => {
    const updated = workouts.filter((_, i) => i !== index);
    setWorkouts(updated);
    saveWorkouts(updated);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Your Workouts</Text>

        <FlatList
          data={workouts}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) => (
            <WorkoutCard
              title={item}
              onPress={() =>
                router.push({
                  pathname: "/workoutEditor/[name]",
                  params: { name: item },
                })
              }
              onDelete={() => deleteWorkout(index)}
            />
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No workouts yet. Add one below.
            </Text>
          }
          ListFooterComponent={
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
              <View style={styles.footer}>
                <View style={styles.section}>
                  <Pressable
                    style={[styles.historyButton, { backgroundColor: theme.accent }]}
                    onPress={() => router.push("/history")}
                  >
                    <Text style={[styles.historyText, { color: theme.text }]}>
                      View History
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.section}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                      },
                    ]}
                    placeholder="New workout name (e.g. Legday)"
                    placeholderTextColor={theme.textSecondary}
                    value={newWorkoutName}
                    onChangeText={setNewWorkoutName}
                    autoCapitalize="words"
                    returnKeyType="done"
                  />

                  <PrimaryButton
                    title="Add Workout"
                    onPress={addWorkout}
                    disabled={!newWorkoutName.trim()}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listContent: {
    gap: 10,
    paddingBottom: 20,
  },
  footer: {
    marginTop: 20,
    paddingBottom: 20,
  },
  section: {
    marginTop: 12,
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
  },
  historyButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  historyText: {
    fontWeight: "600",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
});