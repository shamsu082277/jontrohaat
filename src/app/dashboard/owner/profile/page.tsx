"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload/image-upload";
import { User, Mail, Phone, MapPin, Building, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function OwnerProfilePage() {
  const [businessName, setBusinessName] = useState("Akbar Agro Machinery Hub");
  const [ownerName, setOwnerName] = useState("Haji Nurul Islam");
  const [email] = useState("nurul.islam.bogura@gmail.com");
  const [phone, setPhone] = useState("01712-345678");
  const [district, setDistrict] = useState("Bogura");
  const [division, setDivision] = useState("Rajshahi");
  const [address, setAddress] = useState("Sherpur Bazar Highway, Bogura");
  const [tradeLicense, setTradeLicense] = useState("TRAD/BOG/2024/0912");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("মালিক প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
    }, 600);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Equipment Owner Profile</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          আপনার ব্যবসার পরিচিতি, যোগাযোগের নম্বর ও ভেরিফিকেশন তথ্য
        </p>
      </div>

      <form onSubmit={handleUpdate} className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5 text-xs">
        <div className="space-y-2 border-b border-border pb-5">
          <label className="font-semibold text-foreground">Business Logo / Profile Image</label>
          <ImageUpload value={avatar} onChange={(url) => setAvatar(url)} label="" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Business / Farm Name</span>
            </label>
            <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Owner Name</span>
            </label>
            <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Email (Read Only)</span>
            </label>
            <Input value={email} disabled className="opacity-75 bg-muted" />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Helpline Phone</span>
            </label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-leaf" />
              <span>District</span>
            </label>
            <Input value={district} onChange={(e) => setDistrict(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Trade License / NID No</span>
            </label>
            <Input value={tradeLicense} onChange={(e) => setTradeLicense(e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">Workshop / Yard Address</label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="brand" disabled={saving} className="font-bold text-xs h-10 px-6">
            {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন (Save Changes)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
