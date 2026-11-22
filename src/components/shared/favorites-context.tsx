"use client";

import * as React from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { favoritesService, profileService } from "@/lib/api-services";

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string, title?: string) => Promise<boolean>;
}

const FavoritesContext = React.createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [isCustomer, setIsCustomer] = React.useState(false);
  const session = useSession();
  const userId = session.data?.user?.id;

  React.useEffect(() => {
    let active = true;
    if (userId) {
      profileService.getMe()
        .then(async (profile) => {
          if (!active) return;
          const customer = profile.data?.role === "customer";
          setIsCustomer(customer);
          if (!customer) {
            setFavorites([]);
            return;
          }
          const response = await favoritesService.getAll();
          if (active) setFavorites((response.data || []).map((equipment) => equipment._id));
        })
        .catch((error) => {
          if (active) toast.error(error instanceof Error ? error.message : "Favorites could not be loaded");
        });
    }
    return () => { active = false; };
  }, [userId]);

  const toggleFavorite = React.useCallback(async (id: string, title?: string) => {
    if (!userId || !isCustomer) {
      toast.error("Sign in as a customer to save favorites");
      return false;
    }
    const exists = favorites.includes(id);
    try {
      if (exists) {
        await favoritesService.remove(id);
        setFavorites((current) => current.filter((item) => item !== id));
        toast.info(title ? `${title} পছন্দের তালিকা থেকে সরানো হয়েছে` : "Removed from favorites");
      } else {
        await favoritesService.add(id);
        setFavorites((current) => current.includes(id) ? current : [...current, id]);
        toast.success(title ? `${title} পছন্দের তালিকায় যুক্ত হয়েছে` : "Added to favorites");
      }
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Favorite could not be updated");
      return false;
    }
  }, [favorites, isCustomer, userId]);

  const visibleFavorites = React.useMemo(() => userId ? favorites : [], [favorites, userId]);
  const isFavorite = React.useCallback((id: string) => visibleFavorites.includes(id), [visibleFavorites]);

  return (
    <FavoritesContext.Provider value={{ favorites: visibleFavorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = React.useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
}
