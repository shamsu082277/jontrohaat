"use client";

import { useState, useEffect } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import { formatBDT } from "@/lib/utils";
import { Equipment, EquipmentStatus } from "@/types";
import { adminService } from "@/lib/api-services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminEquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEquipment = () => {
    adminService.getEquipment()
      .then((response) => setEquipmentList(response.data || []))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Equipment could not be loaded"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadEquipment(); }, []);

  const handleStatusChange = async (id: string, status: EquipmentStatus, title: string) => {
    try {
      const response = await adminService.approveEquipment(id, status as "approved" | "rejected");
      if (response.data) setEquipmentList((prev) => prev.map((eq) => eq._id === id ? response.data! : eq));
      toast.success(`"${title}" এর স্ট্যাটাস আপডেট হয়েছে: ${status.toUpperCase()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Equipment status could not be updated");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${title}" স্থায়ীভাবে ডিলিট করতে চান?`)) {
      try {
        await adminService.deleteEquipment(id);
        setEquipmentList((prev) => prev.filter((eq) => eq._id !== id));
        toast.success("যন্ত্রপাতি ডিলিট করা হয়েছে");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Equipment could not be deleted");
      }
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
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">লোড হচ্ছে...</td></tr>
              ) : equipmentList.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">কোনো equipment পাওয়া যায়নি।</td></tr>
              ) : equipmentList.map((eq) => (
                <tr key={eq._id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-14 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                        <SafeImage
                          src={eq.images?.[0]}
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
