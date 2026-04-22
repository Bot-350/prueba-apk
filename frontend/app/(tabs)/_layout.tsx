import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Home, Upload, ShoppingBag, User } from 'lucide-react-native';
import { COLORS, FONTS } from '../../src/theme';
import { useAuth } from '../../src/auth';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useArt } from '../../src/store';

function TabBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <View style={styles.badge} testID="cart-tab-badge">
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { cart } = useArt();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: {
          backgroundColor: COLORS.tabBar,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontFamily: FONTS.bodyMed, fontSize: 11, marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={2} />,
          tabBarButtonTestID: 'tab-home',
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, size }) => <Upload color={color} size={size} strokeWidth={2} />,
          tabBarButtonTestID: 'tab-upload',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <ShoppingBag color={color} size={size} strokeWidth={2} />
              <TabBadge count={cart.length} />
            </View>
          ),
          tabBarButtonTestID: 'tab-cart',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} strokeWidth={2} />,
          tabBarButtonTestID: 'tab-profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg },
  badge: {
    position: 'absolute', top: -4, right: -8, backgroundColor: COLORS.primary,
    borderRadius: 10, paddingHorizontal: 5, minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: COLORS.onPrimary, fontFamily: FONTS.headingBold, fontSize: 10 },
});
