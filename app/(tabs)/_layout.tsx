import CustomHeader from "@/components/CustomHeader";
import { useTheme } from "@/context/ThemeContext";
import { Tabs } from "expo-router";
import { useMemo } from "react";
import { LayoutAnimation, Platform, Pressable, Text } from "react-native";

export default function TabsLayout() {
  const { theme, toggleTheme } = useTheme();
  const isWeb = Platform.OS === "web";

  const styles = useMemo(
    () => ({
      header: { backgroundColor: theme.card },
      headerTitle: { color: theme.text },
      tabBar: { backgroundColor: theme.card },
    }),
    [theme]
  );

  const ThemeToggle = () => (
    <Pressable
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        toggleTheme();
      }}
      style={{ marginRight: 12 }}
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
    </Pressable>
  );

  return (
    <>
      {isWeb && <CustomHeader />}

      <Tabs
        screenOptions={{
          headerRight: !isWeb ? () => <ThemeToggle /> : undefined,
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="session" options={{ title: "Session" }} />
        <Tabs.Screen name="statistics" options={{ title: "Statistics" }} />
      </Tabs>
    </>
  );
}