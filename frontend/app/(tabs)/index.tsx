import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Sparkles } from 'lucide-react-native';
import { COLORS, SPACING, RADII, FONTS } from '../../src/theme';
import { useArt } from '../../src/store';
import { Artwork } from '../../src/seed';

const { width } = Dimensions.get('window');
const COL_GAP = SPACING.sm;
const H_PAD = SPACING.md;
const COL_WIDTH = (width - H_PAD * 2 - COL_GAP) / 2;

function ArtCard({ item, onPress }: { item: Artwork; onPress: () => void }) {
  const h = Math.max(160, Math.min(320, COL_WIDTH / item.aspectRatio));
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.card, { width: COL_WIDTH }]}
      testID={`art-card-${item.id}`}
    >
      <Image source={{ uri: item.imageUrl }} style={[styles.img, { height: h }]} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.cardRow}>
          <Text style={styles.cardAuthor} numberOfLines={1}>@{item.author}</Text>
          <View style={styles.priceChip}>
            <Text style={styles.priceChipText}>${item.price.toFixed(0)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { artworks, hydrated } = useArt();
  const router = useRouter();

  const left = artworks.filter((_, i) => i % 2 === 0);
  const right = artworks.filter((_, i) => i % 2 === 1);

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="home-screen">
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoMini}>
            <Text style={styles.logoMiniText}>PA</Text>
          </View>
          <Text style={styles.brand}>papilinesart</Text>
        </View>
        <TouchableOpacity style={styles.searchBtn} testID="home-search-btn" activeOpacity={0.8}>
          <Search color={COLORS.text} size={20} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.pill}>
        <Sparkles color={COLORS.primary} size={14} strokeWidth={2.5} />
        <Text style={styles.pillText}>Trending today</Text>
      </View>

      {hydrated && (
        <FlatList
          data={[0]}
          keyExtractor={() => 'masonry'}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={() => (
            <View style={styles.masonry}>
              <View style={{ width: COL_WIDTH, gap: COL_GAP }}>
                {left.map((it) => (
                  <ArtCard key={it.id} item={it} onPress={() => router.push(`/artwork/${it.id}`)} />
                ))}
              </View>
              <View style={{ width: COL_WIDTH, gap: COL_GAP }}>
                {right.map((it) => (
                  <ArtCard key={it.id} item={it} onPress={() => router.push(`/artwork/${it.id}`)} />
                ))}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: H_PAD, paddingVertical: SPACING.sm,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMini: { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  logoMiniText: { color: COLORS.onPrimary, fontFamily: FONTS.headingBold, fontSize: 13 },
  brand: { color: COLORS.text, fontFamily: FONTS.headingBold, fontSize: 22 },
  searchBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  pill: {
    alignSelf: 'flex-start', marginHorizontal: H_PAD, marginBottom: SPACING.sm,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primarySubtle, paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADII.full,
  },
  pillText: { color: COLORS.primary, fontFamily: FONTS.headingSemi, fontSize: 12 },
  listContent: { paddingHorizontal: H_PAD, paddingBottom: SPACING.xl2 },
  masonry: { flexDirection: 'row', gap: COL_GAP },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADII.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
  },
  img: { width: '100%', resizeMode: 'cover', backgroundColor: COLORS.surfaceElevated },
  cardBody: { padding: SPACING.sm },
  cardTitle: { color: COLORS.text, fontFamily: FONTS.headingSemi, fontSize: 14, marginBottom: 4 },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardAuthor: { color: COLORS.textSecondary, fontFamily: FONTS.body, fontSize: 12, flex: 1 },
  priceChip: { backgroundColor: COLORS.primarySubtle, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADII.full },
  priceChipText: { color: COLORS.primary, fontFamily: FONTS.headingBold, fontSize: 12 },
});
