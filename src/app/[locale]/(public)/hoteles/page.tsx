import { setRequestLocale, getTranslations } from "next-intl/server";
import { getContentByCategory } from "@/lib/cms/content";
import { getFeatureFlag } from "@/lib/cms/feature-flags";
import HotelesClient from "./HotelesClient";
import { buildPageMetadata } from "@/lib/utils/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageHoteles" });
  return buildPageMetadata(locale, "/hoteles", t("metaTitle"), t("metaDescription"));
}

export default async function HotelesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [cms, bookingEnabled] = await Promise.all([
    getContentByCategory("page_hoteles", locale),
    getFeatureFlag("feature_hotel_booking"),
  ]);
  return <HotelesClient cms={cms} bookingEnabled={bookingEnabled} />;
}
