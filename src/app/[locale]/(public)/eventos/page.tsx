import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Heart,
  Gem,
  Sparkles,
  Building2,
  CalendarHeart,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { getMegatravelDestUrl } from "@/lib/utils/megatravel";
import { getContentByCategory } from "@/lib/cms/content";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from "@/lib/utils/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageEventos" });
  return buildPageMetadata(locale, "/eventos", t("metaTitle"), t("metaDescription"));
}

export default async function EventosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pageEventos");

  const EVENT_TYPES = [
    {
      icon: Heart,
      title: t("event1Title"),
      description: t("event1Desc"),
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      features: [t("event1Feature1"), t("event1Feature2"), t("event1Feature3")],
    },
    {
      icon: Gem,
      title: t("event2Title"),
      description: t("event2Desc"),
      image:
        "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
      features: [t("event2Feature1"), t("event2Feature2"), t("event2Feature3")],
    },
    {
      icon: Sparkles,
      title: t("event3Title"),
      description: t("event3Desc"),
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      features: [t("event3Feature1"), t("event3Feature2"), t("event3Feature3")],
    },
    {
      icon: Building2,
      title: t("event4Title"),
      description: t("event4Desc"),
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      features: [t("event4Feature1"), t("event4Feature2"), t("event4Feature3")],
    },
  ];

  const cms = await getContentByCategory("page_eventos", locale);
  const heroImage = cms.eventos_hero_image || "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&q=80";
  const heroTag = cms.eventos_hero_tag || t("heroTag");
  const heroHeading = cms.eventos_hero_heading || t("heroHeading");
  const megatravelUrl = cms.eventos_megatravel_url || getMegatravelDestUrl(12);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: BASE_URL },
    { name: t("metaTitle"), url: `${BASE_URL}${locale === "es" ? "/eventos" : `/${locale}/eventos`}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
              <CalendarHeart className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                {heroTag}
              </span>
            </div>
            <h1 className="mb-4 font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
              {heroHeading}
            </h1>
            <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-white/85">
              {t("heroDescription")}
            </p>
          </AnimatedSection>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Event Types */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t("servicesTag")}
            </p>
            <h2 className="font-heading text-text">
              {t("servicesHeading1")}
              <span className="text-gradient">{t("servicesHeading2")}</span>
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </AnimatedSection>

          <div className="space-y-16">
            {EVENT_TYPES.map((event, index) => {
              const isReversed = index % 2 !== 0;
              return (
                <AnimatedSection
                  key={event.title}
                  variant="fade-up"
                  delay={0.1}
                >
                  <div
                    className={cn(
                      "grid items-center gap-8 lg:grid-cols-2 lg:gap-14",
                      isReversed && "lg:[direction:rtl]"
                    )}
                  >
                    {/* Image */}
                    <div className="img-zoom overflow-hidden rounded-2xl lg:[direction:ltr]">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={event.image}
                          alt={t("eventAlt", { title: event.title })}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                        <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur-sm">
                          <event.icon
                            className="h-6 w-6 text-accent"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:[direction:ltr]">
                      <h3 className="mb-4 font-heading text-3xl font-semibold text-text md:text-4xl">
                        {event.title}
                      </h3>
                      <p className="mb-6 font-body leading-relaxed text-text-muted">
                        {event.description}
                      </p>

                      <ul className="mb-8 space-y-2">
                        {event.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 font-body text-sm text-text"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href="/contacto"
                        className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 font-body text-sm font-semibold text-white shadow-card transition-colors duration-300 hover:bg-primary-light"
                      >
                        {t("planButton", { title: event.title })}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Megatravel — Upcoming Events & Deals */}
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
              id="megatravel-iframe"
              src={megatravelUrl}
              loading="lazy"
              title={t("megatravelIframeTitle")}
              className="w-full border-0"
              style={{ height: "1200px" }}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <Image
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80"
          alt={t("ctaAlt")}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/80" />

        <div className="container-custom relative z-10 text-center">
          <AnimatedSection variant="fade-up">
            <CalendarHeart
              className="mx-auto mb-4 h-10 w-10 text-accent"
              aria-hidden="true"
            />
            <h2 className="mb-4 font-heading text-4xl font-bold text-white md:text-5xl">
              {t("ctaHeading")}
            </h2>
            <p className="mx-auto mb-8 max-w-xl font-body text-lg text-white/80">
              {t("ctaDescription")}
            </p>
            <Link
              href="/contacto"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-body font-semibold text-white shadow-lg transition-all duration-200 hover:bg-accent-dark hover:shadow-xl"
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
