"use client";

import { useState } from "react";
import { DEMO_USERS } from "@/lib/dashboard-fixtures";
import { formatDate } from "@/lib/utils";
import { User, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, UserCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(DEMO_USERS);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    toast.success(`ব্যবহারকারীর রোল পরিবর্তন করা হয়েছে: ${newRole.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">User Management</h1>
        <p className="text-xs text-muted-foreground font-bengali mt-0.5">
          প্ল্যাটফর্মের গ্রাহক ও যন্ত্রপাতি মালিকদের রোল ও প্রোফাইল নিয়ন্ত্রণ
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">নাম (User Name)</th>
                <th className="py-3 px-4">ইমেল</th>
                <th className="py-3 px-4">ফোন ও অবস্থান</th>
                <th className="py-3 px-4">বর্তমান রোল (Current Role)</th>
                <th className="py-3 px-4">নিবন্ধন তারিখ</th>
                <th className="py-3 px-4 text-right">রোল পরিবর্তন (Change Role)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {u.name}
                  </td>

                  <td className="py-3.5 px-4 text-muted-foreground">
                    {u.email}
                  </td>

                  <td className="py-3.5 px-4 text-muted-foreground">
                    <div>{u.phone || "N/A"}</div>
                    <div className="text-[10px] font-bengali">{u.district}, {u.division}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge
                      variant={u.role === "admin" ? "harvest" : u.role === "owner" ? "forest" : "leaf"}
                      className="text-[10px] uppercase font-black"
                    >
                      {u.role}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                    {formatDate(u.createdAt)}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40 font-medium"
                    >
                      <option value="customer">Customer (কৃষক/গ্রাহক)</option>
                      <option value="owner">Owner (মালিক)</option>
                      <option value="admin">Admin (প্রশাসক)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
