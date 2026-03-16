"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import QuoteWizard from "./QuoteWizard";

export default function QuoteButton() {
  const t = useTranslations("quoter");
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 font-body text-sm font-semibold text-white shadow-lg transition-shadow hover:shadow-xl cursor-pointer"
        aria-label={t("buttonLabel")}
      >
        <Calculator className="h-4 w-4" />
        <span>{t("buttonLabel")}</span>
      </motion.button>
      <QuoteWizard isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
