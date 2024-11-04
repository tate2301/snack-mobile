import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingLayout() {
  return (
    <SafeAreaView edges={["bottom"]}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="features" options={{ headerShown: true }} />
        <Stack.Screen name="setup" options={{ headerShown: true }} />
      </Stack>
    </SafeAreaView>
  );
}
