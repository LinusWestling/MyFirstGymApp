import { useTheme } from "@/context/ThemeContext";
import { LayoutAnimation, Text, TouchableOpacity, View } from "react-native";

export default function CustomHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: theme.card,
        borderBottomWidth: 1,
        borderColor: theme.border,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          toggleTheme();
        }}
      >
        <Text
          style={{
            color: theme.text,
            fontSize: 22,
            transform: [{ rotate: theme.mode === "light" ? "0deg" : "180deg" }],
          }}
        >
          {theme.mode === "light" ? "🌙" : "☀️"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}