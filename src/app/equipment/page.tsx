"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { EquipmentCard } from "@/components/shared/equipment-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SAMPLE_EQUIPMENTS,
  CATEGORIES,
  BANGLADESH_DISTRICTS,
  BANGLADESH_DIVISIONS,
} from "@/lib/fixtures";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  MapPin,
  ChevronLeft,
  ChevronRight,
  FilterX,
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

function EquipmentContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL params or fallback to defaults
  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "All";
  const districtParam = searchParams.get("district") || "All Districts";
  const divisionParam = searchParams.get("division") || "All Divisions";
  const rentalTypeParam = searchParams.get("rentalType") || "all";
  const availabilityParam = searchParams.get("available") || "all";
  const sortByParam = searchParams.get("sortBy") || "newest";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  // Local mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Helper to update URL params
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all" || value === "All" || value === "All Districts" || value === "All Divisions") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset to page 1 unless page itself was changed
    if (!updates.page) {
      params.delete("page");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push(pathname);
  };

  // Filter & sort logic
  const filteredEquipment = useMemo(() => {
    return SAMPLE_EQUIPMENTS.filter((item) => {
      // Search
      if (searchParam) {
        const query = searchParam.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesBangla = item.banglaTitle?.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesDistrict = item.location.district.toLowerCase().includes(query);
        if (!matchesTitle && !matchesBangla && !matchesDesc && !matchesDistrict) {
          return false;
        }
      }

      // Category
      if (categoryParam !== "All" && item.category !== categoryParam) {
        return false;
      }

      // District
      if (districtParam !== "All Districts" && item.location.district !== districtParam) {
        return false;
      }

      // Division
      if (divisionParam !== "All Divisions" && item.location.division !== divisionParam) {
        return false;
      }

      // Rental Type
      if (rentalTypeParam !== "all" && item.rentalType !== rentalTypeParam) {
        return false;
      }

      // Availability
      if (availabilityParam === "available_now" && item.isAvailable === false) {
        return false;
      }

      // Min Price
      if (minPriceParam && item.pricePerDay < Number(minPriceParam)) {
        return false;
      }

      // Max Price
      if (maxPriceParam && item.pricePerDay > Number(maxPriceParam)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortByParam === "price_asc") return a.pricePerDay - b.pricePerDay;
      if (sortByParam === "price_desc") return b.pricePerDay - a.pricePerDay;
      if (sortByParam === "rating") return (b.averageRating || 0) - (a.averageRating || 0);
      // default "newest"
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    searchParam,
    categoryParam,
    districtParam,
    divisionParam,
    rentalTypeParam,
    availabilityParam,
    minPriceParam,
    maxPriceParam,
    sortByParam,
  ]);

  // Pagination
  const totalItems = filteredEquipment.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.min(Math.max(1, pageParam), totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEquipment = filteredEquipment.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const hasActiveFilters = Boolean(
    searchParam ||
      categoryParam !== "All" ||
      districtParam !== "All Districts" ||
      divisionParam !== "All Divisions" ||
      rentalTypeParam !== "all" ||
      availabilityParam !== "all" ||
      minPriceParam ||
      maxPriceParam
  );

  return (
    <div className="container-haat py-8 lg:py-12">
      {/* Header & Search Bar */}
      <div className="space-y-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Agricultural Equipment Marketplace
          </h1>
          <p className="text-sm text-muted-foreground font-bengali mt-1">
            বাংলাদেশের বিভিন্ন জেলার নির্ভরযোগ্য কৃষি যন্ত্রপাতি খুঁজুন ও সরাসরি ভাড়া নিন।
          </p>
        </div>

        {/* Global Search and Sort Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by equipment name, model or location..."
              defaultValue={searchParam}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParams({ search: (e.target as HTMLInputElement).value });
                }
              }}
              onBlur={(e) => updateParams({ search: e.target.value })}
              className="h-10 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/30"
            />
          </div>

          <div className="flex items-center gap-2.5">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden gap-1.5 text-xs font-semibold"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-brand-leaf" />
              <span>Filters {hasActiveFilters && "•"}</span>
            </Button>

            {/* Sort Dropdown */}
            <select
              value={sortByParam}
              onChange={(e) => updateParams({ sortBy: e.target.value })}
              className="h-10 rounded-xl border border-input bg-card px-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/30"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Equipment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* =========================================================
            DESKTOP & MOBILE SIDEBAR FILTER
           ========================================================= */}
        <aside
          className={`${
            mobileFilterOpen ? "block" : "hidden"
          } lg:block lg:col-span-1 rounded-2xl border border-border bg-card p-5 space-y-6 shadow-xs sticky top-20`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-brand-leaf" />
              <span>Filter Equipment</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs text-brand-leaf hover:underline cursor-pointer font-medium"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Category
            </label>
            <div className="flex flex-col space-y-1.5 text-xs">
              <button
                onClick={() => updateParams({ category: "All" })}
                className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-colors cursor-pointer ${
                  categoryParam === "All"
                    ? "bg-brand-forest text-brand-cream font-bold"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span>All Categories</span>
                <span>{SAMPLE_EQUIPMENTS.length}</span>
              </button>

              {CATEGORIES.map((cat) => {
                const count = SAMPLE_EQUIPMENTS.filter((eq) => eq.category === cat.id).length;
                const active = categoryParam === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => updateParams({ category: cat.id })}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition-colors cursor-pointer ${
                      active
                        ? "bg-brand-forest text-brand-cream font-bold"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* District Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-brand-leaf" />
              <span>District</span>
            </label>
            <select
              value={districtParam}
              onChange={(e) => updateParams({ district: e.target.value })}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/30"
            >
              {BANGLADESH_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Division Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Division
            </label>
            <select
              value={divisionParam}
              onChange={(e) => updateParams({ division: e.target.value })}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/30"
            >
              {BANGLADESH_DIVISIONS.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>

          {/* Rental Type Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Rental Type
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => updateParams({ rentalType: "all" })}
                className={`rounded-lg py-1.5 px-2 border text-center transition-colors cursor-pointer ${
                  rentalTypeParam === "all"
                    ? "border-brand-leaf bg-brand-leaf/10 font-bold text-brand-forest dark:text-brand-fresh"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => updateParams({ rentalType: "per_day" })}
                className={`rounded-lg py-1.5 px-2 border text-center transition-colors cursor-pointer ${
                  rentalTypeParam === "per_day"
                    ? "border-brand-leaf bg-brand-leaf/10 font-bold text-brand-forest dark:text-brand-fresh"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                Per Day
              </button>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Availability
            </label>
            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={availabilityParam === "available_now"}
                onChange={(e) =>
                  updateParams({
                    available: e.target.checked ? "available_now" : "all",
                  })
                }
                className="h-4 w-4 rounded border-input accent-brand-forest"
              />
              <span>Available Now Only</span>
            </label>
          </div>

          {/* Price Range Filter (BDT) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Daily Price (৳ BDT)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ৳"
                value={minPriceParam}
                onChange={(e) => updateParams({ minPrice: e.target.value })}
                className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/30"
              />
              <input
                type="number"
                placeholder="Max ৳"
                value={maxPriceParam}
                onChange={(e) => updateParams({ maxPrice: e.target.value })}
                className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-leaf/30"
              />
            </div>
          </div>

          {/* Apply / Close for mobile */}
          <div className="pt-2 lg:hidden flex gap-2">
            <Button
              variant="brand"
              size="sm"
              className="w-full"
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </aside>

        {/* =========================================================
            EQUIPMENT GRID
           ========================================================= */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">Active filters:</span>
              {searchParam && (
                <Badge variant="outline" className="gap-1 bg-muted">
                  Search: "{searchParam}"
                  <button
                    onClick={() => updateParams({ search: null })}
                    className="hover:text-destructive cursor-pointer ml-1"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {categoryParam !== "All" && (
                <Badge variant="forest" className="gap-1">
                  Category: {categoryParam}
                  <button
                    onClick={() => updateParams({ category: null })}
                    className="hover:opacity-75 cursor-pointer ml-1"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {districtParam !== "All Districts" && (
                <Badge variant="leaf" className="gap-1">
                  District: {districtParam}
                  <button
                    onClick={() => updateParams({ district: null })}
                    className="hover:text-destructive cursor-pointer ml-1"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {availabilityParam === "available_now" && (
                <Badge variant="available" className="gap-1">
                  Available Now
                  <button
                    onClick={() => updateParams({ available: null })}
                    className="hover:text-destructive cursor-pointer ml-1"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-brand-leaf hover:underline cursor-pointer ml-1 font-medium"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Showing count */}
          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span>
              Showing{" "}
              <strong className="text-foreground">{paginatedEquipment.length}</strong> of{" "}
              <strong className="text-foreground">{totalItems}</strong> equipment
            </span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Equipment Cards Grid */}
          {paginatedEquipment.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedEquipment.map((equipment, idx) => (
                <EquipmentCard
                  key={equipment._id}
                  equipment={equipment}
                  priority={idx < 2}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4 bg-card">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <FilterX className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">
                  No Equipment Found
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto font-bengali">
                  আপনার নির্বাচিত ফিল্টারে কোনো যন্ত্রপাতি পাওয়া যায়নি। সার্চ ফিল্টার পরিবর্তন করুন বা ফিল্টার রিসেট করুন।
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                ফিল্টার রিসেট করুন (Reset Filters)
              </Button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => updateParams({ page: String(currentPage - 1) })}
                className="gap-1 text-xs"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateParams({ page: String(pageNum) })}
                      className={`h-9 w-9 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? "bg-brand-forest text-brand-cream"
                          : "border border-border hover:bg-muted text-foreground"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => updateParams({ page: String(currentPage + 1) })}
                className="gap-1 text-xs"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function EquipmentPageSkeleton() {
  return (
    <div className="container-haat py-8 space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Skeleton className="h-96 rounded-2xl" />
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EquipmentPage() {
  return (
    <Suspense fallback={<EquipmentPageSkeleton />}>
      <EquipmentContent />
    </Suspense>
  );
}
