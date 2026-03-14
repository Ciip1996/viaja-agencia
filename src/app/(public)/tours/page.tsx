"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  Mountain,
  ArrowRight,
  Compass,
  UtensilsCrossed,
  TreePine,
  Landmark,
  CalendarDays,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type TourCategory = "cultura" | "aventura" | "gastronomia" | "naturaleza";

const CATEGORY_META: Record<
  TourCategory,
  { label: string; icon: typeof Compass }
> = {
  cultura: { label: "Cultura", icon: Landmark },
  aventura: { label: "Aventura", icon: Compass },
  gastronomia: { label: "Gastronomia", icon: UtensilsCrossed },
  naturaleza: { label: "Naturaleza", icon: TreePine },
};

const DIFFICULTY_LABELS: Record<string, string> = {
  facil: "Facil",
  moderado: "Moderado",
  dificil: "Dificil",
};

interface Tour {
  id: string;
  name: string;
  destination: string;
  duration_hours: number;
  price: number;
  currency: string;
  difficulty: "facil" | "moderado" | "dificil";
  category: TourCategory;
  image_url: string;
  description: string;
}

const TOURS: Tour[] = [
  {
    id: "t1",
    name: "Chichen Itza Premium",
    destination: "Yucatan, Mexico",
    duration_hours: 10,
    price: 2800,
    currency: "MXN",
    difficulty: "facil",
    category: "cultura",
    image_url:
      "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80",
    description:
      "Visita guiada a la maravilla del mundo con cenote sagrado y almuerzo tipico incluido.",
  },
  {
    id: "t2",
    name: "Ruta del Vino en Toscana",
    destination: "Toscana, Italia",
    duration_hours: 8,
    price: 4200,
    currency: "MXN",
    difficulty: "facil",
    category: "gastronomia",
    image_url:
      "https://images.unsplash.com/photo-1523528283115-9bf9b1699245?w=800&q=80",
    description:
      "Degustacion de vinos, visita a vinedos y almuerzo gourmet en la campina toscana.",
  },
  {
    id: "t3",
    name: "Safari Masai Mara",
    destination: "Kenia, Africa",
    duration_hours: 12,
    price: 8500,
    currency: "MXN",
    difficulty: "moderado",
    category: "aventura",
    image_url:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    description:
      "Safari de dia completo en la reserva Masai Mara con guia profesional y almuerzo en la sabana.",
  },
  {
    id: "t4",
    name: "Templos de Kioto",
    destination: "Kioto, Japon",
    duration_hours: 6,
    price: 3600,
    currency: "MXN",
    difficulty: "facil",
    category: "cultura",
    image_url:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    description:
      "Recorrido guiado por los templos mas emblematicos de Kioto, incluyendo Fushimi Inari y Kinkaku-ji.",
  },
  {
    id: "t5",
    name: "Trekking Patagonia",
    destination: "Torres del Paine, Chile",
    duration_hours: 14,
    price: 6200,
    currency: "MXN",
    difficulty: "dificil",
    category: "naturaleza",
    image_url:
      "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=80",
    description:
      "Caminata de dia completo por los senderos mas impresionantes del Parque Nacional Torres del Paine.",
  },
  {
    id: "t6",
    name: "Gastronomia de Oaxaca",
    destination: "Oaxaca, Mexico",
    duration_hours: 5,
    price: 1800,
    currency: "MXN",
    difficulty: "facil",
    category: "gastronomia",
    image_url:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    description:
      "Tour culinario por mercados, mezcalerias y restaurantes tradicionales de la capital oaxaquena.",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ToursPage() {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<TourCategory | "">("");

  const filteredTours = useMemo(() => {
    return TOURS.filter((tour) => {
      if (destination) {
        const q = destination.toLowerCase();
        const matchesName = tour.name.toLowerCase().includes(q);
        const matchesDest = tour.destination.toLowerCase().includes(q);
        if (!matchesName && !matchesDest) return false;
      }
      if (category && tour.category !== category) return false;
      return true;
    });
  }, [destination, category]);

  function getDifficultyColor(d: string) {
    if (d === "facil") return "bg-success/10 text-success";
    if (d === "moderado") return "bg-warning/10 text-warning";
    return "bg-error/10 text-error";
  }

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
            alt="Paisaje de aventura"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-20 px-4 text-center"
        >
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
            Experiencias Unicas
          </p>
          <h1 className="font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
            Tours y{" "}
            <span className="text-gradient-gold inline-block">Excursiones</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base text-white/80 sm:text-lg">
            Descubre actividades, aventuras y experiencias culturales guiadas por
            expertos locales en los destinos mas fascinantes del mundo.
          </p>
        </motion.div>
      </section>

      {/* Search form */}
      <section className="relative z-30 -mt-10 px-4">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={(e) => e.preventDefault()}
          className="glass container-custom mx-auto max-w-4xl rounded-2xl p-4 shadow-elevated sm:p-6"
          aria-label="Buscar tours"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Destino o actividad"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                aria-label="Fecha"
              />
            </div>
            <div className="relative">
              <Compass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as TourCategory | "")
                }
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
              >
                <option value="">Todas las categorias</option>
                {(
                  Object.entries(CATEGORY_META) as [
                    TourCategory,
                    (typeof CATEGORY_META)[TourCategory],
                  ][]
                ).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-8 font-body text-sm font-semibold text-white shadow-lg transition-all hover:bg-accent-dark hover:shadow-xl active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              Buscar
            </button>
          </div>

          {/* Category quick filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory("")}
              className={cn(
                "rounded-full border px-4 py-1.5 font-body text-sm transition-colors",
                category === ""
                  ? "border-secondary bg-secondary/10 text-secondary"
                  : "border-border bg-surface text-text-muted hover:border-secondary/40"
              )}
            >
              Todos
            </button>
            {(
              Object.entries(CATEGORY_META) as [
                TourCategory,
                (typeof CATEGORY_META)[TourCategory],
              ][]
            ).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setCategory(category === key ? "" : key)
                  }
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-body text-sm transition-colors",
                    category === key
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-border bg-surface text-text-muted hover:border-secondary/40"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </motion.form>
      </section>

      {/* Results */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-8">
            <p className="font-body text-sm text-text-muted">
              {filteredTours.length} tours encontrados
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTours.map((tour, i) => (
              <AnimatedSection
                key={tour.id}
                variant="fade-up"
                delay={i * 0.08}
                className="group"
              >
                <div className="hover-lift glass flex h-full flex-col overflow-hidden rounded-2xl">
                  {/* Image */}
                  <div className="img-zoom relative aspect-[16/10]">
                    <Image
                      src={tour.image_url}
                      alt={tour.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                    <div className="absolute left-3 top-3 z-10">
                      {(() => {
                        const catMeta = CATEGORY_META[tour.category];
                        const CatIcon = catMeta.icon;
                        return (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 font-body text-xs font-semibold text-primary backdrop-blur-sm">
                            <CatIcon className="h-3 w-3" />
                            {catMeta.label}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="absolute right-3 top-3 z-10">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 font-body text-xs font-semibold backdrop-blur-sm",
                          getDifficultyColor(tour.difficulty)
                        )}
                      >
                        {DIFFICULTY_LABELS[tour.difficulty]}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-1.5 flex items-center gap-1.5 text-text-muted">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="font-body text-xs font-medium uppercase tracking-wider">
                        {tour.destination}
                      </span>
                    </div>
                    <h3 className="mb-2 font-heading text-xl font-semibold text-text transition-colors group-hover:text-primary">
                      {tour.name}
                    </h3>
                    <p className="mb-4 line-clamp-2 flex-1 font-body text-sm leading-relaxed text-text-muted">
                      {tour.description}
                    </p>

                    {/* Meta row */}
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex items-center gap-1 text-text-muted">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-body text-xs">
                          {tour.duration_hours}h
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-text-muted">
                        <Mountain className="h-3.5 w-3.5" />
                        <span className="font-body text-xs">
                          {DIFFICULTY_LABELS[tour.difficulty]}
                        </span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-end justify-between border-t border-border pt-4">
                      <div>
                        <p className="font-body text-xs text-text-muted">
                          Por persona
                        </p>
                        <p className="font-heading text-2xl font-bold text-primary">
                          {formatPrice(tour.price, tour.currency)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 font-body text-sm font-semibold text-white transition-all hover:bg-accent-dark hover:shadow-lg active:scale-[0.97]"
                      >
                        Ver Detalles
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {filteredTours.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-heading text-2xl text-text-muted">
                No se encontraron tours
              </p>
              <p className="mt-2 font-body text-sm text-text-muted">
                Intenta ajustar tu busqueda o categoria.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
