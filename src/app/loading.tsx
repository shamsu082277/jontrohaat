import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Brand spinner */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-brand-fresh/30" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-forest animate-spin" />
          <div className="absolute inset-2 rounded-full bg-brand-forest/10 flex items-center justify-center">
            <span className="text-xs font-black text-brand-forest dark:text-brand-fresh">
              JH
            </span>
          </div>
        </div>
        <div className="space-y-2 text-center">
          <Skeleton className="h-3 w-32 mx-auto" />
          <p className="text-xs text-muted-foreground font-bengali">
            লোড হচ্ছে…
          </p>
        </div>
      </div>
    </div>
  );
}
