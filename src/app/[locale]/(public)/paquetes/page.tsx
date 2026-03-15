import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { MapPin, Clock, ArrowRight, Sparkles, Tag } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { promotions as mockPromotions } from "@/lib/data/mock-data";
import { formatPrice } from "@/lib/utils/format";
import { getContentByCategory } from "@/lib/cms/content";
import { getMegatravelOfertasUrl } from "@/lib/utils/megatravel";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pagePaquetes" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const DURATION_MAP: Record<string, string> = {
  Grecia: "8 días / 7 noches",
  Italia: "7 días / 6 noches",
  París: "8 días / 7 noches",
  Maldivas: "7 días / 6 noches",
  Marruecos: "8 días / 7 noches",
  Japón: "10 días / 9 noches",
};

async function getPromotions(locale: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("promotions").select("*").eq("is_active", true).eq("locale", locale).order("created_at", { ascending: false });
    return data && data.length > 0 ? data : null;
  } catch { return null; }
}

export default async function PaquetesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pagePaquetes");
  const tc = await getTranslations("common");

  const [cms, dbPromos] = await Promise.all([
    getContentByCategory("page_paquetes", locale),
    getPromotions(locale),
  ]);
  const heroImage = cms.paquetes_hero_image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80";
  const heroTag = cms.paquetes_hero_tag || t("heroTag");
  const heroHeading = cms.paquetes_hero_heading || t("heroHeading");
  const heroDescription = cms.paquetes_hero_description || t("heroDescription");
  const megatravelUrl = cms.paquetes_megatravel_url || getMegatravelOfertasUrl();
  const promotions = dbPromos ?? mockPromotions;
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src={heroImage}
          alt={t("heroAlt")}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-black/60" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <AnimatedSection variant="fade-up">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                {heroTag}
              </span>
            </div>
            <h1 className="mb-4 font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
              {heroHeading}
            </h1>
            <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-white/85">
              {heroDescription}
            </p>
          </AnimatedSection>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Promotions */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t("offersTag")}
            </p>
            <h2 className="font-heading text-text">
              {t("offersHeading1")}
              <span className="text-gradient">{t("offersHeading2")}</span>
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {promotions.map((promo, index) => (
              <AnimatedSection
                key={promo.id}
                variant="fade-up"
                delay={index * 0.1}
                className="group"
              >
                <div className="hover-lift glass overflow-hidden rounded-2xl">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="img-zoom relative aspect-[4/3] md:aspect-auto md:w-[45%]">
                      <Image
                        src={promo.image_url ?? ""}
                        alt={`${promo.title} — ${promo.destination}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="object-cover"
                      />

                      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />

                      {promo.badge && (
                        <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-white shadow-md">
                          {promo.badge}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 text-text-muted">
                            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="font-body text-xs font-medium uppercase tracking-wider">
                              {promo.destination}
                            </span>
                          </span>
                          {DURATION_MAP[promo.destination] && (
                            <span className="inline-flex items-center gap-1.5 text-text-muted">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="font-body text-xs font-medium uppercase tracking-wider">
                                {DURATION_MAP[promo.destination]}
                              </span>
                            </span>
                          )}
                        </div>

                        <h3 className="mb-3 font-heading text-2xl font-semibold text-text transition-colors group-hover:text-primary">
                          {promo.title}
                        </h3>

                        <p className="mb-5 line-clamp-3 font-body text-sm leading-relaxed text-text-muted">
                          {promo.description}
                        </p>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="font-body text-xs font-medium text-text-muted">
                            {tc("from")}
                          </p>
                          <p className="font-heading text-3xl font-bold text-primary">
                            {formatPrice(promo.price_usd, promo.currency)}
                          </p>
                          <p className="font-body text-xs text-text-light">
                            {tc("perPerson")}
                          </p>
                        </div>

                        <Link
                          href="/contacto"
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-6 py-3 font-body text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-accent-dark hover:shadow-lg"
                        >
                          {tc("consult")}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Megatravel — Ofertas HOT */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-10 text-center">
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t("megatravelTag")}
            </p>
            <h2 className="font-heading text-text">
              {t("megatravelHeading1")}
              <span className="text-gradient">{t("megatravelHeading2")}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-text-muted">
              {t("megatravelDescription")}
            </p>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </AnimatedSection>

          <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
            <iframe
              id="megatravel-ofertas-iframe"
              src={megatravelUrl}
              loading="lazy"
              title={t("megatravelIframeTitle")}
              className="w-full border-0"
              style={{ height: "1200px" }}
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding aurora-bg">
        <div className="container-custom text-center">
          <AnimatedSection variant="fade-up">
            <Tag className="mx-auto mb-4 h-10 w-10 text-accent" aria-hidden="true" />
            <h2 className="mb-4 font-heading text-text">
              {t("ctaHeading1")}
              <span className="text-gradient">{t("ctaHeading2")}</span>?
            </h2>
            <p className="mx-auto mb-8 max-w-xl font-body text-lg text-text-muted">
              {t("ctaDescription")}
            </p>
            <Link
              href="/contacto"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-body font-semibold text-white shadow-card transition-colors duration-300 hover:bg-primary-light"
            >
              {t("ctaButton")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
