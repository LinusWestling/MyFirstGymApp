import { exerciseLibrary } from "@/constants/exercises";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import {
    FlatList,
    LayoutAnimation,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ExercisePicker({ onSelect }: any) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");

  const filtered = exerciseLibrary.filter((ex) =>
    ex.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <TextInput
        style={[styles.search, { backgroundColor: theme.background, color: theme.text }]}
        placeholder="Search exercises..."
        placeholderTextColor={theme.textSecondary}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, { borderColor: theme.border }]}
            onPress={() => {
              LayoutAnimation.easeInEaseOut();
              onSelect(item);
            }}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.category, { color: theme.textSecondary }]}>
                {item.category}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    maxHeight: 400,
  },
  search: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  icon: {
    fontSize: 26,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  category: {
    fontSize: 14,
  },
});