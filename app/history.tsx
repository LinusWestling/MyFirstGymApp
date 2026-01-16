import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { FlatList, LayoutAnimation, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

type HistoryEntry = {
  workoutName: string;
  timestamp: number;
  exercises: {
    name: string;
    sets?: number;
    reps?: number;
    weight?: number;
    completed?: boolean;
  }[];
};

export default function HistoryScreen() {
  const { theme } = useTheme();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem("workout-history");
      const parsed: HistoryEntry[] = raw ? JSON.parse(raw) : [];
      setHistory(parsed.reverse()); // newest first
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const deleteEntry = async (index: number) => {
    LayoutAnimation.easeInEaseOut();
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    await AsyncStorage.setItem("workout-history", JSON.stringify(updated));
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedId(expandedId === id ? null : id);
  };

  const renderRightActions = (index: number) => (
    <Pressable
      onPress={() => deleteEntry(index)}
      style={[styles.deleteButton, { backgroundColor: theme.danger }]}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Workout History</Text>

      <FlatList
        data={history}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => {
          const id = `${item.timestamp}-${index}`;
          const isExpanded = expandedId === id;

          return (
            <Swipeable key={id} renderRightActions={() => renderRightActions(index)}>
              <Pressable
                onPress={() => toggleExpand(id)}
                style={[
                  styles.entry,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.entryTitle, { color: theme.text }]}>
                  {item.workoutName}
                </Text>

                <Text style={[styles.entryDate, { color: theme.textSecondary }]}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>

                <Text style={[styles.entryDetails, { color: theme.textSecondary }]}>
                  {item.exercises.filter((e) => e.completed).length} completed exercises
                </Text>

                {isExpanded && (
                  <View style={styles.expandedContainer}>
                    {item.exercises.map((ex, i) => {
                      const sets = ex.sets ?? 0;
                      const reps = ex.reps ?? 0;
                      const weight = ex.weight ?? 0;
                      const volume = sets * reps * weight;

                      return (
                        <View key={i} style={styles.exerciseRow}>
                          <Text style={[styles.exerciseName, { color: theme.text }]}>
                            {ex.name}
                          </Text>
                          <Text style={[styles.exerciseDetails, { color: theme.textSecondary }]}>
                            {sets} × {reps} × {weight} kg = {volume} kg
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </Pressable>
            </Swipeable>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No history yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  entry: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 12,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  entryDate: {
    fontSize: 14,
    marginTop: 4,
  },
  entryDetails: {
    fontSize: 14,
    marginTop: 4,
  },
  expandedContainer: {
    marginTop: 10,
  },
  exerciseRow: {
    marginBottom: 6,
  },
  exerciseName: {
    fontWeight: "600",
    fontSize: 15,
  },
  exerciseDetails: {
    fontSize: 14,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    marginVertical: 6,
    borderRadius: 6,
  },
  deleteText: {
    color: "white",
    fontWeight: "700",
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
  },
});