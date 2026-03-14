"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Plane, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/", label: "Inicio" },
  {
    label: "Viajes",
    children: [
      { href: "/destinos", label: "Destinos" },
      { href: "/paquetes", label: "Paquetes" },
      { href: "/grupos", label: "Viajes Grupales" },
      { href: "/eventos", label: "Eventos Especiales" },
    ],
  },
  {
    label: "Reservar",
    children: [
      { href: "/hoteles", label: "Hoteles" },
      { href: "/tours", label: "Tours y Excursiones" },
      { href: "/autos", label: "Renta de Autos" },
    ],
  },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "top-0 left-0 right-0 glass shadow-glass"
            : "top-4 left-4 right-4 bg-transparent"
        )}
      >
        <nav className="container-custom flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <Plane className="w-6 h-6 text-accent transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-heading text-2xl font-bold text-primary tracking-tight">
              Viaja
            </span>
            <span className="font-heading text-lg font-normal text-text-muted hidden sm:inline">
              Agencia
            </span>
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
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-text hover:text-primary transition-colors duration-200 cursor-pointer">
                    {link.label}
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      openDropdown === link.label && "rotate-180"
                    )} />
                  </button>
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 py-2 w-52 glass rounded-xl shadow-elevated"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-text hover:text-primary hover:bg-primary/5 transition-colors duration-150 cursor-pointer"
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
                  className="px-4 py-2 text-sm font-medium text-text hover:text-primary transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contacto"
              className="px-6 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-dark transition-colors duration-200 cursor-pointer shadow-card"
            >
              Cotizar Viaje
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 cursor-pointer"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
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
            <nav className="flex flex-col items-center justify-center h-full gap-6 pt-20">
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
              <Link
                href="/contacto"
                onClick={() => setMobileOpen(false)}
                className="mt-4 px-8 py-3 bg-accent text-white font-semibold rounded-xl cursor-pointer"
              >
                Cotizar Viaje
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
