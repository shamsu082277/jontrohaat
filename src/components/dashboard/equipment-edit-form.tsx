"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Equipment, EquipmentCategory, RentalType } from "@/types";
import { EquipmentUpdateInput } from "@/lib/api-services";
import { CATEGORIES } from "@/lib/fixtures";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EquipmentEditFormProps {
  equipment: Equipment;
  cancelHref: string;
  onSave: (data: EquipmentUpdateInput) => Promise<void>;
}

export function EquipmentEditForm({ equipment, cancelHref, onSave }: EquipmentEditFormProps) {
  const [title, setTitle] = useState(equipment.title);
  const [description, setDescription] = useState(equipment.description);
  const [category, setCategory] = useState<EquipmentCategory>(equipment.category);
  const [rentalType, setRentalType] = useState<RentalType>(equipment.rentalType || "per_day");
  const [rentalPrice, setRentalPrice] = useState(String(equipment.pricePerDay));
  const [securityDeposit, setSecurityDeposit] = useState(String(equipment.securityDeposit ?? 0));
  const [quantity, setQuantity] = useState(String(equipment.quantity));
  const [condition, setCondition] = useState(equipment.condition || "");
  const [brand, setBrand] = useState(equipment.brand || "");
  const [model, setModel] = useState(equipment.model || "");
  const [division, setDivision] = useState(equipment.location.division);
  const [district, setDistrict] = useState(equipment.location.district);
  const [address, setAddress] = useState(equipment.location.address || "");
  const [terms, setTerms] = useState(equipment.terms?.join("\n") || "");
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data: EquipmentUpdateInput = {};
    if (title.trim() !== equipment.title) data.title = title.trim();
    if (description.trim() !== equipment.description) data.description = description.trim();
    if (category !== equipment.category) data.category = category;
    if (rentalType !== equipment.rentalType) data.rentalType = rentalType;
    if (Number(rentalPrice) !== equipment.pricePerDay) data.rentalPrice = Number(rentalPrice);
    if (Number(securityDeposit) !== (equipment.securityDeposit ?? 0)) data.securityDeposit = Number(securityDeposit);
    if (Number(quantity) !== equipment.quantity) data.availableQuantity = Number(quantity);
    if (condition.trim() !== (equipment.condition || "")) data.condition = condition.trim();
    if (brand.trim() !== (equipment.brand || "")) data.brand = brand.trim();
    if (model.trim() !== (equipment.model || "")) data.model = model.trim();
    if (
      division !== equipment.location.division ||
      district !== equipment.location.district ||
      address !== (equipment.location.address || "")
    ) {
      data.location = { ...equipment.location, division, district, address };
    }
    const rentalTerms = terms.trim();
    if (rentalTerms !== (equipment.terms || []).join("\n")) data.rentalTerms = rentalTerms;

    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href={cancelHref}><ArrowLeft className="mr-1 h-3.5 w-3.5" />Back</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black text-foreground">Update Equipment</h1>
          <p className="text-xs text-muted-foreground">{equipment.title}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 font-semibold">Equipment Name
            <Input required minLength={2} maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label className="space-y-1.5 font-semibold">Category
            <select value={category} onChange={(event) => setCategory(event.target.value as EquipmentCategory)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs">
              {CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="space-y-1.5 font-semibold">Rental rate (BDT)
            <Input required type="number" min="0.01" step="0.01" value={rentalPrice} onChange={(event) => setRentalPrice(event.target.value)} />
          </label>
          <label className="space-y-1.5 font-semibold">Rental Type
            <select value={rentalType} onChange={(event) => setRentalType(event.target.value as RentalType)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs">
              <option value="per_day">Daily</option><option value="per_hour">Hourly</option><option value="per_acre">Per acre</option>
            </select>
          </label>
          <label className="space-y-1.5 font-semibold">Available Quantity
            <Input required type="number" min="0" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </label>
          <label className="space-y-1.5 font-semibold">Security Deposit (BDT)
            <Input required type="number" min="0" step="0.01" value={securityDeposit} onChange={(event) => setSecurityDeposit(event.target.value)} />
          </label>
          <label className="space-y-1.5 font-semibold">Brand
            <Input maxLength={80} value={brand} onChange={(event) => setBrand(event.target.value)} />
          </label>
          <label className="space-y-1.5 font-semibold">Model
            <Input maxLength={80} value={model} onChange={(event) => setModel(event.target.value)} />
          </label>
          <label className="space-y-1.5 font-semibold">Condition
            <Input required maxLength={80} value={condition} onChange={(event) => setCondition(event.target.value)} />
          </label>
          <label className="space-y-1.5 font-semibold">Division
            <Input required maxLength={80} value={division} onChange={(event) => setDivision(event.target.value)} />
          </label>
          <label className="space-y-1.5 font-semibold">District
            <Input required maxLength={80} value={district} onChange={(event) => setDistrict(event.target.value)} />
          </label>
          <label className="space-y-1.5 font-semibold">Address
            <Input maxLength={300} value={address} onChange={(event) => setAddress(event.target.value)} />
          </label>
        </div>
        <label className="block space-y-1.5 font-semibold">Description
          <textarea required minLength={10} maxLength={4000} rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-lg border border-input bg-background p-3 text-xs" />
        </label>
        <label className="block space-y-1.5 font-semibold">Rental Terms
          <textarea maxLength={2000} rows={3} value={terms} onChange={(event) => setTerms(event.target.value)} className="w-full rounded-lg border border-input bg-background p-3 text-xs" />
        </label>
        <div className="flex justify-end gap-2">
          <Button asChild type="button" variant="outline"><Link href={cancelHref}>Cancel</Link></Button>
          <Button type="submit" variant="brand" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
        </div>
      </form>
    </div>
  );
}
