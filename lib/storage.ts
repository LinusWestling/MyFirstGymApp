import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveSessions(sessions: any) {
  try {
    await AsyncStorage.setItem("sessions", JSON.stringify(sessions));
  } catch (e) {
    console.log("Error saving sessions", e);
  }
}

export async function loadSessions() {
  try {
    const data = await AsyncStorage.getItem("sessions");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log("Error loading sessions", e);
    return [];
  }
}