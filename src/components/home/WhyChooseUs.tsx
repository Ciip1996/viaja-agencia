import { Shield, Globe, Headphones, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";

const propositions = [
  {
    icon: Shield,
    title: "20+ A\u00f1os de Experiencia",
    description:
      "Dos d\u00e9cadas respald\u00e1ndonos como la agencia de confianza del Baj\u00edo con certificaci\u00f3n IATA.",
  },
  {
    icon: Globe,
    title: "Destinos Sin L\u00edmites",
    description:
      "Acceso a m\u00e1s de 170,000 hoteles y miles de experiencias en todo el mundo.",
  },
  {
    icon: Headphones,
    title: "Soporte 24/7",
    description:
      "Asistencia en todo momento durante tu viaje. Estamos a una llamada de distancia.",
  },
  {
    icon: Sparkles,
    title: "Experiencias a la Medida",
    description:
      "Itinerarios personalizados dise\u00f1ados por expertos para hacer realidad tu viaje so\u00f1ado.",
  },
] as const;

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <AnimatedSection variant="fade-up" className="text-center mb-12 md:mb-16">
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-widest mb-3">
            Por qu\u00e9 elegirnos
          </span>
          <h2 className="font-heading text-text mb-4">
            Tu Viaje en las{" "}
            <span className="text-gradient-gold">Mejores Manos</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            M\u00e1s de 20 a\u00f1os creando experiencias de viaje inolvidables desde el
            coraz\u00f3n de M\u00e9xico
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {propositions.map((item, index) => {
            const Icon = item.icon;
            return (
              <AnimatedSection
                key={item.title}
                variant="fade-up"
                delay={index * 0.12}
                duration={0.5}
              >
                <div
                  className={cn(
                    "glass rounded-2xl p-6 md:p-8 h-full",
                    "hover-lift cursor-default",
                    "border border-border/60 hover:border-accent/30",
                    "transition-colors duration-300"
                  )}
                >
                  <div className="w-14 h-14 rounded-xl bg-accent-light/20 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-accent-dark" strokeWidth={1.8} />
                  </div>

                  <h3 className="font-heading text-xl font-bold text-text mb-2.5 leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-text-muted text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
