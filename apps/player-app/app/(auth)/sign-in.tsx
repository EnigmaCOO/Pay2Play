import React, { useEffect } from 'react';
import { useRouter, Href } from 'expo-router';

const SignInScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified auth screen
    router.replace('/(auth)/auth' as Href);
  }, []);

  return null;
};

export default SignInScreen;
