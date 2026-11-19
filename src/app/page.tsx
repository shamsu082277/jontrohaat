import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Wrench, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-forest flex items-center justify-center text-brand-cream shadow-xs">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                JontroHaat <span className="font-bengali text-brand-forest dark:text-brand-fresh">(যন্ত্রহাট)</span>
              </h1>
              <p className="text-xs text-muted-foreground font-bengali">
                যন্ত্র ভাড়া নিন, কাজ এগিয়ে নিন।
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-brand-cream/60 dark:bg-brand-forest/20 p-4 border border-brand-leaf/20">
            <div className="flex items-center gap-2 text-brand-forest dark:text-brand-fresh text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              <span>Frontend Foundation Ready</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-bengali">
              বাংলাদেশি কৃষি যন্ত্রপাতির অনলাইন মার্কেটপ্লেস-এর ডিজাইন সিস্টেম ও আর্কিটেকচার সফলভাবে প্রস্তুত হয়েছে।
            </p>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-leaf" />
              <span>Next.js App Router + TypeScript + Tailwind CSS v4</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-leaf" />
              <span>Brand Palettes (Forest, Leaf, Fresh, Harvest, Warm Cream)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-leaf" />
              <span>Bilingual Typography: Manrope & Hind Siliguri</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-leaf" />
              <span>Light & Dark Theme Engine (next-themes)</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-2.5">
            <Button variant="brand" size="sm">
              Brand Button
            </Button>
            <Button variant="harvest" size="sm">
              Harvest Button
            </Button>
            <Button variant="outline" size="sm">
              Outline Button
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
