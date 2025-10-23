# P2P Mobile App

A React Native mobile application built with Expo and TypeScript for the P2P sports booking platform.

## Features

- **Expo Router**: File-based routing with bottom tabs navigation
- **Firebase Authentication**: Phone and email OTP authentication
- **Expo Push Notifications**: Real-time notifications with automatic token registration
- **NativeWind**: Tailwind CSS for React Native styling
- **React Query**: Data fetching and state management
- **Zustand**: Lightweight state management
- **TypeScript**: Full type safety
- **API Integration**: Axios client with automatic Bearer token authentication

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
- Firebase project with Authentication enabled

### Installation

```bash
cd apps/mobile
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Firebase configuration to `.env`:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   EXPO_PUBLIC_API_URL=http://localhost:5000
   ```

3. Enable Email/Password and Phone authentication in Firebase Console:
   - Go to Authentication → Sign-in method
   - Enable Email/Password provider
   - Enable Phone provider

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
│   ├── (auth)/           # Authentication screens
│   │   ├── _layout.tsx   # Auth layout
│   │   └── login.tsx     # Login with email/phone OTP
│   ├── (tabs)/           # Tab screens
│   │   ├── _layout.tsx   # Tab navigation
│   │   ├── index.tsx     # Discover
│   │   ├── bookings.tsx  # Bookings
│   │   ├── friends.tsx   # Friends
│   │   ├── messages.tsx  # Messages
│   │   └── profile.tsx   # Profile
│   └── _layout.tsx       # Root layout with auth routing
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Firebase authentication context
├── lib/                  # Utilities
│   ├── firebase.ts       # Firebase configuration
│   ├── api.ts            # API client with auth headers
│   └── pushNotifications.ts # Push notification setup
├── assets/               # Images and fonts
├── babel.config.js       # Babel configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── metro.config.js       # Metro bundler configuration
├── global.css            # Global styles
├── tsconfig.json         # TypeScript configuration
├── app.json              # Expo configuration
└── .env.example          # Environment variables template
```

## Technologies

- **Expo**: ~52.0.0
- **React Native**: 0.76.5
- **React**: ^18.3.1
- **Expo Router**: ~4.0.0
- **Firebase**: ^10.7.1
- **Expo Notifications**: ~0.29.0
- **NativeWind**: ^4.1.23
- **TanStack Query**: ^5.17.0
- **Zustand**: ^4.4.7
- **Axios**: ^1.6.2
- **TypeScript**: ^5.3.0

## Authentication

The app uses Firebase Authentication with support for:

### Email/Password Authentication
- Sign up with email and password
- Sign in with existing credentials
- Automatic token refresh

### Phone OTP Authentication
1. Enter phone number with country code (e.g., +1 555 123 4567)
2. Receive 6-digit OTP via SMS
3. Enter code to verify and sign in
4. Supports invisible reCAPTCHA verification

### Authorization
- ID tokens automatically attached as `Authorization: Bearer <token>` on all API requests
- Tokens refresh automatically when expired
- Sign out clears tokens and redirects to login

### Push Notifications
- Expo push tokens automatically registered on login
- Tokens sent to `POST /api/users/push-token`
- Notifications configured with P2P theme colors

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
