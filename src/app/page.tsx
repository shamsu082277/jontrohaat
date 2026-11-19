"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EquipmentCard } from "@/components/shared/equipment-card";
import {
  CATEGORIES,
  SAMPLE_EQUIPMENTS,
  CUSTOMER_REVIEWS,
  BANGLADESH_DISTRICTS,
} from "@/lib/fixtures";
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Tractor,
  CheckCircle2,
  PhoneCall,
  Star,
  Quote,
  TrendingUp,
  Award,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (selectedDistrict !== "All Districts") params.set("district", selectedDistrict);
    router.push(`/equipment?${params.toString()}`);
  };

  const featuredEquipment = SAMPLE_EQUIPMENTS.filter((eq) => eq.isFeatured).slice(0, 6);
  const recentEquipment = [...SAMPLE_EQUIPMENTS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ========================================================
          A. HERO SECTION
         ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-forest/15 via-background to-background py-16 lg:py-24 border-b border-border">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#174C32_1px,transparent_1px)] [background-size:24px_24px] opacity-15 dark:opacity-25 pointer-events-none" />

        <div className="container-haat relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-leaf/30 bg-brand-cream/80 dark:bg-brand-forest/30 px-3.5 py-1 text-xs font-semibold text-brand-forest dark:text-brand-fresh backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5 text-brand-harvest" />
                <span>বাংলাদেশের ১ নম্বর ডিজিটাল কৃষি যন্ত্রপাতি মার্কেটপ্লেস</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.12]">
                  Better Farming Starts With{" "}
                  <span className="text-brand-forest dark:text-brand-fresh underline decoration-brand-harvest decoration-wavy decoration-2">
                    Better Access.
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-brand-leaf font-bengali pt-1">
                  যন্ত্র ভাড়া নিন, কাজ এগিয়ে নিন।
                </p>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                পাওয়ার টিলার, কম্বাইন হারভেস্টার, সেচ পাম্প থেকে আধুনিক স্প্রেয়ার—চাষ কিংবা ফসল তোলার সঠিক সময়ে সাশ্রয়ী ভাড়ায় সরাসরি আপনার এলাকায়।
              </p>

              {/* Quick Search Form */}
              <form
                onSubmit={handleHeroSearch}
                className="rounded-2xl border border-border bg-card p-3 shadow-lg max-w-2xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="যন্ত্রের নাম (e.g. হারভেস্টার, টিলার)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
                    />
                  </div>

                  <div className="sm:col-span-4 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-input bg-background pl-9 pr-7 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-leaf/40 text-foreground"
                    >
                      {BANGLADESH_DISTRICTS.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <Button
                      type="submit"
                      variant="brand"
                      className="h-11 w-full font-bold text-xs sm:text-sm"
                    >
                      খুঁজুন
                    </Button>
                  </div>
                </div>
              </form>

              {/* Trust Pills */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-leaf" />
                  <span>১,৫০০+ ভেরিফায়েড যন্ত্রপাতি</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-leaf" />
                  <span>৬৪ জেলায় সরবরাহ নেটওয়ার্ক</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-leaf" />
                  <span>স্বচ্ছ দৈনিক ভাড়ার হার</span>
                </div>
              </div>
            </motion.div>

            {/* Right Authentic Bangladeshi Farm Photograph */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto aspect-[4/3] sm:aspect-[16/11] lg:aspect-square w-full max-w-lg overflow-hidden rounded-3xl border-4 border-card shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
                  alt="Bangladeshi agricultural harvest with combine harvester and golden paddy field"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                {/* Floating Owner Badge */}
                <div className="absolute top-4 left-4 rounded-xl bg-card/90 p-3 shadow-md backdrop-blur-md border border-border/70 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-brand-forest flex items-center justify-center text-brand-harvest">
                    <Tractor className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">মালিকদের জন্য প্ল্যাটফর্ম</div>
                    <div className="text-[11px] text-brand-leaf font-medium font-bengali">অব্যবহৃত যন্ত্রে অতিরিক্ত আয়</div>
                  </div>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/60 p-3.5 backdrop-blur-md text-white text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>বোরো ও আমন মৌসুমে বিশেষ রেট</span>
                      <Badge variant="harvest" className="text-[10px] py-0 px-1.5">Active</Badge>
                    </div>
                    <div className="text-[11px] opacity-80 font-bengali mt-0.5">
                      সরাসরি কৃষকের জমিতে ডেলিভারি সুবিধা
                    </div>
                  </div>
                  <Button asChild size="sm" variant="harvest" className="text-xs font-bold h-8">
                    <Link href="/equipment">যন্ত্রপাতি দেখুন</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          B. POPULAR CATEGORIES
         ======================================================== */}
      <section id="categories" className="py-16 bg-muted/30 border-b border-border scroll-mt-20">
        <div className="container-haat space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
                Popular Categories
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                কৃষি যন্ত্রপাতির প্রধান ক্যাটাগরি
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                আপনার চাষ ও ফসলের ধরন অনুযায়ী প্রয়োজনীয় যন্ত্র বেছে নিন
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-1.5 font-semibold self-start sm:self-auto">
              <Link href="/equipment">
                <span>সকল ক্যাটাগরি দেখুন</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
              >
                <Link
                  href={`/equipment?category=${encodeURIComponent(cat.id)}`}
                  className="group flex flex-col h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-leaf/50 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 200px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                      {cat.count}+ টি যন্ত্র
                    </span>
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-brand-forest dark:group-hover:text-brand-fresh transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-bengali mt-0.5 font-medium">
                        {cat.banglaName}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-brand-leaf">
                      <span>খুঁজুন</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          C. FEATURED EQUIPMENT
         ======================================================== */}
      <section className="py-16 lg:py-20 bg-background border-b border-border">
        <div className="container-haat space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-forest dark:text-brand-fresh">
                <Award className="h-4 w-4 text-brand-harvest" />
                Featured Equipment
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                জনপ্রিয় ও পরীক্ষিত যন্ত্রপাতি
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                কৃষকদের সর্বোচ্চ রেটিংপ্রাপ্ত ও সরাসরি ভাড়ার জন্য প্রস্তুত যন্ত্রপাতি
              </p>
            </div>

            <Button asChild variant="brand" size="sm" className="gap-1.5 font-bold self-start sm:self-auto">
              <Link href="/equipment">
                <span>সম্পূর্ণ তালিকা দেখুন ({SAMPLE_EQUIPMENTS.length})</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEquipment.map((eq, idx) => (
              <motion.div
                key={eq._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <EquipmentCard equipment={eq} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          D. HOW IT WORKS
         ======================================================== */}
      <section id="how-it-works" className="py-16 lg:py-20 bg-brand-cream/30 dark:bg-brand-forest/10 border-b border-border scroll-mt-20">
        <div className="container-haat space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              কীভাবে যন্ত্রহাট কাজ করে?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-bengali">
              প্রয়োজনীয় কৃষি যন্ত্রপাতি ভাড়া নেওয়া এখন মোবাইল ফোনে মাত্র ৩টি সহজ ধাপ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col items-start space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-forest text-brand-cream font-black text-lg">
                ১
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Find Equipment</h3>
                <h4 className="text-sm font-semibold text-brand-leaf font-bengali">খুঁজুন ও পছন্দ করুন</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                আপনার জেলা, উপজেলা ও কাজের ধরন অনুযায়ী পাওয়ার টিলার, হারভেস্টার বা পাম্প ফিল্টার করে সঠিক যন্ত্রটি নির্বাচন করুন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col items-start space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-leaf text-brand-cream font-black text-lg">
                ২
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Book Equipment</h3>
                <h4 className="text-sm font-semibold text-brand-leaf font-bengali">তারিখ ও সময় বুক করুন</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                কাজের দিনক্ষণ এবং জমিতে পৌঁছানোর ঠিকানা দিয়ে বুকিং রিকোয়েস্ট পাঠান। মালিকের সাথে কথা বলে বিস্তারিত জেনে নিন।
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col items-start space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-harvest text-neutral-900 font-black text-lg">
                ৩
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Complete Farming Work</h3>
                <h4 className="text-sm font-semibold text-brand-forest dark:text-brand-fresh font-bengali">কাজ সম্পন্ন করুন</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                নির্ধারিত দিনে যন্ত্র সরাসরি আপনার জমিতে পৌঁছে যাবে। ফসল কাটা বা জমি চাষ নির্বিঘ্নে শেষ করে নিরাপদে হস্তান্তর করুন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          E. WHY CHOOSE JONTROHAAT
         ======================================================== */}
      <section className="py-16 lg:py-20 bg-background border-b border-border">
        <div className="container-haat space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-forest dark:text-brand-fresh">
              Platform Benefits
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              কেন কৃষকের প্রথম পছন্দ যন্ত্রহাট?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-bengali">
              বাংলাদেশের বাস্তব প্রেক্ষাপটে ক্ষুদ্র ও মাঝারি কৃষকদের সময় ও অর্থ সাশ্রয়ের পূর্ণ সমাধান
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 transition-colors hover:border-brand-leaf/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-forest/10 text-brand-forest dark:text-brand-fresh">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">যাচাইকৃত স্থানীয় মালিক</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                প্রতিটি যন্ত্রপাতির মালিকের জাতীয় পরিচয়পত্র ও ফোন নম্বর যাচাই করা থাকে, ফলে লেনদেন হয় শতভাগ নিরাপদ।
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 transition-colors hover:border-brand-leaf/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-leaf/10 text-brand-leaf">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">স্বচ্ছ ও সাশ্রয়ী ভাড়ার হার</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                দৈনিক বা ঘণ্টার ভিত্তিতে পূর্বনির্ধারিত রেট। কোনো লুকানো চার্জ বা মধ্যস্বত্বভোগীর অতিরিক্ত কমিশন নেই।
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 transition-colors hover:border-brand-leaf/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-harvest/15 text-neutral-900 dark:text-brand-harvest">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">মৌসুমে দ্রুত প্রাপ্তি</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                বৃষ্টি বা দুর্যোগের আগে দ্রুত ধান কাটা ও জমি প্রস্তুত করতে নিকটস্থ যন্ত্রের দ্রুত বুকিং নিশ্চিত করুন।
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 transition-colors hover:border-brand-leaf/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-forest/10 text-brand-forest dark:text-brand-fresh">
                <PhoneCall className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">১৬১২৩ কৃষক হেল্পডেস্ক</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                বুকিং সংক্রান্ত যে কোনো সমস্যায় সার্বক্ষণিক সহায়তা এবং মাঠ পর্যায়ে সংযোগ ব্যবস্থা।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          F. RECENTLY ADDED EQUIPMENT
         ======================================================== */}
      <section className="py-16 bg-muted/20 border-b border-border">
        <div className="container-haat space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
                Latest Additions
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                সম্প্রতি যুক্ত হওয়া যন্ত্রপাতি
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                নতুন তালিকাভুক্ত আধুনিক যন্ত্রপাতি দেখে নিন
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-1.5 font-semibold self-start sm:self-auto">
              <Link href="/equipment?sortBy=newest">
                <span>নতুন যন্ত্রপাতি দেখুন</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentEquipment.map((eq, idx) => (
              <motion.div
                key={eq._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.07 }}
              >
                <EquipmentCard equipment={eq} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          G. CUSTOMER REVIEWS (DEMO CONTENT)
         ======================================================== */}
      <section className="py-16 lg:py-20 bg-background border-b border-border">
        <div className="container-haat space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <span>Demo Community Content • নমুনা কৃষক মতামত</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              মাঠের কৃষকরা যা বলছেন
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-bengali">
              বিভিন্ন জেলা থেকে যন্ত্রহাট ব্যবহারকারী কৃষকদের অভিজ্ঞতার ডেমো সংকলন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CUSTOMER_REVIEWS.map((review, idx) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative rounded-2xl border border-border bg-card p-5 flex flex-col justify-between shadow-xs transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-brand-harvest mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="h-5 w-5 text-muted-foreground/30" />
                  </div>

                  <p className="text-xs text-foreground/90 font-bengali leading-relaxed italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/70 flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted border border-border">
                    <Image
                      src={review.renterAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80"}
                      alt={review.renterName}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-foreground">{review.renterName}</div>
                    <div className="text-[11px] text-muted-foreground font-medium">
                      {review.renterLocation}
                    </div>
                    {review.cropType && (
                      <div className="text-[10px] text-brand-leaf font-bengali font-semibold mt-0.5">
                        {review.cropType}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          H. BECOME AN EQUIPMENT OWNER CTA
         ======================================================== */}
      <section className="py-16 bg-gradient-to-r from-brand-forest to-[#113824] text-white">
        <div className="container-haat">
          <div className="rounded-3xl bg-black/20 p-8 sm:p-12 border border-white/10 backdrop-blur-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <Badge className="bg-brand-harvest text-neutral-900 border-0 font-bold text-xs py-1 px-3">
                  মেশিন মালিকদের জন্য বিশেষ সুযোগ
                </Badge>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  আপনার কি অব্যবহৃত পাওয়ার টিলার, ট্রাক্টর বা হারভেস্টার আছে?
                </h2>
                <p className="text-sm sm:text-base text-brand-cream/80 font-bengali leading-relaxed max-w-2xl">
                  মৌসুমের বাইরে কিংবা কাজের ফাঁকে যন্ত্রপাতি অলস ফেলে না রেখে যন্ত্রহাটে তালিকাভুক্ত করুন। পার্শ্ববর্তী কৃষকদের কাছে ভাড়া দিয়ে প্রতি মৌসুমে নিশ্চিত অতিরিক্ত আয় করুন।
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-brand-cream/90 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-fresh" />
                    <span>বিনামূল্যে তালিকাভুক্তি</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-fresh" />
                    <span>সরাসরি কৃষক বুকিং</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-fresh" />
                    <span>নিরাপদ জামানত ব্যবস্থা</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="harvest"
                  className="font-extrabold text-sm shadow-lg hover:scale-105 transition-transform"
                >
                  <Link href="/register?role=owner">
                    <span>যন্ত্রের মালিক হিসেবে যুক্ত হন</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-sm font-semibold"
                >
                  <Link href="/equipment">
                    <span>বর্তমানে তালিকাভুক্ত যন্ত্র দেখুন</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
