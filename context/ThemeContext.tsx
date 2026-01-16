import React, { createContext, ReactNode, useContext, useState } from "react";

type ThemeMode = "light" | "dark";

type Theme = {
  mode: ThemeMode;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  accent: string;
  danger: string;
};

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const lightTheme: Theme = {
  mode: "light",
  background: "#f2f2f2",
  card: "#ffffff",
  text: "#111111",
  textSecondary: "#666666",
  border: "#dddddd",
  primary: "#4f46e5",
  accent: "#22c55e",
  danger: "#dc2626",
};

const darkTheme: Theme = {
  mode: "dark",
  background: "#050816",
  card: "#0f172a",
  text: "#e5e7eb",
  textSecondary: "#9ca3af",
  border: "#1f2937",
  primary: "#6366f1",
  accent: "#10b981",
  danger: "#f97373",
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>("light");

  const theme = mode === "light" ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return ctx;
};