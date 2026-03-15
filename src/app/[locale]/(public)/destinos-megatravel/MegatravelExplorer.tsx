"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Flame, Ship, Loader2 } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {
  MEGATRAVEL_DESTINATIONS,
  getMegatravelDestUrl,
  getMegatravelOfertasUrl,
  getMegatravelCrucerosUrl,
} from "@/lib/utils/megatravel";

type SpecialTab = "ofertas" | "cruceros";
type TabSelection =
  | { type: "special"; id: SpecialTab }
  | { type: "dest"; id: number };

interface Props {
  locale: string;
}

const SPECIAL_TABS: { id: SpecialTab; labelEs: string; labelEn: string; icon: typeof Globe; getUrl: () => string }[] = [
  {
    id: "ofertas",
    labelEs: "Ofertas HOT",
    labelEn: "HOT Deals",
    icon: Flame,
    getUrl: getMegatravelOfertasUrl,
  },
  {
    id: "cruceros",
    labelEs: "Cruceros",
    labelEn: "Cruises",
    icon: Ship,
    getUrl: getMegatravelCrucerosUrl,
  },
];

function getIframeUrl(tab: TabSelection): string {
  if (tab.type === "special") {
    const found = SPECIAL_TABS.find((s) => s.id === tab.id);
    return found ? found.getUrl() : getMegatravelOfertasUrl();
  }
  return getMegatravelDestUrl(tab.id);
}

function isSelected(current: TabSelection, type: string, id: string | number): boolean {
  return current.type === type && current.id === id;
}

export default function MegatravelExplorer({ locale }: Props) {
  const isEn = locale === "en";
  const [selected, setSelected] = useState<TabSelection>({ type: "special", id: "ofertas" });
  const [iframeLoading, setIframeLoading] = useState(true);

  const handleSelect = useCallback((tab: TabSelection) => {
    setIframeLoading(true);
    setSelected(tab);
  }, []);

  const iframeUrl = getIframeUrl(selected);
  const tabKey = selected.type === "special" ? selected.id : `dest-${selected.id}`;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-light py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(38,103,255,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(29,206,200,0.2),transparent_60%)]" />

        <div className="container-custom relative z-10 text-center">
          <AnimatedSection variant="fade-up">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Globe className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                {isEn ? "MEGATRAVEL DESTINATIONS" : "DESTINOS MEGATRAVEL"}
              </span>
            </div>
            <h1 className="mb-4 font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
              {isEn ? "Explore the " : "Explora el "}
              <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
                {isEn ? "World" : "Mundo"}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-white/85">
              {isEn
                ? "Discover travel packages to amazing destinations across every continent. Select a region to explore available deals."
                : "Descubre paquetes de viaje a destinos increíbles en todos los continentes. Selecciona una región para explorar ofertas disponibles."}
            </p>
          </AnimatedSection>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Tab selector + iframe */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Special tabs (Ofertas HOT + Cruceros) */}
          <AnimatedSection variant="fade-up" className="mb-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {SPECIAL_TABS.map((tab) => {
                const active = isSelected(selected, "special", tab.id);
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelect({ type: "special", id: tab.id })}
                    className={`
                      group relative flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 font-body text-sm font-semibold
                      transition-all duration-200
                      ${active
                        ? "bg-accent text-white shadow-lg shadow-accent/25"
                        : "bg-surface text-text-muted shadow-card hover:bg-accent/10 hover:text-accent"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {isEn ? tab.labelEn : tab.labelEs}
                    {active && (
                      <motion.div
                        layoutId="special-indicator"
                        className="absolute inset-0 rounded-xl border-2 border-accent"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </AnimatedSection>

          {/* Destination grid */}
          <AnimatedSection variant="fade-up" delay={0.1} className="mb-10">
            <p className="mb-4 text-center font-body text-sm font-medium uppercase tracking-[0.15em] text-text-muted">
              {isEn ? "Or browse by region" : "O explora por región"}
            </p>

            {/* Desktop/Tablet grid */}
            <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {MEGATRAVEL_DESTINATIONS.map((dest) => {
                const active = isSelected(selected, "dest", dest.id);
                return (
                  <button
                    key={dest.id}
                    onClick={() => handleSelect({ type: "dest", id: dest.id })}
                    className={`
                      group relative flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3
                      font-body text-sm font-medium transition-all duration-200
                      ${active
                        ? "bg-accent/10 text-accent ring-2 ring-accent shadow-md"
                        : "bg-surface text-text shadow-card hover:bg-primary/5 hover:text-primary hover:shadow-md"
                      }
                    `}
                  >
                    <span className="text-lg leading-none" aria-hidden="true">{dest.icon}</span>
                    <span className="truncate">{isEn ? dest.nameEn : dest.nameEs}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:hidden scrollbar-hide">
              {MEGATRAVEL_DESTINATIONS.map((dest) => {
                const active = isSelected(selected, "dest", dest.id);
                return (
                  <button
                    key={dest.id}
                    onClick={() => handleSelect({ type: "dest", id: dest.id })}
                    className={`
                      flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5
                      font-body text-sm font-medium whitespace-nowrap transition-all duration-200
                      ${active
                        ? "bg-accent/10 text-accent ring-2 ring-accent"
                        : "bg-surface text-text shadow-card hover:bg-primary/5"
                      }
                    `}
                  >
                    <span className="text-base leading-none" aria-hidden="true">{dest.icon}</span>
                    {isEn ? dest.nameEn : dest.nameEs}
                  </button>
                );
              })}
            </div>
          </AnimatedSection>

          {/* Iframe container */}
          <AnimatedSection variant="fade-up" delay={0.15}>
            <div className="relative overflow-hidden rounded-2xl bg-surface shadow-card">
              {/* Loading overlay */}
              <AnimatePresence>
                {iframeLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-surface/90 backdrop-blur-sm"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <p className="font-body text-sm text-text-muted">
                      {isEn ? "Loading destinations..." : "Cargando destinos..."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tabKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <iframe
                    src={iframeUrl}
                    loading="lazy"
                    title={
                      isEn
                        ? "Megatravel travel packages"
                        : "Paquetes de viaje Megatravel"
                    }
                    className="w-full border-0"
                    style={{ height: "1200px" }}
                    onLoad={() => setIframeLoading(false)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
