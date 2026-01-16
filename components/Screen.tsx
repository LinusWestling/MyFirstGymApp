// components/Screen.tsx
import { useTheme } from "@/context/ThemeContext";
import { ReactNode } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
};

export default function Screen({
  children,
  scroll = false,
  contentContainerStyle,
}: ScreenProps) {
  const { theme } = useTheme();

  if (scroll) {
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.content, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});