import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import MegatravelExplorer from "./MegatravelExplorer";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "Explore Destinations | Viaja Agencia"
        : "Explorar Destinos | Viaja Agencia",
    description:
      locale === "en"
        ? "Browse travel packages to destinations worldwide with Viaja Agencia"
        : "Explora paquetes de viaje a destinos de todo el mundo con Viaja Agencia",
  };
}

export default async function MegatravelPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MegatravelExplorer locale={locale} />;
}
