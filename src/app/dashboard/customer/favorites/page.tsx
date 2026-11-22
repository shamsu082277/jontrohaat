"use client";

import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/components/shared/favorites-context";
import { favoritesService } from "@/lib/api-services";
import { Equipment } from "@/types";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Trash2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CustomerFavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [favoriteEquipments, setFavoriteEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoritesService.getAll()
      .then((response) => setFavoriteEquipments(response.data || []))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Favorites could not be loaded"))
      .finally(() => setLoading(false));
  }, [favorites]);

  const removeFavorite = async (id: string, title: string) => {
    if (await toggleFavorite(id, title)) {
      setFavoriteEquipments((items) => items.filter((item) => item._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Saved Favorites</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          আপনার সংরক্ষিত প্রিয় কৃষি যন্ত্রপাতির তালিকা ({favoriteEquipments.length} টি)
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground">লোড হচ্ছে...</div>
      ) : favoriteEquipments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteEquipments.map((eq) => (
            <div
              key={eq._id}
              className="group rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
                  <Image
                    src={eq.images?.[0] || "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80"}
                    alt={eq.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge variant="forest" className="absolute top-3 left-3 text-[10px]">
                    {eq.category}
                  </Badge>
                  <button
                    onClick={() => removeFavorite(eq._id, eq.title)}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 text-rose-400 hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-brand-forest dark:group-hover:text-brand-fresh transition-colors">
                    {eq.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-brand-harvest" />
                    <span>{eq.location.district}, {eq.location.division}</span>
                  </div>
                  <div className="text-base font-black text-brand-forest dark:text-brand-fresh pt-1">
                    {formatBDT(eq.pricePerDay)} <span className="text-xs text-muted-foreground font-normal">/ day</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-border flex items-center justify-between gap-2 mt-2">
                <Button asChild size="sm" variant="brand" className="w-full text-xs font-semibold">
                  <Link href={`/equipment/${eq._id}`}>
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-card">
          <Heart className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">আপনার পছন্দের তালিকায় কোনো যন্ত্র নেই</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto font-bengali">
            মার্কেটপ্লেস ব্রাউজ করার সময় হার্ট (Heart) আইকনে ক্লিক করে সহজেই যেকোনো কৃষি যন্ত্রপাতি পছন্দের তালিকায় যুক্ত করুন।
          </p>
          <Button asChild variant="brand" size="sm">
            <Link href="/equipment">Browse Equipment Now</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
