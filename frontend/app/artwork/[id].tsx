import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADII, FONTS } from '../../src/theme';
import { useArt } from '../../src/store';

const { width } = Dimensions.get('window');

export default function ArtworkDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getArtwork, addToCart, cart } = useArt();
  const art = getArtwork(String(id));
  const [added, setAdded] = useState(() => !!cart.find((c) => c.id === String(id)));

  if (!art) {
    return (
      <SafeAreaView style={styles.root}>
        <Text style={styles.missing}>Artwork not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backInline}>
          <Text style={styles.backInlineText}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const imgHeight = Math.min(width / art.aspectRatio, 520);

  const onAdd = async () => {
    await addToCart(art.id);
    setAdded(true);
    Alert.alert('Added to cart', `${art.title} was added to your cart.`);
  };

  return (
    <View style={styles.root} testID="artwork-detail-screen">
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View>
          <Image source={{ uri: art.imageUrl }} style={[styles.hero, { height: imgHeight }]} />
          <LinearGradient
            colors={['rgba(10,10,10,0.5)', 'transparent']}
            style={styles.heroGradient}
          />
          <SafeAreaView edges={['top']} style={styles.heroBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconBtn}
              testID="artwork-back-btn"
              activeOpacity={0.85}
            >
              <ArrowLeft color={COLORS.text} size={20} strokeWidth={2} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <Text style={styles.title} testID="artwork-title">{art.title}</Text>
          <View style={styles.authorRow}>
            <View style={styles.avatar}>
              {art.authorAvatar ? (
                <Image source={{ uri: art.authorAvatar }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarInitial}>{(art.author[0] || 'A').toUpperCase()}</Text>
              )}
            </View>
            <View>
              <Text style={styles.authorName} testID="artwork-author">@{art.author}</Text>
              <Text style={styles.authorLabel}>Artist</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>About this piece</Text>
          <Text style={styles.desc} testID="artwork-desc">{art.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue} testID="artwork-price">${art.price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, added && styles.addBtnAdded]}
          onPress={onAdd}
          disabled={added}
          activeOpacity={0.9}
          testID="artwork-add-to-cart"
        >
          {added ? (
            <>
              <Check color={COLORS.onPrimary} size={18} strokeWidth={2.5} />
              <Text style={styles.addBtnText}>In cart</Text>
            </>
          ) : (
            <>
              <ShoppingBag color={COLORS.onPrimary} size={18} strokeWidth={2.5} />
              <Text style={styles.addBtnText}>Add to cart</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  missing: { color: COLORS.text, fontFamily: FONTS.body, textAlign: 'center', marginTop: SPACING.xl2 },
  backInline: { alignSelf: 'center', marginTop: SPACING.md, paddingVertical: 10, paddingHorizontal: 20, borderRadius: RADII.full, borderWidth: 1, borderColor: COLORS.border },
  backInlineText: { color: COLORS.text, fontFamily: FONTS.headingSemi },
  hero: { width: '100%', backgroundColor: COLORS.surfaceElevated },
  heroGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 120 },
  heroBar: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: SPACING.md },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center', marginTop: SPACING.xs,
  },
  body: { padding: SPACING.md },
  title: { color: COLORS.text, fontFamily: FONTS.headingBold, fontSize: 28, letterSpacing: -0.5 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.md, marginBottom: SPACING.lg },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.primary, overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarInitial: { color: COLORS.primary, fontFamily: FONTS.headingBold, fontSize: 18 },
  authorName: { color: COLORS.text, fontFamily: FONTS.headingSemi, fontSize: 15 },
  authorLabel: { color: COLORS.textTertiary, fontFamily: FONTS.body, fontSize: 12 },
  sectionLabel: { color: COLORS.textSecondary, fontFamily: FONTS.bodyMed, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: SPACING.xs },
  desc: { color: COLORS.text, fontFamily: FONTS.body, fontSize: 15, lineHeight: 24 },
  bottomBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.xl,
  },
  priceLabel: { color: COLORS.textTertiary, fontFamily: FONTS.bodyMed, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  priceValue: { color: COLORS.text, fontFamily: FONTS.headingBold, fontSize: 24 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: RADII.full,
    paddingHorizontal: 24, paddingVertical: 14,
    shadowColor: COLORS.primary, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6,
  },
  addBtnAdded: { backgroundColor: COLORS.primaryPressed },
  addBtnText: { color: COLORS.onPrimary, fontFamily: FONTS.headingSemi, fontSize: 16 },
});
