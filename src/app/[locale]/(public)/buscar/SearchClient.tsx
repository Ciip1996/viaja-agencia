"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Clock,
  ArrowRight,
  Loader2,
  Hotel,
  Package,
  SlidersHorizontal,
  X,
  Wifi,
  Waves,
  Sparkles,
  UtensilsCrossed,
  Dumbbell,
  Wine,
  Eye,
  Coffee,
  Briefcase,
  Palmtree,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";

type Tab = "all" | "packages" | "hotels";

interface PackageResult {
  id: string;
  title: string;
  description: string | null;
  destination: string;
  region: string;
  price_usd: number;
  duration_days: number;
  difficulty: string | null;
  includes: string | null;
  image_url: string | null;
  is_featured: boolean;
}

interface HotelResult {
  id: string;
  name: string;
  location: string;
  price: number;
  currency: string;
  rating: number;
  imageUrl: string;
  amenities: string[];
  provider: string;
}

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  wifi: Wifi,
  pool: Waves,
  spa: Sparkles,
  restaurant: UtensilsCrossed,
  gym: Dumbbell,
  bar: Wine,
  "ocean-view": Eye,
  breakfast: Coffee,
  concierge: Briefcase,
  beach: Palmtree,
  "all-inclusive": Star,
  garden: Palmtree,
};

const DESTINATIONS = [
  "Europa", "Asia", "Medio Oriente", "Africa", "Sudamérica",
  "Centroamérica", "Caribe", "Estados Unidos", "Canadá", "México",
  "Pacífico", "Cruceros",
];

const DESTINATIONS_EN = [
  "Europe", "Asia", "Middle East", "Africa", "South America",
  "Central America", "Caribbean", "United States", "Canada", "Mexico",
  "Pacific", "Cruises",
];

