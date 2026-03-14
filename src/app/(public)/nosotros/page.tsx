import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Award,
  Heart,
  Handshake,
  ArrowRight,
  MapPin,
  Users,
  Clock,
  Plane,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Nosotros | Viaja Agencia",
  description:
    "Conoce nuestra historia de más de 20 años creando experiencias de viaje inolvidables desde León, Guanajuato. Somos Viaja Agencia.",
};

const VALUES = [
  {
    icon: Shield,
    title: "Confianza",
    description:
      "Más de dos décadas respaldando cada viaje con transparencia, honestidad y el compromiso de siempre cumplir lo prometido.",
  },
  {
    icon: Award,
    title: "Excelencia",
    description:
      "Certificados por IATA y reconocidos por los mejores proveedores internacionales. Solo trabajamos con lo mejor para ti.",
  },
  {
    icon: Heart,
    title: "Personalización",
    description:
      "Cada viajero es único. Diseñamos experiencias a la medida de tus gustos, intereses y presupuesto.",
  },
  {
    icon: Handshake,
    title: "Compromiso",
    description:
      "Te acompañamos antes, durante y después de tu viaje. Soporte 24/7 para que disfrutes sin preocupaciones.",
  },
];

const STATS = [
  { value: "20+", label: "Años de experiencia", icon: Clock },
  { value: "10,000+", label: "Viajeros felices", icon: Users },
  { value: "50+", label: "Destinos mundiales", icon: MapPin },
  { value: "500+", label: "Vuelos gestionados al año", icon: Plane },
];

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
          alt="Pareja contemplando un atardecer dorado sobre el horizonte"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-black/60" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <AnimatedSection variant="fade-up">
            <span className="mb-4 inline-block font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
              Nuestra Historia
            </span>
            <h1 className="mb-4 font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
              Creamos{" "}
              <span className="text-gradient-gold inline-block">
                Experiencias
              </span>
            </h1>
            <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-white/85">
              Más de 20 años convirtiendo sueños de viaje en realidad desde el
              corazón del Bajío.
            </p>
          </AnimatedSection>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Story */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <AnimatedSection variant="slide-left">
              <span className="mb-3 inline-block font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Quiénes Somos
              </span>
              <h2 className="mb-6 font-heading text-text">
                Nuestra{" "}
                <span className="text-gradient">Historia</span>
              </h2>
              <div className="space-y-4 font-body text-text-muted leading-relaxed">
                <p>
                  Viaja Agencia nació en <strong className="text-text">León, Guanajuato</strong>,
                  con la visión de acercar el mundo a las familias de la región
                  del Bajío. Desde nuestros inicios, nos comprometimos a ofrecer
                  un servicio personalizado y de primera calidad.
                </p>
                <p>
                  Con más de <strong className="text-text">20 años de experiencia</strong> en
                  el sector turístico, hemos guiado a miles de viajeros hacia
                  experiencias inolvidables en los cinco continentes. Nuestro
                  equipo de asesores especializados conoce de primera mano cada
                  destino que recomendamos.
                </p>
                <p>
                  Hoy somos una agencia de viajes consolidada, respaldada por
                  certificaciones internacionales como{" "}
                  <strong className="text-text">IATA</strong>, y reconocida por
                  nuestro servicio de excelencia en la región.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="slide-right">
              <div className="relative">
                <div className="img-zoom overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
                    alt="Equipo de trabajo profesional en una oficina moderna"
                    width={640}
                    height={480}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 z-10 rounded-xl bg-primary p-5 shadow-elevated">
                  <p className="font-heading text-4xl font-bold text-white">20+</p>
                  <p className="font-body text-sm text-white/80">
                    Años de experiencia
                  </p>
                </div>
                <div className="absolute -right-4 -top-4 z-10 rounded-xl bg-accent p-4 shadow-elevated">
                  <Award className="h-8 w-8 text-white" aria-hidden="true" />
                  <p className="mt-1 font-body text-xs font-semibold text-white">
                    IATA
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat, index) => (
              <AnimatedSection
                key={stat.label}
                variant="fade-up"
                delay={index * 0.1}
                className="text-center"
              >
                <stat.icon
                  className="mx-auto mb-3 h-8 w-8 text-accent"
                  aria-hidden="true"
                />
                <p className="font-heading text-4xl font-bold text-white md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-1 font-body text-sm text-white/70">
                  {stat.label}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding aurora-bg">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Nuestros Pilares
            </p>
            <h2 className="font-heading text-text">
              Lo que nos{" "}
              <span className="text-gradient">define</span>
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => (
              <AnimatedSection
                key={value.title}
                variant="fade-up"
                delay={index * 0.1}
              >
                <div
                  className={cn(
                    "hover-lift glass cursor-default rounded-2xl p-8 text-center",
                    "transition-all duration-300"
                  )}
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <value.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-semibold text-text">
                    {value.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-text-muted">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Placeholder */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <AnimatedSection variant="fade-up" className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Nuestro Equipo
            </p>
            <h2 className="font-heading text-text">
              Las personas detrás de{" "}
              <span className="text-gradient">tu viaje</span>
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Equipo de Asesores",
                role: "Especialistas en destinos",
                image:
                  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80",
              },
              {
                name: "Equipo de Operaciones",
                role: "Logística y coordinación",
                image:
                  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80",
              },
              {
                name: "Atención al Cliente",
                role: "Soporte 24/7",
                image:
                  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80",
              },
            ].map((member, index) => (
              <AnimatedSection
                key={member.name}
                variant="scale-in"
                delay={index * 0.1}
              >
                <div className="hover-lift glass overflow-hidden rounded-2xl">
                  <div className="img-zoom relative aspect-[4/3]">
                    <Image
                      src={member.image}
                      alt={`${member.name} — ${member.role}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-heading text-xl font-semibold text-text">
                      {member.name}
                    </h3>
                    <p className="mt-1 font-body text-sm text-text-muted">
                      {member.role}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding aurora-bg">
        <div className="container-custom text-center">
          <AnimatedSection variant="fade-up">
            <h2 className="mb-4 font-heading text-text">
              ¿Listo para tu próxima{" "}
              <span className="text-gradient">aventura</span>?
            </h2>
            <p className="mx-auto mb-8 max-w-xl font-body text-lg text-text-muted">
              Déjanos crear la experiencia de viaje perfecta para ti. Nuestro
              equipo está listo para atenderte.
            </p>
            <Link
              href="/contacto"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-body font-semibold text-white shadow-card transition-colors duration-300 hover:bg-primary-light"
            >
              Contáctanos
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
