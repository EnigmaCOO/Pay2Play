import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { LogBox } from 'react-native';

// Error boundary to catch and silently ignore the specific Suspense
// hydration error React throws in dev/SSR on web, while still allowing
// the app to fall back to client rendering.
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; ignoreSuspenseHydrationError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, ignoreSuspenseHydrationError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    const message = (error as any)?.message as string | undefined;
    if (
      message &&
      message.includes('This Suspense boundary received an update before it finished hydrating')
    ) {
      // Mark that we've seen the Suspense hydration error, but do NOT
      // show a fallback; let React continue with client rendering.
      return { hasError: false, ignoreSuspenseHydrationError: true };
    }
    return { hasError: true, ignoreSuspenseHydrationError: false };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Only report unexpected errors; silently ignore the known
    // Suspense hydration case so it doesn't surface in the UI.
    if (!this.state.ignoreSuspenseHydrationError) {
      console.error(error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can customize this fallback if you want a visible error UI.
      return null;
    }
    // For the Suspense hydration case we simply render children normally,
    // allowing React to switch the boundary to client rendering.
    return this.props.children;
  }
}

// const IgnoreLogs = (props: { children: React.ReactNode }) => {
//   React.useEffect(() => {
//     LogBox.ignoreLogs([
//       '*Suspense*'
//     ]);
//   }, []);
//   return props.children;
// }

export default function RootLayout() {
  return (
    <AppErrorBoundary>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
    </AppErrorBoundary>
  );
}
