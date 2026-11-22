"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImageUrlList } from "@/components/shared/image-url-list";
import { equipmentService } from "@/lib/api-services";
import type { Equipment } from "@/types";

export default function EquipmentImagesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imagesValid, setImagesValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    equipmentService.getByIdForOwner(id)
      .then(({ data }) => {
        if (!data) throw new Error("Equipment listing could not be loaded");
        setEquipment(data);
        setImages(data.images || []);
        if (!data.images?.length) setImagesValid(false);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Equipment could not be loaded"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleValidityChange = useCallback((valid: boolean) => {
    setImagesValid(valid);
  }, []);

  const saveImages = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imagesValid) {
      toast.error("Add at least one valid image URL and wait for every preview to load.");
      return;
    }

    setSaving(true);
    try {
      await equipmentService.update(id, { images });
      toast.success("Equipment images updated.");
      router.push("/dashboard/owner/equipment");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Equipment images could not be saved");
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-muted-foreground">লোড হচ্ছে...</div>;
  }
  if (!equipment) {
    return <div className="p-8 text-center text-xs text-muted-foreground">Equipment listing could not be found.</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link href="/dashboard/owner/equipment">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            ফিরে যান
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black text-foreground">Manage Equipment Images</h1>
          <p className="text-xs text-muted-foreground">{equipment.title}</p>
        </div>
      </div>

      <form onSubmit={saveImages} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <ImageUrlList
          value={images}
          onChange={setImages}
          onValidityChange={handleValidityChange}
          label="Equipment image URLs"
          helperText="Add, replace, or remove HTTPS image URLs. All previews must load before saving."
        />
        <div className="flex justify-end gap-3">
          <Button asChild type="button" variant="outline">
            <Link href="/dashboard/owner/equipment">Cancel</Link>
          </Button>
          <Button type="submit" variant="brand" disabled={saving || !imagesValid}>
            {saving ? "Saving…" : "Save images"}
          </Button>
        </div>
      </form>
    </div>
  );
}
