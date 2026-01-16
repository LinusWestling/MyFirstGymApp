import Screen from "@/components/Screen";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

import AddExerciseModal from "@/components/AddExerciseModal";
import ExerciseCard from "@/components/ExerciseCard";
import Timer from "@/components/Timer";

// Enable animation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type SetEntry = {
  reps: number;
  weight: number;
  completed: boolean;
};

type Exercise = {
  name: string;
  sets: SetEntry[];
};

export default function SessionRunner() {
  const { theme } = useTheme();
  const { name } = useLocalSearchParams();
  const workoutName = Array.isArray(name) ? name[0] : name;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const listRef = useRef<FlatList>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // --- Load workout schema ---
  const loadWorkout = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("workout-schemas");
      if (!data || !workoutName) return;

      const parsed = JSON.parse(data);
      const raw = parsed[workoutName] || [];

      const normalized: Exercise[] = raw.map((e: any) => {
        const setsCount = e.sets ?? 1;
        const reps = e.reps ?? 0;
        const weight = e.weight ?? 0;

        return {
          name: e.name ?? "",
          sets: Array.from({ length: setsCount }, () => ({
            reps,
            weight,
            completed: false,
          })),
        };
      });

      setExercises(normalized);
    } catch {
      setExercises([]);
    }
  }, [workoutName]);

  useEffect(() => {
    loadWorkout();
  }, [loadWorkout]);

  // --- Persist workout schema updates ---
  const saveWorkoutSchema = useCallback(
    async (updated: Exercise[]) => {
      const raw = await AsyncStorage.getItem("workout-schemas");
      const parsed = raw ? JSON.parse(raw) : {};

      parsed[workoutName] = updated.map((ex) => ({
        name: ex.name,
        sets: ex.sets.length,
        reps: ex.sets[0]?.reps ?? 0,
        weight: ex.sets[0]?.weight ?? 0,
      }));

      await AsyncStorage.setItem("workout-schemas", JSON.stringify(parsed));
    },
    [workoutName]
  );

  // --- Update exercise ---
  const updateExercise = (index: number, updated: Exercise) => {
    LayoutAnimation.easeInEaseOut();
    setExercises((prev) => {
      const next = [...prev];
      next[index] = updated;
      saveWorkoutSchema(next);
      return next;
    });
  };

  // --- Remove exercise ---
  const removeExercise = (index: number) => {
    LayoutAnimation.easeInEaseOut();
    setExercises((prev) => {
      const next = prev.filter((_, i) => i !== index);
      saveWorkoutSchema(next);
      return next;
    });
  };

  // --- Add exercise ---
  const addExercise = (newExercise: Exercise) => {
    LayoutAnimation.easeInEaseOut();
    setExercises((prev) => {
      const next = [...prev, newExercise];
      saveWorkoutSchema(next);
      return next;
    });

    setModalVisible(false);

    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  // --- Finish workout ---
  const finishWorkout = async () => {
    const entry = {
      workoutName,
      timestamp: Date.now(),
      exercises,
    };

    const historyRaw = await AsyncStorage.getItem("workout-history");
    const history = historyRaw ? JSON.parse(historyRaw) : [];

    history.push(entry);

    await AsyncStorage.setItem("workout-history", JSON.stringify(history));

    router.back();
  };

  const cancelWorkout = () => router.back();

  // --- Progress ---
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  );

  const progress = totalSets > 0 ? completedSets / totalSets : 0;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Screen>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>{workoutName}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Active workout session
        </Text>

        {/* Progress Bar */}
        <View style={[styles.progressBarBackground, { backgroundColor: theme.border }]}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { backgroundColor: theme.primary, width: progressWidth },
            ]}
          />
        </View>

        {/* Exercise List */}
        <FlatList
          ref={listRef}
          data={exercises}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <ExerciseCard
              exercise={item}
              onUpdate={(updated: Exercise) => updateExercise(index, updated)}
              onRemove={() => removeExercise(index)}
            />
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No exercises in this workout. Add some below.
            </Text>
          }
        />

        {/* Add Exercise Button */}
        <Pressable
          style={[styles.addExerciseButton, { backgroundColor: theme.accent }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.addExerciseText, { color: theme.text }]}>+ Add Exercise</Text>
        </Pressable>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Pressable
            style={[styles.footerButton, { backgroundColor: theme.border }]}
            onPress={cancelWorkout}
          >
            <Text style={[styles.footerButtonText, { color: theme.text }]}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.footerButton, { backgroundColor: theme.primary }]}
            onPress={finishWorkout}
          >
            <Text style={styles.footerButtonText}>Finish</Text>
          </Pressable>
        </View>

        <Timer />

        <AddExerciseModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={addExercise}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  listContent: {
    paddingBottom: 140,
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
  },
  addExerciseButton: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addExerciseText: {
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    gap: 10,
  },
  footerButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  footerButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});