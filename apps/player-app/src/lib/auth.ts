import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { firebaseConfig } from "./firebase"; // Assuming firebase.ts exports firebaseConfig

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Optionally update display name
    if (displayName && userCredential.user) {
      // This would typically be handled by a backend call to update the user profile
      // For now, we'll just return the user credential
    }
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing up:", error.message);
    throw error;
  }
};

export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error logging in:", error.message);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error logging out:", error.message);
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Unsubscribe after the first call
      resolve(user);
    });
  });
};

export { auth };
