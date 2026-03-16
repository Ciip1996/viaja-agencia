import { Suspense } from "react";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/utils/seo";
import SearchClient from "./SearchClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageSearch" });
  return buildPageMetadata(locale, "/buscar", t("metaTitle"), t("metaDescription"));
}

export default async function BuscarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pageSearch");

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
            alt={t("heroAlt")}
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
        <div className="relative z-20 px-4 text-center">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
            {t("heroTag")}
          </p>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            {t("heroHeading")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base text-white/80 sm:text-lg">
            {t("heroDescription")}
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="py-20 text-center"><p className="text-text-muted">Cargando...</p></div>}>
        <SearchClient />
      </Suspense>
    </>
  );
}
