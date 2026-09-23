"use client";

import { useCallback, useSyncExternalStore } from "react";

// The bag and wishlist, kept in localStorage: there is no backend, so this is what "add to cart"
// does. Both product pages and the shop header read it through `useShop`.
export type CartLine = { slug: string; size: string; qty: number };
type ShopState = { cart: CartLine[]; wishlist: string[] };

const KEY = "ree-shop";
const EMPTY: ShopState = { cart: [], wishlist: [] };
let cache: { raw: string | null; state: ShopState } = { raw: null, state: EMPTY };
const listeners = new Set<() => void>();

function read(): ShopState {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw === cache.raw) return cache.state;
  let state = EMPTY;
  try {
    state = raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<ShopState>) } : EMPTY;
  } catch {
    state = EMPTY;
  }
  cache = { raw, state };
  return state;
}

function write(state: ShopState) {
  const raw = JSON.stringify(state);
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    // Storage can be unavailable; the bag still works for this visit.
  }
  cache = { raw, state };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const serverSnapshot = () => EMPTY;

export function useShop() {
  const state = useSyncExternalStore(subscribe, read, serverSnapshot);

  const addToCart = useCallback((slug: string, size: string) => {
    const current = read();
    const line = current.cart.find((l) => l.slug === slug && l.size === size);
    write({
      ...current,
      cart: line ? current.cart.map((l) => (l === line ? { ...l, qty: l.qty + 1 } : l)) : [...current.cart, { slug, size, qty: 1 }],
    });
  }, []);

  const removeLine = useCallback((slug: string, size: string) => {
    const current = read();
    write({ ...current, cart: current.cart.filter((l) => !(l.slug === slug && l.size === size)) });
  }, []);

  const toggleWishlist = useCallback((slug: string) => {
    const current = read();
    write({ ...current, wishlist: current.wishlist.includes(slug) ? current.wishlist.filter((s) => s !== slug) : [...current.wishlist, slug] });
  }, []);

  return { cart: state.cart, wishlist: state.wishlist, addToCart, removeLine, toggleWishlist };
}
