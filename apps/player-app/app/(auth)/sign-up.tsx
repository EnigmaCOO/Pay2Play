import React, { useEffect } from 'react';
import { useRouter, Href } from 'expo-router';

const SignUpScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified auth screen
    router.replace('/(auth)/auth' as Href);
  }, []);

  return null;
};

export default SignUpScreen;
