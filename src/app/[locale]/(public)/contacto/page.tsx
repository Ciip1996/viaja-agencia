import { setRequestLocale, getTranslations } from "next-intl/server";
import { getContentByCategory } from "@/lib/cms/content";
import ContactoClient from "./ContactoClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageContacto" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cms = await getContentByCategory("page_contacto", locale);
  return <ContactoClient cms={cms} />;
}
