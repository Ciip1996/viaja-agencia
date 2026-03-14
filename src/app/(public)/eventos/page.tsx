import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Gem,
  Sparkles,
  Building2,
  CalendarHeart,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Eventos Especiales | Viaja Agencia",
  description:
    "Bodas destino, lunas de miel, aniversarios y viajes corporativos. Hacemos que cada evento sea una experiencia extraordinaria.",
};

const EVENT_TYPES = [
  {
    icon: Heart,
    title: "Bodas Destino",
    description:
      "Celebra tu amor en los escenarios más románticos del mundo. Organizamos cada detalle — desde la ceremonia frente al mar hasta la recepción de ensueño. Coordinación con proveedores locales, permisos legales y logística completa para tus invitados.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    features: ["Ceremonia en playa", "Coordinación de invitados", "Paquetes todo incluido"],
  },
  {
    icon: Gem,
    title: "Lunas de Miel",
    description:
      "Comienza tu nueva vida juntos con un viaje inolvidable. Destinos exclusivos, hoteles adults-only, cenas románticas privadas y experiencias diseñadas para parejas. Desde las Maldivas hasta la Toscana — tu luna de miel perfecta te espera.",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
    features: ["Hoteles adults-only", "Cenas privadas", "Itinerarios románticos"],
  },
  {
    icon: Sparkles,
    title: "Aniversarios",
    description:
      "Celebra los años de amor con un viaje que los reconecte. Ya sea una escapada de fin de semana o un viaje por Europa, diseñamos experiencias a la medida de su historia. Sorpresas, upgrades y momentos mágicos incluidos.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    features: ["Sorpresas personalizadas", "Upgrades de cortesía", "Experiencias VIP"],
  },
  {
    icon: Building2,
    title: "Corporativos",
    description:
      "Viajes de incentivo, convenciones y team-building que inspiran. Manejamos la logística completa para grupos empresariales — vuelos, hospedaje, salas de reuniones, actividades y transporte. Resultados medibles para tu organización.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    features: ["Viajes de incentivo", "Logística empresarial", "Team-building"],
  },
];

export default function EventosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&q=80"
          alt="Elegante celebración al aire libre con luces decorativas al atardecer"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-black/60" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <AnimatedSection variant="fade-up">
            <div className="mb-4 flex items-center justify-center gap-2">
              <CalendarHeart className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                Eventos Especiales
              </span>
            </div>
            <h1 className="mb-4 font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
              Momentos{" "}
              <span className="text-gradient-gold inline-block">
                Extraordinarios
              </span>
            </h1>
            <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-white/85">
              Cada celebración merece un escenario a la altura. Convertimos tus
              eventos más importantes en experiencias de viaje inolvidables.
            </p>
          </AnimatedSection>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Event Types */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Nuestros Servicios
            </p>
            <h2 className="font-heading text-text">
              Eventos que{" "}
              <span className="text-gradient">trascienden</span>
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </AnimatedSection>

          <div className="space-y-16">
            {EVENT_TYPES.map((event, index) => {
              const isReversed = index % 2 !== 0;
              return (
                <AnimatedSection
                  key={event.title}
                  variant="fade-up"
                  delay={0.1}
                >
                  <div
                    className={cn(
                      "grid items-center gap-8 lg:grid-cols-2 lg:gap-14",
                      isReversed && "lg:[direction:rtl]"
                    )}
                  >
                    {/* Image */}
                    <div className="img-zoom overflow-hidden rounded-2xl lg:[direction:ltr]">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={event.image}
                          alt={`${event.title} — evento especial`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                        <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur-sm">
                          <event.icon
                            className="h-6 w-6 text-accent"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:[direction:ltr]">
                      <h3 className="mb-4 font-heading text-3xl font-semibold text-text md:text-4xl">
                        {event.title}
                      </h3>
                      <p className="mb-6 font-body leading-relaxed text-text-muted">
                        {event.description}
                      </p>

                      <ul className="mb-8 space-y-2">
                        {event.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 font-body text-sm text-text"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href="/contacto"
                        className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 font-body text-sm font-semibold text-white shadow-card transition-colors duration-300 hover:bg-primary-light"
                      >
                        Planificar mi {event.title.split(" ")[0].toLowerCase() === "lunas" ? "Luna de Miel" : event.title}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <Image
          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80"
          alt="Pareja celebrando en un destino paradisíaco"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/80" />

        <div className="container-custom relative z-10 text-center">
          <AnimatedSection variant="fade-up">
            <CalendarHeart
              className="mx-auto mb-4 h-10 w-10 text-accent"
              aria-hidden="true"
            />
            <h2 className="mb-4 font-heading text-4xl font-bold text-white md:text-5xl">
              Tu evento merece lo extraordinario
            </h2>
            <p className="mx-auto mb-8 max-w-xl font-body text-lg text-white/80">
              Cuéntanos tu visión y nuestro equipo especializado creará una
              propuesta personalizada para tu celebración.
            </p>
            <Link
              href="/contacto"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-body font-semibold text-white shadow-lg transition-all duration-200 hover:bg-accent-dark hover:shadow-xl"
            >
              Solicitar Propuesta
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
