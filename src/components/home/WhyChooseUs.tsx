"use client";

import { Wallet, Globe, Headphones, Map } from "lucide-react";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";

const ICON_MAP: Record<string, typeof Wallet> = {
  Wallet,
  Globe,
  Headphones,
  Map,
};

// Default pillars are now provided via useTranslations in the component body

type Pillar = { icon: string; title: string; description: string };

type WhyChooseUsProps = {
  content?: Record<string, string>;
};

export default function WhyChooseUs({ content = {} }: WhyChooseUsProps) {
  const t = useTranslations("whyChooseUs");
  const tag = content.why_tag || t("defaultTag");
  const heading = content.why_heading || t("defaultHeading");
  const description = content.why_description || t("defaultDescription");

  const defaultPillars: Pillar[] = [
    { icon: "Wallet", title: t("pillar1Title"), description: t("pillar1Desc") },
    { icon: "Globe", title: t("pillar2Title"), description: t("pillar2Desc") },
    { icon: "Headphones", title: t("pillar3Title"), description: t("pillar3Desc") },
    { icon: "Map", title: t("pillar4Title"), description: t("pillar4Desc") },
  ];
  let pillars: Pillar[] = defaultPillars;
  if (content.why_pillars) {
    try {
      pillars = JSON.parse(content.why_pillars);
    } catch {
      // keep defaults
    }
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <AnimatedSection variant="fade-up" className="text-center mb-12 md:mb-16">
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-widest mb-3">
            {tag}
          </span>
          <h2 className="font-heading text-text mb-4">
            {heading.includes(t("gradientWord")) ? (
              <>
                {heading.split(t("gradientWord"))[0]}
                <span className="text-gradient-accent">{t("gradientWord")}</span>
              </>
            ) : (
              heading
            )}
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            {description}
          </p>
          <div className="mt-6">
            <Image
              src="/images/site/iata-badge.png"
              alt={t("iataAlt")}
              width={120}
              height={60}
              className="mx-auto object-contain"
            />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {pillars.map((pillar, index) => {
            const Icon = ICON_MAP[pillar.icon] || Wallet;
            return (
              <AnimatedSection key={pillar.title} variant="fade-up" delay={index * 0.12} duration={0.5}>
                <div className={cn(
                  "glass rounded-2xl p-6 md:p-8 h-full",
                  "hover-lift cursor-default",
                  "border border-border/60 hover:border-accent/30",
                  "transition-colors duration-300"
                )}>
                  <div className="w-14 h-14 rounded-xl bg-accent-light/20 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-accent-dark" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-text mb-2.5 leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {pillar.description}
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
