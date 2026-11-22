"use client";

import { useState, useEffect } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import Link from "next/link";
import { Equipment } from "@/types";
import { equipmentService, ownerService } from "@/lib/api-services";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function OwnerEquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadEquipment = () => {
    setLoading(true);
    setLoadError(null);
    ownerService.getEquipment()
      .then((response) => setEquipmentList(response.data || []))
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Equipment could not be loaded";
        setLoadError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    ownerService.getEquipment()
      .then((response) => { if (active) setEquipmentList(response.data || []); })
      .catch((error) => {
        if (!active) return;
        const message = error instanceof Error ? error.message : "Equipment could not be loaded";
        setLoadError(message);
        toast.error(message);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${title}" তালিকা থেকে মুছে ফেলতে চান?`)) {
      try {
        await equipmentService.delete(id);
        setEquipmentList((prev) => prev.filter((item) => item._id !== id));
        toast.success("যন্ত্রপাতি সফলভাবে মুছে ফেলা হয়েছে");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "যন্ত্রপাতি মুছতে পারেনি");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">My Equipment Listings</h1>
          <p className="text-xs text-muted-foreground font-bengali mt-0.5">
            আপনার মালিকানাধীন তালিকাভুক্ত কৃষি যন্ত্রপাতি ও অনুমোদন স্ট্যাটাস
          </p>
        </div>
        <Button asChild variant="brand" size="sm" className="font-bold text-xs">
          <Link href="/dashboard/owner/equipment/new">
            <PlusCircle className="h-4 w-4 mr-1.5" />
            <span>Add New Equipment (নতুন যন্ত্র যুক্ত করুন)</span>
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">যন্ত্রের বিবরণ (Equipment)</th>
                <th className="py-3 px-4">ক্যাটাগরি</th>
                <th className="py-3 px-4">দৈনিক ভাড়া (Rate)</th>
                <th className="py-3 px-4">মজুদ সংখ্যা (Qty)</th>
                <th className="py-3 px-4">অনুমোদন স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">লোড হচ্ছে...</td></tr>
              ) : loadError ? (
                <tr><td colSpan={6} className="p-8 text-center text-destructive">{loadError} <button className="ml-2 underline" onClick={loadEquipment}>Retry</button></td></tr>
              ) : equipmentList.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">আপনার কোনো equipment listing নেই।</td></tr>
              ) : equipmentList.map((eq) => (
                <tr key={eq._id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                        <SafeImage
                          src={eq.images?.[0]}
                          alt={eq.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-foreground line-clamp-1">{eq.title}</div>
                        <div className="text-[11px] text-muted-foreground font-bengali">
                          {eq.location.district}, {eq.location.division}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant="outline" className="text-[10px] font-medium">
                      {eq.category}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 font-black text-brand-forest dark:text-brand-fresh whitespace-nowrap">
                    {formatBDT(eq.pricePerDay)} <span className="text-[10px] text-muted-foreground font-normal">/ day</span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {eq.quantity} টি
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge
                      variant={eq.status === "approved" ? "available" : eq.status === "rejected" ? "destructive" : "unavailable"}
                      className="text-[10px] uppercase font-bold"
                    >
                      {eq.status === "approved" ? "Approved • অনুমোদিত" : eq.status === "rejected" ? "Rejected • প্রত্যাখ্যাত" : "Pending • অপেক্ষমান"}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                        <Link href={`/equipment/${eq._id}`}>ভিউ</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                        <Link href={`/dashboard/owner/equipment/${eq._id}/edit`}>Update</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                        <Link href={`/dashboard/owner/equipment/${eq._id}/images`}>ছবি</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(eq._id, eq.title)}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
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
