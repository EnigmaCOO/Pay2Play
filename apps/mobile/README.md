# P2P Mobile App

A React Native mobile application built with Expo and TypeScript for the P2P sports booking platform.

## Features

- **Expo Router**: File-based routing with bottom tabs navigation
- **NativeWind**: Tailwind CSS for React Native styling
- **React Query**: Data fetching and state management
- **Zustand**: Lightweight state management
- **TypeScript**: Full type safety

## Tabs

1. **Discover**: Browse games and venues
2. **Bookings**: Manage reservations
3. **Friends**: Connect with teammates
4. **Messages**: Chat with players
5. **Profile**: Account management

## Theme

The app uses the P2P brand colors:
- **Navy** (#1e3a5f): Primary background
- **Teal** (#14b8a6): Accent color for interactive elements
- **Gold** (#fbbf24): Highlight color for special features

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
cd apps/mobile
npm install
```

### Running the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## Project Structure

```
apps/mobile/
├── app/
│   ├── (tabs)/           # Tab screens
│   │   ├── _layout.tsx   # Tab navigation
│   │   ├── index.tsx     # Discover
│   │   ├── bookings.tsx  # Bookings
│   │   ├── friends.tsx   # Friends
│   │   ├── messages.tsx  # Messages
│   │   └── profile.tsx   # Profile
│   └── _layout.tsx       # Root layout
├── assets/               # Images and fonts
├── babel.config.js       # Babel configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── global.css            # Global styles
├── tsconfig.json         # TypeScript configuration
└── app.json              # Expo configuration
```

## Technologies

- **Expo**: ~52.0.0
- **React Native**: 0.80.2
- **Expo Router**: ~4.0.0
- **NativeWind**: ^4.1.23
- **TanStack Query**: ^5.17.0
- **Zustand**: ^4.4.7
- **TypeScript**: ^5.3.0

## Styling with NativeWind

This app uses NativeWind (Tailwind CSS for React Native). Use Tailwind utility classes in your components:

```tsx
<View className="bg-navy-800 p-4 rounded-xl">
  <Text className="text-white font-bold text-xl">
    Hello P2P!
  </Text>
</View>
```

## License

Private
