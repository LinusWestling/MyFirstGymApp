// app/_layout.tsx
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Slot } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function AppContainer() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // 🔹 try 80 first
      >
        <Slot />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContainer />
    </ThemeProvider>
  );
}