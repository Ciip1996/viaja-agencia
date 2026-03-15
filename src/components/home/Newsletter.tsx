"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";

type NewsletterProps = {
  content?: Record<string, string>;
};

export default function Newsletter({ content = {} }: NewsletterProps) {
  const t = useTranslations("newsletter");
  const tag = content.newsletter_tag || t("defaultTag");
  const heading = content.newsletter_heading || t("defaultHeading");
  const description = content.newsletter_description || t("defaultDescription");

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al suscribirse");
        return;
      }

      setSubmitted(true);
      setEmail("");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Image
        src="/images/site/newsletter-bg.png"
        alt=""
        fill
        className="absolute inset-0 -z-20 object-cover"
        priority={false}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, rgba(6,45,151,0.85) 0%, rgba(38,103,255,0.75) 50%, rgba(29,206,200,0.65) 100%)",
        }}
      />

      <div className="container-custom relative">
        <div className="mx-auto max-w-2xl text-center">
          <AnimatedSection variant="fade-up">
            <p className="mb-3 text-sm font-semibold tracking-widest uppercase text-white/70">
              {tag}
            </p>
            <h2 className="mb-6 font-heading text-white">{heading}</h2>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/80">
              {description}
            </p>
          </AnimatedSection>

          <AnimatedSection variant="fade-up" delay={0.2}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl bg-white/15 p-8 backdrop-blur-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                    <CheckCircle size={28} className="text-white" />
                  </div>
                  <p className="text-xl font-semibold text-white">
                    {t("successMessage")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 cursor-pointer text-sm text-white/60 underline underline-offset-4 transition-colors hover:text-white/90"
                  >
                    {t("subscribeAnother")}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="mx-auto max-w-lg"
                >
                  <div className={cn(
                    "flex flex-col gap-3 rounded-2xl p-2 transition-shadow duration-300 sm:flex-row sm:gap-0 sm:rounded-full sm:bg-white/15 sm:backdrop-blur-md",
                    focused && "shadow-[0_0_0_2px_rgba(29,206,200,0.5)]",
                  )}>
                    <label htmlFor="newsletter-email" className="sr-only">{t("emailLabel")}</label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      placeholder={t("emailPlaceholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      className="flex-1 rounded-full bg-white/15 px-6 py-4 text-white placeholder-white/50 outline-none backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-accent-dark hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? t("sending") ?? "Enviando..." : t("submitButton")}
                      <Send size={16} className={cn("transition-transform duration-200 group-hover:translate-x-0.5", loading && "animate-pulse")} />
                    </button>
                  </div>
                  {error && (
                    <p className="mt-3 text-sm text-red-300">{error}</p>
                  )}
                  <p className="mt-4 text-xs text-white/50">
                    {t("disclaimer")}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
