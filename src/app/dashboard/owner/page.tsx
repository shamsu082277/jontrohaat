"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Equipment, Booking } from "@/types";
import { bookingService, ownerService } from "@/lib/api-services";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Wrench,
  CheckCircle2,
  Clock,
  DollarSign,
  PlusCircle,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function OwnerOverviewPage() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalEquipment: number; approvedEquipment: number; pendingEquipment: number;
    totalRentals: number; completedRentals: number; totalEarnings: number;
    monthlyEarnings: { _id: string; earnings: number }[];
  }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ownerService.getEquipment(), bookingService.getOwnerRentals(), ownerService.getAnalytics()])
      .then(([equipmentResponse, bookingResponse, analyticsResponse]) => {
        setEquipmentList(equipmentResponse.data || []);
        setBookings(bookingResponse.data || []);
        setAnalytics(analyticsResponse.data);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Dashboard data could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  const monthlyEarnings = analytics?.monthlyEarnings.map((item) => ({ month: item._id, earnings: item.earnings })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Equipment Owner Dashboard</h1>
          <p className="text-xs text-muted-foreground font-bengali mt-0.5">
            যন্ত্রপাতির তালিকা, ভাড়ার হিসাব এবং আয়ের সার্বিক বিবরণী
          </p>
        </div>
        <Button asChild variant="brand" size="sm" className="font-bold text-xs">
          <Link href="/dashboard/owner/equipment/new">
            <PlusCircle className="h-4 w-4 mr-1.5" />
            <span>নতুন যন্ত্রপাতি যুক্ত করুন</span>
          </Link>
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Machines</span>
            <Wrench className="h-4 w-4 text-brand-forest dark:text-brand-fresh" />
          </div>
          <div className="text-2xl font-black text-foreground">{analytics?.totalEquipment ?? "—"}</div>
          <div className="text-[10px] text-muted-foreground">তালিকাভুক্ত যন্ত্র</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Approved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{analytics?.approvedEquipment ?? "—"}</div>
          <div className="text-[10px] text-muted-foreground">ভাড়ার জন্য অনুমোদিত</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Pending</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {analytics?.pendingEquipment ?? "—"}
          </div>
          <div className="text-[10px] text-muted-foreground">এডমিন রিভিউতে রয়েছে</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Completed Rentals</span>
            <Calendar className="h-4 w-4 text-brand-leaf" />
          </div>
          <div className="text-2xl font-black text-brand-leaf">{analytics?.completedRentals ?? "—"}</div>
          <div className="text-[10px] text-muted-foreground">সফল ভাড়া সম্পন্ন</div>
        </div>

        <div className="col-span-2 lg:col-span-1 rounded-2xl border border-brand-leaf/30 bg-brand-forest/10 dark:bg-brand-forest/25 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-brand-forest dark:text-brand-fresh">
            <span className="text-xs font-bold">Total Earnings</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-brand-forest dark:text-brand-fresh">
            {formatBDT(analytics?.totalEarnings || 0)}
          </div>
          <div className="text-[10px] text-muted-foreground">চলতি মৌসুমে মোট আয়</div>
        </div>
      </div>

      {/* Monthly Earnings Chart using Recharts */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-leaf" />
              <span>মাসভিত্তিক আয়ের গতিপ্রকৃতি (Monthly Earnings Trend)</span>
            </h2>
            <p className="text-xs text-muted-foreground font-bengali">
              কৃষি মৌসুমে যন্ত্রপাতি ভাড়ার আয় বিশ্লেষণ
            </p>
          </div>
          <Badge variant="leaf" className="text-xs font-bold">{analytics?.totalRentals ?? 0} rentals</Badge>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyEarnings}>
              <defs>
                <linearGradient id="ownerColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#174C32" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#174C32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#888888" fontSize={11} />
              <YAxis
                stroke="#888888"
                fontSize={11}
                tickFormatter={(val) => `৳${val / 1000}k`}
              />
              <Tooltip
                formatter={(value) => [formatBDT(Number(value) || 0), "Earnings"]}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#39834F"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#ownerColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Action List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recent Equipment Activity
            </h3>
            <Link href="/dashboard/owner/equipment" className="text-xs text-brand-leaf hover:underline font-semibold">
              View All
            </Link>
          </div>
          <div className="space-y-2.5">
            {equipmentList.slice(0, 4).map((eq) => (
              <div key={eq._id} className="flex items-center justify-between text-xs py-1.5 border-b border-border/50 last:border-0">
                <span className="font-semibold text-foreground line-clamp-1">{eq.title}</span>
                <Badge variant={eq.status === "approved" ? "available" : "unavailable"} className="text-[10px]">
                  {eq.status}
                </Badge>
              </div>
            ))}
            {!loading && equipmentList.length === 0 && <p className="text-xs text-muted-foreground">No equipment listings yet.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recent Bookings & Inquiries
            </h3>
            <Link href="/dashboard/owner/rentals" className="text-xs text-brand-leaf hover:underline font-semibold">
              Manage Bookings
            </Link>
          </div>
          <div className="space-y-2.5">
            {bookings.slice(0, 3).map((b) => (
              <div key={b._id} className="flex items-center justify-between text-xs py-1.5 border-b border-border/50 last:border-0">
                <div>
                  <div className="font-semibold text-foreground">{b.renterName}</div>
                  <div className="text-[10px] text-muted-foreground">{b.equipmentTitle}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-brand-forest dark:text-brand-fresh">{formatBDT(b.totalPrice)}</div>
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase">{b.bookingStatus}</span>
                </div>
              </div>
            ))}
            {!loading && bookings.length === 0 && <p className="text-xs text-muted-foreground">No bookings yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
