"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { profileService } from "@/lib/api-services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUrlList } from "@/components/shared/image-url-list";
import { SafeImage } from "@/components/shared/safe-image";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function CustomerProfilePage() {
  const { data: session, refetch: refreshSession } = useSession();
  const currentUser = session?.user;

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [division, setDivision] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState(currentUser?.image || "");
  const [imageValid, setImageValid] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.getMe()
      .then((response) => {
        const profile = response.data;
        if (!profile) return;
        setName(profile.name || "");
        setEmail(profile.email || "");
        setPhone(profile.phone || "");
        setDistrict(profile.district || "");
        setDivision(profile.division || "");
        setAddress("address" in profile && typeof profile.address === "string" ? profile.address : "");
        setAvatar(profile.image || "");
        setImageValid(!profile.image);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Profile could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileService.updateMe({ name, phone, district, division, address, image: avatar });
      await refreshSession({ query: { disableCookieCache: true } });
      toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Profile could not be updated");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Customer Profile</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          আপনার ব্যক্তিগত তথ্য ও যোগাযোগের ঠিকানা পরিচালনা করুন
        </p>
      </div>

      {loading ? <div className="p-8 text-center text-xs text-muted-foreground">লোড হচ্ছে...</div> : <form onSubmit={handleUpdate} className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5 text-xs">
        {/* External Profile Image URL */}
        <div className="space-y-2 border-b border-border pb-5">
          <label className="font-semibold text-foreground">Profile Picture (প্রোফাইল ছবি)</label>
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
              <SafeImage
                src={avatar}
                fallbackSrc="/images/avatar-placeholder.svg"
                alt={`${name || "User"} profile avatar`}
                fill
                sizes="96px"
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground">Your profile avatar preview</p>
          </div>
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
              <span>Full Name</span>
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Division</span>
            </label>
            <Input value={division} onChange={(e) => setDivision(e.target.value)} />
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
          <Button type="submit" variant="brand" disabled={saving || !imageValid} className="font-bold text-xs h-10 px-6">
            {saving ? "আপডেট হচ্ছে..." : "প্রোফাইল সংরক্ষণ করুন (Save Profile)"}
          </Button>
        </div>
      </form>}
    </div>
  );
}
