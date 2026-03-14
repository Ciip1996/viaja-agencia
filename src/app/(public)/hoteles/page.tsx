"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Wifi,
  Waves,
  Sparkles,
  UtensilsCrossed,
  Dumbbell,
  Wine,
  Eye,
  Coffee,
  Briefcase,
  Palmtree,
  SlidersHorizontal,
  X,
  CalendarDays,
  Users,
  BedDouble,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const AMENITY_META: Record<string, { label: string; icon: typeof Wifi }> = {
  wifi: { label: "WiFi", icon: Wifi },
  pool: { label: "Alberca", icon: Waves },
  spa: { label: "Spa", icon: Sparkles },
  restaurant: { label: "Restaurante", icon: UtensilsCrossed },
  gym: { label: "Gimnasio", icon: Dumbbell },
  bar: { label: "Bar", icon: Wine },
  "ocean-view": { label: "Vista al mar", icon: Eye },
  breakfast: { label: "Desayuno", icon: Coffee },
  concierge: { label: "Concierge", icon: Briefcase },
  beach: { label: "Playa", icon: Palmtree },
  "all-inclusive": { label: "Todo incluido", icon: Star },
  garden: { label: "Jardin", icon: Palmtree },
  business: { label: "Business", icon: Briefcase },
};

interface Hotel {
  id: string;
  name: string;
  location: string;
  price_per_night: number;
  currency: string;
  rating: number;
  image_url: string;
  amenities: string[];
  stars: number;
}

const HOTELS: Hotel[] = [
  {
    id: "h1",
    name: "Hotel Riviera Maya Resort",
    location: "Cancun, Mexico",
    price_per_night: 3200,
    currency: "MXN",
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    amenities: ["wifi", "pool", "spa", "restaurant", "gym"],
    stars: 5,
  },
  {
    id: "h2",
    name: "Grand Hotel Barcelona",
    location: "Barcelona, Espana",
    price_per_night: 4500,
    currency: "MXN",
    rating: 4.6,
    image_url:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    amenities: ["wifi", "restaurant", "bar", "concierge"],
    stars: 4,
  },
  {
    id: "h3",
    name: "Santorini Blue Suites",
    location: "Santorini, Grecia",
    price_per_night: 6800,
    currency: "MXN",
    rating: 4.9,
    image_url:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    amenities: ["wifi", "pool", "spa", "ocean-view", "breakfast"],
    stars: 5,
  },
  {
    id: "h4",
    name: "Hotel Xcaret Arte",
    location: "Playa del Carmen, Mexico",
    price_per_night: 5500,
    currency: "MXN",
    rating: 4.9,
    image_url:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    amenities: ["wifi", "pool", "spa", "all-inclusive", "beach"],
    stars: 5,
  },
  {
    id: "h5",
    name: "Riad Palais Namaskar",
    location: "Marrakech, Marruecos",
    price_per_night: 4800,
    currency: "MXN",
    rating: 4.7,
    image_url:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    amenities: ["wifi", "pool", "spa", "restaurant", "garden"],
    stars: 5,
  },
  {
    id: "h6",
    name: "Tokyo Imperial Hotel",
    location: "Tokio, Japon",
    price_per_night: 7200,
    currency: "MXN",
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&q=80",
    amenities: ["wifi", "restaurant", "concierge", "gym", "business"],
    stars: 4,
  },
];

