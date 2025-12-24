import { Redirect } from 'expo-router';
import React, { startTransition, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Index() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // During SSR hydration on web, auth can resolve very quickly.
      // Wrapping state updates in startTransition avoids updating
      // this Suspense boundary before hydration has completed.
      startTransition(() => {
      setUser(user);
      setLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null; // Or a loading screen
  }

  // If user is authenticated, redirect to home
  if (user) {
    return <Redirect href={'/tabs/home as any'} />;
  }

  // Otherwise, redirect to sign-in
  return <Redirect href="/(auth)/sign-in" />;
}
