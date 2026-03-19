"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import type { Promotion } from "@/lib/supabase/types";

export default function HotelesClient({
  cms = {},
  promotions = [],
}: {
  cms?: Record<string, string>;
  promotions?: Promotion[];
}) {
  const t = useTranslations("pageHoteles");
  const tc = useTranslations("common");

  const heroImage =
    cms.hoteles_hero_image ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80";
  const heroTag = cms.hoteles_hero_tag || t("heroTag");
  const heroHeading = cms.hoteles_hero_heading || t("heroHeading");

  const [query, setQuery] = useState("");
  const [priceMax, setPriceMax] = useState(() => {
    const max = Math.max(...promotions.map((p) => p.price_usd), 0);
    return Math.ceil(max * 1.1) || 10000;
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, priceMax]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return promotions.filter((p) => {
      if (p.price_usd < priceRange[0] || p.price_usd > priceRange[1]) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.destination.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [promotions, query, priceRange]);

  const filterContent = (
    <div className="space-y-8">
      <div>
        <h4 className="mb-3 font-heading text-lg font-semibold text-text">
          {t("pricePerNight")}
        </h4>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={priceMax}
            step={Math.max(1, Math.round(priceMax / 20))}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-secondary"
          />
          <div className="flex items-center justify-between font-body text-sm text-text-muted">
            <span>{formatPrice(priceRange[0], "USD")}</span>
            <span>{formatPrice(priceRange[1], "USD")}</span>
          </div>
        </div>
      </div>
    </div>
  );

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

      {/* Search bar */}
      <section className="relative z-30 -mt-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass container-custom mx-auto max-w-2xl rounded-2xl p-4 shadow-elevated sm:p-5"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-10 font-body text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-secondary focus:ring-1 focus:ring-secondary"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Results */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <AnimatedSection variant="fade-up">
              <p className="font-body text-sm text-text-muted">
                {t("resultsCount", { count: filtered.length })}
              </p>
            </AnimatedSection>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 font-body text-sm text-text transition-colors hover:bg-background lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {tc("filters")}
            </button>
          </div>

          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-28 rounded-2xl border border-border bg-surface p-6">
                <h3 className="mb-6 font-heading text-xl font-semibold text-text">
                  {tc("filters")}
                </h3>
                {filterContent}
              </div>
            </aside>

            {/* Mobile filter drawer */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="absolute inset-0 bg-black/40"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-surface p-6 shadow-elevated"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-heading text-xl font-semibold text-text">
                      {tc("filters")}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(false)}
                      className="rounded-lg p-2 text-text-muted transition-colors hover:bg-background"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {filterContent}
                </motion.div>
              </div>
            )}

            {/* Hotel grid */}
            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="font-heading text-2xl text-text-muted">
                    {t("noResults")}
                  </p>
                  <p className="mt-2 font-body text-sm text-text-muted">
                    {t("noResultsHint")}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((promo, i) => (
                    <AnimatedSection
                      key={promo.id}
                      variant="fade-up"
                      delay={i * 0.08}
                      className="group"
                    >
                      <div className="hover-lift glass overflow-hidden rounded-2xl">
                        <div className="img-zoom relative aspect-[4/3]">
                          <Image
                            src={promo.image_url ?? "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"}
                            alt={promo.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                          {promo.badge && (
                            <div className="absolute left-3 top-3 z-10 rounded-md bg-accent/90 px-2 py-0.5 backdrop-blur-sm">
                              <span className="font-body text-[10px] font-bold uppercase tracking-widest text-white">
                                {promo.badge}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <div className="mb-1.5 flex items-center gap-1.5 text-text-muted">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="font-body text-xs font-medium uppercase tracking-wider">
                              {promo.destination}
                            </span>
                          </div>
                          <h3 className="mb-2 font-heading text-xl font-semibold text-text transition-colors group-hover:text-primary">
                            {promo.title}
                          </h3>
                          {promo.description && (
                            <p className="mb-4 line-clamp-2 font-body text-sm text-text-muted">
                              {promo.description}
                            </p>
                          )}

                          <div className="flex items-end justify-between">
                            <div>
                              <p className="font-body text-xs text-text-muted">
                                {tc("perNight")}
                              </p>
                              <p className="font-heading text-2xl font-bold text-primary">
                                {formatPrice(promo.price_usd, promo.currency)}
                              </p>
                            </div>
                            <Link
                              href="/contacto"
                              className="rounded-xl bg-accent px-5 py-2.5 font-body text-sm font-semibold text-white transition-all hover:bg-accent-dark hover:shadow-lg active:scale-[0.97]"
                            >
                              {tc("reserve")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
