import type { Metadata } from "next";

const BASE_URL = "https://viajaagencia.com.mx";
const LOCALES = ["es", "en"] as const;

type Locale = (typeof LOCALES)[number];

export function buildAlternates(locale: string, path: string) {
  const canonicalPath = locale === "es" ? path : `/${locale}${path}`;
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = `${BASE_URL}${loc === "es" ? path : `/${loc}${path}`}`;
  }
  return {
    canonical: `${BASE_URL}${canonicalPath}`,
    languages,
  };
}

export function buildPageMetadata(
  locale: string,
  path: string,
  title: string,
  description: string,
  ogType: "website" | "article" = "website"
): Metadata {
  const alternates = buildAlternates(locale, path);
  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: ogType,
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildWebSiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Viaja Agencia",
    url: `${BASE_URL}${locale === "es" ? "" : `/${locale}`}`,
    inLanguage: locale === "es" ? "es-MX" : "en-US",
    publisher: {
      "@type": "Organization",
      name: "Viaja Agencia",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo-viaja.png`,
      },
    },
  };
}

export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildItemListJsonLd(
  name: string,
  items: { name: string; url: string; image?: string; description?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: item.name,
        url: item.url,
        ...(item.image && { image: item.image }),
        ...(item.description && { description: item.description }),
      },
    })),
  };
}

export function buildContactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contacto — Viaja Agencia",
    url: `${BASE_URL}/contacto`,
    mainEntity: {
      "@type": "TravelAgency",
      name: "Viaja Agencia",
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
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+52-477-779-0610",
        contactType: "reservations",
        availableLanguage: ["Spanish", "English"],
      },
    },
  };
}

export function buildAboutPageJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: locale === "es" ? "Sobre Nosotros" : "About Us",
    url: `${BASE_URL}${locale === "es" ? "/nosotros" : `/${locale}/nosotros`}`,
    mainEntity: {
      "@type": "TravelAgency",
      name: "Viaja Agencia",
      legalName: "Grupo Turístico del Centro-Occidente, S.A. de C.V.",
      url: BASE_URL,
      logo: `${BASE_URL}/logo-viaja.png`,
      foundingDate: "2015",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Nube #522, Col. Jardines del Moral",
        addressLocality: "León",
        addressRegion: "Guanajuato",
        postalCode: "37160",
        addressCountry: "MX",
      },
      sameAs: [
        "https://www.facebook.com/viajaagencia/",
        "https://www.instagram.com/viajaagencia",
      ],
    },
  };
}

export { BASE_URL, LOCALES };
export type { Locale };
