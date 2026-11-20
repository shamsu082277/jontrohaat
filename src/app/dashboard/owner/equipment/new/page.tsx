"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload/image-upload";
import { CATEGORIES, BANGLADESH_DISTRICTS, BANGLADESH_DIVISIONS } from "@/lib/fixtures";
import { EquipmentCategory } from "@/types";
import { Tractor, Sparkles, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { equipmentService } from "@/lib/api-services";

export default function AddEquipmentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [banglaTitle, setBanglaTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<EquipmentCategory>("Power Tillers");
  const [rentalType, setRentalType] = useState<"per_day" | "per_hour" | "per_acre">("per_day");
  const [pricePerDay, setPricePerDay] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [condition, setCondition] = useState("Excellent – Serviced & Field Tested");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [division, setDivision] = useState("Rajshahi");
  const [district, setDistrict] = useState("Bogura");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [terms, setTerms] = useState("জ্বালানি খরচ (ডিজেল) ভাড়াগ্রহীতার। জাতীয় পরিচয়পত্র (NID) কপি আবশ্যক।");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !pricePerDay || !quantity || !address.trim()) {
      toast.error("অনুগ্রহ করে সকল আবশ্যক তথ্য পূরণ করুন");
      return;
    }

    setSubmitting(true);
    try {
      const response = await equipmentService.create({
        title: title.trim(),
        description: description.trim(),
        category,
        location: { division, district, address: address.trim() },
        rentalPrice: Number(pricePerDay),
        rentalType,
        availableQuantity: Number(quantity),
        condition,
        brand: brand.trim() || undefined,
        model: model.trim() || undefined,
        image,
        rentalTerms: terms.trim(),
      });
      if (!response.success) throw new Error(response.message || "Equipment could not be submitted");
      toast.success("যন্ত্রপাতি সফলভাবে সাবমিট হয়েছে! স্ট্যাটাস: Pending");
      router.push("/dashboard/owner/equipment");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "যন্ত্রপাতি সাবমিট করা যায়নি");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link href="/dashboard/owner/equipment">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            ফিরে যান
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black text-foreground">Add New Agricultural Equipment</h1>
          <p className="text-xs text-muted-foreground font-bengali">
            নতুন যন্ত্রপাতি তালিকাভুক্ত করুন। প্রাথমিক অবস্থায় স্ট্যাটাস &apos;Pending&apos; থাকবে।
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6 text-xs">
        {/* Notice */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            <strong>অনুমোদন শর্ত:</strong> নতুন যন্ত্রপাতি সাবমিট করার পর স্বয়ংক্রিয়ভাবে &apos;Pending&apos; থাকবে। কোনো মালিক নিজের যন্ত্র নিজে অনুমোদন করতে পারবেন না। এডমিন যাচাই করে অনুমোদন করবেন।
          </span>
        </div>

        {/* Basic Info */}
        <div className="space-y-4 border-b border-border pb-6">
          <h2 className="text-sm font-bold text-foreground">যন্ত্রের প্রাথমিক তথ্য (Basic Details)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Equipment Title (English) *</label>
              <Input
                required
                placeholder="e.g. Dongfeng 16HP Walking Power Tiller"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">যন্ত্রের নাম (বাংলায়)</label>
              <Input
                placeholder="e.g. ডংফেং ১৬ হর্সপাওয়ার পাওয়ার টিলার"
                value={banglaTitle}
                onChange={(e) => setBanglaTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">ক্যাটাগরি (Category) *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EquipmentCategory)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.banglaName})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">ভাড়ার ধরন (Rental Type) *</label>
              <select
                value={rentalType}
                onChange={(e) => setRentalType(e.target.value as "per_day" | "per_hour" | "per_acre")}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
              >
                <option value="per_day">Per Day (দৈনিক)</option>
                <option value="per_hour">Per Hour (প্রতি ঘণ্টা)</option>
                <option value="per_acre">Per Acre (প্রতি একর)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">যন্ত্রপাতির বিবরণ (Description) *</label>
            <textarea
              required
              rows={3}
              placeholder="যন্ত্রের ক্ষমতা, কাজের সুবিধা, রোটাভেটর বা ট্রেইলার ইত্যাদি সংযুক্তি সম্পর্কে লিখুন..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4 border-b border-border pb-6">
          <h2 className="text-sm font-bold text-foreground">ভাড়া ও মজুদের পরিমাণ (Pricing & Inventory)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">দৈনিক ভাড়ার হার (BDT) *</label>
              <Input
                type="number"
                required
                min={100}
                placeholder="e.g. 1800"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">ফেরতযোগ্য জামানত (Security Deposit)</label>
              <Input
                type="number"
                placeholder="e.g. 3000"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">মজুদ সংখ্যা (Quantity) *</label>
              <Input
                type="number"
                required
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Brand & Technical */}
        <div className="space-y-4 border-b border-border pb-6">
          <h2 className="text-sm font-bold text-foreground">ব্র্যান্ড ও স্পেসিফিকেশন</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">ব্র্যান্ড (Brand)</label>
              <Input placeholder="e.g. Kubota, Dongfeng, Honda" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">মডেল (Model)</label>
              <Input placeholder="e.g. DF-121 / GX160" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">কন্ডিশন (Condition)</label>
              <Input placeholder="e.g. Excellent / Serviced" value={condition} onChange={(e) => setCondition(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Location & Image */}
        <div className="space-y-4 border-b border-border pb-6">
          <h2 className="text-sm font-bold text-foreground">অবস্থান ও ছবি (Location & Image)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">বিভাগ (Division) *</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
              >
                {BANGLADESH_DIVISIONS.filter((d) => d !== "All Divisions").map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">জেলা (District) *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
              >
                {BANGLADESH_DISTRICTS.filter((d) => d !== "All Districts").map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">সুনির্দিষ্ট ঠিকানা (Address) *</label>
            <Input
              required
              placeholder="গ্রাম, ইউনিয়ন, সড়ক নম্বর বা বাজার পয়েন্ট"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <ImageUpload
            value={image}
            onChange={(url) => setImage(url)}
            label="যন্ত্রপাতির ছবি আপলোড করুন *"
            helperText="সরাসরি আপনার মেশিনের আসল ছবি দিলে কৃষক দ্রুত বুকিং করবে"
          />
        </div>

        {/* Terms */}
        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">ভাড়ার শর্তাবলী (Rental Terms)</label>
          <Input
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="জ্বালানি খরচ, ড্রাইভার বা জিম্মার শর্ত"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end gap-3">
          <Button asChild type="button" variant="outline">
            <Link href="/dashboard/owner/equipment">বাতিল</Link>
          </Button>
          <Button type="submit" variant="brand" disabled={submitting} className="font-bold h-11 px-8 text-xs">
            {submitting ? "সাবমিট হচ্ছে..." : "যন্ত্রপাতি সাবমিট করুন (Submit for Approval)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
