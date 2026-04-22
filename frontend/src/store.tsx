import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Artwork, SEED_ARTWORKS } from './seed';

type CartItem = { id: string; addedAt: number };

type ArtCtx = {
  artworks: Artwork[];
  cart: CartItem[];
  hydrated: boolean;
  addArtwork: (a: Omit<Artwork, 'id' | 'createdAt'>) => Promise<Artwork>;
  addToCart: (id: string) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getArtwork: (id: string) => Artwork | undefined;
  myUploads: (userId?: string) => Artwork[];
};

const ArtContext = createContext<ArtCtx>({} as ArtCtx);

const K_ART = 'arthub.artworks.v1';
const K_CART = 'arthub.cart.v1';
const K_SEEDED = 'arthub.seeded.v1';

export function ArtProvider({ children }: { children: React.ReactNode }) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const seeded = await AsyncStorage.getItem(K_SEEDED);
      if (!seeded) {
        await AsyncStorage.setItem(K_ART, JSON.stringify(SEED_ARTWORKS));
        await AsyncStorage.setItem(K_SEEDED, '1');
      }
      const [aRaw, cRaw] = await Promise.all([
        AsyncStorage.getItem(K_ART),
        AsyncStorage.getItem(K_CART),
      ]);
      setArtworks(aRaw ? JSON.parse(aRaw) : SEED_ARTWORKS);
      setCart(cRaw ? JSON.parse(cRaw) : []);
      setHydrated(true);
    })();
  }, []);

  const persistArt = async (list: Artwork[]) => {
    setArtworks(list);
    await AsyncStorage.setItem(K_ART, JSON.stringify(list));
  };
  const persistCart = async (list: CartItem[]) => {
    setCart(list);
    await AsyncStorage.setItem(K_CART, JSON.stringify(list));
  };

  const value = useMemo<ArtCtx>(() => ({
    artworks,
    cart,
    hydrated,
    addArtwork: async (a) => {
      const item: Artwork = {
        ...a,
        id: `art_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      };
      await persistArt([item, ...artworks]);
      return item;
    },
    addToCart: async (id) => {
      if (cart.find((c) => c.id === id)) return;
      await persistCart([{ id, addedAt: Date.now() }, ...cart]);
    },
    removeFromCart: async (id) => {
      await persistCart(cart.filter((c) => c.id !== id));
    },
    clearCart: async () => {
      await persistCart([]);
    },
    getArtwork: (id) => artworks.find((a) => a.id === id),
    myUploads: (userId) => artworks.filter((a) => a.uploadedBy && a.uploadedBy === userId),
  }), [artworks, cart, hydrated]);

  return <ArtContext.Provider value={value}>{children}</ArtContext.Provider>;
}

export const useArt = () => useContext(ArtContext);
