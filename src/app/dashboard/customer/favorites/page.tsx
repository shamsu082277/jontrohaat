"use client";

import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    favoritesService.getAll()
      .then((response) => {
        if (active) {
          setError(null);
          setFavoriteEquipments(response.data || []);
        }
      })
      .catch((loadError) => {
        if (!active) return;
        const message = loadError instanceof Error ? loadError.message : "Favorites could not be loaded";
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
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
      ) : error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">
          {error}
        </div>
      ) : favoriteEquipments.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="border-b border-border bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Equipment</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Rental Price</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {favoriteEquipments.map((eq) => (
                <tr key={eq._id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <SafeImage src={eq.images?.[0]} alt={eq.title} fill sizes="64px" className="object-cover" />
                      </div>
                      <span className="font-bold text-foreground">{eq.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="forest">{eq.category}</Badge></td>
                  <td className="px-4 py-3 font-bold text-brand-forest dark:text-brand-fresh">
                    {formatBDT(eq.pricePerDay)} <span className="font-normal text-muted-foreground">/ {eq.rentalType === "per_hour" ? "hour" : eq.rentalType === "per_acre" ? "acre" : "day"}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-brand-harvest" />{eq.location.district}, {eq.location.division}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="brand">
                        <Link href={`/equipment/${eq._id}`}>View Details <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removeFavorite(eq._id, eq.title)} aria-label={`Remove ${eq.title} from favorites`}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
