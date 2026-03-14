"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/data/mock-data";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
  }),
};

export default function Testimonials() {
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);

  const paginate = useCallback(
    (newIndex: number) => {
      const dir = newIndex > activeIndex ? 1 : -1;
      setActiveIndex([newIndex, dir]);
    },
    [activeIndex],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (activeIndex + 1) % testimonials.length;
      paginate(next);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex, paginate]);

  const current = testimonials[activeIndex];

  return (
    <section className="aurora-section section-padding relative overflow-hidden">
      <div className="container-custom">
        <AnimatedSection variant="fade-up" className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest uppercase text-accent">
            Testimonios
          </p>
          <h2 className="text-gradient mb-4">
            Lo Que Dicen Nuestros Viajeros
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
        </AnimatedSection>

        <AnimatedSection variant="fade-up" delay={0.2}>
          <div className="relative mx-auto min-h-[320px] max-w-3xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="absolute inset-0"
              >
                <div className="glass hover-lift mx-auto max-w-2xl rounded-2xl p-8 shadow-[var(--shadow-glass)] sm:p-12">
                  <div className="mb-6 flex justify-center">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-accent opacity-40"
                      aria-hidden="true"
                    >
                      <path
                        d="M14 28H6l6-14h6L14 28Zm18 0h-8l6-14h6L32 28Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  <blockquote className="mb-8 text-center font-body text-lg leading-relaxed text-text-muted italic sm:text-xl">
                    {current.review_text}
                  </blockquote>

                  <div className="mb-4 flex justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={cn(
                          "transition-colors",
                          i < current.rating
                            ? "fill-accent text-accent"
                            : "fill-border text-border",
                        )}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="font-heading text-lg font-semibold text-text">
                      {current.client_name}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      {current.trip_destination}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="mt-8 flex items-center justify-center gap-3"
            role="tablist"
            aria-label="Testimonios"
          >
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Testimonio de ${t.client_name}`}
                onClick={() => paginate(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                  i === activeIndex
                    ? "w-8 bg-accent"
                    : "w-2.5 bg-text-light/40 hover:bg-text-muted/60",
                )}
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
