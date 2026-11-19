"use client";

import { useState } from "react";
import Image from "next/image";
import { DEMO_RENTALS } from "@/lib/dashboard-fixtures";
import { formatBDT, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function OwnerRentalsPage() {
  const [rentals, setRentals] = useState(DEMO_RENTALS);

  const handleStatusChange = (id: string, newStatus: "active" | "completed") => {
    setRentals((prev) =>
      prev.map((r) => (r._id === id ? { ...r, bookingStatus: newStatus } : r))
    );
    toast.success(`বুকিং স্ট্যাটাস পরিবর্তন হয়েছে: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Customer Rental Orders</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          কৃষকদের কাছ থেকে আসা আপনার যন্ত্রপাতির বুকিং ও ভাড়ার তালিকা
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">গ্রাহক (Customer Info)</th>
                <th className="py-3 px-4">যন্ত্রপাতি (Equipment)</th>
                <th className="py-3 px-4">ভাড়ার সময়কাল</th>
                <th className="py-3 px-4">পরিমাণ</th>
                <th className="py-3 px-4">মোট বিল</th>
                <th className="py-3 px-4">পেমেন্ট</th>
                <th className="py-3 px-4">অর্ডার স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rentals.map((r) => (
                <tr key={r._id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-foreground">{r.renterName}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3 text-brand-leaf" />
                      <span>{r.contactNumber}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground line-clamp-1">{r.deliveryAddress}</div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                    {r.equipmentTitle}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>{formatDate(r.startDate)} – {formatDate(r.endDate)}</div>
                    <div className="text-[10px] text-muted-foreground">{r.durationDays} দিন (Days)</div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {r.quantity} টি
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
                    <Badge variant={r.bookingStatus === "active" ? "forest" : r.bookingStatus === "completed" ? "available" : "secondary"} className="text-[10px] uppercase font-semibold">
                      {r.bookingStatus}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {r.bookingStatus === "pending" && (
                      <Button size="sm" variant="brand" onClick={() => handleStatusChange(r._id, "active")} className="h-7 text-[11px]">
                        হস্তান্তর (Deliver)
                      </Button>
                    )}
                    {r.bookingStatus === "active" && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(r._id, "completed")} className="h-7 text-[11px]">
                        ফেরত গ্রহণ (Complete)
                      </Button>
                    )}
                    {r.bookingStatus === "completed" && (
                      <span className="text-[11px] text-emerald-600 font-bold">সম্পন্ন</span>
                    )}
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
