import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Index() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null; // Or a loading screen
  }

  // If user is authenticated, redirect to home
  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Otherwise, redirect to sign-in
  return <Redirect href="/(auth)/sign-in" />;
}
