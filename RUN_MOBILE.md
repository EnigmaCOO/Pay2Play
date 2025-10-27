# Running the P2P Mobile App on Replit

## Quick Start

The P2P mobile app is built with Expo and React Native. Here's how to run it:

### Step 1: Start the Expo Development Server

In the Replit Shell, navigate to the mobile app directory and start the server:

```bash
cd apps/mobile
npm start
```

Or from the root directory:
```bash
cd apps/mobile && npm start
```

### Step 2: Access the App

Once the server starts, you'll see a QR code in the terminal. You have several options:

#### Option A: Use Expo Go on Your Phone (Recommended)
1. **Install Expo Go**:
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. **Scan the QR Code**:
   - iOS: Use your Camera app to scan the QR code
   - Android: Use the Expo Go app to scan the QR code

3. The app will load on your device!

#### Option B: Use Web Browser (Limited Features)
- Press `w` in the terminal to open the web version
- Note: Some React Native features won't work in web mode

#### Option C: Use an Emulator (Advanced)
- Press `a` for Android emulator (requires Android Studio)
- Press `i` for iOS simulator (requires macOS with Xcode)

## Environment Variables

The mobile app needs to connect to the backend API. Make sure these are configured:

### Development (Local Testing)
The app is configured to use:
```
EXPO_PUBLIC_API_URL=http://localhost:5000
```

### Testing with Real Device
If your phone and Replit are on different networks, you'll need to:

1. Make sure the backend server is running:
   ```bash
   npm run dev
   ```

2. Update the API URL in `apps/mobile/lib/api.ts` to use your Replit URL or ngrok tunnel.

## Firebase Configuration

The app requires Firebase for authentication. Make sure these environment variables are set:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## Troubleshooting

### Port Issues
If port 8081 (Expo's default) is already in use:
```bash
npx expo start --port 8082
```

### Metro Bundler Issues
Clear the cache:
```bash
npx expo start --clear
```

### Backend Connection Issues
1. Make sure the backend server is running on port 5000
2. Check that `EXPO_PUBLIC_API_URL` points to the correct server
3. For device testing, use your machine's local IP instead of localhost

## Hot Reload

The app supports hot reload! Changes you make to the code will automatically refresh on your device.

## Available Screens

Once running, you'll have access to:
- **Discover**: Browse and search for games
- **Bookings**: View your upcoming and past bookings
- **Friends**: (Coming soon)
- **Messages**: (Coming soon)
- **Profile**: Manage your user profile

## Design Features

The app now includes:
- ✨ AsyncStorage cache persistence (data persists across restarts)
- 💀 Skeleton loaders for smooth loading states
- 🎮 Nintendo-style design with rounded cards and playful shadows
- 🌈 Color-coded difficulty levels (green to red)
- 🎨 Sport-specific glows and theming

Enjoy testing the app!
