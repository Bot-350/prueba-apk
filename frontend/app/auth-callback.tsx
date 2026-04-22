import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../src/auth';
import { COLORS, FONTS, SPACING } from '../src/theme';

export default function AuthCallback() {
  const params = useLocalSearchParams<{ session_id?: string }>();
  const router = useRouter();
  const { signInWithSessionId } = useAuth();
  const processed = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    const sid = params.session_id;
    if (!sid) {
      router.replace('/login');
      return;
    }
    (async () => {
      try {
        await signInWithSessionId(String(sid));
        router.replace('/(tabs)');
      } catch (e: any) {
        setError(e?.message || 'Login failed');
        setTimeout(() => router.replace('/login'), 1500);
      }
    })();
  }, [params.session_id, router, signInWithSessionId]);

  return (
    <View style={styles.container} testID="auth-callback-screen">
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>{error ? error : 'Signing you in…'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg },
  text: { color: COLORS.textSecondary, fontFamily: FONTS.body, marginTop: SPACING.md },
});
