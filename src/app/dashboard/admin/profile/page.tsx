"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUrlList } from "@/components/shared/image-url-list";
import { SafeImage } from "@/components/shared/safe-image";
import { useSession } from "@/lib/auth-client";
import { profileService } from "@/lib/api-services";
import { Shield } from "lucide-react";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const { refetch: refreshSession } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [imageValid, setImageValid] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.getMe()
      .then(({ data }) => {
        if (!data) throw new Error("Profile could not be loaded");
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setImage(data.image || "");
        setImageValid(!data.image);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Profile could not be loaded"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileService.updateMe({ name, phone, image });
      await refreshSession({ query: { disableCookieCache: true } });
      toast.success("এডমিন প্রোফাইল সফলভাবে আপডেট হয়েছে!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Profile could not be updated");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Platform Admin Profile</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          সুপার এডমিন সিকিউরিটি ও সিস্টেম ক্রেডেনশিয়ালস
        </p>
      </div>

      {loading ? <div className="p-8 text-center text-xs text-muted-foreground">লোড হচ্ছে...</div> : <form onSubmit={handleUpdate} className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5 text-xs">
        <div className="rounded-xl border border-brand-leaf/30 bg-brand-forest/10 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-forest text-brand-harvest flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-foreground">System Super Administrator</div>
            <div className="text-[11px] text-muted-foreground">Full Platform Permissions Enabled</div>
          </div>
        </div>

        <div className="space-y-2 border-b border-border pb-5">
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
              <SafeImage
                src={image}
                fallbackSrc="/images/avatar-placeholder.svg"
                alt={`${name || "Admin"} profile avatar`}
                fill
                sizes="96px"
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground">Admin profile avatar preview</p>
          </div>
          <ImageUrlList
            value={image ? [image] : []}
            onChange={(urls) => setImage(urls[0] || "")}
            onValidityChange={setImageValid}
            label="Admin profile image URL"
            helperText="Host your profile image externally and paste its HTTPS image URL."
            maxItems={1}
            allowEmpty
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Admin Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Official Email (System Key)</label>
            <Input value={email} disabled className="opacity-75 bg-muted" />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Support Hotline</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Security Role</label>
            <Input value="Super Admin (Root)" disabled className="opacity-75 bg-muted font-bold text-brand-forest dark:text-brand-fresh" />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="brand" disabled={saving || !imageValid} className="font-bold text-xs h-10 px-6">
            {saving ? "আপডেট হচ্ছে..." : "সংরক্ষণ করুন (Save Admin Profile)"}
          </Button>
        </div>
      </form>}
    </div>
  );
}
