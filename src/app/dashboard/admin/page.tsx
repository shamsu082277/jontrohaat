"use client";

import { useState } from "react";
import Link from "next/link";
import { ADMIN_MONTHLY_REVENUE, DEMO_USERS, DEMO_RENTALS } from "@/lib/dashboard-fixtures";
import { SAMPLE_EQUIPMENTS } from "@/lib/fixtures";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Shield,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminOverviewPage() {
  const totalUsers = 48;
  const totalEquipment = SAMPLE_EQUIPMENTS.length;
  const totalBookings = 126;
  const pendingApprovals = 3;
  const completedRentals = 94;
  const totalRevenue = 340000;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-foreground">JontroHaat Admin Command Center</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          সারা বাংলাদেশের কৃষি যন্ত্রপাতি ভাড়ার মার্কেটপ্লেস ও ব্যবহারকারীদের সামগ্রিক তদারকি
        </p>
      </div>

      {/* 6 Mandatory Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">Total Users</span>
            <Users className="h-4 w-4 text-brand-forest dark:text-brand-fresh" />
          </div>
          <div className="text-2xl font-black text-foreground">{totalUsers}</div>
          <div className="text-[10px] text-muted-foreground">নিবন্ধিত কৃষক ও মালিক</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">Total Equipment</span>
            <Wrench className="h-4 w-4 text-brand-leaf" />
          </div>
          <div className="text-2xl font-black text-foreground">{totalEquipment}</div>
          <div className="text-[10px] text-muted-foreground">প্ল্যাটফর্মে যন্ত্রপাতি</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">Total Bookings</span>
            <Calendar className="h-4 w-4 text-brand-forest dark:text-brand-fresh" />
          </div>
          <div className="text-2xl font-black text-foreground">{totalBookings}</div>
          <div className="text-[10px] text-muted-foreground">মোট বুকিং আদেশ</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">Pending Approvals</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {pendingApprovals}
          </div>
          <div className="text-[10px] text-muted-foreground">অপেক্ষমান মেশিন</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-semibold">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{completedRentals}</div>
          <div className="text-[10px] text-muted-foreground">সম্পন্ন ভাড়া</div>
        </div>

        <div className="rounded-2xl border border-brand-leaf/30 bg-brand-forest/10 dark:bg-brand-forest/25 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-brand-forest dark:text-brand-fresh">
            <span className="text-[11px] font-bold">Total Volume</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="text-xl font-black text-brand-forest dark:text-brand-fresh">
            {formatBDT(totalRevenue)}
          </div>
          <div className="text-[10px] text-muted-foreground">মোট মার্কেটপ্লেস ভলিউম</div>
        </div>
      </div>

      {/* Platform Monthly Revenue BarChart using Recharts */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-leaf" />
              <span>মার্কেটপ্লেস রাজস্ব ও অর্ডার ভলিউম (Platform Revenue & Booking Volume)</span>
            </h2>
            <p className="text-xs text-muted-foreground font-bengali">
              গত ৬ মাসের প্ল্যাটফর্ম প্রবৃদ্ধি বিশ্লেষণ
            </p>
          </div>
          <Badge variant="harvest" className="text-xs font-bold text-neutral-900">
            Rapid Growth in Aman & Boro Seasons
          </Badge>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ADMIN_MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#888888" fontSize={11} />
              <YAxis
                stroke="#888888"
                fontSize={11}
                tickFormatter={(val) => `৳${val / 1000}k`}
              />
              <Tooltip
                formatter={(value) => [formatBDT(Number(value) || 0), "Platform Volume"]}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="revenue" fill="#174C32" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Administration Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending approvals quick card */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Equipment Pending Review
            </h3>
            <Link href="/dashboard/admin/equipment" className="text-xs text-brand-leaf hover:underline font-semibold">
              Manage All
            </Link>
          </div>
          <div className="space-y-2.5">
            {SAMPLE_EQUIPMENTS.slice(4, 7).map((eq) => (
              <div key={eq._id} className="flex items-center justify-between text-xs py-1.5 border-b border-border/50 last:border-0">
                <div>
                  <div className="font-semibold text-foreground line-clamp-1">{eq.title}</div>
                  <div className="text-[10px] text-muted-foreground">Owner: {eq.ownerName} • {eq.location.district}</div>
                </div>
                <Button asChild size="sm" variant="brand" className="h-7 text-[11px]">
                  <Link href="/dashboard/admin/equipment">Review</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* User quick table */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recent Registered Users
            </h3>
            <Link href="/dashboard/admin/users" className="text-xs text-brand-leaf hover:underline font-semibold">
              Manage Users
            </Link>
          </div>
          <div className="space-y-2.5">
            {DEMO_USERS.slice(0, 4).map((u) => (
              <div key={u.id} className="flex items-center justify-between text-xs py-1.5 border-b border-border/50 last:border-0">
                <div>
                  <div className="font-semibold text-foreground">{u.name}</div>
                  <div className="text-[10px] text-muted-foreground">{u.email}</div>
                </div>
                <Badge variant={u.role === "admin" ? "harvest" : u.role === "owner" ? "forest" : "leaf"} className="text-[9px] uppercase font-bold">
                  {u.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
