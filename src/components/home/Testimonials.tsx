"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";
import type { GoogleReview, GoogleReviewsData } from "@/lib/services/google-places";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
  }),
};

type TestimonialsProps = {
  content?: Record<string, string>;
  googleReviews?: GoogleReviewsData;
};

function GoogleStars({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            "transition-colors",
            i < rating ? "fill-accent text-accent" : "fill-border text-border"
          )}
        />
      ))}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GoogleBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/80 px-2 py-0.5 text-[10px] font-medium text-text-muted">
      <GoogleIcon />
      Google
    </span>
  );
}

function GoogleReviewCard({ review }: { review: GoogleReview }) {
  const initial = review.authorName.charAt(0).toUpperCase();

  return (
    <div className="glass hover-lift mx-auto max-w-2xl rounded-2xl p-8 shadow-[var(--shadow-glass)] sm:p-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 font-heading text-lg font-bold text-accent">
            {initial}
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-text">
              {review.authorName}
            </p>
            <p className="text-xs text-text-muted">{review.relativeTime}</p>
          </div>
        </div>
        <GoogleBadge />
      </div>

      <div className="mb-4 flex justify-center">
        <GoogleStars rating={review.rating} />
      </div>

      <blockquote className="mb-4 text-center font-body text-lg leading-relaxed text-text-muted italic sm:text-xl">
        {review.text}
      </blockquote>
    </div>
  );
}

export default function Testimonials({
  content = {},
  googleReviews,
}: TestimonialsProps) {
  const t = useTranslations("testimonials");
  const tag = content.testimonials_tag || t("defaultTag");
  const heading = content.testimonials_heading || t("defaultHeading");

  const reviews = googleReviews?.reviews ?? [];
  const itemCount = reviews.length;

  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);

  const paginate = useCallback(
    (newIndex: number) => {
      const dir = newIndex > activeIndex ? 1 : -1;
      setActiveIndex([newIndex, dir]);
    },
    [activeIndex],
  );

  useEffect(() => {
    if (itemCount === 0) return;
    const timer = setInterval(() => {
      const next = (activeIndex + 1) % itemCount;
      paginate(next);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex, paginate, itemCount]);

  if (itemCount === 0) return null;

  const currentKey = reviews[activeIndex]?.authorName ?? activeIndex;

  return (
    <section className="aurora-section section-padding relative overflow-hidden">
      <div className="container-custom">
        <AnimatedSection variant="fade-up" className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest uppercase text-accent">
            {tag}
          </p>
          <h2 className="text-gradient mb-4">{heading}</h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent" />

          {googleReviews && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <GoogleIcon />
                <GoogleStars rating={Math.round(googleReviews.rating)} size={20} />
                <span className="text-sm font-medium text-text">
                  {googleReviews.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-text-muted">
                {googleReviews.totalReviews} reseñas en Google
              </p>
            </div>
          )}
        </AnimatedSection>

        <AnimatedSection variant="fade-up" delay={0.2}>
          <div className="relative mx-auto min-h-[320px] max-w-3xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentKey}
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
                <GoogleReviewCard review={reviews[activeIndex]!} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3" role="tablist" aria-label={t("tablistAria")}>
            {reviews.map((review, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={t("testimonialAria", { name: review.authorName })}
                onClick={() => paginate(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                  i === activeIndex ? "w-8 bg-accent" : "w-2.5 bg-text-light/40 hover:bg-text-muted/60",
                )}
              />
            ))}
          </div>

          {googleReviews?.googleMapsUrl && (
            <div className="mt-8 text-center">
              <a
                href={googleReviews.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent/80"
              >
                Ver todas las reseñas en Google Maps
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
