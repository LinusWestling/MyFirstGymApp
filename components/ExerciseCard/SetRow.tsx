import { LayoutAnimation, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SetRow({ index, set, onUpdate, onToggle, onRemove }: any) {
  const handleChange = (field: "reps" | "weight", value: string) => {
    const num = parseInt(value, 10);
    onUpdate(index, { ...set, [field]: isNaN(num) ? 0 : num });
  };

  return (
    <View style={[styles.row, set.completed && styles.completedRow]}>
      <Text style={styles.setNumber}>Set {index + 1}</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(set.reps)}
        onChangeText={(v) => handleChange("reps", v)}
        placeholder="Reps"
      />

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(set.weight)}
        onChangeText={(v) => handleChange("weight", v)}
        placeholder="Kg"
      />

      <TouchableOpacity
        style={[styles.toggleButton, set.completed && styles.toggleCompleted]}
        onPress={() => {
          LayoutAnimation.easeInEaseOut();
          onToggle(index);
        }}
      >
        <Text style={styles.toggleText}>{set.completed ? "✓" : "○"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => {
          LayoutAnimation.easeInEaseOut();
          onRemove(index);
        }}
      >
        <Text style={styles.removeText}>−</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: 8,
  },
  completedRow: {
    opacity: 0.6,
  },
  setNumber: {
    width: 50,
    fontWeight: "600",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#4caf50",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleCompleted: {
    backgroundColor: "#4caf50",
  },
  toggleText: {
    color: "white",
    fontWeight: "bold",
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
});