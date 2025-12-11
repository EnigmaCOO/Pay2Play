
import { Redirect } from 'expo-router';

export default function Index() {
  // For now, always redirect to the onboarding flow.
  // Later, this can be conditional based on user auth state.
  return <Redirect href="/(onboarding)/welcome" />;
}
