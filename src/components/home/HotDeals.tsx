"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { formatPrice } from "@/lib/utils/format";
import { promotions as mockPromotions } from "@/lib/data/mock-data";
import type { Promotion } from "@/lib/supabase/types";
import { useTranslations } from "next-intl";

type HotDealsProps = {
  content?: Record<string, string>;
  promotions?: Promotion[];
};

export default function HotDeals({ content = {}, promotions }: HotDealsProps) {
  const t = useTranslations("hotDeals");
  const tc = useTranslations("common");
  const tag = content.hotdeals_tag || t("defaultTag");
  const heading = content.hotdeals_heading || t("defaultHeading");
  const priceLabel = content.hotdeals_price_label || t("defaultPriceLabel");

  const items = promotions && promotions.length > 0 ? promotions : mockPromotions;

  return (
    <section className="section-padding aurora-section" aria-labelledby="hot-deals-heading">
      <div className="container-custom">
        <AnimatedSection variant="fade-up" className="mb-14 text-center">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {tag}
          </p>
          <h2 id="hot-deals-heading" className="font-heading text-text">
            {heading.includes(t("gradientWord")) ? (
              <>
                {heading.split(t("gradientWord"))[0]}
                <span className="text-gradient">{t("gradientWord")}</span>
              </>
            ) : (
              heading
            )}
          </h2>
          <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((promo, index) => (
            <AnimatedSection key={promo.id} variant="fade-up" delay={index * 0.1} className="group">
              <Link
                href="/paquetes"
                className="hover-lift glass block cursor-pointer overflow-hidden rounded-2xl"
                aria-label={t("viewDetailsAria", { title: promo.title })}
              >
                <div className="img-zoom relative aspect-[4/3]">
                  <Image
                    src={promo.image_url ?? ""}
                    alt={`${promo.title} — ${promo.destination}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                  {promo.badge && (
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-white shadow-md">
                      {promo.badge}
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 right-4 z-10 text-right">
                    <p className="font-heading text-2xl font-bold text-white">
                      {formatPrice(promo.price_usd, promo.currency)}
                    </p>
                    <p className="font-body text-xs font-medium text-white/70">
                      {priceLabel}
                    </p>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="mb-2 flex items-center gap-1.5 text-text-muted">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="font-body text-xs font-medium uppercase tracking-wider">
                      {promo.destination}
                    </span>
                  </div>
                  <h3 className="mb-2 font-heading text-xl font-semibold text-text transition-colors group-hover:text-primary">
                    {promo.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 font-body text-sm leading-relaxed text-text-muted">
                    {promo.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-primary transition-colors group-hover:text-secondary">
                    {tc("viewDetails")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
