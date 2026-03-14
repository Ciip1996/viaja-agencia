"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, ChevronDown, MapPin, Calendar, Users } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80";

const DESTINATIONS = [
  "Europa",
  "Asia",
  "Medio Oriente",
  "Africa",
  "Sudamerica",
  "Centroamerica",
  "Caribe",
  "Estados Unidos",
  "Canada",
  "Mexico",
  "Pacifico",
  "Cruceros",
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const searchBarVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 1, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const scrollIndicator = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 1.6, duration: 0.6 },
  },
};

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.45, 0.75]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden"
      aria-label="Hero principal"
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div
          className="absolute inset-0 h-[130%] w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          role="img"
          aria-label="Playa paradisiaca con aguas cristalinas"
        />
      </motion.div>

      {/* Dark overlay */}
      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-b from-primary/60 via-black/40 to-black/70"
        style={{ opacity: overlayOpacity }}
      />

      {/* Decorative gradient accent */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/20 via-transparent to-accent/10 pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Tagline */}
          <motion.p
            variants={item}
            className="mb-4 font-body text-sm font-medium uppercase tracking-[0.25em] text-white/80 md:text-base"
          >
            Viaja Agencia — Tu mundo, tu estilo
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="mb-6 font-heading text-5xl font-bold leading-[1.1] text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Explora el Mundo{" "}
            <span className="text-gradient-gold inline-block">con Estilo</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="mx-auto max-w-2xl font-body text-base leading-relaxed text-white/85 sm:text-lg md:text-xl"
          >
            Mas de 20 anos creando experiencias de viaje inolvidables. Destinos
            exclusivos, asesoria personalizada y servicio 24/7.
          </motion.p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          variants={searchBarVariant}
          initial="hidden"
          animate="visible"
          className="mt-10 w-full max-w-4xl px-2 sm:mt-12"
        >
          <form
            className="glass-dark rounded-2xl p-3 sm:p-4"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Buscar viajes"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
              {/* Destination */}
              <div className="relative">
                <label htmlFor="hero-destination" className="sr-only">
                  Destino
                </label>
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
                  aria-hidden="true"
                />
                <select
                  id="hero-destination"
                  defaultValue=""
                  className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/10 pl-10 pr-4 font-body text-sm text-white placeholder-white/50 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                >
                  <option value="" disabled className="text-text">
                    Destino
                  </option>
                  {DESTINATIONS.map((dest) => (
                    <option key={dest} value={dest} className="text-text">
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="relative">
                <label htmlFor="hero-date" className="sr-only">
                  Fecha de viaje
                </label>
                <Calendar
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
                  aria-hidden="true"
                />
                <input
                  id="hero-date"
                  type="date"
                  placeholder="Fecha"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/10 pl-10 pr-4 font-body text-sm text-white placeholder-white/50 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent [color-scheme:dark]"
                />
              </div>

              {/* Travelers */}
              <div className="relative">
                <label htmlFor="hero-travelers" className="sr-only">
                  Numero de viajeros
                </label>
                <Users
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
                  aria-hidden="true"
                />
                <input
                  id="hero-travelers"
                  type="number"
                  min={1}
                  max={20}
                  placeholder="Viajeros"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/10 pl-10 pr-4 font-body text-sm text-white placeholder-white/50 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* CTA */}
              <button
                type="submit"
                className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-8 font-body text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-accent-dark hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-transparent active:scale-[0.98]"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>Buscar</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        variants={scrollIndicator}
        initial="hidden"
        animate="visible"
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="font-body text-xs tracking-widest text-white/50 uppercase">
            Descubre
          </span>
          <ChevronDown className="h-5 w-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
