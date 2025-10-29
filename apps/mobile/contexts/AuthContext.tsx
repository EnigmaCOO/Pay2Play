import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { registerForPushNotificationsAsync, registerPushTokenWithServer } from '@/lib/pushNotifications';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  verifyPhoneNumber: (phoneNumber: string, recaptchaVerifier: any) => Promise<string>;
  confirmPhoneCode: (verificationId: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  idToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
        
        // Register push token after login
        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken) {
          await registerPushTokenWithServer(pushToken);
        }
      } else {
        setIdToken(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const verifyPhoneNumber = async (phoneNumber: string, recaptchaVerifier: any): Promise<string> => {
    const phoneProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneProvider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier
    );
    return verificationId;
  };

  const confirmPhoneCode = async (verificationId: string, code: string) => {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    await signInWithCredential(auth, credential);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        verifyPhoneNumber,
        confirmPhoneCode,
        signOut,
        idToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
