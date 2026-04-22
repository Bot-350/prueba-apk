import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { COLORS, SPACING, RADII, FONTS } from '../../src/theme';
import { useAuth } from '../../src/auth';
import { useArt } from '../../src/store';

const { width } = Dimensions.get('window');
const TILE = (width - SPACING.md * 2 - SPACING.sm * 2) / 3;

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { artworks } = useArt();
  const router = useRouter();

  const myArt = artworks.filter((a) => a.uploadedBy && a.uploadedBy === user?.user_id);

  const doLogout = () => {
    const confirmLogout = async () => {
      await signOut();
      router.replace('/login');
    };
    if (Platform.OS === 'web') {
      // Alert.alert callbacks are unreliable on web — confirm synchronously
      // eslint-disable-next-line no-alert
      if (typeof window !== 'undefined' && window.confirm('Log out of ArtHub?')) {
        confirmLogout();
      }
      return;
    }
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: confirmLogout },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="profile-screen">
      <View style={styles.headerBg} />
      <View style={styles.profileCard}>
        {user?.picture ? (
          <Image source={{ uri: user.picture }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitial}>{(user?.name?.[0] || 'U').toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.name} testID="profile-name">{user?.name || 'Artist'}</Text>
        <Text style={styles.email} testID="profile-email">{user?.email}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{myArt.length}</Text>
            <Text style={styles.statLabel}>Uploads</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{artworks.length}</Text>
            <Text style={styles.statLabel}>Total pieces</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={doLogout} testID="profile-logout-btn">
          <LogOut color={COLORS.text} size={16} strokeWidth={2} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your uploads</Text>
      </View>

      {myArt.length === 0 ? (
        <View style={styles.emptyUploads}>
          <Text style={styles.emptyText}>You haven&apos;t uploaded anything yet.</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/upload')} style={styles.startBtn} testID="profile-start-upload">
            <Text style={styles.startBtnText}>Upload your first piece</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myArt}
          keyExtractor={(i) => i.id}
          numColumns={3}
          columnWrapperStyle={{ gap: SPACING.sm }}
          contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.xl2 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/artwork/${item.id}`)}
              activeOpacity={0.85}
              testID={`profile-upload-${item.id}`}
            >
              <Image source={{ uri: item.imageUrl }} style={{ width: TILE, height: TILE, borderRadius: RADII.md, backgroundColor: COLORS.surfaceElevated }} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  headerBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 160, backgroundColor: COLORS.surface },
  profileCard: {
    marginTop: SPACING.xl, marginHorizontal: SPACING.md,
    backgroundColor: COLORS.surfaceElevated, borderRadius: RADII.lg,
    padding: SPACING.lg, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  avatar: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: COLORS.primary, backgroundColor: COLORS.surface },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: COLORS.primary, fontFamily: FONTS.headingBold, fontSize: 36 },
  name: { color: COLORS.text, fontFamily: FONTS.headingBold, fontSize: 22, marginTop: SPACING.sm },
  email: { color: COLORS.textSecondary, fontFamily: FONTS.body, fontSize: 13, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginTop: SPACING.md, alignItems: 'center' },
  stat: { alignItems: 'center', paddingHorizontal: SPACING.lg },
  statValue: { color: COLORS.text, fontFamily: FONTS.headingBold, fontSize: 20 },
  statLabel: { color: COLORS.textTertiary, fontFamily: FONTS.body, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: COLORS.border },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADII.full, paddingVertical: 10, paddingHorizontal: SPACING.lg,
  },
  logoutText: { color: COLORS.text, fontFamily: FONTS.headingSemi, fontSize: 14 },
  sectionHeader: { paddingHorizontal: SPACING.md, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  sectionTitle: { color: COLORS.text, fontFamily: FONTS.headingBold, fontSize: 18 },
  emptyUploads: { alignItems: 'center', paddingHorizontal: SPACING.xl, marginTop: SPACING.lg },
  emptyText: { color: COLORS.textSecondary, fontFamily: FONTS.body, fontSize: 14, textAlign: 'center', marginBottom: SPACING.md },
  startBtn: { backgroundColor: COLORS.primarySubtle, borderRadius: RADII.full, paddingVertical: 10, paddingHorizontal: SPACING.lg },
  startBtnText: { color: COLORS.primary, fontFamily: FONTS.headingSemi, fontSize: 14 },
});
