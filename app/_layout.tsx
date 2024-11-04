import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import AuthenticationService from '@/services/AuthenticationService';
import useStore from '@/stores/useStore';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const user = useStore((state) => state.user);
  const hasCompletedOnboarding = useStore((state) => state.hasCompletedOnboarding);
  const { setUser, setHasCompletedOnboarding } = useStore();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    MaterialSymbols: require('../assets/fonts/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].ttf'),
    InterRegular: require('../assets/fonts/Inter-Regular.ttf'),
    InterTight: require('../assets/fonts/InterTight-Regular.ttf'),
    InterMedium: require('../assets/fonts/Inter-Medium.ttf'),
    InterTightMedium: require('../assets/fonts/InterTight-Medium.ttf'),
    InterSemiBold: require('../assets/fonts/Inter-SemiBold.ttf'),
    InterTightSemiBold: require('../assets/fonts/InterTight-SemiBold.ttf'),
    InterBold: require('../assets/fonts/Inter-Bold.ttf'),
    InterTightBold: require('../assets/fonts/InterTight-Bold.ttf'),
    InterTightExtraBold: require('../assets/fonts/InterTight-ExtraBold.ttf'),
  });

  useEffect(() => {
    async function checkInitialState() {
      try {
        const authService = AuthenticationService.getInstance();
        const currentUser = await authService.getUser();
        const hasCompleted = await authService.hasCompletedOnboarding();
        
        setUser(currentUser);
        setHasCompletedOnboarding(hasCompleted);
      } catch (error) {
        console.error('Error checking initial state:', error);
      } finally {
        SplashScreen.hideAsync();
      }
    }

    if (loaded) {
      checkInitialState();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false,}}>
        {!user || !hasCompletedOnboarding ? (
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        )}
      </Stack>
    </ThemeProvider>
    </SafeAreaProvider>
  );
}
