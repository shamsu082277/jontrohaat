"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload/image-upload";
import { User, Mail, Phone, MapPin, CheckCircle2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function CustomerProfilePage() {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [name, setName] = useState(currentUser?.name || "Md. Rafiqul Islam");
  const [email] = useState(currentUser?.email || "farmer.rafiqul@gmail.com");
  const [phone, setPhone] = useState("01711-223344");
  const [district, setDistrict] = useState("Bogura");
  const [division, setDivision] = useState("Rajshahi");
  const [address, setAddress] = useState("Mirzapur Para, Sherpur, Bogura");
  const [avatar, setAvatar] = useState(currentUser?.image || "");
  const [saving, setSaving] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
    }, 600);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Customer Profile</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          আপনার ব্যক্তিগত তথ্য ও যোগাযোগের ঠিকানা পরিচালনা করুন
        </p>
      </div>

      <form onSubmit={handleUpdate} className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5 text-xs">
        {/* Profile Picture Upload */}
        <div className="space-y-2 border-b border-border pb-5">
          <label className="font-semibold text-foreground">Profile Picture (প্রোফাইল ছবি)</label>
          <ImageUpload
            value={avatar}
            onChange={(url) => setAvatar(url)}
            label=""
            helperText="JPG or PNG up to 2MB"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Full Name</span>
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Email Address (Read Only)</span>
            </label>
            <Input value={email} disabled className="opacity-75 bg-muted" />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Mobile Phone</span>
            </label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-leaf" />
              <span>District (জেলা)</span>
            </label>
            <Input value={district} onChange={(e) => setDistrict(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-leaf" />
            <span>Detailed Address / Village / Union</span>
          </label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="brand" disabled={saving} className="font-bold text-xs h-10 px-6">
            {saving ? "আপডেট হচ্ছে..." : "প্রোফাইল সংরক্ষণ করুন (Save Profile)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
