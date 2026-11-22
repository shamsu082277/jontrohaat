"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tractor,
  LayoutDashboard,
  Calendar,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Briefcase,
  Shield,
  Users,
  Wrench,
  TrendingUp,
  FileText,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardLayoutProps {
  role: "customer" | "owner" | "admin";
  children: React.ReactNode;
}

export function DashboardShell({ role, children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = session?.user;
  const userRole = (currentUser as unknown as { role?: string })?.role || role;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে লগআউট হয়েছেন");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("লগআউটে সমস্যা হয়েছে");
    }
  };

  // Role Navigation Config
  const customerNav = [
    { name: "My Rentals (আমার বুকিং)", href: "/dashboard/customer/rentals", icon: Calendar },
    { name: "Saved Favorites (পছন্দের তালিকা)", href: "/dashboard/customer/favorites", icon: Heart },
    { name: "Profile & Settings (প্রোফাইল)", href: "/dashboard/customer/profile", icon: User },
  ];

  const ownerNav = [
    { name: "Dashboard Overview", href: "/dashboard/owner", icon: LayoutDashboard },
    { name: "My Machinery (যন্ত্রপাতি)", href: "/dashboard/owner/equipment", icon: Wrench },
    { name: "Add New Equipment", href: "/dashboard/owner/equipment/new", icon: PlusCircle },
    { name: "Rental Requests & Bookings", href: "/dashboard/owner/rentals", icon: Calendar },
    { name: "Owner Profile", href: "/dashboard/owner/profile", icon: User },
  ];

  const adminNav = [
    { name: "Admin Overview", href: "/dashboard/admin", icon: TrendingUp },
    { name: "User Management (ব্যবহারকারী)", href: "/dashboard/admin/users", icon: Users },
    { name: "Equipment Approvals", href: "/dashboard/admin/equipment", icon: Wrench },
    { name: "All Rental Orders", href: "/dashboard/admin/rentals", icon: FileText },
    { name: "Admin Profile", href: "/dashboard/admin/profile", icon: Shield },
  ];

  const currentNav = role === "admin" ? adminNav : role === "owner" ? ownerNav : customerNav;

  const roleTitle =
    role === "admin"
      ? "Admin Control Portal"
      : role === "owner"
      ? "Owner Partner Hub"
      : "Farmer Customer Dashboard";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex-col justify-between border-r border-border bg-card p-5 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 flex" : "-translate-x-full hidden lg:flex"
        }`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-brand-forest text-brand-harvest flex items-center justify-center shadow-xs">
                <Tractor className="h-5 w-5" />
              </div>
              <div>
                <span className="text-base font-black text-foreground">JontroHaat</span>
                <span className="block text-[10px] text-muted-foreground font-bengali font-semibold">
                  {roleTitle}
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* User Badge */}
          <div className="rounded-xl bg-muted/60 p-3 flex items-center gap-3 border border-border/60">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-muted shrink-0">
              <SafeImage
                src={currentUser?.image}
                fallbackSrc="/images/avatar-placeholder.svg"
                alt={`${currentUser?.name || "User"} profile avatar`}
                width={40}
                height={40}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-foreground truncate">
                {currentUser?.name || "Demo User"}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {currentUser?.email || "user@jontrohaat.com"}
              </div>
              <Badge
                variant={role === "admin" ? "harvest" : role === "owner" ? "forest" : "leaf"}
                className="mt-1 text-[9px] py-0 uppercase font-black"
              >
                {role}
              </Badge>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {currentNav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
                    active
                      ? "bg-brand-forest text-brand-cream shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                  {active && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-border">
          {/* Marketplace Return */}
          <Button asChild variant="outline" size="sm" className="w-full text-xs justify-start gap-2">
            <Link href="/equipment">
              <Wrench className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Browse Equipment</span>
            </Link>
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full text-xs justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>লগআউট (Logout)</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-16 z-30 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-bold text-foreground capitalize truncate">
              {role} Workspace
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Session</span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
