"use client";

import Link from "next/link";
import { Tractor, Home, Wrench, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-forest/10 ring-8 ring-brand-fresh/20">
          <Tractor className="h-14 w-14 text-brand-forest dark:text-brand-fresh" />
        </div>
        <span className="absolute -top-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-harvest font-black text-brand-forest text-sm shadow-lg">
          404
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
        পৃষ্ঠাটি পাওয়া যায়নি
      </h1>
      <p className="mt-2 text-lg font-semibold text-foreground">
        Page Not Found
      </p>

      {/* Description */}
      <p className="mt-4 max-w-md text-muted-foreground text-sm leading-relaxed font-bengali">
        আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে,
        বা কখনো ছিল না।
      </p>
      <p className="mt-1 max-w-md text-muted-foreground text-sm">
        The page you are looking for may have been moved, renamed, or never
        existed. Let&apos;s get you back on track.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Button asChild variant="brand" size="lg" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            হোমে ফিরুন (Go Home)
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href="/equipment">
            <Wrench className="h-4 w-4" />
            Browse Equipment
          </Link>
        </Button>
      </div>

      {/* Back link */}
      <button
        onClick={() => window.history.back()}
        className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-brand-forest dark:hover:text-brand-fresh transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Go back to previous page
      </button>
    </div>
  );
}
