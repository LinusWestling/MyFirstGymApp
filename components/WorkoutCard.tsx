import { useTheme } from "@/context/ThemeContext";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  onDelete?: () => void;
};

export default function WorkoutCard({ title, onPress, onDelete }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.text, { color: theme.text }]}>{title}</Text>
      </Pressable>

      {onDelete && (
        <Pressable
          onPress={onDelete}
          hitSlop={10}
          style={[
            styles.delete,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.deleteText, { color: theme.textSecondary }]}>
            ×
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
  delete: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    fontSize: 20,
    fontWeight: "600",
  },
});