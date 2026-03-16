import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getContentByCategory } from "@/lib/cms/content";
import { getFeatureFlag } from "@/lib/cms/feature-flags";
import ToursClient from "./ToursClient";
import { buildPageMetadata } from "@/lib/utils/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageTours" });
  return buildPageMetadata(locale, "/tours", t("metaTitle"), t("metaDescription"));
}

export default async function ToursPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const enabled = await getFeatureFlag("feature_tours");
  if (!enabled) redirect(`/${locale}`);

  const cms = await getContentByCategory("page_tours", locale);
  return <ToursClient cms={cms} />;
}
