import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Use an env override for local dev so the auth flow can run on app.pay2play.local.
const authDomain =
  process.env.EXPO_PUBLIC_AUTH_DOMAIN ?? "pay-2-play-f1da3.firebaseapp.com";

const firebaseConfig = {
  apiKey: "AIzaSyArQjL38x2egEme3PNNtjhICzt3hekcouA",
  authDomain,
  projectId: "pay-2-play-f1da3",
  storageBucket: "pay-2-play-f1da3.appspot.com",
  messagingSenderId: "270335223167",
  appId: "1:270335223167:web:89c8f63243e26a7715264a",
  measurementId: "G-J565XP2MXB",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Connect to Firebase emulators in development
if (process.env.NODE_ENV === "development") {
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export default app;
