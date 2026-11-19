import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl text-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <XCircle className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">পেমেন্ট বাতিল করা হয়েছে</h1>
          <p className="text-xs text-muted-foreground font-bengali">
            আপনি পেমেন্ট প্রক্রিয়া বাতিল করেছেন। আপনার কার্ড বা ব্যাংক থেকে কোনো চার্জ কাটা হয়নি।
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button asChild variant="brand" className="font-bold">
            <Link href="/dashboard/customer/rentals">
              <RotateCcw className="h-4 w-4 mr-2" />
              <span>বুকিং তালিকায় ফিরে যান</span>
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
