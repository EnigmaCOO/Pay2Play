
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="phone-entry" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="basic-info" />
      <Stack.Screen name="preferences" />
    </Stack>
  );
}
