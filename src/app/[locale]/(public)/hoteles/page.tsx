import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getContentByCategory } from "@/lib/cms/content";
import { getFeatureFlag } from "@/lib/cms/feature-flags";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { promotions as mockPromotions } from "@/lib/data/mock-data";
import { buildPageMetadata } from "@/lib/utils/seo";
import HotelesClient from "./HotelesClient";
import type { Promotion } from "@/lib/supabase/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageHoteles" });
  return buildPageMetadata(locale, "/hoteles", t("metaTitle"), t("metaDescription"));
}

async function getHotelPromotions(locale: string): Promise<Promotion[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("promotions")
      .select("*")
      .eq("is_active", true)
      .eq("locale", locale)
      .order("created_at", { ascending: false });
    return data && data.length > 0 ? data : mockPromotions.filter((p) => p.locale === locale);
  } catch {
    return mockPromotions.filter((p) => p.locale === locale);
  }
}

export default async function HotelesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const hotelsEnabled = await getFeatureFlag("feature_hoteles");
  if (!hotelsEnabled) redirect(`/${locale}/paquetes`);

  const [cms, promotions] = await Promise.all([
    getContentByCategory("page_hoteles", locale),
    getHotelPromotions(locale),
  ]);

  return <HotelesClient cms={cms} promotions={promotions} />;
}
