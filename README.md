# MyFirstGymApp 💪

A cross-platform fitness tracking application built with React Native and Expo. This app helps you manage workout sessions, track exercises, and monitor your fitness progress.

## Features

- **Session Management**: Create, start, and track workout sessions
- **Exercise Tracking**: Log exercises with sets, reps, and weights
- **Workout Editor**: Create and customize your workout routines
- **Session History**: View your past workout sessions
- **Statistics**: Track your fitness progress and statistics
- **Dark/Light Mode**: Toggle between light and dark themes for comfortable viewing
- **Cross-Platform**: Runs on iOS, Android, and web

## Tech Stack

- **Framework**: [Expo](https://expo.dev) with React Native
- **Routing**: [Expo Router](https://expo.dev/router) for file-based navigation
- **State Management**: React Context API for theme management
- **Storage**: AsyncStorage for persisting user data
- **TypeScript**: Fully typed for better development experience

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/LinusWestling/MyFirstGymApp.git
   cd MyFirstGymApp
   ```

2. Install dependencies

   ```bash
   npm install
   ```

### Running the App

Start the development server:

```bash
npm start
```

or with cache clearing:

```bash
npx expo start -c
```

In the terminal output, you'll see options to open the app in:

- **Expo Go** (fastest way to test on your phone)
- **Android Emulator**: Press `a`
- **iOS Simulator**: Press `i`
- **Web Browser**: Press `w`

## Project Structure

```
├── app/                      # Main app screens
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── index.tsx        # Home screen
│   │   ├── session.tsx      # Session tracking
│   │   └── statistics.tsx   # Statistics view
│   ├── history.tsx          # Workout history
│   ├── sessionRunner/       # Session execution
│   └── workoutEditor/       # Workout creation
├── components/              # Reusable UI components
├── context/                 # React Context (Theme)
├── constants/               # App constants
├── lib/                     # Utilities (Storage)
└── assets/                  # Images and media
```

## Available Scripts

- `npm start` - Start the development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
