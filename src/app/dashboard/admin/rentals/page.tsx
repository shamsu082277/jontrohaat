"use client";

import { useState, useEffect } from "react";
import { formatBDT, formatDate } from "@/lib/utils";
import { Booking } from "@/types";
import { bookingService } from "@/lib/api-services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, Phone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getAllRentalsAdmin()
      .then((response) => setRentals(response.data || []))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Bookings could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (id: string, status: Booking["bookingStatus"]) => {
    try {
      const response = await bookingService.updateAdminStatus(id, status);
      if (response.data) setRentals((prev) => prev.map((r) => r._id === id ? response.data! : r));
      toast.success(`অর্ডার স্ট্যাটাস আপডেট হয়েছে: ${status.toUpperCase()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking status could not be updated");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Global Rental Orders</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          প্ল্যাটফর্মের সকল কৃষক বুকিং, লেনদেন ও সরবরাহ তদারকি
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">গ্রাহক (Customer)</th>
                <th className="py-3 px-4">যন্ত্রপাতি (Equipment)</th>
                <th className="py-3 px-4">ভাড়ার সময়কাল</th>
                <th className="py-3 px-4">মোট বিল (BDT)</th>
                <th className="py-3 px-4">পেমেন্ট</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">ম্যানেজ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">লোড হচ্ছে...</td></tr>
              ) : rentals.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">কোনো booking পাওয়া যায়নি।</td></tr>
              ) : rentals.map((r) => (
                <tr key={r._id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">{r.renterName}</div>
                    <div className="text-[10px] text-muted-foreground">{r.contactNumber}</div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    <div>{r.equipmentTitle}</div>
                    <div className="text-[10px] text-muted-foreground font-medium">Qty: {r.quantity}</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>{formatDate(r.startDate)} – {formatDate(r.endDate)}</div>
                    <div className="text-[10px] text-muted-foreground">{r.durationDays} দিন (Days)</div>
                  </td>

                  <td className="py-3.5 px-4 font-black text-brand-forest dark:text-brand-fresh whitespace-nowrap">
                    {formatBDT(r.totalPrice)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant={r.paymentStatus === "paid" ? "available" : "unavailable"} className="text-[10px] uppercase font-bold">
                      {r.paymentStatus}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge
                      variant={
                        r.bookingStatus === "active"
                          ? "forest"
                          : r.bookingStatus === "completed"
                          ? "available"
                          : "secondary"
                      }
                      className="text-[10px] uppercase font-semibold"
                    >
                      {r.bookingStatus}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <select
                      value={r.bookingStatus}
                      onChange={(e) => handleUpdateStatus(r._id, e.target.value as Booking["bookingStatus"])}
                      className="h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40 font-medium"
                    >
                      <option value="pending" disabled>Pending (unpaid)</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
