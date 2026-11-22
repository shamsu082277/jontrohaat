"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { bookingService, paymentService } from "@/lib/api-services";
import { Booking } from "@/types";
import { AlertCircle, ArrowLeft, Loader2, RotateCcw } from "lucide-react";

export default function PaymentCancelPage() {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [verifiedPaid, setVerifiedPaid] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const bookingId = new URLSearchParams(window.location.search).get("booking_id");
    Promise.resolve().then(() => {
      if (!bookingId) throw new Error("Missing booking reference");
      return bookingService.getById(bookingId);
    }).then(async (response) => {
        if (!response.data) throw new Error(response.message || "Booking could not be verified");
        if (active) setBooking(response.data);
        if (response.data.stripeSessionId) {
          const payment = await paymentService.verifySession(response.data.stripeSessionId);
          if (active) setVerifiedPaid(payment.data?.paid === true);
        }
      })
      .catch(() => {
        if (active) setVerificationFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const paid = verifiedPaid || booking?.paymentStatus === "paid";

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl text-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          {loading ? <Loader2 className="h-10 w-10 animate-spin" /> : <AlertCircle className="h-10 w-10" />}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground">
            {loading ? "পেমেন্ট যাচাই করা হচ্ছে..." : paid ? "পেমেন্ট নিশ্চিত হয়েছে" : "চেকআউট সম্পন্ন হয়নি"}
          </h1>
          <p className="text-xs text-muted-foreground font-bengali">
            {loading
              ? "Stripe এবং সার্ভার থেকে বুকিংয়ের বর্তমান অবস্থা যাচাই করা হচ্ছে।"
              : paid
                ? "Stripe নিশ্চিত করেছে যে পেমেন্ট সম্পন্ন হয়েছে।"
                : verificationFailed
                  ? "বুকিং বা পেমেন্টের অবস্থা যাচাই করা যায়নি। চার্জ হয়েছে কি না নিশ্চিত না হয়ে আবার পেমেন্ট করবেন না।"
                  : "Stripe-এ পেমেন্ট সম্পন্ন হয়নি। বুকিংয়ের সংরক্ষণের সময় শেষ না হওয়া পর্যন্ত আপনি আবার চেষ্টা করতে পারবেন।"}
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
