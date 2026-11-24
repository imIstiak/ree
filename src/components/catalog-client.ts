"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import type { Product } from "../data/products";

// The catalogue in the browser, loaded once per visit from /api/catalog and shared by every
// component that asks (the header's bag, /cart, /checkout). `ready` is false until it arrives, so
// those views wait instead of saying a piece is missing. Nothing is fetched until a component
// passes `enabled` (the header only asks once something is in the bag or saved).
type State = { ready: boolean; products: Product[] };

const SERVER: State = { ready: false, products: [] };
let state: State = SERVER;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function load() {
  loading ??= fetch("/api/catalog")
    .then((response) => (response.ok ? (response.json() as Promise<Product[]>) : Promise.reject(new Error(String(response.status)))))
    .then((products) => {
      state = { ready: true, products };
    })
    .catch(() => {
      // Try again on the next subscriber; meanwhile show an empty, settled catalogue.
      state = { ready: true, products: [] };
      loading = null;
    })
    .finally(() => listeners.forEach((listener) => listener()));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useCatalog(enabled = true) {
  const current = useSyncExternalStore(subscribe, () => state, () => SERVER);
  useEffect(() => {
    if (enabled) load();
  }, [enabled]);
  // A piece renamed in the backroom is still found under its old slugs (bags saved before the
  // rename); old slugs go in first, so a current slug always wins over another piece's old one.
  const bySlug = useMemo(
    () => new Map([...current.products.flatMap((product) => (product.previousSlugs ?? []).map((slug) => [slug, product] as const)), ...current.products.map((product) => [product.slug, product] as const)]),
    [current.products],
  );
  return { ready: current.ready, products: current.products, find: (slug: string) => bySlug.get(slug) };
}
