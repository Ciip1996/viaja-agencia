"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function LanguageSwitcher({ scrolled }: { scrolled?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");

  const otherLocale = locale === "es" ? "en" : "es";

  function handleSwitch() {
    router.replace(pathname, { locale: otherLocale as (typeof routing.locales)[number] });
  }

  return (
    <button
      onClick={handleSwitch}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 cursor-pointer border",
        scrolled
          ? "text-text-muted hover:text-primary border-border hover:border-primary/30"
          : "text-white/80 hover:text-white border-white/20 hover:border-white/40"
      )}
      aria-label={t(otherLocale)}
    >
      <Globe className="w-3.5 h-3.5" />
      <span className="uppercase">{otherLocale}</span>
    </button>
  );
}
