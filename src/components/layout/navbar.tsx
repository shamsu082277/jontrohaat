"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Tractor,
  Search,
  Menu,
  X,
  User,
  Heart,
  LayoutDashboard,
  Shield,
  Briefcase,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useFavorites } from "@/components/shared/favorites-context";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [quickSearch, setQuickSearch] = React.useState("");
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const { favorites } = useFavorites();
  const { data: session } = useSession();

  const currentUser = session?.user;
  const userRole = (currentUser as unknown as { role?: string })?.role || "customer";

  const getDashboardHref = (role: string) => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "owner") return "/dashboard/owner";
    return "/dashboard/customer/rentals";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      router.push(`/equipment?search=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch("");
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে লগআউট হয়েছেন");
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("লগআউটে সমস্যা হয়েছে");
    }
  };

  const navLinks = [
    { name: "Home", bangla: "হোম", href: "/" },
    { name: "All Equipment", bangla: "সকল যন্ত্রপাতি", href: "/equipment" },
    { name: "Categories", bangla: "ক্যাটাগরি", href: "/#categories" },
    { name: "How It Works", bangla: "কীভাবে কাজ করে", href: "/#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-colors">
      <div className="container-haat flex h-16 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-forest text-brand-cream shadow-xs transition-transform group-hover:scale-105">
            <Tractor className="h-5 w-5 text-brand-harvest" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-1.5 leading-none">
              JontroHaat
              <span className="text-xs font-semibold text-brand-leaf font-bengali">
                যন্ত্রহাট
              </span>
            </span>
            <span className="text-[10px] text-muted-foreground font-bengali leading-tight mt-0.5">
              যন্ত্র ভাড়া নিন, কাজ এগিয়ে নিন।
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-brand-forest dark:hover:text-brand-fresh ${
                  isActive
                    ? "text-brand-forest dark:text-brand-fresh font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search power tiller, pump..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="h-9 w-52 rounded-full border border-border bg-muted/50 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:w-64 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-leaf/30 transition-all"
            />
          </form>

          {/* Favorites shortcut */}
          <Link
            href="/equipment"
            title={`${favorites.length} saved equipment`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-rose-500 transition-colors"
          >
            <Heart className="h-4 w-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Authenticated User Menu vs Guest Login/Register */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 h-9 rounded-full border border-border pl-1.5 pr-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="h-6 w-6 rounded-full bg-brand-forest text-brand-cream overflow-hidden flex items-center justify-center text-[11px] font-bold">
                  {currentUser.image ? (
                    <Image
                      src={currentUser.image}
                      alt={currentUser.name || "User"}
                      width={24}
                      height={24}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    currentUser.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <span className="max-w-[100px] truncate">{currentUser.name || "User"}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-lg z-50">
                    <div className="px-3 py-2 border-b border-border/70 mb-1">
                      <div className="font-bold text-xs text-foreground truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {currentUser.email}
                      </div>
                      <span className="mt-1 inline-block rounded bg-brand-forest/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-brand-forest dark:text-brand-fresh">
                        {userRole}
                      </span>
                    </div>

                    <Link
                      href={getDashboardHref(userRole)}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      {userRole === "admin" ? (
                        <Shield className="h-4 w-4 text-brand-harvest" />
                      ) : userRole === "owner" ? (
                        <Briefcase className="h-4 w-4 text-brand-leaf" />
                      ) : (
                        <LayoutDashboard className="h-4 w-4 text-brand-forest dark:text-brand-fresh" />
                      )}
                      <div>
                        <div className="font-semibold">
                          {userRole === "admin"
                            ? "Admin Dashboard"
                            : userRole === "owner"
                            ? "Owner Dashboard"
                            : "Customer Dashboard"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {userRole === "admin"
                            ? "Manage approvals & platform"
                            : userRole === "owner"
                            ? "Manage listings & orders"
                            : "View bookings & favorites"}
                        </div>
                      </div>
                    </Link>

                    <Link
                      href={
                        userRole === "admin"
                          ? "/dashboard/admin/profile"
                          : userRole === "owner"
                          ? "/dashboard/owner/profile"
                          : "/dashboard/customer/profile"
                      }
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Profile & Settings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>লগআউট (Logout)</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-xs font-medium">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="brand" size="sm" className="text-xs font-semibold">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card px-4 py-5 lg:hidden animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search equipment in your district..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-leaf/30"
              />
            </div>
          </form>

          {/* Links */}
          <div className="flex flex-col space-y-3 pb-4 border-b border-border text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-1.5 text-foreground hover:text-brand-forest dark:hover:text-brand-fresh"
              >
                <span>{link.name}</span>
                <span className="text-xs text-muted-foreground font-bengali">
                  {link.bangla}
                </span>
              </Link>
            ))}
          </div>

          {/* Authenticated Dashboard Links or Guest Auth */}
          {currentUser ? (
            <div className="py-4 border-b border-border space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-forest text-brand-cream overflow-hidden flex items-center justify-center text-xs font-bold shrink-0">
                  {currentUser.image ? (
                    <Image
                      src={currentUser.image}
                      alt={currentUser.name || "User"}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    currentUser.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-xs text-foreground truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {currentUser.email} ({userRole})
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <Link
                  href={getDashboardHref(userRole)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-xs font-semibold text-foreground"
                >
                  <LayoutDashboard className="h-4 w-4 text-brand-leaf" />
                  <span>
                    Go to {userRole === "admin" ? "Admin" : userRole === "owner" ? "Owner" : "Customer"} Dashboard
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 py-2 text-xs font-medium text-destructive text-left cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>লগআউট (Logout)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button asChild variant="brand" size="sm" className="flex-1">
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
