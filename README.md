# MyFirstGymApp 💪

A modern, cross-platform fitness tracking application built with **React Native** and **Expo**. Designed for simplicity and efficiency, this app empowers users to plan, execute, and track their strength training progress with ease.

## 🚀 Features

- **Session Management**: Plan your workouts and track them in real-time.
- **Dynamic Workout Editor**: Create and customize routines with ease.
- **Rich Exercise Library**: Choose from a predefined list of exercises or add custom ones.
- **Built-in Timer**: Track rest periods directly within the session runner.
- **Session History**: Review past performances to monitor progress over time.
- **Comprehensive Statistics**: Visual insights into your fitness journey (Work in Progress).
- **Dark/Light Mode**: Full theme support for a personalized visual experience.
- **Offline First**: Data is persisted locally using `AsyncStorage`.
- **Cross-Platform**: Seamless experience across iOS, Android, and Web.

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev) (SDK 54)
- **Library**: [React Native](https://reactnative.dev) (0.81)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Styling**: React Native StyleSheet with Dynamic Theme Context
- **State Management**: React Context API
- **Storage**: `@react-native-async-storage/async-storage`
- **Animations**: `react-native-reanimated`
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📂 Project Structure

```text
├── app/                     # Navigation and Screens (Expo Router)
│   ├── (tabs)/              # Main Tab Navigation (Home, Session, Statistics)
│   ├── sessionRunner/       # Active workout execution interface
│   ├── workoutEditor/       # Interfaces for creating/editing workouts
│   ├── history.tsx          # Past session log
│   └── _layout.tsx          # Root layout and providers
├── components/              # Reusable UI Components
│   ├── ExerciseCard/        # Detailed exercise display during sessions
│   ├── ExercisePicker/      # Modal for selecting exercises from the library
│   ├── Timer/               # Rest period timer component
│   ├── AddExerciseModal.tsx # Form for adding exercises to a workout
│   ├── CustomHeader.tsx     # Specialized header for navigation
│   └── Screen.tsx           # Base container with theme awareness
├── constants/               # Global constants and exercise definitions
├── context/                 # Theme and Global State providers
├── lib/                     # Utility functions and storage logic
└── assets/                  # Images, fonts, and static resources
```

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your mobile device (optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LinusWestling/MyFirstGymApp.git
   cd MyFirstGymApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm start
```

Use the keyboard shortcuts in the terminal to open the app:
- `a` for Android Emulator
- `i` for iOS Simulator
- `w` for Web Browser

## 🗺 Roadmap

- [ ] Enhanced dark mode styling across all legacy screens.
- [ ] Advanced search and category filters for the Exercise Picker.
- [ ] Transition from Emoji icons to custom SVG muscle group icons.
- [ ] Muscle group color coding (e.g., Chest: Red, Legs: Blue).
- [ ] "Favorite Exercises" section for quick access.
- [ ] Data Export/Import functionality.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

Developed with ❤️ by [Linus Westling](https://github.com/LinusWestling)