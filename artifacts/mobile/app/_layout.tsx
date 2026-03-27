import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform, View } from "react-native";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { isOnboardingDone } from "@/utils/storage";
import colors from "@/constants/colors";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Track whether we should redirect after navigation mounts
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const didNavigate = useRef(false);

  const darkBg = { flex: 1, backgroundColor: colors.background };

  // Check onboarding state once fonts are ready
  useEffect(() => {
    if (!fontsLoaded && !fontError) return;
    async function check() {
      try {
        if (Platform.OS !== "web") {
          await ScreenOrientation.unlockAsync();
        }
        const done = await isOnboardingDone();
        setNeedsOnboarding(!done);
        if (Platform.OS !== "web") {
          Notifications.requestPermissionsAsync({
            ios: { allowAlert: true, allowSound: true, allowBadge: true },
          }).catch(() => {});
          MediaLibrary.requestPermissionsAsync().catch(() => {});
          Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
          }).catch(() => {});
        }
      } catch {
        setNeedsOnboarding(false);
      } finally {
        SplashScreen.hideAsync().catch(() => {});
      }
    }
    check();
  }, [fontsLoaded, fontError]);

  // Once navigation is mounted and we know onboarding state, redirect
  useEffect(() => {
    if (needsOnboarding === null || didNavigate.current) return;
    if (needsOnboarding) {
      didNavigate.current = true;
      // Small delay to ensure navigation stack is mounted
      const t = setTimeout(() => {
        router.replace("/onboarding");
      }, 100);
      return () => clearTimeout(t);
    }
  }, [needsOnboarding]);

  // Always render the navigation tree so router is available
  return (
    <SafeAreaProvider style={darkBg}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={darkBg}>
            <KeyboardProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="player"
                  options={{
                    headerShown: false,
                    animation: "slide_from_bottom",
                    presentation: "modal",
                  }}
                />
                <Stack.Screen
                  name="onboarding"
                  options={{
                    headerShown: false,
                    animation: "fade",
                    presentation: "fullScreenModal",
                    gestureEnabled: false,
                  }}
                />
              </Stack>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
