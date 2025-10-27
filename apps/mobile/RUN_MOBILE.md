# Running the P2P Mobile App

## Quick Start

### Option 1: Run Locally with Expo Go (Recommended)

1. **Install dependencies** (if not already installed):
   ```bash
   cd apps/mobile
   npm install
   ```

2. **Start the Expo dev server**:
   ```bash
   npm start
   ```

3. **Scan QR code**:
   - Install **Expo Go** app on your phone:
     - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
     - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - Scan the QR code shown in your terminal with:
     - iOS: Camera app
     - Android: Expo Go app

4. **The app will load** on your phone connected to the backend running on port 5000

### Option 2: Run in Browser (Limited Features)

```bash
cd apps/mobile
npm run web
```

**Note**: Some native features (Firebase Auth, Push Notifications) won't work in browser.

## Environment Setup

The mobile app expects the backend API to be running on `http://localhost:5000`.

Make sure the backend is started:
```bash
# From project root
npm run dev
```

## Firebase Configuration

The app uses Firebase for authentication. Ensure these environment variables are set in the backend:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## Features Available

- ✅ Discover games with filters (date, sport, difficulty, distance)
- ✅ Game details with roster, tabs, join/pay flow
- ✅ Profile with progress tracking and editable preferences
- ✅ Bookings list (upcoming/past)
- ✅ Friends list
- ✅ Push notifications

## Troubleshooting

### "Unable to connect to development server"
- Ensure backend is running on port 5000
- Check that your phone and computer are on the same network
- Try restarting the Expo server with `npm start --clear`

### Firebase Auth Issues
- Verify Firebase credentials are configured in backend
- Check that Firebase project allows the authentication methods you're using

### "Module not found" errors
- Clear cache: `npm start --clear`
- Reinstall: `rm -rf node_modules && npm install`
