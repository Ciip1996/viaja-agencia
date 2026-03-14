"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #0C4A6E 0%, #0E6FA0 40%, #0EA5E9 70%, #D4A574 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 70% 80%, rgba(212,165,116,0.2) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="container-custom relative">
        <div className="mx-auto max-w-2xl text-center">
          <AnimatedSection variant="fade-up">
            <p className="mb-3 text-sm font-semibold tracking-widest uppercase text-white/70">
              Newsletter
            </p>
            <h2 className="mb-6 font-heading text-white">
              Recibe las Mejores Ofertas
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/80">
              Suscribete a nuestro newsletter y se el primero en conocer
              promociones exclusivas y destinos de temporada.
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
                    Gracias! Te mantendremos informado.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 cursor-pointer text-sm text-white/60 underline underline-offset-4 transition-colors hover:text-white/90"
                  >
                    Suscribir otro correo
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
                  <div
                    className={cn(
                      "flex flex-col gap-3 rounded-2xl p-2 transition-shadow duration-300 sm:flex-row sm:gap-0 sm:rounded-full sm:bg-white/15 sm:backdrop-blur-md",
                      focused && "shadow-[0_0_0_2px_rgba(212,165,116,0.5)]",
                    )}
                  >
                    <label htmlFor="newsletter-email" className="sr-only">
                      Correo electronico
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      className="flex-1 rounded-full bg-white/15 px-6 py-4 text-white placeholder-white/50 outline-none backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none"
                    />
                    <button
                      type="submit"
                      className="group flex cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-accent-dark hover:shadow-lg active:scale-[0.98]"
                    >
                      Suscribirme
                      <Send
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                  <p className="mt-4 text-xs text-white/50">
                    Sin spam. Puedes darte de baja en cualquier momento.
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
