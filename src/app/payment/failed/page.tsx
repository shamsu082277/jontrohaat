import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, ArrowLeft, PhoneCall } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md rounded-3xl border border-destructive/20 bg-card p-8 shadow-xl text-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">পেমেন্ট সম্পন্ন হতে ব্যর্থ হয়েছে</h1>
          <p className="text-xs text-muted-foreground font-bengali">
            কার্ডের সমস্যা, অপর্যাপ্ত ব্যালেন্স বা নেটওয়ার্ক সংযোগ বিচ্ছিন্ন হওয়ার কারণে পেমেন্ট সম্পন্ন হয়নি।
          </p>
        </div>

        <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground flex items-center justify-center gap-2">
          <PhoneCall className="h-3.5 w-3.5 text-brand-leaf" />
          <span>সহায়তার জন্য কল করুন: <strong>16123</strong></span>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button asChild variant="brand" className="font-bold">
            <Link href="/dashboard/customer/rentals">
              <RotateCcw className="h-4 w-4 mr-2" />
              <span>পুনরায় পেমেন্ট চেষ্টা করুন</span>
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/equipment">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>মার্কেটপ্লেসে ফিরে যান</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
