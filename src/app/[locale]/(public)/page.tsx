import { setRequestLocale, getTranslations } from "next-intl/server";
import Hero from "@/components/home/Hero";
import HotDeals from "@/components/home/HotDeals";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import InstagramFeed from "@/components/home/InstagramFeed";
import Newsletter from "@/components/home/Newsletter";
import FAQ from "@/components/home/FAQ";
import { getContentByCategory } from "@/lib/cms/content";
import { getFeatureFlags } from "@/lib/cms/feature-flags";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchGoogleReviews } from "@/lib/services/google-places";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

async function getPromotions(locale: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("promotions")
      .select("*")
      .eq("is_active", true)
      .eq("locale", locale)
      .order("created_at", { ascending: false })
      .limit(6);
    return data ?? [];
  } catch {
    return [];
  }
}

async function getDestinations(locale: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("destinations")
      .select("*")
      .eq("is_active", true)
      .eq("locale", locale)
      .order("display_order");
    return data ?? [];
  } catch {
    return [];
  }
}

async function getFaqs(locale: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("faq")
      .select("*")
      .eq("is_active", true)
      .eq("locale", locale)
      .order("display_order");
    return data ?? [];
  } catch {
    return [];
  }
}

function buildJsonLd(locale: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Viaja Agencia",
    legalName: "Grupo Turístico del Centro-Occidente, S.A. de C.V.",
    url: `https://viajaagencia.com.mx/${locale}`,
    logo: "https://viajaagencia.com.mx/logo-viaja.png",
    image: "https://viajaagencia.com.mx/logo-viaja.png",
    description,
    inLanguage: locale === "en" ? "en-US" : "es-MX",
    telephone: "+52-477-779-0610",
    email: "reservaciones@viajaagencia.com.mx",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nube #522, Col. Jardines del Moral",
      addressLocality: "León",
      addressRegion: "Guanajuato",
      postalCode: "37160",
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 21.1507512,
      longitude: -101.6905235,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "14:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/viajaagencia/",
      "https://www.instagram.com/viajaagencia",
    ],
    priceRange: "$$",
    currenciesAccepted: "MXN, USD",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: 21.15, longitude: -101.69 },
      geoRadius: "200000",
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tMeta = await getTranslations({ locale, namespace: "metadata" });
  const jsonLd = buildJsonLd(locale, tMeta("homeDescription"));

  const [
    heroContent,
    offersContent,
    whyContent,
    destContent,
    testimonialsContent,
    newsletterContent,
    faqContent,
    igContent,
    promotions,
    destinations,
    faqs,
    googleReviews,
    flags,
  ] = await Promise.all([
    getContentByCategory("homepage_hero", locale),
    getContentByCategory("homepage_ofertas", locale),
    getContentByCategory("homepage_porque", locale),
    getContentByCategory("homepage_destinos", locale),
    getContentByCategory("homepage_testimonios", locale),
    getContentByCategory("homepage_newsletter", locale),
    getContentByCategory("homepage_faq", locale),
    getContentByCategory("homepage_instagram", locale),
    getPromotions(locale),
    getDestinations(locale),
    getFaqs(locale),
    fetchGoogleReviews(undefined, locale).catch(() => null),
    getFeatureFlags(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero content={heroContent} />
      <HotDeals content={offersContent} promotions={promotions} />
      <FeaturedDestinations content={destContent} destinations={destinations} />
      <WhyChooseUs content={whyContent} />
      <Testimonials content={testimonialsContent} googleReviews={googleReviews ?? undefined} />
      {flags.feature_instagram && <InstagramFeed content={igContent} />}
      <Newsletter content={newsletterContent} />
      <FAQ content={faqContent} faqs={faqs} />
    </>
  );
}
