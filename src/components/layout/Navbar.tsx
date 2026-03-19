"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import type { FeatureFlags } from "@/lib/cms/feature-flags";

type ChildLink = { href: string; label: string; flag?: keyof FeatureFlags };
type NavItem = { href?: string; label: string; children?: ChildLink[] };

export default function Navbar({ featureFlags }: { featureFlags?: FeatureFlags }) {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const ff = featureFlags ?? ({} as FeatureFlags);

  const raw: NavItem[] = [
    { href: "/", label: t("home") },
    {
      label: t("trips"),
      children: [
        { href: "/destinos", label: t("destinations") },
        { href: "/destinos-megatravel", label: t("exploreDestinations") },
        { href: "/paquetes", label: t("packages") },
        { href: "/grupos", label: t("groupTrips") },
        { href: "/eventos", label: t("specialEvents") },
      ],
    },
    {
      label: t("reserve"),
      children: [
        { href: "/hoteles", label: t("hotels"), flag: "feature_hoteles" },
        { href: "/tours", label: t("tours"), flag: "feature_tours" },
        { href: "/autos", label: t("carRental"), flag: "feature_autos" },
      ],
    },
    { href: "/nosotros", label: t("aboutUs") },
    { href: "/blog", label: t("blog") },
    { href: "/contacto", label: t("contact") },
  ];

  const navLinks = raw
    .map((item) => {
      if (!item.children) return item;
      const kids = item.children.filter((c) => !c.flag || ff[c.flag]);
      return { ...item, children: kids };
    })
    .filter((item) => !item.children || item.children.length > 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => mobileMenuRef.current?.focus());
    } else {
      document.body.style.overflow = "";
      mobileToggleRef.current?.focus();
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-white focus:text-primary focus:rounded-lg focus:shadow-lg"
      >
        {t("skipToContent")}
      </a>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "top-0 glass shadow-glass"
            : "top-10 sm:top-10 bg-transparent"
        )}
      >
        <nav className="container-custom flex items-center justify-between h-16 md:h-20" aria-label={t("mainMenu")}>
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <Image
              src="/logo-viaja.png"
              alt={t("brandAlt")}
              width={40}
              height={40}
              className="w-9 h-9 md:w-10 md:h-10 rounded-lg object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
              priority
            />
            <div className="flex items-baseline gap-1.5">
              <span className={cn(
                "font-heading text-2xl font-bold tracking-tight transition-colors duration-500",
                scrolled ? "text-primary" : "text-white"
              )}>
                {t("brandName")}
              </span>
              <span className={cn(
                "font-heading text-lg font-normal hidden sm:inline transition-colors duration-500",
                scrolled ? "text-text-muted" : "text-white/70"
              )}>
                {t("brandSuffix")}
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer",
                      scrolled ? "text-text hover:text-primary" : "text-white/90 hover:text-white"
                    )}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === link.label}
                  >
                    {link.label}
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      openDropdown === link.label && "rotate-180"
                    )} aria-hidden="true" />
                  </button>
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 py-2 w-52 glass rounded-xl shadow-elevated"
                        role="menu"
                        aria-label={link.label}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            className="block px-4 py-2.5 text-sm text-text hover:text-secondary hover:bg-secondary/10 transition-colors duration-150 cursor-pointer"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer",
                    scrolled ? "text-text hover:text-primary" : "text-white/90 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher scrolled={scrolled} />
            <Link
              href="/contacto"
              className="px-6 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-dark transition-colors duration-200 cursor-pointer shadow-card"
            >
              {t("quoteTrip")}
            </Link>
          </div>

          <button
            ref={mobileToggleRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "lg:hidden p-2 cursor-pointer transition-colors duration-500",
              scrolled ? "text-text" : "text-white"
            )}
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <nav
              ref={mobileMenuRef}
              tabIndex={-1}
              className="flex flex-col items-center justify-center h-full gap-6 pt-20 outline-none"
              aria-label={t("mobileMenu")}
            >
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="flex flex-col items-center gap-3">
                    <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                      {link.label}
                    </span>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-2xl font-heading font-semibold text-text hover:text-primary transition-colors cursor-pointer"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-heading font-semibold text-text hover:text-primary transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="mt-4 flex flex-col items-center gap-4">
                <LanguageSwitcher scrolled={true} />
                <Link
                  href="/contacto"
                  onClick={() => setMobileOpen(false)}
                  className="px-8 py-3 bg-accent text-white font-semibold rounded-xl cursor-pointer"
                >
                  {t("quoteTrip")}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
