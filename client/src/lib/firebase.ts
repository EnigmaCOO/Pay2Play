import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyArQjL38x2egEme3PNNtjhICzt3hekcouA",
  authDomain: "pay-2-play-f1da3.firebaseapp.com",
  projectId: "pay-2-play-f1da3",
  storageBucket: "pay-2-play-f1da3.firebasestorage.app",
  messagingSenderId: "270335223167",
  appId: "1:270335223167:web:89c8f63243e26a7715264a",
  measurementId: "G-J565XP2MXB",
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

let analytics: Analytics | undefined;

if (typeof window !== "undefined") {
  void isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(firebaseApp);
      }
    })
    .catch((error) => {
      if (import.meta.env.DEV) {
        console.warn("Firebase analytics initialization failed", error);
      }
    });
}

export { analytics, firebaseApp, firebaseConfig };
