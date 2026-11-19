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

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // Ignore local storage parse errors
    }
    setMounted(true);
  }, []);

  const toggleFavorite = React.useCallback(
    (id: string, title?: string) => {
      setFavorites((prev) => {
        const exists = prev.includes(id);
        const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        if (exists) {
          toast.info(title ? `${title} পছন্দের তালিকা থেকে সরানো হয়েছে` : "Removed from favorites");
        } else {
          toast.success(title ? `${title} পছন্দের তালিকায় যুক্ত হয়েছে` : "Added to favorites");
        }
        return next;
      });
    },
    []
  );

  const isFavorite = React.useCallback(
    (id: string) => {
      if (!mounted) return false;
      return favorites.includes(id);
    },
    [favorites, mounted]
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
