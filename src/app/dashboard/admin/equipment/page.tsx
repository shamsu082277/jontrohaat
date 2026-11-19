"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SAMPLE_EQUIPMENTS } from "@/lib/fixtures";
import { formatBDT } from "@/lib/utils";
import { Equipment, EquipmentStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function AdminEquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(
    SAMPLE_EQUIPMENTS.map((eq, i) => ({
      ...eq,
      status: i === 4 ? "pending" : i === 5 ? "rejected" : ("approved" as EquipmentStatus),
    }))
  );

  const handleStatusChange = (id: string, status: EquipmentStatus, title: string) => {
    setEquipmentList((prev) =>
      prev.map((eq) => (eq._id === id ? { ...eq, status } : eq))
    );
    toast.success(`"${title}" এর স্ট্যাটাস আপডেট হয়েছে: ${status.toUpperCase()}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${title}" স্থায়ীভাবে ডিলিট করতে চান?`)) {
      setEquipmentList((prev) => prev.filter((eq) => eq._id !== id));
      toast.success("যন্ত্রপাতি ডিলিট করা হয়েছে");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Equipment Moderation & Approval</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          প্ল্যাটফর্মের সকল যন্ত্রপাতি অনুমোদন, প্রত্যাখ্যান বা অপসারণ নিয়ন্ত্রণ করুন
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">যন্ত্রপাতি (Equipment)</th>
                <th className="py-3 px-4">মালিকের নাম (Owner)</th>
                <th className="py-3 px-4">ক্যাটাগরি</th>
                <th className="py-3 px-4">দৈনিক ভাড়া</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">মডারেশন অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {equipmentList.map((eq) => (
                <tr key={eq._id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-14 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                        <Image
                          src={eq.images?.[0] || "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80"}
                          alt={eq.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-foreground line-clamp-1">{eq.title}</div>
                        <div className="text-[11px] text-muted-foreground">{eq.location.district}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                    {eq.ownerName}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant="outline" className="text-[10px]">{eq.category}</Badge>
                  </td>

                  <td className="py-3.5 px-4 font-black text-brand-forest dark:text-brand-fresh whitespace-nowrap">
                    {formatBDT(eq.pricePerDay)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge
                      variant={
                        eq.status === "approved"
                          ? "available"
                          : eq.status === "rejected"
                          ? "destructive"
                          : "unavailable"
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      {eq.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {eq.status !== "approved" && (
                        <Button
                          size="sm"
                          variant="brand"
                          onClick={() => handleStatusChange(eq._id, "approved", eq.title)}
                          className="h-7 text-[11px] gap-1 px-2.5 font-bold"
                        >
                          <Check className="h-3 w-3" />
                          <span>Approve</span>
                        </Button>
                      )}
                      {eq.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(eq._id, "rejected", eq.title)}
                          className="h-7 text-[11px] gap-1 px-2.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                        >
                          <X className="h-3 w-3" />
                          <span>Reject</span>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(eq._id, eq.title)}
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Delete Permanently"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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
