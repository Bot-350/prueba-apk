import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, ShoppingBag } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADII, FONTS } from '../../src/theme';
import { useArt } from '../../src/store';

export default function CartScreen() {
  const { cart, artworks, removeFromCart, clearCart } = useArt();
  const router = useRouter();

  const items = cart
    .map((c) => artworks.find((a) => a.id === c.id))
    .filter(Boolean) as { id: string; title: string; author: string; price: number; imageUrl: string }[];

  const total = items.reduce((sum, it) => sum + it.price, 0);

  const checkout = async () => {
    if (!items.length) return;
    const count = items.length;
    const amount = total.toFixed(2);
    await clearCart();
    Alert.alert(
      'Order placed!',
      `You just collected ${count} piece${count === 1 ? '' : 's'} for $${amount}. (Fake checkout)`,
    );
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="cart-screen">
      <View style={styles.header}>
        <Text style={styles.h1}>Your cart</Text>
        <Text style={styles.count}>{items.length} item{items.length === 1 ? '' : 's'}</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty} testID="cart-empty">
          <View style={styles.emptyIcon}>
            <ShoppingBag color={COLORS.primary} size={32} strokeWidth={2} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Browse the gallery and add pieces you love.</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/(tabs)')} testID="cart-browse-btn">
            <Text style={styles.browseBtnText}>Browse artworks</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 180 }}
            ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
            renderItem={({ item }) => (
              <View style={styles.row} testID={`cart-item-${item.id}`}>
                <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.author} numberOfLines={1}>@{item.author}</Text>
                  <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  style={styles.trashBtn}
                  testID={`cart-remove-${item.id}`}
                >
                  <Trash2 color={COLORS.error} size={18} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue} testID="cart-total">${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.buyBtn} onPress={checkout} testID="cart-buy-now-btn" activeOpacity={0.9}>
              <Text style={styles.buyBtnText}>Buy now</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.sm, paddingBottom: SPACING.md },
  h1: { color: COLORS.text, fontFamily: FONTS.headingBold, fontSize: 28, letterSpacing: -0.5 },
  count: { color: COLORS.textSecondary, fontFamily: FONTS.body, fontSize: 13, marginTop: 2 },
  row: {
    flexDirection: 'row', gap: SPACING.sm, backgroundColor: COLORS.surface,
    borderRadius: RADII.lg, padding: SPACING.sm, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  thumb: { width: 72, height: 72, borderRadius: RADII.md, backgroundColor: COLORS.surfaceElevated },
  title: { color: COLORS.text, fontFamily: FONTS.headingSemi, fontSize: 15 },
  author: { color: COLORS.textSecondary, fontFamily: FONTS.body, fontSize: 12, marginTop: 2 },
  price: { color: COLORS.primary, fontFamily: FONTS.headingBold, fontSize: 15, marginTop: 6 },
  trashBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.xl,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: SPACING.sm },
  totalLabel: { color: COLORS.textSecondary, fontFamily: FONTS.bodyMed, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
  totalValue: { color: COLORS.text, fontFamily: FONTS.headingBold, fontSize: 24 },
  buyBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADII.full, paddingVertical: 16, alignItems: 'center',
    shadowColor: COLORS.primary, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6,
  },
  buyBtnText: { color: COLORS.onPrimary, fontFamily: FONTS.headingSemi, fontSize: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primarySubtle, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  emptyTitle: { color: COLORS.text, fontFamily: FONTS.headingBold, fontSize: 22, marginBottom: 4 },
  emptyText: { color: COLORS.textSecondary, fontFamily: FONTS.body, fontSize: 14, textAlign: 'center', marginBottom: SPACING.lg },
  browseBtn: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADII.full,
    paddingVertical: 12, paddingHorizontal: SPACING.lg,
  },
  browseBtnText: { color: COLORS.text, fontFamily: FONTS.headingSemi, fontSize: 14 },
});
