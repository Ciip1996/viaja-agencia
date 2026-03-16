"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, ChevronDown, MapPin, Calendar, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

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

type HeroProps = {
  content?: Record<string, string>;
};

export default function Hero({ content = {} }: HeroProps) {
  const t = useTranslations("hero");
  const tagline = content.hero_tagline || t("defaultTag");
  const heading = content.hero_heading || t("defaultHeading");
  const subtitle = content.hero_subtitle || t("defaultSubtitle");
  const videoUrl = content.hero_video_url || "/videos/viaja_hero.webm";
  const posterUrl = content.hero_poster_url || "/images/site/hero-bg.png";

  const DESTINATIONS = [
    t("destinations.europa"), t("destinations.asia"), t("destinations.medioOriente"),
    t("destinations.africa"), t("destinations.sudamerica"), t("destinations.centroamerica"),
    t("destinations.caribe"), t("destinations.estadosUnidos"), t("destinations.canada"),
    t("destinations.mexico"), t("destinations.pacifico"), t("destinations.cruceros"),
  ];

  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.45, 0.75]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  const headingParts = heading.split(" ");
  const lastWord = headingParts.pop();
  const firstWords = headingParts.join(" ");

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden"
      aria-label={t("ariaLabel")}
    >
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-[130%] w-full object-cover"
          poster={posterUrl}
          aria-label={t("videoAria")}
        >
          <source src={videoUrl} type="video/webm" />
        </video>
      </motion.div>

      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-b from-primary/60 via-black/40 to-black/70"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/20 via-transparent to-accent/10 pointer-events-none" />

      <motion.div
        className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.div variants={container} initial="hidden" animate="visible" className="max-w-4xl">
          <motion.p variants={item} className="mb-4 font-body text-sm font-medium uppercase tracking-[0.25em] text-white/80 md:text-base">
            {tagline}
          </motion.p>

          <motion.h1 variants={item} className="mb-6 font-heading text-5xl font-bold uppercase leading-[1.1] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            {firstWords}{" "}
            <span className="bg-gradient-to-r from-[#1DCEC8] to-[#2667FF] bg-clip-text text-transparent inline-block">
              {lastWord}
            </span>
          </motion.h1>

          <motion.p variants={item} className="mx-auto max-w-2xl font-body text-base leading-relaxed text-white/85 sm:text-lg md:text-xl">
            {subtitle}
          </motion.p>
        </motion.div>

        <motion.div variants={searchBarVariant} initial="hidden" animate="visible" className="mt-10 w-full max-w-4xl px-2 sm:mt-12">
          <form
            className="glass-dark rounded-2xl p-3 sm:p-4"
            onSubmit={(e) => {
              e.preventDefault();
              const params = new URLSearchParams();
              if (destination) params.set("destination", destination);
              if (date) {
                params.set("checkIn", date);
                const co = new Date(date);
                co.setDate(co.getDate() + 3);
                params.set("checkOut", co.toISOString().split("T")[0]);
              }
              if (travelers) params.set("travelers", travelers);
              router.push(`/buscar?${params.toString()}`);
            }}
            aria-label={t("searchAria")}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
              <div className="relative">
                <label htmlFor="hero-destination" className="sr-only">{t("destinationLabel")}</label>
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" aria-hidden="true" />
                <select
                  id="hero-destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/10 pl-10 pr-4 font-body text-sm text-white placeholder-white/50 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                >
                  <option value="" disabled className="text-text">{t("destinationPlaceholder")}</option>
                  {DESTINATIONS.map((dest) => (
                    <option key={dest} value={dest} className="text-text">{dest}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label htmlFor="hero-date" className="sr-only">{t("dateLabel")}</label>
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" aria-hidden="true" />
                <input
                  id="hero-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder={t("datePlaceholder")}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/10 pl-10 pr-4 font-body text-sm text-white placeholder-white/50 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent [color-scheme:dark]"
                />
              </div>

              <div className="relative">
                <label htmlFor="hero-travelers" className="sr-only">{t("travelersLabel")}</label>
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" aria-hidden="true" />
                <input
                  id="hero-travelers"
                  type="number"
                  min={1}
                  max={20}
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  placeholder={t("travelersPlaceholder")}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/10 pl-10 pr-4 font-body text-sm text-white placeholder-white/50 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              <button
                type="submit"
                className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-8 font-body text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-accent-dark hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-transparent active:scale-[0.98]"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>{t("searchButton")}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      <motion.div variants={scrollIndicator} initial="hidden" animate="visible" className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2" aria-hidden="true">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center gap-1">
          <span className="font-body text-xs tracking-widest text-white/50 uppercase">{t("scrollDiscover")}</span>
          <ChevronDown className="h-5 w-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
