import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  Shield,
  Award,
  Heart,
  Handshake,
  ArrowRight,
  MapPin,
  Users,
  Clock,
  Plane,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { getContentByCategory, parseJson } from "@/lib/cms/content";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata, buildAboutPageJsonLd, buildBreadcrumbJsonLd, BASE_URL } from "@/lib/utils/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageNosotros" });
  return buildPageMetadata(locale, "/nosotros", t("metaTitle"), t("metaDescription"));
}

export default async function NosotrosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pageNosotros");

  const VALUES = [
    {
      icon: Shield,
      title: t("value1Title"),
      description: t("value1Desc"),
    },
    {
      icon: Award,
      title: t("value2Title"),
      description: t("value2Desc"),
    },
    {
      icon: Heart,
      title: t("value3Title"),
      description: t("value3Desc"),
    },
    {
      icon: Handshake,
      title: t("value4Title"),
      description: t("value4Desc"),
    },
  ];

  const STATS = [
    { value: "20+", label: t("stat1Label"), icon: Clock },
    { value: "10,000+", label: t("stat2Label"), icon: Users },
    { value: "50+", label: t("stat3Label"), icon: MapPin },
    { value: "500+", label: t("stat4Label"), icon: Plane },
  ];

  const TEAM_MEMBERS = [
    {
      name: t("team1Name"),
      role: t("team1Role"),
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80",
    },
    {
      name: t("team2Name"),
      role: t("team2Role"),
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80",
    },
    {
      name: t("team3Name"),
      role: t("team3Role"),
      image:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80",
    },
  ];

  const cms = await getContentByCategory("page_nosotros", locale);
  const heroImage = cms.nosotros_hero_image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80";
  const heroTag = cms.nosotros_hero_tag || t("heroTag");
  const heroHeading = cms.nosotros_hero_heading || t("heroHeading");
  const cmsStats = parseJson<{ value: string; label: string }[]>(cms.nosotros_stats, []);

  const aboutJsonLd = buildAboutPageJsonLd(locale as "es" | "en");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: BASE_URL },
    { name: t("metaTitle"), url: `${BASE_URL}${locale === "es" ? "/nosotros" : `/${locale}/nosotros`}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
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
            <span className="mb-4 inline-block font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
              {heroTag}
            </span>
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

      {/* Story */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <AnimatedSection variant="slide-left">
              <span className="mb-3 inline-block font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                {t("storyTag")}
              </span>
              <h2 className="mb-6 font-heading text-text">
                {t("storyHeading1")}
                <span className="text-gradient">{t("storyHeading2")}</span>
              </h2>
              <div className="space-y-4 font-body text-text-muted leading-relaxed">
                <p>
                  {t("storyParagraph1", { city: t("storyCity") })}
                </p>
                <p>
                  <strong className="text-text">{t("storyParagraph2Start")}</strong>{" "}
                  {t("storyParagraph2End")}
                </p>
                <p>
                  {t("storyParagraph3")}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="slide-right">
              <div className="relative">
                <div className="img-zoom overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
                    alt={t("storyImageAlt")}
                    width={640}
                    height={480}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 z-10 rounded-xl bg-primary p-5 shadow-elevated">
                  <p className="font-heading text-4xl font-bold text-white">{t("storyBadgeYears")}</p>
                  <p className="font-body text-sm text-white/80">
                    {t("storyBadgeText")}
                  </p>
                </div>
                <div className="absolute -right-4 -top-4 z-10 rounded-xl bg-accent p-4 shadow-elevated">
                  <Award className="h-8 w-8 text-white" aria-hidden="true" />
                  <p className="mt-1 font-body text-xs font-semibold text-white">
                    {t("storyBadgeIata")}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {(cmsStats.length > 0 ? STATS.map((s, i) => ({ ...s, value: cmsStats[i]?.value ?? s.value, label: cmsStats[i]?.label ?? s.label })) : STATS).map((stat, index) => (
              <AnimatedSection
                key={stat.label}
                variant="fade-up"
                delay={index * 0.1}
                className="text-center"
              >
                <stat.icon
                  className="mx-auto mb-3 h-8 w-8 text-accent"
                  aria-hidden="true"
                />
                <p className="font-heading text-4xl font-bold text-white md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-1 font-body text-sm text-white/70">
                  {stat.label}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding aurora-bg">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t("valuesTag")}
            </p>
            <h2 className="font-heading text-text">
              {t("valuesHeading1")}
              <span className="text-gradient">{t("valuesHeading2")}</span>
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => (
              <AnimatedSection
                key={value.title}
                variant="fade-up"
                delay={index * 0.1}
              >
                <div
                  className={cn(
                    "hover-lift glass cursor-default rounded-2xl p-8 text-center",
                    "transition-all duration-300"
                  )}
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <value.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-semibold text-text">
                    {value.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-text-muted">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t("teamTag")}
            </p>
            <h2 className="font-heading text-text">
              {t("teamHeading1")}
              <span className="text-gradient">{t("teamHeading2")}</span>
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member, index) => (
              <AnimatedSection
                key={member.name}
                variant="scale-in"
                delay={index * 0.1}
              >
                <div className="hover-lift glass overflow-hidden rounded-2xl">
                  <div className="img-zoom relative aspect-[4/3]">
                    <Image
                      src={member.image}
                      alt={`${member.name} — ${member.role}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-heading text-xl font-semibold text-text">
                      {member.name}
                    </h3>
                    <p className="mt-1 font-body text-sm text-text-muted">
                      {member.role}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding aurora-bg">
        <div className="container-custom text-center">
          <AnimatedSection variant="fade-up">
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
