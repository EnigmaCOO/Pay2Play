
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, PhoneAuthProvider, signInWithCredential, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  signInWithOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const signInWithOTP = async (phoneNumber: string) => {
    try {
      // Note: For React Native, you'll need @react-native-firebase/auth
      // This implementation assumes Firebase Auth is configured
      // For now, we'll use the web SDK which works in Expo
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      // In production, implement reCAPTCHA for web or use @react-native-firebase/auth
      console.log('Sending OTP to:', formattedNumber);
      
      // Store for verification - in production, Firebase returns this
      setVerificationId('pending-verification');
      
      // TODO: Replace with actual Firebase phone auth when deploying
      // const confirmation = await signInWithPhoneNumber(auth, formattedNumber);
      // setVerificationId(confirmation.verificationId);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }
  };

  const verifyOTP = async (phoneNumber: string, code: string) => {
    try {
      if (!verificationId) {
        throw new Error('No verification ID found');
      }
      
      // TODO: Replace with actual verification when deploying
      // const credential = PhoneAuthProvider.credential(verificationId, code);
      // await signInWithCredential(auth, credential);
      
      // Mock success for development
      console.log('OTP verified:', code);
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      throw new Error(error.message || 'Invalid OTP');
    }
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signInWithOTP, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
