import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Globe, Compass } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { destinations } from "@/lib/data/mock-data";

export const metadata: Metadata = {
  title: "Destinos | Viaja Agencia",
  description:
    "Explora nuestros destinos alrededor del mundo. Europa, Asia, África, América y más — encuentra tu próxima aventura con Viaja Agencia.",
};

export default function DestinosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80"
          alt="Vista aérea de una isla tropical rodeada de aguas turquesa"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-black/60" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <AnimatedSection variant="fade-up">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Globe className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                Destinos Mundiales
              </span>
            </div>
            <h1 className="mb-4 font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
              Destinos para Todos{" "}
              <span className="text-gradient-gold inline-block">los Gustos</span>
            </h1>
            <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-white/85">
              12 regiones del mundo esperan por ti. Cada destino es una puerta a
              experiencias únicas, culturas fascinantes y paisajes inolvidables.
            </p>
          </AnimatedSection>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Destinations Grid */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Explora el Mundo
            </p>
            <h2 className="font-heading text-text">
              Encuentra tu{" "}
              <span className="text-gradient">próximo destino</span>
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {destinations.map((dest, index) => (
              <AnimatedSection
                key={dest.id}
                variant="scale-in"
                delay={index * 0.06}
                duration={0.5}
                className="h-full"
              >
                <Link
                  href="#"
                  className="group relative block h-[300px] overflow-hidden rounded-2xl cursor-pointer"
                  aria-label={`Explorar ${dest.name}`}
                >
                  {dest.hero_image_url && (
                    <Image
                      src={dest.hero_image_url}
                      alt={`Destino ${dest.name} — ${dest.description ?? dest.region}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  )}

                  <div
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500",
                      "bg-gradient-to-t from-black/80 via-black/30 to-transparent",
                      "group-hover:from-black/90 group-hover:via-black/50"
                    )}
                  />

                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                      <span className="font-body text-xs font-medium uppercase tracking-wider text-accent-light">
                        {dest.region}
                      </span>
                    </div>

                    <h3 className="font-heading text-2xl font-bold leading-tight text-white">
                      {dest.name}
                    </h3>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-500 ease-out",
                        "max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100"
                      )}
                    >
                      {dest.description && (
                        <p className="mt-2 font-body text-sm leading-relaxed text-white/80">
                          {dest.description}
                        </p>
                      )}
                      <span className="mt-2.5 inline-flex items-center gap-1 font-body text-sm font-medium text-accent">
                        Explorar
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 transition-all duration-500 group-hover:ring-accent/30" />
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding aurora-bg">
        <div className="container-custom text-center">
          <AnimatedSection variant="fade-up">
            <Compass className="mx-auto mb-4 h-10 w-10 text-accent" aria-hidden="true" />
            <h2 className="mb-4 font-heading text-text">
              ¿No encuentras tu{" "}
              <span className="text-gradient">destino ideal</span>?
            </h2>
            <p className="mx-auto mb-8 max-w-xl font-body text-lg text-text-muted">
              Nuestros asesores pueden crear un itinerario personalizado a
              cualquier rincón del mundo. Cuéntanos tu sueño y lo hacemos
              realidad.
            </p>
            <Link
              href="/contacto"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-body font-semibold text-white shadow-card transition-colors duration-300 hover:bg-primary-light"
            >
              Solicitar Asesoría
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
