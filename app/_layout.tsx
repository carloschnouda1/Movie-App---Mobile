import { useEffect } from "react";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { ActivityIndicator, StatusBar, View } from "react-native";
import "./global.css";

const RootNavigator = () => {
  const { initializing, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const isAuthSegment = segments[0] === "(auth)";

  useEffect(() => {
    if (initializing) {
      return;
    }

    if (!user && !isAuthSegment) {
      router.replace("/(auth)/login");
    } else if (user && isAuthSegment) {
      router.replace("/(tabs)");
    }
  }, [initializing, isAuthSegment, router, user]);

  if (initializing) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
      <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar hidden />
      <RootNavigator />
    </AuthProvider>
  );
}
