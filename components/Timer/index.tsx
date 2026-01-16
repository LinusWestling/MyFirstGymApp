import { useEffect, useState } from "react";
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

// Enable animation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let interval: any = null;

    if (running) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  const toggleRunning = () => {
    LayoutAnimation.easeInEaseOut();
    setRunning((r) => !r);
  };

  const reset = () => {
    LayoutAnimation.easeInEaseOut();
    setSeconds(0);
    setRunning(false);
  };

  const toggleExpanded = () => {
    LayoutAnimation.easeInEaseOut();
    setExpanded((e) => !e);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {/* Floating pill */}
      <TouchableOpacity style={styles.pill} onPress={toggleExpanded}>
        <Text style={styles.pillText}>{formatTime(seconds)}</Text>
        <Text style={styles.pillText}>{running ? "Pause" : "Start"}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedBox}>
          <Text style={styles.timeText}>{formatTime(seconds)}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, running ? styles.pauseButton : styles.startButton]}
              onPress={toggleRunning}
            >
              <Text style={styles.buttonText}>{running ? "Pause" : "Start"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={reset}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    right: 20,
    alignItems: "flex-end",
  },

  pill: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    elevation: 3,
  },
  pillText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  expandedBox: {
    marginTop: 10,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width: 180,
    elevation: 2,
  },

  timeText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },

  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  startButton: {
    backgroundColor: "#4caf50",
  },
  pauseButton: {
    backgroundColor: "#f39c12",
  },
  resetButton: {
    backgroundColor: "#e74c3c",
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});