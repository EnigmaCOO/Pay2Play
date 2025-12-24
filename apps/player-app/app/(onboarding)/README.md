# Onboarding Flow - Phone Verification

This directory contains the onboarding screens for the Pay2Play player app, including Firebase phone authentication with OTP verification.

## Overview

The onboarding flow uses Firebase Phone Authentication to verify user phone numbers via SMS OTP codes.

### Flow

1. **Phone Entry** (`phone-entry.tsx`) - User enters their phone number
2. **OTP Verification** (`otp-verification.tsx`) - User enters the 4-digit OTP code sent via SMS
3. **Basic Info** (`basic-info.tsx`) - User completes their profile

## Firebase Phone Authentication

### Web Platform

On web, we use `signInWithPhoneNumber` with an invisible reCAPTCHA verifier:

```typescript
const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'invisible',
});
const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
```

### Native Platforms (iOS/Android)

Native phone authentication requires additional setup:

1. **iOS**: Configure APNs and upload APNs certificate to Firebase Console
2. **Android**: Enable Play Integrity API and configure SHA-256 fingerprints

For development, test on web platform or use Firebase Test Phone Numbers in Firebase Console.

## Components

### OtpInputRow

A custom component with 4 individual input boxes for OTP entry. Features:
- Auto-focus on first input
- Auto-advance to next input on entry
- Backspace navigation between inputs
- Visual feedback for filled inputs

### CountdownText

A countdown timer component that:
- Shows remaining time until OTP can be resent
- Triggers callback when countdown completes
- Formats time as MM:SS

## Styling

The screens match the design specifications:
- Dark background (#0D0D0D)
- Green accent color for submit button (#0C723F)
- Large, accessible text sizes
- Clear visual feedback for user actions

## Testing

### Development

1. **Web Testing**: 
   - Run `npm start` in the player-app directory
   - Open in browser
   - Phone auth will work with real phone numbers

2. **Test Phone Numbers** (Firebase Console):
   - Add test phone numbers in Firebase Console → Authentication → Sign-in method → Phone
   - Example: +1 650-555-3434 with code 123456

### Production

Before deploying to production:
1. Ensure Firebase Phone Authentication is enabled
2. Configure platform-specific requirements (APNs for iOS, SHA fingerprints for Android)
3. Set up proper reCAPTCHA site key for production domain
4. Test with real devices and phone numbers

## Environment Variables

No additional environment variables required - uses existing Firebase configuration from `lib/firebase.ts`.

## Error Handling

The implementation includes error handling for:
- Invalid phone numbers
- Network errors
- Invalid OTP codes
- Exceeded verification attempts
- User creation failures

All errors are displayed to the user via `Alert` dialogs with clear, actionable messages.

## User Profile Creation

When a user successfully verifies their phone number:
1. Firebase creates an authenticated user
2. A Firestore document is created in the `users` collection with:
   - `phoneNumber`: The verified phone number
   - `createdAt`: Timestamp
   - `role`: 'player' (default)

If the user already exists, the existing profile is used.
