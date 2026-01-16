import { useState } from "react";
import {
    LayoutAnimation,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SetRow from "./SetRow";

export default function ExerciseCard({ exercise, onUpdate, onRemove }: any) {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    LayoutAnimation.easeInEaseOut();
    setExpanded((e) => !e);
  };

  const updateSet = (index: number, updatedSet: any) => {
    const newSets = [...exercise.sets];
    newSets[index] = updatedSet;
    onUpdate({ ...exercise, sets: newSets });
  };

  const toggleSetComplete = (index: number) => {
    const newSets = [...exercise.sets];
    newSets[index].completed = !newSets[index].completed;
    onUpdate({ ...exercise, sets: newSets });
  };

  const removeSet = (index: number) => {
    const newSets = exercise.sets.filter((_: any, i: number) => i !== index);
    onUpdate({ ...exercise, sets: newSets });
  };

  const addSet = () => {
    const newSet = { reps: 0, weight: 0, completed: false };
    onUpdate({ ...exercise, sets: [...exercise.sets, newSet] });
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={toggleExpanded}>
        <Text style={styles.title}>{exercise.name}</Text>
        <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {/* Body */}
      {expanded && (
        <View style={styles.body}>
          {exercise.sets.map((set: any, i: number) => (
            <SetRow
              key={i}
              index={i}
              set={set}
              onUpdate={updateSet}
              onToggle={toggleSetComplete}
              onRemove={removeSet}
            />
          ))}

          <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
            <Text style={styles.addSetText}>+ Add Set</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.removeExercise} onPress={onRemove}>
            <Text style={styles.removeExerciseText}>Remove Exercise</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  chevron: {
    fontSize: 18,
    color: "#555",
  },

  body: {
    padding: 14,
    gap: 10,
  },

  addSetButton: {
    padding: 10,
    backgroundColor: "#4caf50",
    borderRadius: 6,
    alignItems: "center",
  },
  addSetText: {
    color: "white",
    fontWeight: "600",
  },

  removeExercise: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e74c3c",
    borderRadius: 6,
    alignItems: "center",
  },
  removeExerciseText: {
    color: "white",
    fontWeight: "600",
  },
});