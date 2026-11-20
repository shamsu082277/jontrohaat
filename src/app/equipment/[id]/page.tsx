"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Equipment } from "@/types";
import { bookingService, equipmentService, paymentService } from "@/lib/api-services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBDT } from "@/lib/utils";
import { useFavorites } from "@/components/shared/favorites-context";
import { toast } from "sonner";
import {
  MapPin,
  Heart,
  Calendar,
  ShieldCheck,
  Tractor,
  Phone,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  X,
  FileText,
  Info,
} from "lucide-react";

export default function EquipmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const equipmentId = params?.id;
  const [equipment, setEquipment] = useState<Equipment | undefined>();
  const [loadingEquipment, setLoadingEquipment] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingEquipment(true);
    equipmentService.getById(equipmentId)
      .then((response) => {
        if (active) setEquipment(response.data);
      })
      .catch(() => {
        if (active) setEquipment(undefined);
      })
      .finally(() => {
        if (active) setLoadingEquipment(false);
      });
    return () => { active = false; };
  }, [equipmentId]);

  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = equipment ? isFavorite(equipment._id) : false;

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Booking Form State
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const dayAfterTomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  }, []);

  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(dayAfterTomorrow);
  const [quantity, setQuantity] = useState(1);
  const [areaAcres, setAreaAcres] = useState(1);
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Price Calculation Breakdown
  const durationDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  }, [startDate, endDate]);

  const subtotal = useMemo(() => {
    if (!equipment) return 0;
    const rentalUnits = equipment.rentalType === "per_acre" ? areaAcres : durationDays;
    return equipment.pricePerDay * rentalUnits * quantity;
  }, [equipment, areaAcres, durationDays, quantity]);

  const estimatedTotal = subtotal;

  // Handle Share link
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("লিংক কপি করা হয়েছে (Link copied to clipboard)");
    }
  };

  // Booking Form Submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactNumber.trim()) {
      toast.error("যোগাযোগের জন্য সচল মোবাইল নম্বর দিন");
      return;
    }
    // Basic BD Phone validation
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    const cleanNumber = contactNumber.replace(/[-\s]/g, "");
    if (!bdPhoneRegex.test(cleanNumber)) {
      toast.error("সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর লিখুন (e.g. 01712345678)");
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error("যন্ত্র পৌঁছে দেওয়ার পূর্ণাঙ্গ ঠিকানা বা জমির অবস্থান লিখুন");
      return;
    }

    if (quantity < 1 || (equipment && quantity > equipment.quantity)) {
      toast.error(`অনুরোধকৃত পরিমাণ ১ থেকে ${equipment?.quantity} এর মধ্যে হতে হবে`);
      return;
    }

    if (equipment.rentalType === "per_acre" && (!Number.isFinite(areaAcres) || areaAcres <= 0)) {
      toast.error("ভাড়ার জমির পরিমাণ একরে লিখুন");
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const booking = await bookingService.create({
        equipmentId: equipment._id,
        startDate: new Date(`${startDate}T00:00:00`).toISOString(),
        endDate: new Date(`${endDate}T00:00:00`).toISOString(),
        quantity,
        contactNumber: cleanNumber,
        deliveryAddress: deliveryAddress.trim(),
        notes: additionalNotes.trim() || undefined,
        ...(equipment.rentalType === "per_acre" ? { areaAcres } : {}),
      });
      if (!booking.data?._id) throw new Error(booking.message || "Booking could not be created");
      const checkout = await paymentService.createCheckoutSession(booking.data._id);
      if (!checkout.data?.checkoutUrl) throw new Error(checkout.message || "Payment checkout is unavailable");
      window.location.assign(checkout.data.checkoutUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "বুকিং তৈরি করা যায়নি");
      setIsSubmittingBooking(false);
    }
  };

  if (loadingEquipment) {
    return <div className="container-haat py-20 text-center text-sm text-muted-foreground">যন্ত্রপাতির তথ্য লোড হচ্ছে...</div>;
  }

  if (!equipment) {
    return (
      <div className="container-haat py-20 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Equipment Not Found</h1>
        <p className="text-sm text-muted-foreground font-bengali">
          অনুরোধকৃত কৃষি যন্ত্রপাতিটি খুঁজে পাওয়া যায়নি অথবা সরিয়ে নেওয়া হয়েছে।
        </p>
        <Button asChild variant="brand" className="mt-4">
          <Link href="/equipment">
            <ArrowLeft className="h-4 w-4 mr-2" />
            সকল যন্ত্রপাতি দেখুন (Browse All Equipment)
          </Link>
        </Button>
      </div>
    );
  }

  const galleryImages = equipment.images?.length > 0 ? equipment.images : [
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80"
  ];

  return (
    <div className="container-haat py-8 lg:py-12 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-1.5 hover:text-brand-forest dark:hover:text-brand-fresh transition-colors font-semibold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 hover:bg-muted transition-colors cursor-pointer"
          >
            <Share2 className="h-3 w-3" />
            <span>Share</span>
          </button>
          <button
            onClick={() => toggleFavorite(equipment._id, equipment.title)}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 transition-colors cursor-pointer ${
              favorited
                ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                : "border-border hover:bg-muted text-muted-foreground"
            }`}
          >
            <Heart className={`h-3 w-3 ${favorited ? "fill-current" : ""}`} />
            <span>{favorited ? "Saved" : "Favorite"}</span>
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* =========================================================
            LEFT COLUMN: Image Gallery & Description & Specs
           ========================================================= */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Large Image */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
              <Image
                src={galleryImages[activeImageIndex]}
                alt={equipment.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover transition-all duration-300"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="forest" className="font-semibold text-xs shadow-xs">
                  {equipment.category}
                </Badge>
                {equipment.isAvailable !== false ? (
                  <Badge variant="available" className="bg-emerald-600 text-white font-medium text-xs">
                    Available Now
                  </Badge>
                ) : (
                  <Badge variant="unavailable" className="bg-amber-600 text-white font-medium text-xs">
                    Currently Booked
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-brand-forest dark:border-brand-fresh ring-2 ring-brand-forest/20 scale-105"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Overview */}
          <div className="space-y-3 border-b border-border pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-brand-forest dark:text-brand-fresh">
                <Tractor className="h-3.5 w-3.5" />
                {equipment.brand || "Heavy Agri Machinery"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-brand-harvest" />
                {equipment.location.address || equipment.location.district},{" "}
                {equipment.location.division}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {equipment.title}
            </h1>
            {equipment.banglaTitle && (
              <p className="text-base text-brand-forest dark:text-brand-fresh font-semibold font-bengali">
                {equipment.banglaTitle}
              </p>
            )}

            <p className="text-sm text-muted-foreground leading-relaxed pt-2">
              {equipment.description}
            </p>
          </div>

          {/* Technical Specifications */}
          {equipment.specifications && (
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-leaf" />
                <span>Technical Specifications & Features</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(equipment.specifications).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-2.5 border border-border/60"
                  >
                    <span className="font-semibold text-muted-foreground">{key}</span>
                    <span className="font-bold text-foreground text-right">{val}</span>
                  </div>
                ))}
                {equipment.condition && (
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2.5 border border-border/60 sm:col-span-2">
                    <span className="font-semibold text-muted-foreground">Machine Condition</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {equipment.condition}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rental Terms & Policies */}
          <div className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-xs">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-leaf" />
              <span>Rental Terms & Conditions (ভাড়ার শর্তাবলী)</span>
            </h2>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {equipment.terms && equipment.terms.length > 0 ? (
                equipment.terms.map((term, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-leaf shrink-0 mt-0.5" />
                    <span>{term}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-leaf shrink-0 mt-0.5" />
                    <span>ইন্ধন বা জ্বালানি খরচ (ডিজেল/অকটেন) ভাড়াগ্রহীতার বহন করতে হবে।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-leaf shrink-0 mt-0.5" />
                    <span>হস্তান্তরের সময় জাতীয় পরিচয়পত্র (NID) এর ফটোকপি আবশ্যক।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-leaf shrink-0 mt-0.5" />
                    <span>নিরাপদ জামানত যন্ত্র ফেরত দেওয়ার সাথে সাথে রিফান্ড করা হবে।</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: Pricing, Booking Card, Owner Card
           ========================================================= */}
        <div className="lg:col-span-5 space-y-6 sticky top-20">
          {/* Booking Summary Box */}
          <div className="rounded-2xl border-2 border-brand-forest/20 bg-card p-6 shadow-lg space-y-6">
            <div className="flex items-baseline justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs text-muted-foreground">Rental Rate</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-black text-brand-forest dark:text-brand-fresh">
                    {formatBDT(equipment.pricePerDay)}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    /{equipment.rentalType === "per_hour" ? "hour" : "day"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-muted-foreground">Refundable Deposit</span>
                <div className="text-sm font-bold text-foreground">
                  {formatBDT(equipment.securityDeposit || 2000)}
                </div>
              </div>
            </div>

            {/* Availability pill */}
            <div className="flex items-center justify-between text-xs rounded-xl bg-muted/60 p-3">
              <span className="text-muted-foreground">Units in Stock:</span>
              <span className="font-bold text-foreground">
                {equipment.quantity} machine(s) available
              </span>
            </div>

            {/* Quick CTAs */}
            <div className="space-y-3 pt-2">
              <Button
                variant="brand"
                size="lg"
                disabled={equipment.isAvailable === false}
                onClick={() => setBookingModalOpen(true)}
                className="w-full font-bold text-sm h-12 shadow-md hover:scale-[1.01] transition-transform"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {equipment.isAvailable !== false
                  ? "Book This Equipment Now (এখনই বুক করুন)"
                  : "Currently Unavailable"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFavorite(equipment._id, equipment.title)}
                className="w-full text-xs font-semibold gap-2"
              >
                <Heart className={`h-3.5 w-3.5 ${favorited ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>
                  {favorited ? "Saved in Your Favorites" : "Save to Favorites (পছন্দে রাখুন)"}
                </span>
              </Button>
            </div>

            {/* Trust Assurances */}
            <div className="space-y-2 pt-2 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-leaf shrink-0" />
                <span>Verified equipment owner with clear service history</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-leaf shrink-0" />
                <span>Instant booking response within 30-60 minutes</span>
              </div>
            </div>
          </div>

          {/* Equipment Owner Profile Box */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-leaf">
              Equipment Owner Details
            </div>

            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted border border-border shrink-0">
                <Image
                  src={
                    equipment.owner?.avatar ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  }
                  alt={equipment.ownerName}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-bold text-foreground text-sm">
                  <span>{equipment.owner?.banglaName || equipment.ownerName}</span>
                  <Badge variant="available" className="text-[10px] py-0 px-1.5">Verified</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {equipment.location.district}, {equipment.location.division}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Member since {equipment.owner?.memberSince || "2024"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
              <div className="rounded-lg bg-muted/40 p-2 text-center">
                <div className="text-muted-foreground text-[10px]">Response Rate</div>
                <div className="font-bold text-brand-forest dark:text-brand-fresh">
                  {equipment.owner?.responseRate || "98% (Quick)"}
                </div>
              </div>
              <div className="rounded-lg bg-muted/40 p-2 text-center">
                <div className="text-muted-foreground text-[10px]">Owner Helpline</div>
                <div className="font-bold text-foreground">
                  {equipment.ownerPhone || "01712-XXXXXX"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          BOOKING MODAL UI
         ========================================================= */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Book Equipment • বুকিং ফরম
                </h3>
                <p className="text-xs text-muted-foreground font-bengali">
                  {equipment.title}
                </p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4 pt-4 text-xs">
              {/* Date pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-brand-leaf" />
                    <span>Start Date (শুরুর তারিখ)</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={tomorrow}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
                  />
                </div>

                {equipment.rentalType === "per_acre" && (
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Land area (acres)</label>
                    <input
                      type="number"
                      min={0.1}
                      step={0.1}
                      required
                      value={areaAcres}
                      onChange={(e) => setAreaAcres(Number(e.target.value))}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-brand-leaf" />
                    <span>End Date (সমাপ্তির তারিখ)</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground">
                    Quantity (যন্ত্রের সংখ্যা)
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Available: {equipment.quantity}
                  </span>
                </div>
                <input
                  type="number"
                  required
                  min={1}
                  max={equipment.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-brand-leaf" />
                  <span>Contact Mobile Number (মোবাইল নম্বর)</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01712345678"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
                />
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-brand-leaf" />
                  <span>Delivery Address / Land Location (জমির পূর্ণ ঠিকানা)</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="গ্রাম, ইউনিয়ন, ডাকঘর ও জমি চেনার সুনির্দিষ্ট ল্যান্ডমার্ক লিখুন..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
                />
              </div>

              {/* Additional Notes */}
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">
                  Special Notes (অতিরিক্ত কোনো নির্দেশনা থাকলে লিখুন)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ট্রেইলার দিয়ে ডেলিভারি সুবিধা লাগবে..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/40"
                />
              </div>

              {/* Price Calculation Breakdown */}
              <div className="rounded-xl border border-brand-leaf/30 bg-brand-cream/50 dark:bg-brand-forest/20 p-4 space-y-2">
                <div className="text-xs font-bold text-brand-forest dark:text-brand-fresh flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  <span>Estimated Price Breakdown (ভাড়ার হিসাব বিবরণী)</span>
                </div>

                <div className="space-y-1 text-muted-foreground pt-1">
                  <div className="flex justify-between">
                    <span>
                      Rate ({formatBDT(equipment.pricePerDay)} × {equipment.rentalType === "per_acre" ? `${areaAcres} acre(s)` : `${durationDays} rental unit(s)`} × {quantity} machine(s))
                    </span>
                    <span className="font-semibold text-foreground">{formatBDT(subtotal)}</span>
                  </div>

                  <div className="flex justify-between border-t border-border pt-1.5 text-sm font-black text-brand-forest dark:text-brand-fresh">
                    <span>Estimated Total</span>
                    <span>{formatBDT(estimatedTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBookingModalOpen(false)}
                  className="w-1/3"
                >
                  বাতিল (Cancel)
                </Button>
                <Button
                  type="submit"
                  variant="brand"
                  disabled={isSubmittingBooking}
                  className="w-2/3 font-bold"
                >
                  {isSubmittingBooking ? "প্রসেস হচ্ছে..." : "বুকিং নিশ্চিত করুন (Confirm)"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
