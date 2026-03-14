import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, Sparkles, Tag } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { promotions } from "@/lib/data/mock-data";
import { formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Paquetes | Viaja Agencia",
  description:
    "Descubre nuestros paquetes de viaje exclusivos. Ofertas irresistibles a los destinos más increíbles del mundo.",
};

const DURATION_MAP: Record<string, string> = {
  Grecia: "8 días / 7 noches",
  Italia: "7 días / 6 noches",
  París: "8 días / 7 noches",
  Maldivas: "7 días / 6 noches",
  Marruecos: "8 días / 7 noches",
  Japón: "10 días / 9 noches",
};

export default function PaquetesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80"
          alt="Lago cristalino rodeado de montañas verdes al amanecer"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-black/60" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <AnimatedSection variant="fade-up">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                Paquetes Exclusivos
              </span>
            </div>
            <h1 className="mb-4 font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
              Viajes{" "}
              <span className="text-gradient-gold inline-block">Inolvidables</span>
            </h1>
            <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-white/85">
              Paquetes diseñados con atención al detalle para que solo te
              preocupes por disfrutar. Vuelos, hoteles, tours y experiencias —
              todo incluido.
            </p>
          </AnimatedSection>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Promotions */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Ofertas de Temporada
            </p>
            <h2 className="font-heading text-text">
              Nuestros paquetes{" "}
              <span className="text-gradient">más solicitados</span>
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {promotions.map((promo, index) => (
              <AnimatedSection
                key={promo.id}
                variant="fade-up"
                delay={index * 0.1}
                className="group"
              >
                <div className="hover-lift glass overflow-hidden rounded-2xl">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="img-zoom relative aspect-[4/3] md:aspect-auto md:w-[45%]">
                      <Image
                        src={promo.image_url ?? ""}
                        alt={`${promo.title} — ${promo.destination}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="object-cover"
                      />

                      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />

                      {promo.badge && (
                        <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-white shadow-md">
                          {promo.badge}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 text-text-muted">
                            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="font-body text-xs font-medium uppercase tracking-wider">
                              {promo.destination}
                            </span>
                          </span>
                          {DURATION_MAP[promo.destination] && (
                            <span className="inline-flex items-center gap-1.5 text-text-muted">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="font-body text-xs font-medium uppercase tracking-wider">
                                {DURATION_MAP[promo.destination]}
                              </span>
                            </span>
                          )}
                        </div>

                        <h3 className="mb-3 font-heading text-2xl font-semibold text-text transition-colors group-hover:text-primary">
                          {promo.title}
                        </h3>

                        <p className="mb-5 line-clamp-3 font-body text-sm leading-relaxed text-text-muted">
                          {promo.description}
                        </p>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="font-body text-xs font-medium text-text-muted">
                            Desde
                          </p>
                          <p className="font-heading text-3xl font-bold text-primary">
                            {formatPrice(promo.price_usd, promo.currency)}
                          </p>
                          <p className="font-body text-xs text-text-light">
                            por persona
                          </p>
                        </div>

                        <Link
                          href="/contacto"
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-6 py-3 font-body text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-accent-dark hover:shadow-lg"
                        >
                          Consultar
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding aurora-bg">
        <div className="container-custom text-center">
          <AnimatedSection variant="fade-up">
            <Tag className="mx-auto mb-4 h-10 w-10 text-accent" aria-hidden="true" />
            <h2 className="mb-4 font-heading text-text">
              ¿Buscas algo{" "}
              <span className="text-gradient">diferente</span>?
            </h2>
            <p className="mx-auto mb-8 max-w-xl font-body text-lg text-text-muted">
              Creamos paquetes a la medida de tus necesidades. Cuéntanos tu
              viaje soñado y nuestros asesores diseñarán la experiencia
              perfecta para ti.
            </p>
            <Link
              href="/contacto"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-body font-semibold text-white shadow-card transition-colors duration-300 hover:bg-primary-light"
            >
              Solicitar Cotización
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
