import PrimaryButton from "@/components/PrimaryButton";
import Screen from "@/components/Screen";
import WorkoutCard from "@/components/WorkoutCard";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type SessionEntry = {
  workoutName: string;
  timestamp: number;
  exercises: { completed: boolean }[];
};

export default function SessionHome() {
  const router = useRouter();
  const { theme } = useTheme();

  const [workouts, setWorkouts] = useState<string[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionEntry[]>([]);

  // Load workout names
  const loadWorkouts = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("workout-schemas");
      if (!data) {
        setWorkouts([]);
        return;
      }

      const parsed = JSON.parse(data);

      if (Array.isArray(parsed)) {
        setWorkouts(parsed.sort());
      } else {
        setWorkouts(Object.keys(parsed || {}).sort());
      }
    } catch {
      setWorkouts([]);
    }
  }, []);

  // Load last 3 sessions
  const loadRecentSessions = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem("workout-history");
      const parsed: SessionEntry[] = raw ? JSON.parse(raw) : [];
      setRecentSessions(parsed.slice(-3).reverse());
    } catch {
      setRecentSessions([]);
    }
  }, []);

  // Reload every time the tab becomes active
  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
      loadRecentSessions();
    }, [loadWorkouts, loadRecentSessions])
  );

  const quickStart = () => {
    if (workouts.length === 0) return;
    const lastWorkout = workouts[workouts.length - 1];

    router.push({
      pathname: "/sessionRunner/[name]",
      params: { name: lastWorkout },
    });
  };

  const recentCardStyle = useMemo(
    () => ({
      backgroundColor: theme.card,
      borderColor: theme.border,
    }),
    [theme]
  );

  return (
    <Screen scroll>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Start a Workout</Text>

        {workouts.length > 0 && (
          <PrimaryButton title="Quick Start Last Workout" onPress={quickStart} />
        )}

        {/* Recently Completed */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recently Completed
          </Text>

          {recentSessions.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No recent sessions yet.
            </Text>
          ) : (
            recentSessions.map((entry, i) => (
              <Pressable
                key={i}
                style={[styles.recentCard, recentCardStyle]}
                onPress={() =>
                  router.push({
                    pathname: "/sessionRunner/[name]",
                    params: { name: entry.workoutName },
                  })
                }
              >
                <Text style={[styles.recentTitle, { color: theme.text }]}>
                  {entry.workoutName}
                </Text>

                <Text style={[styles.recentDate, { color: theme.textSecondary }]}>
                  {new Date(entry.timestamp).toLocaleString()}
                </Text>

                <Text
                  style={[styles.recentDetails, { color: theme.textSecondary }]}
                >
                  {entry.exercises.filter((e) => e.completed).length} exercises
                  completed
                </Text>
              </Pressable>
            ))
          )}
        </View>

        {/* All Workouts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            All Workouts
          </Text>

          <FlatList
            data={workouts}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <WorkoutCard
                title={item}
                onPress={() =>
                  router.push({
                    pathname: "/sessionRunner/[name]",
                    params: { name: item },
                  })
                }
              />
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No workouts yet. Create one in the Home tab.
              </Text>
            }
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  listContent: {
    gap: 10,
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
  },
  recentCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  recentDate: {
    fontSize: 14,
    marginTop: 4,
  },
  recentDetails: {
    fontSize: 14,
    marginTop: 4,
  },
});