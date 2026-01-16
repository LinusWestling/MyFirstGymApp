import ExercisePicker from "@/components/ExercisePicker";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import {
    LayoutAnimation,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddExerciseModal({ visible, onClose, onAdd }: any) {
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [sets, setSets] = useState("1");
  const [reps, setReps] = useState("8");
  const [weight, setWeight] = useState("0");

  const resetFields = () => {
    setName("");
    setSets("1");
    setReps("8");
    setWeight("0");
  };

  const handleAdd = () => {
    if (!name.trim()) return;

    const numSets = parseInt(sets, 10) || 1;
    const defaultReps = parseInt(reps, 10) || 0;
    const defaultWeight = parseInt(weight, 10) || 0;

    const newExercise = {
      name: name.trim(),
      sets: Array(numSets)
        .fill(0)
        .map(() => ({
          reps: defaultReps,
          weight: defaultWeight,
          completed: false,
        })),
    };

    LayoutAnimation.easeInEaseOut();
    onAdd(newExercise);
    resetFields();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>Add Exercise</Text>

          {/* Exercise Picker */}
          <ExercisePicker
            onSelect={(item: any) => {
              setName(item.name);
            }}
          />

          {/* Manual name override */}
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder="Exercise name"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          {/* Sets / Reps / Weight */}
          <View style={styles.row}>
            <TextInput
              style={[
                styles.input,
                styles.smallInput,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Sets"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={sets}
              onChangeText={setSets}
            />
            <TextInput
              style={[
                styles.input,
                styles.smallInput,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Reps"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={reps}
              onChangeText={setReps}
            />
            <TextInput
              style={[
                styles.input,
                styles.smallInput,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Kg"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleAdd}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    flex: 1,
  },
  smallInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});