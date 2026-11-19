import Link from "next/link";
import { Tractor, Phone, Mail, MapPin, Heart, ShieldCheck, Clock } from "lucide-react";
import { CATEGORIES } from "@/lib/fixtures";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      {/* Top Value Banner */}
      <div className="border-b border-border/70 bg-brand-cream/40 dark:bg-brand-forest/15 py-6">
        <div className="container-haat grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-forest text-brand-cream">
              <ShieldCheck className="h-5 w-5 text-brand-harvest" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Verified Equipment Owners</h4>
              <p className="text-xs text-muted-foreground font-bengali">নিবন্ধিত ও বিশ্বস্ত মালিকের যন্ত্রপাতি</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-leaf text-brand-cream">
              <Clock className="h-5 w-5 text-brand-cream" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Timely Field Delivery</h4>
              <p className="text-xs text-muted-foreground font-bengali">মৌসুমের সঠিক সময়ে সরাসরি জমিতে</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-harvest text-neutral-900">
              <Phone className="h-5 w-5 text-neutral-900" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Agri-Helpline Support</h4>
              <p className="text-xs text-muted-foreground font-bengali">১৬১২৩ – সার্বক্ষণিক কৃষক সহায়তা</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container-haat py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-forest text-brand-cream">
                <Tractor className="h-5 w-5 text-brand-harvest" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-1.5 leading-none">
                  JontroHaat
                  <span className="text-xs font-semibold text-brand-leaf font-bengali">
                    যন্ত্রহাট
                  </span>
                </span>
                <span className="text-[11px] text-muted-foreground font-bengali mt-0.5">
                  যন্ত্র ভাড়া নিন, কাজ এগিয়ে নিন।
                </span>
              </div>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              বাংলাদেশের আধুনিক কৃষি ও ক্ষুদ্র-মাঝারি কৃষকদের ক্ষমতায়নে নিবেদিত অনলাইন কৃষি যন্ত্রপাতি ভাড়ার প্ল্যাটফর্ম। পাওয়ার টিলার, হারভেস্টার থেকে সেচ পাম্প—সবই সহজে ভাড়ায় মিলবে আপনার এলাকায়।
            </p>

            <div className="space-y-2 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-brand-leaf shrink-0" />
                <span>Agricultural Hub Office, Kawran Bazar, Dhaka-1215</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-brand-leaf shrink-0" />
                <span>+880 1712-345678 (Helpdesk: 16123)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-brand-leaf shrink-0" />
                <span>support@jontrohaat.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground">Explore Platform</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/equipment" className="hover:text-brand-forest dark:hover:text-brand-fresh transition-colors">
                  All Equipment (সকল যন্ত্রপাতি)
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-brand-forest dark:hover:text-brand-fresh transition-colors">
                  Popular Categories (ক্যাটাগরি)
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-brand-forest dark:hover:text-brand-fresh transition-colors">
                  How It Works (নিয়মাবলী)
                </Link>
              </li>
              <li>
                <Link href="/register?role=owner" className="hover:text-brand-forest dark:hover:text-brand-fresh transition-colors">
                  List Your Machine (যন্ত্র তালিকাভুক্ত করুন)
                </Link>
              </li>
              <li>
                <Link href="/equipment" className="hover:text-brand-forest dark:hover:text-brand-fresh transition-colors">
                  Favorites (পছন্দের তালিকা)
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground">Machinery Categories</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/equipment?category=${encodeURIComponent(cat.id)}`}
                    className="hover:text-brand-forest dark:hover:text-brand-fresh transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="font-bengali text-[11px] opacity-75">{cat.banglaName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coverage Regions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground">Major Coverage Hubs</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {["Bogura", "Dinajpur", "Cumilla", "Mymensingh", "Jessore", "Rangpur", "Naogaon", "Tangail", "Rajshahi", "Pabna"].map((district) => (
                <Link
                  key={district}
                  href={`/equipment?district=${district}`}
                  className="rounded-md border border-border bg-muted/40 px-2 py-1 text-muted-foreground hover:bg-brand-leaf/10 hover:text-brand-forest dark:hover:text-brand-fresh transition-colors"
                >
                  {district}
                </Link>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 font-bengali">
              বাংলাদেশের সকল ৬৪ জেলায় যন্ত্রপাতি সরবরাহ ও মালিকদের নেটওয়ার্ক বিস্তৃত হচ্ছে।
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            © 2026 JontroHaat (যন্ত্রহাট). Built with{" "}
            <Heart className="h-3 w-3 text-rose-500 fill-current inline" /> for Bangladeshi Agriculture.
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Educational Assignment Project</span>
            <span>•</span>
            <Link href="/" className="hover:underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
