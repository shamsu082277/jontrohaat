"use client";

import Link from "next/link";
import Image from "next/image";
import { Equipment } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/utils";
import { useFavorites } from "@/components/shared/favorites-context";
import { MapPin, Heart, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";

interface EquipmentCardProps {
  equipment: Equipment;
  priority?: boolean;
}

export function EquipmentCard({ equipment, priority = false }: EquipmentCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(equipment._id);
  const [imgSrc, setImgSrc] = useState(
    equipment.images?.[0] ||
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80"
  );

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-leaf/40 hover:shadow-lg">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={imgSrc}
          alt={equipment.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() =>
            setImgSrc(
              "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80"
            )
          }
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant="forest" className="backdrop-blur-xs text-[11px] font-medium">
            {equipment.category}
          </Badge>
          {equipment.isAvailable !== false ? (
            <Badge variant="available" className="bg-emerald-500/90 text-white border-0 text-[11px]">
              Available Now
            </Badge>
          ) : (
            <Badge variant="unavailable" className="bg-amber-600/90 text-white border-0 text-[11px]">
              Booked
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(equipment._id, equipment.title);
          }}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          className={`absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer ${
            favorited
              ? "bg-rose-500 text-white shadow-md scale-110"
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
        >
          <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
        </button>

        {/* Location & Rating pill at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
          <div className="flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 text-brand-harvest" />
            <span className="font-medium">
              {equipment.location.district}, {equipment.location.division}
            </span>
          </div>

          {equipment.averageRating && (
            <div className="flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm font-semibold text-brand-harvest">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{equipment.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <Link href={`/equipment/${equipment._id}`} className="focus:outline-none">
            <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-brand-forest dark:group-hover:text-brand-fresh">
              {equipment.title}
            </h3>
            {equipment.banglaTitle && (
              <p className="line-clamp-1 text-xs text-muted-foreground font-bengali mt-0.5">
                {equipment.banglaTitle}
              </p>
            )}
          </Link>

          <p className="line-clamp-2 mt-2 text-xs text-muted-foreground leading-relaxed">
            {equipment.description}
          </p>

          {/* Quick Info Badges */}
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            {equipment.condition && (
              <span className="flex items-center gap-1 rounded bg-muted px-2 py-0.5">
                <ShieldCheck className="h-3 w-3 text-brand-leaf" />
                {equipment.condition.split("–")[0].trim()}
              </span>
            )}
            {equipment.brand && (
              <span className="rounded bg-muted px-2 py-0.5 font-medium">
                {equipment.brand}
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div>
            <span className="text-xs text-muted-foreground block">Rental Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-brand-forest dark:text-brand-fresh">
                {formatBDT(equipment.pricePerDay)}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                /{equipment.rentalType === "per_hour" ? "hour" : "day"}
              </span>
            </div>
          </div>

          <Button asChild size="sm" variant="brand" className="group/btn gap-1.5 font-semibold text-xs">
            <Link href={`/equipment/${equipment._id}`}>
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
