import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  Users,
  ArrowRight,
  Wallet,
  ShieldCheck,
  CalendarCheck,
  PartyPopper,
  MapPin,
  Clock,
} from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { getContentByCategory } from "@/lib/cms/content";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { GroupTrip } from "@/lib/supabase/types";

async function getGroupTrips(locale: string): Promise<GroupTrip[] | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("group_trips")
      .select("*")
      .eq("is_active", true)
      .eq("locale", locale)
      .order("departure_date", { ascending: true });
    return data && data.length > 0 ? (data as GroupTrip[]) : null;
  } catch {
    return null;
  }
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageGrupos" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const BENEFIT_ICONS = [Wallet, ShieldCheck, CalendarCheck, PartyPopper];

export default async function GruposPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pageGrupos");
  const tc = await getTranslations("common");

  const GROUP_TRIPS = [
    {
      id: "g1",
      title: t("trip1Title"),
      destination: t("trip1Destination"),
      image:
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
      price: 5800,
      duration: t("trip1Duration"),
      spots: t("trip1Spots"),
    },
    {
      id: "g2",
      title: t("trip2Title"),
      destination: t("trip2Destination"),
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
      price: 6200,
      duration: t("trip2Duration"),
      spots: t("trip2Spots"),
    },
    {
      id: "g3",
      title: t("trip3Title"),
      destination: t("trip3Destination"),
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
      price: 7500,
      duration: t("trip3Duration"),
      spots: t("trip3Spots"),
    },
    {
      id: "g4",
      title: t("trip4Title"),
      destination: t("trip4Destination"),
      image:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
      price: 6800,
      duration: t("trip4Duration"),
      spots: t("trip4Spots"),
    },
  ];

  const dbTrips = await getGroupTrips(locale);

  const trips = dbTrips
    ? dbTrips.map((trip) => {
        const dep = new Date(trip.departure_date);
        const ret = new Date(trip.return_date);
        const days = Math.max(1, Math.round((ret.getTime() - dep.getTime()) / 86_400_000));
        const remaining = Math.max(0, (trip.max_travelers ?? 0) - (trip.current_travelers ?? 0));
        return {
          id: String(trip.id),
          title: trip.title,
          destination: trip.destination,
          image: trip.image_url ?? "",
          price: trip.price_usd,
          duration: `${days}d`,
          spots: `${remaining} spots`,
        };
      })
    : GROUP_TRIPS;

  const cms = await getContentByCategory("page_grupos", locale);
  const heroImage = cms.grupos_hero_image || "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1920&q=80";
  const heroTag = cms.grupos_hero_tag || t("heroTag");
  const heroHeading = cms.grupos_hero_heading || t("heroHeading");

  const benefits = [
    { icon: BENEFIT_ICONS[0], title: t("benefit1Title"), description: t("benefit1Desc") },
    { icon: BENEFIT_ICONS[1], title: t("benefit2Title"), description: t("benefit2Desc") },
    { icon: BENEFIT_ICONS[2], title: t("benefit3Title"), description: t("benefit3Desc") },
    { icon: BENEFIT_ICONS[3], title: t("benefit4Title"), description: t("benefit4Desc") },
  ];

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
              <Users className="h-5 w-5 text-accent" aria-hidden="true" />
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

      {/* Benefits */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t("benefitsTag")}
            </p>
            <h2 className="font-heading text-text">
              {t("benefitsHeading1")}
              <span className="text-gradient">{t("benefitsHeading2")}</span>?
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <AnimatedSection
                key={benefit.title}
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
                    <benefit.icon
                      className="h-8 w-8 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-semibold text-text">
                    {benefit.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-text-muted">
                    {benefit.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Group Trips */}
      <section className="section-padding aurora-bg">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t("tripsTag")}
            </p>
            <h2 className="font-heading text-text">
              {t("tripsHeading1")}
              <span className="text-gradient">{t("tripsHeading2")}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-text-muted">
              {t("tripsDescription")}
            </p>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trips.map((trip, index) => (
              <AnimatedSection
                key={trip.id}
                variant="scale-in"
                delay={index * 0.08}
                className="group"
              >
                <div className="hover-lift glass overflow-hidden rounded-2xl">
                  <div className="img-zoom relative aspect-[4/3]">
                    <Image
                      src={trip.image}
                      alt={`${trip.title} — ${trip.destination}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4 z-10">
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/90 px-3 py-1 font-body text-xs font-semibold text-white backdrop-blur-sm">
                        <Users className="h-3 w-3" aria-hidden="true" />
                        {trip.spots}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-text-muted">
                        <MapPin className="h-3 w-3" aria-hidden="true" />
                        <span className="font-body text-xs font-medium uppercase tracking-wider">
                          {trip.destination}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-text-muted">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        <span className="font-body text-xs font-medium uppercase tracking-wider">
                          {trip.duration}
                        </span>
                      </span>
                    </div>

                    <h3 className="mb-3 font-heading text-lg font-semibold text-text transition-colors group-hover:text-primary">
                      {trip.title}
                    </h3>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-body text-xs text-text-muted">{tc("from")}</p>
                        <p className="font-heading text-2xl font-bold text-primary">
                          {formatPrice(trip.price)}
                        </p>
                      </div>
                      <Link
                        href="/contacto"
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 font-body text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        {tc("reserve")}
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80"
          alt={t("ctaAlt")}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/80" />

        <div className="container-custom relative z-10 text-center">
          <AnimatedSection variant="fade-up">
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
