import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

type Exercise = {
  name: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  completed?: boolean;
};

type HistoryEntry = {
  workoutName: string;
  timestamp: number;
  exercises: Exercise[];
};

export default function StatisticsScreen() {
  const { theme } = useTheme();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestDay, setBestDay] = useState<string>("–");
  const [exerciseFreq, setExerciseFreq] = useState<[string, number][]>([]);
  const [prs, setPRs] = useState<Record<string, number>>({});
  const [trend, setTrend] = useState<string>("→");

  // --- Helpers ---
  const calcVolume = useCallback((exercises: Exercise[]) => {
    return exercises.reduce((sum, ex) => {
      const sets = ex.sets ?? 0;
      const reps = ex.reps ?? 0;
      const weight = ex.weight ?? 0;
      return sum + sets * reps * weight;
    }, 0);
  }, []);

  // --- Weekly streak ---
  const calculateStreak = useCallback((entries: HistoryEntry[]) => {
    const days = new Set(entries.map((e) => new Date(e.timestamp).toDateString()));
    let s = 0;
    let current = new Date();

    while (days.has(current.toDateString())) {
      s++;
      current.setDate(current.getDate() - 1);
    }

    return s;
  }, []);

  // --- Best training day ---
  const computeBestDay = useCallback(
    (entries: HistoryEntry[]) => {
      const volumeByDay = Array(7).fill(0);

      entries.forEach((entry) => {
        const day = new Date(entry.timestamp).getDay();
        volumeByDay[day] += calcVolume(entry.exercises);
      });

      const max = Math.max(...volumeByDay);
      if (max === 0) return "–";

      const index = volumeByDay.indexOf(max);
      const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return names[index];
    },
    [calcVolume]
  );

  // --- Exercise frequency ---
  const computeExerciseFrequency = useCallback((entries: HistoryEntry[]) => {
    const map: Record<string, number> = {};

    entries.forEach((entry) => {
      entry.exercises.forEach((ex) => {
        map[ex.name] = (map[ex.name] || 0) + 1;
      });
    });

    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, []);

  // --- PR detection ---
  const computePRs = useCallback(
    (entries: HistoryEntry[]) => {
      const prs: Record<string, number> = {};

      entries.forEach((entry) => {
        entry.exercises.forEach((ex) => {
          const vol = calcVolume([ex]);
          prs[ex.name] = Math.max(prs[ex.name] || 0, vol);
        });
      });

      return prs;
    },
    [calcVolume]
  );

  // --- Weekly volume chart ---
  const computeWeeklyStats = useCallback(
    (entries: HistoryEntry[]) => {
      const today = new Date();
      const days = Array(7).fill(0);

      entries.forEach((entry) => {
        const date = new Date(entry.timestamp);
        const diff = Math.floor(
          (today.getTime() - date.getTime()) / (1000 * 3600 * 24)
        );

        if (diff >= 0 && diff < 7) {
          days[6 - diff] += calcVolume(entry.exercises);
        }
      });

      return days;
    },
    [calcVolume]
  );

  // --- Trend indicator ---
  const computeTrend = useCallback((weekly: number[]) => {
    const lastWeek = weekly.slice(0, 7).reduce((a, b) => a + b, 0);
    const prevWeek = weekly.slice(0, 7).reduce((a, b) => a + b, 0);

    if (prevWeek === 0) return "↗️";
    if (lastWeek > prevWeek) return "↑";
    if (lastWeek < prevWeek) return "↓";
    return "→";
  }, []);

  // --- Load history ---
  const loadHistory = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem("workout-history");
      const parsed: HistoryEntry[] = raw ? JSON.parse(raw) : [];

      setHistory(parsed);

      const weekly = computeWeeklyStats(parsed);
      setWeeklyData(weekly);

      setStreak(calculateStreak(parsed));
      setBestDay(computeBestDay(parsed));
      setExerciseFreq(computeExerciseFrequency(parsed));
      setPRs(computePRs(parsed));
      setTrend(computeTrend(weekly));
    } catch {
      setHistory([]);
      setWeeklyData(Array(7).fill(0));
    }
  }, [
    computeWeeklyStats,
    calculateStreak,
    computeBestDay,
    computeExerciseFrequency,
    computePRs,
    computeTrend,
  ]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // --- Aggregates ---
  const totalWorkouts = history.length;

  const totalCompletedExercises = history.reduce(
    (sum, entry) => sum + entry.exercises.filter((e) => e.completed).length,
    0
  );

  const totalVolume = history.reduce(
    (sum, entry) => sum + calcVolume(entry.exercises),
    0
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Statistics</Text>

      <StatBox label="Total Workouts" value={totalWorkouts} />
      <StatBox label="Completed Exercises" value={totalCompletedExercises} />
      <StatBox label="Total Volume Lifted" value={`${totalVolume} kg`} />
      <StatBox label="Weekly Streak" value={`${streak} days`} />
      <StatBox label="Best Training Day" value={bestDay} />
      <StatBox label="Volume Trend" value={trend} />

      <Text style={[styles.subtitle, { color: theme.text }]}>
        Most Performed Exercises
      </Text>

      {exerciseFreq.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          No exercise data yet.
        </Text>
      ) : (
        exerciseFreq.map(([name, count]) => (
          <Text
            key={name}
            style={[styles.freqItem, { color: theme.textSecondary }]}
          >
            {name} — {count} times
          </Text>
        ))
      )}

      <Text style={[styles.subtitle, { color: theme.text }]}>
        Last 7 Days Volume
      </Text>

      <AnimatedBarChart data={weeklyData} />
    </View>
  );
}

// --- Reusable Stat Box ---
function StatBox({ label, value }: { label: string; value: string | number }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.statBox,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

// --- Animated Bar Chart ---
function AnimatedBarChart({ data }: { data: number[] }) {
  const { theme } = useTheme();
  const max = Math.max(...data, 1);

  const animatedValues = useMemo(
    () => data.map(() => new Animated.Value(0)),
    [data]
  );

  useEffect(() => {
    Animated.stagger(
      80,
      animatedValues.map((val, i) =>
        Animated.timing(val, {
          toValue: data[i] / max,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      )
    ).start();
  }, [data]);

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View style={styles.chartContainer}>
      {data.map((value, i) => (
        <View key={i} style={styles.chartBarWrapper}>
          <Animated.View
            style={[
              styles.chartBar,
              {
                height: animatedValues[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
                backgroundColor: theme.primary,
              },
            ]}
          />
          <Text style={[styles.chartLabel, { color: theme.textSecondary }]}>
            {dayLabels[i]}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  statBox: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 10,
  },
  freqItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  chartContainer: {
    flexDirection: "row",
    height: 150,
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  chartBarWrapper: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  chartBar: {
    width: "100%",
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});