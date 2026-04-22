import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../src/theme';

// Root gate is handled inside _layout via <RootGate /> rendered here.
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/auth';
import { Platform } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      if (hash.includes('session_id=')) {
        const sid = hash.split('session_id=')[1].split('&')[0];
        // Clear the hash so we don't reprocess
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        router.replace({ pathname: '/auth-callback', params: { session_id: sid } } as never);
        return;
      }
    }
    if (loading) return;
    if (!user) router.replace('/login');
    else router.replace('/(tabs)');
  }, [user, loading, router]);

  return (
    <View style={styles.loading} testID="index-loading">
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg },
});
