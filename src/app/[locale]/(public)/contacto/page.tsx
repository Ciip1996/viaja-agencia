import { setRequestLocale, getTranslations } from "next-intl/server";
import { getContentByCategory } from "@/lib/cms/content";
import ContactoClient from "./ContactoClient";
import { buildPageMetadata, buildContactPageJsonLd, buildBreadcrumbJsonLd, BASE_URL } from "@/lib/utils/seo";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageContacto" });
  return buildPageMetadata(locale, "/contacto", t("metaTitle"), t("metaDescription"));
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cms = await getContentByCategory("page_contacto", locale);

  const contactJsonLd = buildContactPageJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: BASE_URL },
    { name: "Contacto", url: `${BASE_URL}${locale === "es" ? "/contacto" : `/${locale}/contacto`}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ContactoClient cms={cms} />
    </>
  );
}