const ALL_AMENITY_KEYS = Array.from(
  new Set(HOTELS.flatMap((h) => h.amenities))
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HotelesPage() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [filterStars, setFilterStars] = useState<number[]>([]);
  const [filterAmenities, setFilterAmenities] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredHotels = useMemo(() => {
    return HOTELS.filter((hotel) => {
      if (destination) {
        const q = destination.toLowerCase();
        const matchesName = hotel.name.toLowerCase().includes(q);
        const matchesLocation = hotel.location.toLowerCase().includes(q);
        if (!matchesName && !matchesLocation) return false;
      }
      if (
        hotel.price_per_night < priceRange[0] ||
        hotel.price_per_night > priceRange[1]
      )
        return false;
      if (filterStars.length > 0 && !filterStars.includes(hotel.stars))
        return false;
      if (
        filterAmenities.length > 0 &&
        !filterAmenities.every((a) => hotel.amenities.includes(a))
      )
        return false;
      return true;
    });
  }, [destination, priceRange, filterStars, filterAmenities]);

  function toggleStar(star: number) {
    setFilterStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  }

  function toggleAmenity(key: string) {
    setFilterAmenities((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  }

  // -------------------------------------------------------------------------
  // Filter sidebar content (reused in mobile drawer and desktop sidebar)
  // -------------------------------------------------------------------------

  const filterContent = (
    <div className="space-y-8">
      {/* Price range */}
      <div>
        <h4 className="mb-3 font-heading text-lg font-semibold text-text">
          Precio por noche
        </h4>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={10000}
            step={500}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full accent-secondary"
          />
          <div className="flex items-center justify-between font-body text-sm text-text-muted">
            <span>{formatPrice(priceRange[0], "MXN")}</span>
            <span>{formatPrice(priceRange[1], "MXN")}</span>
          </div>
        </div>
      </div>

      {/* Stars */}
      <div>
        <h4 className="mb-3 font-heading text-lg font-semibold text-text">
          Estrellas
        </h4>
        <div className="flex flex-wrap gap-2">
          {[3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => toggleStar(star)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-body text-sm transition-colors",
                filterStars.includes(star)
                  ? "border-secondary bg-secondary/10 text-secondary"
                  : "border-border bg-surface text-text-muted hover:border-secondary/40"
              )}
            >
              <Star className="h-3.5 w-3.5" />
              {star}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="mb-3 font-heading text-lg font-semibold text-text">
          Amenidades
        </h4>
        <div className="space-y-2">
          {ALL_AMENITY_KEYS.map((key) => {
            const meta = AMENITY_META[key];
            if (!meta) return null;
            const Icon = meta.icon;
            return (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-background"
              >
                <input
                  type="checkbox"
                  checked={filterAmenities.includes(key)}
                  onChange={() => toggleAmenity(key)}
                  className="h-4 w-4 rounded border-border accent-secondary"
                />
                <Icon className="h-4 w-4 text-text-muted" />
                <span className="font-body text-sm text-text">{meta.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
            alt="Hotel de lujo con alberca"
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
            Hospedaje Premium
          </p>
          <h1 className="font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
            Encuentra tu Hotel{" "}
            <span className="text-gradient-gold inline-block">Ideal</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base text-white/80 sm:text-lg">
            Comparamos las mejores opciones de hospedaje para que encuentres el
            lugar perfecto en tu proximo destino.
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
          className="glass container-custom mx-auto max-w-5xl rounded-2xl p-4 shadow-elevated sm:p-6"
          aria-label="Buscar hoteles"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto_auto]">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Destino o hotel"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                aria-label="Check-in"
              />
            </div>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                aria-label="Check-out"
              />
            </div>
            <div className="relative">
              <BedDouble className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="number"
                min={1}
                max={10}
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                aria-label="Habitaciones"
              />
            </div>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="h-12 w-full rounded-xl border border-border bg-surface pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                aria-label="Huespedes"
              />
            </div>
            <button
              type="submit"
              className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-8 font-body text-sm font-semibold text-white shadow-lg transition-all hover:bg-accent-dark hover:shadow-xl active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              Buscar
            </button>
          </div>
        </motion.form>
      </section>

      {/* Results */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <AnimatedSection variant="fade-up">
              <p className="font-body text-sm text-text-muted">
                {filteredHotels.length} hoteles encontrados
              </p>
            </AnimatedSection>

            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 font-body text-sm text-text transition-colors hover:bg-background lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </button>
          </div>

          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-28 rounded-2xl border border-border bg-surface p-6">
                <h3 className="mb-6 font-heading text-xl font-semibold text-text">
                  Filtros
                </h3>
                {filterContent}
              </div>
            </aside>

            {/* Mobile filter drawer */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="absolute inset-0 bg-black/40"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-surface p-6 shadow-elevated"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-heading text-xl font-semibold text-text">
                      Filtros
                    </h3>
                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(false)}
                      className="rounded-lg p-2 text-text-muted transition-colors hover:bg-background"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {filterContent}
                </motion.div>
              </div>
            )}

            {/* Hotel grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredHotels.map((hotel, i) => (
                  <AnimatedSection
                    key={hotel.id}
                    variant="fade-up"
                    delay={i * 0.08}
                    className="group"
                  >
                    <div className="hover-lift glass overflow-hidden rounded-2xl">
                      {/* Image */}
                      <div className="img-zoom relative aspect-[4/3]">
                        <Image
                          src={hotel.image_url}
                          alt={hotel.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 right-3 z-10 rounded-lg bg-white/90 px-2.5 py-1 backdrop-blur-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                            <span className="font-body text-sm font-bold text-text">
                              {hotel.rating}
                            </span>
                          </div>
                        </div>
                        <div className="absolute left-3 top-3 z-10 flex gap-0.5">
                          {Array.from({ length: hotel.stars }).map((_, s) => (
                            <Star
                              key={s}
                              className="h-3.5 w-3.5 fill-accent text-accent drop-shadow"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="mb-1.5 flex items-center gap-1.5 text-text-muted">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="font-body text-xs font-medium uppercase tracking-wider">
                            {hotel.location}
                          </span>
                        </div>
                        <h3 className="mb-3 font-heading text-xl font-semibold text-text transition-colors group-hover:text-primary">
                          {hotel.name}
                        </h3>

                        {/* Amenities */}
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {hotel.amenities.slice(0, 4).map((key) => {
                            const meta = AMENITY_META[key];
                            if (!meta) return null;
                            const Icon = meta.icon;
                            return (
                              <span
                                key={key}
                                className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 font-body text-xs text-text-muted"
                              >
                                <Icon className="h-3 w-3" />
                                {meta.label}
                              </span>
                            );
                          })}
                          {hotel.amenities.length > 4 && (
                            <span className="inline-flex items-center rounded-full bg-background px-2.5 py-1 font-body text-xs text-text-muted">
                              +{hotel.amenities.length - 4}
                            </span>
                          )}
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="font-body text-xs text-text-muted">
                              Por noche
                            </p>
                            <p className="font-heading text-2xl font-bold text-primary">
                              {formatPrice(hotel.price_per_night, hotel.currency)}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="rounded-xl bg-accent px-5 py-2.5 font-body text-sm font-semibold text-white transition-all hover:bg-accent-dark hover:shadow-lg active:scale-[0.97]"
                          >
                            Reservar
                          </button>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              {filteredHotels.length === 0 && (
                <div className="py-20 text-center">
                  <p className="font-heading text-2xl text-text-muted">
                    No se encontraron hoteles
                  </p>
                  <p className="mt-2 font-body text-sm text-text-muted">
                    Intenta ajustar tus filtros de busqueda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