export default function SearchClient() {
  const t = useTranslations("pageSearch");
  const tc = useTranslations("common");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const destinations = locale === "en" ? DESTINATIONS_EN : DESTINATIONS;

  const [destination, setDestination] = useState(searchParams.get("destination") || "");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [travelers, setTravelers] = useState(parseInt(searchParams.get("travelers") || "2"));

  const [packages, setPackages] = useState<PackageResult[]>([]);
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        destination,
        checkIn,
        checkOut,
        travelers: String(travelers),
        locale,
      });
      const res = await fetch(`/api/search?${qs}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setPackages(data.packages ?? []);
      setHotels(data.hotels ?? []);
      setSearched(true);
    } catch {
      setPackages([]);
      setHotels([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, [destination, checkIn, checkOut, travelers, locale]);

  useEffect(() => {
    if (destination || checkIn) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalResults = packages.length + hotels.length;
  const showPackages = activeTab === "all" || activeTab === "packages";
  const showHotels = activeTab === "all" || activeTab === "hotels";

  return (
    <>
      {/* Search form */}
      <section className="relative z-30 -mt-8 px-4">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="glass container-custom mx-auto max-w-5xl rounded-2xl p-4 shadow-elevated sm:p-6"
          aria-label={t("searchAria")}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto]">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
              >
                <option value="">{t("anyDestination")}</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                aria-label={t("checkInLabel")}
              />
            </div>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                aria-label={t("checkOutLabel")}
              />
            </div>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="number"
                min={1}
                max={20}
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                aria-label={t("travelersLabel")}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-8 font-body text-sm font-semibold text-white shadow-lg transition-all hover:bg-accent-dark hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {tc("search")}
            </button>
          </div>
        </motion.form>
      </section>

      {/* Results */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          {/* Header + Tabs */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {searched && !loading && (
                <p className="font-body text-sm text-text-muted">
                  {t("resultsCount", { count: totalResults })}
                </p>
              )}

              {/* Mobile filter toggle */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 font-body text-xs text-text transition-colors hover:bg-background sm:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {tc("filters")}
              </button>
            </div>

            {/* Tabs */}
            {searched && !loading && totalResults > 0 && (
              <div className="flex gap-1 rounded-xl bg-surface p-1 border border-border">
                {(["all", "packages", "hotels"] as Tab[]).map((tab) => {
                  const count =
                    tab === "all" ? totalResults :
                    tab === "packages" ? packages.length : hotels.length;
                  if (tab !== "all" && count === 0) return null;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-4 py-2 font-body text-sm transition-all",
                        activeTab === tab
                          ? "bg-primary text-white shadow-sm"
                          : "text-text-muted hover:text-text"
                      )}
                    >
                      {tab === "all" && t("tabAll")}
                      {tab === "packages" && (
                        <>
                          <Package className="h-3.5 w-3.5" />
                          {t("tabPackages")}
                        </>
                      )}
                      {tab === "hotels" && (
                        <>
                          <Hotel className="h-3.5 w-3.5" />
                          {t("tabHotels")}
                        </>
                      )}
                      <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface">
                  <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-3 p-5">
                    <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="flex items-end justify-between pt-2">
                      <div className="h-7 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-10 w-24 rounded-xl bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {searched && !loading && totalResults === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <Search className="mx-auto mb-4 h-12 w-12 text-text-muted/40" />
              <p className="font-heading text-2xl text-text-muted">{t("noResults")}</p>
              <p className="mt-2 font-body text-sm text-text-muted">{t("noResultsHint")}</p>
            </motion.div>
          )}

          {/* Not searched yet */}
          {!searched && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <Search className="mx-auto mb-4 h-12 w-12 text-text-muted/30" />
              <p className="font-heading text-2xl text-text">{t("startSearch")}</p>
              <p className="mt-2 font-body text-sm text-text-muted">{t("startSearchHint")}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!loading && searched && totalResults > 0 && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* Packages */}
                {showPackages && packages.length > 0 && (
                  <div className="mb-12">
                    {activeTab === "all" && (
                      <div className="mb-6 flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <h2 className="font-heading text-2xl font-semibold text-text">
                          {t("packagesTitle")}
                        </h2>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-body text-xs font-semibold text-primary">
                          {packages.length}
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {packages.map((pkg, i) => (
                        <AnimatedSection key={pkg.id} variant="fade-up" delay={i * 0.06} className="group">
                          <div className="hover-lift glass overflow-hidden rounded-2xl h-full flex flex-col">
                            <div className="img-zoom relative aspect-[4/3]">
                              <Image
                                src={pkg.image_url || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80"}
                                alt={pkg.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                              />
                              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                              {pkg.is_featured && (
                                <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-white shadow-md">
                                  {t("featured")}
                                </span>
                              )}
                              <span className="absolute right-3 top-3 z-10 rounded-full bg-primary/90 px-2.5 py-1 font-body text-xs font-semibold text-white backdrop-blur-sm">
                                <Package className="mr-1 inline h-3 w-3" />
                                {t("packageBadge")}
                              </span>
                            </div>
                            <div className="flex flex-1 flex-col justify-between p-5">
                              <div>
                                <div className="mb-1.5 flex items-center gap-3 text-text-muted">
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span className="font-body text-xs font-medium uppercase tracking-wider">
                                      {pkg.destination}
                                    </span>
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span className="font-body text-xs font-medium">
                                      {t("durationDays", { days: pkg.duration_days })}
                                    </span>
                                  </span>
                                </div>
                                <h3 className="mb-2 font-heading text-xl font-semibold text-text transition-colors group-hover:text-primary">
                                  {pkg.title}
                                </h3>
                                {pkg.description && (
                                  <p className="mb-4 line-clamp-2 font-body text-sm text-text-muted">
                                    {pkg.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-end justify-between">
                                <div>
                                  <p className="font-body text-xs text-text-muted">{tc("from")}</p>
                                  <p className="font-heading text-2xl font-bold text-primary">
                                    {formatPrice(pkg.price_usd, "USD")}
                                  </p>
                                  <p className="font-body text-xs text-text-light">{tc("perPerson")}</p>
                                </div>
                                <Link
                                  href="/contacto"
                                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-body text-sm font-semibold text-white transition-all hover:bg-accent-dark hover:shadow-lg active:scale-[0.97]"
                                >
                                  {tc("consult")}
                                  <ArrowRight className="h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </AnimatedSection>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hotels */}
                {showHotels && hotels.length > 0 && (
                  <div>
                    {activeTab === "all" && (
                      <div className="mb-6 flex items-center gap-2">
                        <Hotel className="h-5 w-5 text-secondary" />
                        <h2 className="font-heading text-2xl font-semibold text-text">
                          {t("hotelsTitle")}
                        </h2>
                        <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 font-body text-xs font-semibold text-secondary">
                          {hotels.length}
                        </span>
                        <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Bedsonline
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {hotels.map((hotel, i) => (
                        <AnimatedSection key={hotel.id} variant="fade-up" delay={i * 0.06} className="group">
                          <div className="hover-lift glass overflow-hidden rounded-2xl h-full flex flex-col">
                            <div className="img-zoom relative aspect-[4/3]">
                              <Image
                                src={hotel.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"}
                                alt={hotel.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";
                                }}
                              />
                              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                              <div className="absolute bottom-3 right-3 z-10 rounded-lg bg-white/90 px-2.5 py-1 backdrop-blur-sm">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                                  <span className="font-body text-sm font-bold text-text">
                                    {hotel.rating}
                                  </span>
                                </div>
                              </div>
                              <span className="absolute right-3 top-3 z-10 rounded-full bg-secondary/90 px-2.5 py-1 font-body text-xs font-semibold text-white backdrop-blur-sm">
                                <Hotel className="mr-1 inline h-3 w-3" />
                                Hotel
                              </span>
                            </div>
                            <div className="flex flex-1 flex-col justify-between p-5">
                              <div>
                                <div className="mb-1.5 flex items-center gap-1.5 text-text-muted">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span className="font-body text-xs font-medium uppercase tracking-wider">
                                    {hotel.location}
                                  </span>
                                </div>
                                <h3 className="mb-3 font-heading text-xl font-semibold text-text transition-colors group-hover:text-primary">
                                  {hotel.name}
                                </h3>
                                <div className="mb-4 flex flex-wrap gap-1.5">
                                  {hotel.amenities.slice(0, 4).map((key) => {
                                    const Icon = AMENITY_ICONS[key];
                                    if (!Icon) return null;
                                    return (
                                      <span
                                        key={key}
                                        className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 font-body text-xs text-text-muted"
                                      >
                                        <Icon className="h-3 w-3" />
                                        {key}
                                      </span>
                                    );
                                  })}
                                  {hotel.amenities.length > 4 && (
                                    <span className="inline-flex items-center rounded-full bg-background px-2.5 py-1 font-body text-xs text-text-muted">
                                      +{hotel.amenities.length - 4}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-end justify-between">
                                <div>
                                  <p className="font-body text-xs text-text-muted">{tc("from")}</p>
                                  <p className="font-heading text-2xl font-bold text-primary">
                                    {formatPrice(hotel.price, hotel.currency)}
                                  </p>
                                  <p className="font-body text-xs text-text-light">{tc("perNight")}</p>
                                </div>
                                <Link
                                  href="/contacto"
                                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-body text-sm font-semibold text-white transition-all hover:bg-accent-dark hover:shadow-lg active:scale-[0.97]"
                                >
                                  {tc("consult")}
                                  <ArrowRight className="h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </AnimatedSection>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-surface p-6 shadow-elevated"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-heading text-xl font-semibold text-text">{tc("filters")}</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-2 text-text-muted transition-colors hover:bg-background"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {(["all", "packages", "hotels"] as Tab[]).map((tab) => {
                const count =
                  tab === "all" ? totalResults :
                  tab === "packages" ? packages.length : hotels.length;
                if (tab !== "all" && count === 0) return null;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileFiltersOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-4 py-3 font-body text-sm transition-all",
                      activeTab === tab
                        ? "bg-primary text-white"
                        : "bg-background text-text hover:bg-background/80"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {tab === "all" && t("tabAll")}
                      {tab === "packages" && <><Package className="h-4 w-4" />{t("tabPackages")}</>}
                      {tab === "hotels" && <><Hotel className="h-4 w-4" />{t("tabHotels")}</>}
                    </span>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
