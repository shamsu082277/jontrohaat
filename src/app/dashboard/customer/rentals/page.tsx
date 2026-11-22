"use client";

import { useState, useEffect } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import Link from "next/link";
import { Booking } from "@/types";
import { bookingService, paymentService } from "@/lib/api-services";
import { formatBDT, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Tractor,
} from "lucide-react";
import { toast } from "sonner";

export default function CustomerRentalsPage() {
  const [rentals, setRentals] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getMyRentals()
      .then((response) => setRentals(response.data || []))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Bookings could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  const handlePay = async (bookingId: string) => {
    try {
      const response = await paymentService.createCheckoutSession(bookingId);
      if (!response.data?.checkoutUrl) throw new Error(response.message || "Stripe checkout is unavailable");
      window.location.assign(response.data.checkoutUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment could not be started");
    }
  };

  const totalRentals = rentals.length;
  const activeRentals = rentals.filter((r) => r.bookingStatus === "active").length;
  const completedRentals = rentals.filter((r) => r.bookingStatus === "completed").length;
  const pendingPayments = rentals.filter((r) => r.paymentStatus === "pending").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-foreground">My Equipment Rentals</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          আপনার সকল বর্তমান ও অতীত কৃষি যন্ত্রপাতি বুকিং ও ভাড়ার বিবরণী
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Rentals</span>
            <Calendar className="h-4 w-4 text-brand-forest dark:text-brand-fresh" />
          </div>
          <div className="text-2xl font-black text-foreground">{totalRentals}</div>
          <div className="text-[10px] text-muted-foreground">মোট বুকিং সম্পন্ন</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Active In Field</span>
            <Clock className="h-4 w-4 text-brand-leaf" />
          </div>
          <div className="text-2xl font-black text-brand-leaf">{activeRentals}</div>
          <div className="text-[10px] text-muted-foreground">বর্তমানে মাঠে চলমান কাজ</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{completedRentals}</div>
          <div className="text-[10px] text-muted-foreground">সফলভাবে সম্পন্ন হয়েছে</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Pending Payments</span>
            <CreditCard className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {pendingPayments}
          </div>
          <div className="text-[10px] text-muted-foreground">পেমেন্ট অপেক্ষমান</div>
        </div>
      </div>

      {/* Rentals Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Rental History & Bookings</h2>
          <Button asChild variant="brand" size="sm" className="text-xs font-semibold">
            <Link href="/equipment">
              <Tractor className="h-3.5 w-3.5 mr-1.5" />
              <span>নতুন যন্ত্র ভাড়া করুন</span>
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">লোড হচ্ছে...</div>
        ) : rentals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">যন্ত্রপাতি (Equipment)</th>
                  <th className="py-3 px-4">ভাড়ার সময়কাল (Duration)</th>
                  <th className="py-3 px-4">পরিমাণ</th>
                  <th className="py-3 px-4">মোট পরিমাণ (BDT)</th>
                  <th className="py-3 px-4">পেমেন্ট স্ট্যাটাস</th>
                  <th className="py-3 px-4">বুকিং স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rentals.map((rental) => (
                  <tr key={rental._id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-14 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                          <SafeImage
                            src={rental.equipmentImage}
                            alt={rental.equipmentTitle}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-foreground line-clamp-1">
                            {rental.equipmentTitle}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {rental.deliveryAddress}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-foreground whitespace-nowrap">
                      <div>{formatDate(rental.startDate)} – {formatDate(rental.endDate)}</div>
                      <div className="text-[10px] text-muted-foreground">{rental.durationDays} দিন (Days)</div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {rental.quantity} টি
                    </td>

                    <td className="py-3.5 px-4 font-black text-brand-forest dark:text-brand-fresh whitespace-nowrap">
                      {formatBDT(rental.totalPrice)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant={rental.paymentStatus === "paid" ? "available" : "unavailable"}
                        className="text-[10px] uppercase font-bold"
                      >
                        {rental.paymentStatus}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          rental.bookingStatus === "active"
                            ? "forest"
                            : rental.bookingStatus === "completed"
                            ? "available"
                            : "secondary"
                        }
                        className="text-[10px] uppercase font-semibold"
                      >
                        {rental.bookingStatus}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {rental.paymentStatus === "pending" && rental.bookingStatus === "pending" ? (
                        <Button size="sm" variant="harvest" className="text-xs font-bold h-8" onClick={() => handlePay(rental._id)}>
                          <span>Pay ৳</span>
                        </Button>
                      ) : (
                        <Button asChild size="sm" variant="outline" className="text-xs h-8">
                          <Link href={`/equipment/${rental.equipmentId}`}>
                            <span>View</span>
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
            <h3 className="text-sm font-bold text-foreground">এখনো কোনো যন্ত্রপাতি ভাড়া নেননি</h3>
            <p className="text-xs text-muted-foreground font-bengali">
              মার্কেটপ্লেস ব্রাউজ করে আপনার পছন্দের যন্ত্রপাতি বুকিং দিন।
            </p>
            <Button asChild variant="brand" size="sm">
              <Link href="/equipment">Browse Equipment</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
