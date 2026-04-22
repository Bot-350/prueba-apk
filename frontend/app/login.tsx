import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADII, FONTS } from '../src/theme';
import { useAuth } from '../src/auth';

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
const BACKEND = process.env.EXPO_PUBLIC_BACKEND_URL as string;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { signInWithSessionId } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        // On web, the app origin matches the packager hostname
        const redirectUrl = typeof window !== 'undefined' ? window.location.origin + '/' : BACKEND + '/';
        const url = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
        window.location.href = url;
        return;
      }
      // Native: use expo-web-browser auth session
      const redirectUrl = BACKEND + '/';
      const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
      if (result.type === 'success' && result.url) {
        const hashIdx = result.url.indexOf('#');
        const frag = hashIdx >= 0 ? result.url.slice(hashIdx + 1) : '';
        const params = Object.fromEntries(new URLSearchParams(frag));
        const sid = params.session_id;
        if (sid) {
          await signInWithSessionId(sid);
          router.replace('/(tabs)');
        } else {
          Alert.alert('Login failed', 'No session returned.');
        }
      }
    } catch (e: any) {
      Alert.alert('Login error', e?.message || 'Could not complete sign-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root} testID="login-screen">
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1758930908621-550b64b0b1c1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwzfHxmYW50YXN5JTIwbGFuZHNjYXBlJTIwY29uY2VwdCUyMGFydHxlbnwwfHx8fDE3NzY4NTk5MzF8MA&ixlib=rb-4.1.0&q=85' }}
        style={StyleSheet.absoluteFill as any}
        blurRadius={Platform.OS === 'web' ? 0 : 6}
      />
      <LinearGradient
        colors={['rgba(10,10,10,0.3)', 'rgba(10,10,10,0.85)', '#0A0A0A']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill as any}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>PA</Text>
          </View>
          <Text style={styles.title}>papilinesart</Text>
          <Text style={styles.subtitle}>
            A gallery built by creators. Browse, collect, and share one-of-a-kind digital art.
          </Text>

          <TouchableOpacity
            testID="login-google-button"
            onPress={handleGoogleLogin}
            disabled={loading}
            activeOpacity={0.85}
            style={styles.googleBtn}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.onPrimary} />
            ) : (
              <>
                <View style={styles.gIcon}>
                  <Text style={styles.gIconText}>G</Text>
                </View>
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.legal}>
            By continuing, you agree to the community rules. No real payments are processed.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1, paddingHorizontal: SPACING.lg, justifyContent: 'flex-end', paddingBottom: SPACING.xl2 },
  logoBadge: {
    width: 56, height: 56, borderRadius: RADII.md, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md,
  },
  logoText: { color: COLORS.onPrimary, fontFamily: FONTS.headingBold, fontSize: 22 },
  title: { color: COLORS.text, fontFamily: FONTS.headingBold, fontSize: 44, letterSpacing: -1 },
  subtitle: {
    color: COLORS.textSecondary, fontFamily: FONTS.body, fontSize: 16, lineHeight: 24,
    marginTop: SPACING.sm, marginBottom: SPACING.xl,
  },
  googleBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADII.full,
    paddingVertical: 16, paddingHorizontal: SPACING.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    shadowColor: COLORS.primary, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, elevation: 8,
  },
  gIcon: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  gIconText: { color: '#4285F4', fontFamily: FONTS.headingBold, fontSize: 14 },
  googleBtnText: { color: COLORS.onPrimary, fontFamily: FONTS.headingSemi, fontSize: 16 },
  legal: { color: COLORS.textTertiary, fontFamily: FONTS.body, fontSize: 12, marginTop: SPACING.md, textAlign: 'center' },
});
