"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/data/mock-data";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <AnimatedSection variant="fade-up" delay={index * 0.08}>
      <div className="border-b border-border">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-4 py-6 text-left transition-colors duration-200",
            isOpen ? "text-primary" : "text-text hover:text-primary",
          )}
        >
          <h3 className="font-heading text-lg font-semibold leading-snug sm:text-xl">
            {question}
          </h3>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <ChevronDown
              size={20}
              className={cn(
                "transition-colors duration-200",
                isOpen ? "text-accent" : "text-text-muted",
              )}
            />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.25, delay: 0.05 },
              }}
              className="overflow-hidden"
            >
              <p className="pb-6 pr-12 leading-relaxed text-text-muted">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const sortedFaqs = [...faqs].sort(
    (a, b) => a.display_order - b.display_order,
  );

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <AnimatedSection variant="fade-up" className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest uppercase text-accent">
            Ayuda
          </p>
          <h2 className="text-gradient mb-4">Preguntas Frecuentes</h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
        </AnimatedSection>

        <div className="mx-auto max-w-3xl">
          {sortedFaqs.map((faq, i) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openId === faq.id}
              onToggle={() => toggle(faq.id)}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
