"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  CalendarDays,
  Clock,
  Car,
  Fuel,
  Gauge,
  Snowflake,
  Navigation,
  Cog,
  Users,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type CarCategory = "economico" | "sedan" | "suv" | "luxury";

const FEATURE_ICONS: Record<string, typeof Car> = {
  AC: Snowflake,
  GPS: Navigation,
  automatico: Cog,
  manual: Cog,
  "4-pasajeros": Users,
  "5-pasajeros": Users,
  "7-pasajeros": Users,
  seguro: ShieldCheck,
  gasolina: Fuel,
  diesel: Fuel,
  bluetooth: Gauge,
};

interface CarListing {
  id: string;
  model: string;
  category: CarCategory;
  price_per_day: number;
  currency: string;
  features: string[];
  image_url: string;
  seats: number;
  transmission: string;
}

const CARS: CarListing[] = [
  {
    id: "c1",
    model: "Nissan March",
    category: "economico",
    price_per_day: 650,
    currency: "MXN",
    features: ["AC", "automatico", "bluetooth", "gasolina"],
    image_url:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&q=80",
    seats: 4,
    transmission: "Automatico",
  },
  {
    id: "c2",
    model: "Toyota Camry",
    category: "sedan",
    price_per_day: 1200,
    currency: "MXN",
    features: ["AC", "GPS", "automatico", "seguro", "bluetooth"],
    image_url:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
    seats: 5,
    transmission: "Automatico",
  },
  {
    id: "c3",
    model: "Jeep Grand Cherokee",
    category: "suv",
    price_per_day: 2200,
    currency: "MXN",
    features: ["AC", "GPS", "automatico", "seguro", "bluetooth"],
    image_url:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    seats: 7,
    transmission: "Automatico",
  },
  {
    id: "c4",
    model: "Mercedes-Benz Clase C",
    category: "luxury",
    price_per_day: 3800,
    currency: "MXN",
    features: ["AC", "GPS", "automatico", "seguro", "bluetooth"],
    image_url:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    seats: 5,
    transmission: "Automatico",
  },
  {
    id: "c5",
    model: "Volkswagen Vento",
    category: "sedan",
    price_per_day: 950,
    currency: "MXN",
    features: ["AC", "automatico", "gasolina", "bluetooth"],
    image_url:
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
    seats: 5,
    transmission: "Automatico",
  },
  {
    id: "c6",
    model: "BMW X5",
    category: "suv",
    price_per_day: 4200,
    currency: "MXN",
    features: ["AC", "GPS", "automatico", "seguro", "bluetooth"],
    image_url:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    seats: 7,
    transmission: "Automatico",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AutosClient({ cms = {} }: { cms?: Record<string, string> }) {
  const t = useTranslations("pageAutos");
  const tc = useTranslations("common");

  const heroImage = cms.autos_hero_image || "https://images.unsplash.com/photo-1449965408869-ebd3fee75e46?w=1920&q=80";
  const heroTag = cms.autos_hero_tag || t("heroTag");
  const heroHeading = cms.autos_hero_heading || t("heroHeading");

  const categoryLabels: Record<CarCategory, string> = {
    economico: t("categoryEconomy"),
    sedan: t("categorySedan"),
    suv: t("categorySuv"),
    luxury: t("categoryLuxury"),
  };

  const featureLabels: Record<string, string> = {
    AC: t("featureAC"),
    GPS: "GPS",
    automatico: t("featureAutomatic"),
    manual: t("featureManual"),
    "4-pasajeros": t("feature4Passengers"),
    "5-pasajeros": t("feature5Passengers"),
    "7-pasajeros": t("feature7Passengers"),
    seguro: t("featureInsurance"),
    gasolina: t("featureGas"),
    diesel: t("featureDiesel"),
    bluetooth: "Bluetooth",
  };

  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | "">("");

  const filteredCars = useMemo(() => {
    return CARS.filter((car) => {
      if (selectedCategory && car.category !== selectedCategory) return false;
      if (pickupLocation) {
        const q = pickupLocation.toLowerCase();
        if (!car.model.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [selectedCategory, pickupLocation]);

  function getCategoryColor(cat: CarCategory) {
    const map: Record<CarCategory, string> = {
      economico: "bg-success/10 text-success border-success/20",
      sedan: "bg-secondary/10 text-secondary border-secondary/20",
      suv: "bg-warning/10 text-warning border-warning/20",
      luxury: "bg-accent/10 text-accent border-accent/20",
    };
    return map[cat];
  }

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={t("heroAlt")}
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-20 px-4 text-center"
        >
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
            {heroTag}
          </p>
          <h1 className="font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
            {heroHeading}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base text-white/80 sm:text-lg">
            {t("heroDescription")}
          </p>
        </motion.div>
      </section>

      {/* Search form */}
      <section className="relative z-30 -mt-10 px-4">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={(e) => e.preventDefault()}
          className="glass container-custom mx-auto max-w-5xl rounded-2xl p-4 shadow-elevated sm:p-6"
          aria-label={t("searchAria")}
        >
          {/* Pickup row */}
          <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
            {t("pickup")}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder={t("pickupPlaceholder")}
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                aria-label={t("pickupDateAria")}
              />
            </div>
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                aria-label={t("pickupTimeAria")}
              />
            </div>
          </div>

          {/* Dropoff row */}
          <p className="mb-2 mt-4 font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
            {t("dropoff")}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder={t("dropoffPlaceholder")}
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                aria-label={t("dropoffDateAria")}
              />
            </div>
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="time"
                value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                aria-label={t("dropoffTimeAria")}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-10 font-body text-sm font-semibold text-white shadow-lg transition-all hover:bg-accent-dark hover:shadow-xl active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              {t("searchButton")}
            </button>
          </div>
        </motion.form>
      </section>

      {/* Results */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          {/* Category filters */}
          <AnimatedSection variant="fade-up" className="mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <p className="mr-2 font-body text-sm text-text-muted">
                {t("resultsCount", { count: filteredCars.length })}
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className={cn(
                  "rounded-full border px-4 py-1.5 font-body text-sm transition-colors",
                  selectedCategory === ""
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-border bg-surface text-text-muted hover:border-secondary/40"
                )}
              >
                {tc("all")}
              </button>
              {(
                Object.entries(categoryLabels) as [CarCategory, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(selectedCategory === key ? "" : key)
                  }
                  className={cn(
                    "rounded-full border px-4 py-1.5 font-body text-sm transition-colors",
                    selectedCategory === key
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-border bg-surface text-text-muted hover:border-secondary/40"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Cars grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car, i) => (
              <AnimatedSection
                key={car.id}
                variant="fade-up"
                delay={i * 0.08}
                className="group"
              >
                <div className="hover-lift glass flex h-full flex-col overflow-hidden rounded-2xl">
                  {/* Image */}
                  <div className="img-zoom relative aspect-[16/10] bg-background">
                    <Image
                      src={car.image_url}
                      alt={car.model}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute left-3 top-3 z-10">
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 font-body text-xs font-semibold backdrop-blur-sm",
                          getCategoryColor(car.category)
                        )}
                      >
                        {categoryLabels[car.category]}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 font-heading text-xl font-semibold text-text transition-colors group-hover:text-primary">
                      {car.model}
                    </h3>

                    {/* Specs */}
                    <div className="mb-4 flex items-center gap-4 text-text-muted">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span className="font-body text-xs">{car.seats} {tc("seats")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Cog className="h-3.5 w-3.5" />
                        <span className="font-body text-xs">{car.transmission}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {car.features.map((key) => {
                        const Icon = FEATURE_ICONS[key];
                        const label = featureLabels[key];
                        if (!Icon || !label) return null;
                        return (
                          <span
                            key={key}
                            className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 font-body text-xs text-text-muted"
                          >
                            <Icon className="h-3 w-3" />
                            {label}
                          </span>
                        );
                      })}
                    </div>

                    {/* Price & CTA */}
                    <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
                      <div>
                        <p className="font-body text-xs text-text-muted">
                          {tc("perDay")}
                        </p>
                        <p className="font-heading text-2xl font-bold text-primary">
                          {formatPrice(car.price_per_day, car.currency)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rounded-xl bg-accent px-5 py-2.5 font-body text-sm font-semibold text-white transition-all hover:bg-accent-dark hover:shadow-lg active:scale-[0.97]"
                      >
                        {tc("rent")}
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-heading text-2xl text-text-muted">
                {t("noResults")}
              </p>
              <p className="mt-2 font-body text-sm text-text-muted">
                {t("noResultsHint")}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
