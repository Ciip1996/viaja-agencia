import { setRequestLocale } from "next-intl/server";
import MegatravelExplorer from "./MegatravelExplorer";
import { buildPageMetadata } from "@/lib/utils/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const title = locale === "en" ? "Explore Destinations" : "Explorar Destinos";
  const description =
    locale === "en"
      ? "Browse travel packages to destinations worldwide with Viaja Agencia"
      : "Explora paquetes de viaje a destinos de todo el mundo con Viaja Agencia";
  return buildPageMetadata(locale, "/destinos-megatravel", title, description);
}

export default async function MegatravelPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MegatravelExplorer locale={locale} />;
}
