
# P2P Sports Mobile App (React Native + Expo)

## Setup

1. Install dependencies:
```bash
cd mobile
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your values:
   - `EXPO_PUBLIC_API_URL`: Your Replit deployment URL or local IP
   - Firebase credentials from Firebase Console

4. Start the development server:
```bash
npm start
```

5. Scan QR code with Expo Go app (iOS/Android)

## Features

- ✅ Firebase OTP Authentication
- ✅ Push Notifications (Expo)
- ✅ Tab Navigation (Home, Games, Venues, Bookings, Profile)
- ✅ API Integration with unified Express backend
- ✅ Auto push token registration

## API Integration

The app connects to your unified backend at port 5000. Make sure:
- Backend is running on Replit
- `.env` has correct `EXPO_PUBLIC_API_URL`
- Firewall allows connections from your device

## Push Notifications

Push tokens are automatically registered to `/api/users/push-token` when user logs in.
