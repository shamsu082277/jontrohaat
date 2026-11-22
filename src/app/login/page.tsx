"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient, signIn, useSession } from "@/lib/auth-client";
import { dashboardPathForRole, getUserRole } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tractor, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const { data: session, isPending: sessionPending } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionPending && session?.user) {
      const role = getUserRole(session.user);
      if (role) {
        router.replace(dashboardPathForRole(role));
      }
    }
  }, [router, session, sessionPending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || "লগইন ব্যর্থ হয়েছে। ইমেল এবং পাসওয়ার্ড সঠিক কিনা পরীক্ষা করুন।");
        toast.error("Invalid email or password");
      } else {
        const sessionResponse = await authClient.getSession();
        const role = getUserRole(sessionResponse.data?.user);
        if (!role) {
          throw new Error("আপনার অ্যাকাউন্টের ভূমিকা যাচাই করা যায়নি।");
        }

        toast.success("সফলভাবে লগইন হয়েছে! স্বাগতম।");
        const rolePath = dashboardPathForRole(role);
        const rolePrefix = `/dashboard/${role}`;
        const canResumeCallback =
          callbackUrl?.startsWith(`${rolePrefix}/`) ||
          callbackUrl === rolePrefix ||
          callbackUrl?.startsWith("/payment/");
        router.replace(canResumeCallback && callbackUrl ? callbackUrl : rolePath);
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "একটি অপ্রত্যাশিত সমস্যা হয়েছে";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl || "/login",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google লগইনে ত্রুটি হয়েছে";
      setError(msg);
      toast.error(msg);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl space-y-6">
      {/* Brand & Title */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group mb-2">
          <div className="h-10 w-10 rounded-xl bg-brand-forest flex items-center justify-center text-brand-harvest shadow-xs">
            <Tractor className="h-5 w-5" />
          </div>
          <span className="text-xl font-black text-foreground">
            JontroHaat <span className="font-bengali text-brand-leaf text-sm">যন্ত্রহাট</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          স্বাগতম! লগইন করুন
        </h1>
        <p className="text-xs text-muted-foreground font-bengali">
          আপনার কৃষি যন্ত্রপাতি ভাড়া ও বুকিং অ্যাকাউন্ট ব্যবহার করুন
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-foreground flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-brand-leaf" />
            <span>Email Address (ইমেল এড্রেস)</span>
          </label>
          <Input
            type="email"
            required
            placeholder="farmer@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || googleLoading}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Password (পাসওয়ার্ড)</span>
            </label>
          </div>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || googleLoading}
          />
        </div>

        <Button
          type="submit"
          variant="brand"
          disabled={loading || googleLoading}
          className="w-full h-11 text-sm font-bold shadow-md hover:scale-[1.01] transition-transform"
        >
          {loading ? "লগইন হচ্ছে..." : "লগইন করুন (Sign In)"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground">
          অথবা
        </div>
      </div>

      {/* Google Login */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={loading || googleLoading}
        className="w-full h-11 text-xs font-semibold gap-2.5 border-border hover:bg-muted"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{googleLoading ? "কানেক্ট হচ্ছে..." : "Google দিয়ে সরাসরি প্রবেশ করুন"}</span>
      </Button>

      {/* Register redirect */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        <span>এখনো একাউন্ট নেই? </span>
        <Link
          href="/register"
          className="font-bold text-brand-forest dark:text-brand-fresh hover:underline inline-flex items-center gap-1"
        >
          <span>নতুন নিবন্ধন করুন</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-muted/20">
      <Suspense fallback={<div className="text-xs text-muted-foreground">লোড হচ্ছে...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
