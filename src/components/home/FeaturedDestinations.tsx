import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { destinations } from "@/lib/data/mock-data";

function DestinationCard({
  destination,
  size,
  index,
}: {
  destination: (typeof destinations)[number];
  size: "large" | "small";
  index: number;
}) {
  const isLarge = size === "large";

  return (
    <AnimatedSection
      variant="scale-in"
      delay={index * 0.08}
      duration={0.5}
      className="h-full"
    >
      <Link
        href="/destinos"
        className={cn(
          "group relative block overflow-hidden rounded-2xl cursor-pointer",
          isLarge ? "h-[340px] md:h-[420px]" : "h-[220px] md:h-[260px]"
        )}
      >
        {destination.hero_image_url && (
          <Image
            src={destination.hero_image_url}
            alt={`Destino ${destination.name} - ${destination.description ?? destination.region}`}
            fill
            sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
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

        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
          <div className="flex items-center gap-1.5 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="text-accent-light text-xs font-medium uppercase tracking-wider">
              {destination.region}
            </span>
          </div>

          <h3
            className={cn(
              "font-heading font-bold text-white leading-tight",
              isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
            )}
          >
            {destination.name}
          </h3>

          <div
            className={cn(
              "overflow-hidden transition-all duration-500 ease-out",
              "max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100"
            )}
          >
            {destination.description && (
              <p className="text-white/80 text-sm mt-2 leading-relaxed line-clamp-2">
                {destination.description}
              </p>
            )}
            <span className="inline-flex items-center gap-1 text-accent text-sm font-medium mt-2.5">
              Explorar
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-accent/30 transition-all duration-500 pointer-events-none" />
      </Link>
    </AnimatedSection>
  );
}

export default function FeaturedDestinations() {
  const sorted = [...destinations].sort(
    (a, b) => a.display_order - b.display_order
  );
  const featured = sorted.slice(0, 4);
  const secondary = sorted.slice(4, 12);

  return (
    <section className="aurora-section section-padding">
      <div className="container-custom">
        <AnimatedSection variant="fade-up" className="text-center mb-12 md:mb-16">
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-widest mb-3">
            Destinos
          </span>
          <h2 className="font-heading text-text mb-4">
            Destinos para Todos los{" "}
            <span className="text-gradient">Gustos</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            12 regiones del mundo esperan por ti
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {featured.map((dest, i) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              size="large"
              index={i}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {secondary.map((dest, i) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              size="small"
              index={i + 4}
            />
          ))}
        </div>

        <AnimatedSection variant="fade-up" delay={0.6} className="text-center mt-10 md:mt-14">
          <Link
            href="/destinos"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors duration-300 cursor-pointer shadow-card"
          >
            Ver Todos los Destinos
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
