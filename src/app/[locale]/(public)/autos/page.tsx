import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getContentByCategory } from "@/lib/cms/content";
import { getFeatureFlag } from "@/lib/cms/feature-flags";
import AutosClient from "./AutosClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageAutos" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AutosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const enabled = await getFeatureFlag("feature_autos");
  if (!enabled) redirect(`/${locale}`);

  const cms = await getContentByCategory("page_autos", locale);
  return <AutosClient cms={cms} />;
}
