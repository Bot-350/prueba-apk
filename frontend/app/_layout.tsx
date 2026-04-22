import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Manrope_400Regular, Manrope_500Medium } from '@expo-google-fonts/manrope';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../src/auth';
import { ArtProvider } from '../src/store';
import { COLORS } from '../src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootGate() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Handle web OAuth redirect with #session_id=
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      if (hash.includes('session_id=')) {
        const sid = hash.split('session_id=')[1].split('&')[0];
        router.replace({ pathname: '/auth-callback', params: { session_id: sid } } as never);
        return;
      }
    }
    if (loading) return;
    if (!user) router.replace('/login');
    else router.replace('/(tabs)');
  }, [user, loading, router]);

  return (
    <View style={styles.loading} testID="root-gate-loading">
      <ActivityIndicator color={COLORS.primary} size="large" />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_600SemiBold,
    Outfit_700Bold,
    Manrope_400Regular,
    Manrope_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <AuthProvider>
        <ArtProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.bg } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="auth-callback" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="artwork/[id]" options={{ presentation: 'card' }} />
          </Stack>
        </ArtProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg },
});
