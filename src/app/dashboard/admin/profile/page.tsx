"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Mail, Phone, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const [name, setName] = useState("JontroHaat Super Administrator");
  const [email] = useState("admin@jontrohaat.com");
  const [phone, setPhone] = useState("01800-000000");
  const [saving, setSaving] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("এডমিন প্রোফাইল সফলভাবে আপডেট হয়েছে!");
    }, 600);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Platform Admin Profile</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          সুপার এডমিন সিকিউরিটি ও সিস্টেম ক্রেডেনশিয়ালস
        </p>
      </div>

      <form onSubmit={handleUpdate} className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5 text-xs">
        <div className="rounded-xl border border-brand-leaf/30 bg-brand-forest/10 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-forest text-brand-harvest flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-foreground">System Super Administrator</div>
            <div className="text-[11px] text-muted-foreground">Full Platform Permissions Enabled</div>
          </div>
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
          <Button type="submit" variant="brand" disabled={saving} className="font-bold text-xs h-10 px-6">
            {saving ? "আপডেট হচ্ছে..." : "সংরক্ষণ করুন (Save Admin Profile)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
