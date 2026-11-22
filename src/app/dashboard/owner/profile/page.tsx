"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUrlList } from "@/components/shared/image-url-list";
import { useSession } from "@/lib/auth-client";
import { profileService } from "@/lib/api-services";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function OwnerProfilePage() {
  const { refetch: refreshSession } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [division, setDivision] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageValid, setImageValid] = useState(true);

  useEffect(() => {
    profileService.getMe()
      .then(({ data }) => {
        if (!data) throw new Error("Profile could not be loaded");
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setDistrict(data.district || "");
        setDivision(data.division || "");
        setAddress(data.address || "");
        setAvatar(data.image || "");
        setImageValid(!data.image);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Profile could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileService.updateMe({ name, phone, district, division, address, image: avatar });
      await refreshSession();
      toast.success("মালিক প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Profile could not be updated");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Equipment Owner Profile</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          আপনার যোগাযোগের তথ্য ও বাহ্যিকভাবে হোস্ট করা প্রোফাইল ছবি পরিচালনা করুন
        </p>
      </div>

      {loading ? <div className="p-8 text-center text-xs text-muted-foreground">লোড হচ্ছে...</div> : <form onSubmit={handleUpdate} className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5 text-xs">
        <div className="space-y-2 border-b border-border pb-5">
          <label className="font-semibold text-foreground">Business Logo / Profile Image</label>
          <ImageUrlList
            value={avatar ? [avatar] : []}
            onChange={(urls) => setAvatar(urls[0] || "")}
            onValidityChange={setImageValid}
            label=""
            helperText="Host your profile image externally and paste its HTTPS image URL."
            maxItems={1}
            allowEmpty
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Owner Name</span>
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
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
              <MapPin className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Division</span>
            </label>
            <Input value={division} onChange={(e) => setDivision(e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground">Address</label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="brand" disabled={saving || !imageValid} className="font-bold text-xs h-10 px-6">
            {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন (Save Changes)"}
          </Button>
        </div>
      </form>}
    </div>
  );
}
