"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EquipmentEditForm } from "@/components/dashboard/equipment-edit-form";
import { adminService, equipmentService } from "@/lib/api-services";
import { Equipment } from "@/types";
import { toast } from "sonner";

export default function AdminEquipmentEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    equipmentService.getByIdForOwner(id)
      .then(({ data }) => { if (active) setEquipment(data || null); })
      .catch((error) => { if (active) toast.error(error instanceof Error ? error.message : "Equipment could not be loaded"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const save = async (data: Parameters<typeof adminService.updateEquipment>[1]) => {
    try {
      await adminService.updateEquipment(id, data);
      toast.success("Equipment updated");
      router.push("/dashboard/admin/equipment");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Equipment could not be updated");
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-muted-foreground">লোড হচ্ছে...</div>;
  if (!equipment) return <div className="p-8 text-center text-xs text-muted-foreground">Equipment listing could not be found.</div>;
  return <EquipmentEditForm equipment={equipment} cancelHref="/dashboard/admin/equipment" onSave={save} />;
}
