"use client";

import * as React from "react";
import { toast } from "sonner";

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string, title?: string) => void;
}

const FavoritesContext = React.createContext<FavoritesContextType | undefined>(
  undefined
);

const STORAGE_KEY = "jontrohaat_favorites";

let listeners: Array<() => void> = [];
let cachedFavorites: string[] = [];
let cachedRaw: string | null = null;

function getSnapshot(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedFavorites = raw ? JSON.parse(raw) : [];
    }
    return cachedFavorites;
  } catch {
    return [];
  }
}

const getServerSnapshot = () => [];

function subscribe(onStoreChange: () => void) {
  listeners.push(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners = listeners.filter((l) => l !== onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const favorites = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleFavorite = React.useCallback((id: string, title?: string) => {
    const current = getSnapshot();
    const exists = current.includes(id);
    const next = exists ? current.filter((item) => item !== id) : [...current, id];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    notify();
    if (exists) {
      toast.info(title ? `${title} পছন্দের তালিকা থেকে সরানো হয়েছে` : "Removed from favorites");
    } else {
      toast.success(title ? `${title} পছন্দের তালিকায় যুক্ত হয়েছে` : "Added to favorites");
    }
  }, []);

  const isFavorite = React.useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = React.useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
