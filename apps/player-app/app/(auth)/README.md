# Authentication Module

This module handles user authentication for the Pay2Play player app.

## Features

- **Sign In**: Phone number and password authentication
- **Sign Up**: New user registration
- **Forgot Password**: Password reset via email
- **Google Sign-In**: Social authentication (Web only for now)
- **Auth State Management**: Automatic routing based on authentication status

## Screens

### Sign In (`sign-in.tsx`)
The main authentication screen where users can:
- Sign in with phone number and password
- Sign in with Google (web only)
- Navigate to sign up
- Reset forgotten password

**Design Notes:**
- Matches the Figma design with dark theme
- Uses Ionicons for consistent iconography
- Includes password visibility toggle
- Validates input before submission

### Sign Up (`sign-up.tsx`)
New user registration screen with:
- Full name input
- Phone number input
- Password with confirmation
- Auto-creates user profile in Firestore

**Validation:**
- All fields required
- Passwords must match
- Minimum 6 characters for password
- Checks for existing phone numbers

### Forgot Password (`forgot-password.tsx`)
Password reset flow:
- Enter phone number
- Receive password reset email
- Follow link to reset password

## Authentication Utilities (`lib/auth.ts`)

### Key Functions

#### `phoneToEmail(phoneNumber: string): string`
Converts phone numbers to email format for Firebase compatibility.

```typescript
phoneToEmail("3001234567") // returns "3001234567@pay2play.app"
```

#### `signUpWithPhone(phoneNumber, password, displayName?)`
Creates a new user account and Firestore profile.

```typescript
await signUpWithPhone("3001234567", "password123", "John Doe");
```

#### `signInWithPhone(phoneNumber, password)`
Authenticates existing user.

```typescript
await signInWithPhone("3001234567", "password123");
```

#### `signOut()`
Signs out current user.

```typescript
await signOut();
```

#### `resetPassword(phoneNumber)`
Sends password reset email.

```typescript
await resetPassword("3001234567");
```

#### `getUserProfile(uid)`
Retrieves user profile from Firestore.

```typescript
const profile = await getUserProfile(user.uid);
```

## Firebase Configuration

Authentication uses the Firebase configuration in `lib/firebase.ts`:

```typescript
import { auth, db } from '../../lib/firebase';
```

### Services Used
- **Firebase Auth**: User authentication
- **Firestore**: User profiles and data
- **Firebase Functions**: Backend integration

## User Flow

1. **First Launch**: User sees sign-in screen
2. **New User**: Clicks "Sign up" → Fill registration form → Auto sign-in → Home
3. **Returning User**: Enter credentials → Sign in → Home
4. **Forgot Password**: Click "Forgot Password?" → Enter phone → Receive email → Reset password

## Auth State Management

The root `index.tsx` handles auth state:

```typescript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });
  return () => unsubscribe();
}, []);

// Redirects based on auth state
if (user) {
  return <Redirect href="/(tabs)/home" />;
}
return <Redirect href="/(auth)/sign-in" />;
```

## Google Sign-In

### Web
Google Sign-In works out of the box on web using `signInWithPopup`.

### Mobile (Coming Soon)
Mobile Google Sign-In requires additional setup:
1. Install `@react-native-google-signin/google-signin` or `expo-auth-session`
2. Configure OAuth credentials in Firebase Console
3. Implement native sign-in flow

Current implementation shows "Coming Soon" alert on mobile.

## Firestore User Profile

When a user signs up, a profile document is created:

```typescript
{
  phoneNumber: string,
  displayName: string,
  createdAt: string,
  role: 'player'
}
```

## Security

- Passwords are hashed by Firebase Auth
- Phone numbers are converted to email format for privacy
- Firestore rules should restrict user document access
- All auth operations use secure Firebase SDK methods

## Error Handling

The module provides user-friendly error messages:
- "Invalid phone number or password" for auth failures
- "This phone number is already registered" for duplicate accounts
- "Passwords do not match" for sign-up validation
- "Password must be at least 6 characters" for weak passwords

## Styling

All screens use the shared design system:
- `ScreenBackground`: Gradient dark background
- `Ionicons`: Consistent icon library
- Matches Figma design specifications
- Responsive font sizes and spacing

## Next Steps

- [ ] Implement phone OTP verification
- [ ] Add biometric authentication
- [ ] Implement mobile Google Sign-In
- [ ] Add Facebook/Apple authentication
- [ ] Implement session management
- [ ] Add remember me functionality
- [ ] Implement email verification
