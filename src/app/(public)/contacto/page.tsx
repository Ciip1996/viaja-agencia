"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  User,
  MessageSquare,
  Plane,
  CheckCircle,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";

const TRAVEL_TYPES = [
  "Luna de Miel",
  "Familiar",
  "Aventura",
  "Grupal",
  "Corporativo",
  "Crucero",
  "Todo Incluido",
  "Personalizado",
];

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Dirección",
    value: "Nube #522, Col. Jardines del Moral, C.P. 37160, León, Gto., México",
    href: "https://maps.google.com/?q=Nube+522+Jardines+del+Moral+Leon+Guanajuato",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "477 779 0610 ext 102-115",
    href: "tel:+524777790610",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@viajaagencia.com.mx",
    href: "mailto:info@viajaagencia.com.mx",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun — Vie: 9:00 — 19:00 · Sáb: 10:00 — 14:00",
    href: null,
  },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  travelType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactoPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    travelType: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Tu nombre es requerido";
    if (!form.email.trim()) {
      errs.email = "Tu email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Ingresa un email válido";
    }
    if (!form.message.trim()) errs.message = "Escribe tu mensaje";
    return errs;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&q=80"
          alt="Recepción de hotel de lujo con decoración elegante"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-black/60" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <AnimatedSection variant="fade-up">
            <div className="mb-4 flex items-center justify-center gap-2">
              <MessageSquare className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                Hablemos
              </span>
            </div>
            <h1 className="mb-4 font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
              Contác<span className="text-gradient-gold inline-block">tanos</span>
            </h1>
            <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-white/85">
              Estamos listos para crear la experiencia de viaje perfecta para ti.
              Escríbenos y un asesor te atenderá de inmediato.
            </p>
          </AnimatedSection>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Form + Info */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
            {/* Form */}
            <AnimatedSection variant="slide-left">
              {submitted ? (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-surface p-12 text-center shadow-card">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle className="h-10 w-10 text-success" />
                  </div>
                  <h2 className="mb-3 font-heading text-3xl font-semibold text-text">
                    ¡Mensaje Enviado!
                  </h2>
                  <p className="mb-6 max-w-md font-body text-text-muted">
                    Gracias por contactarnos. Uno de nuestros asesores se pondrá
                    en contacto contigo en las próximas 24 horas.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", travelType: "", message: "" });
                    }}
                    className="cursor-pointer rounded-xl bg-primary px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-primary-light"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl bg-surface p-8 shadow-card md:p-10">
                  <h2 className="mb-2 font-heading text-2xl font-semibold text-text">
                    Envíanos un mensaje
                  </h2>
                  <p className="mb-8 font-body text-sm text-text-muted">
                    Completa el formulario y te responderemos lo antes posible.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block font-body text-sm font-medium text-text"
                      >
                        Nombre completo *
                      </label>
                      <div className="relative">
                        <User
                          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light"
                          aria-hidden="true"
                        />
                        <input
                          id="contact-name"
                          type="text"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          className={cn(
                            "h-12 w-full rounded-xl border bg-background pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary",
                            errors.name ? "border-error" : "border-border"
                          )}
                          placeholder="Tu nombre"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 font-body text-xs text-error">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1.5 block font-body text-sm font-medium text-text"
                      >
                        Email *
                      </label>
                      <div className="relative">
                        <Mail
                          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light"
                          aria-hidden="true"
                        />
                        <input
                          id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          className={cn(
                            "h-12 w-full rounded-xl border bg-background pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary",
                            errors.email ? "border-error" : "border-border"
                          )}
                          placeholder="tu@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 font-body text-xs text-error">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="mb-1.5 block font-body text-sm font-medium text-text"
                      >
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone
                          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light"
                          aria-hidden="true"
                        />
                        <input
                          id="contact-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                          placeholder="477 123 4567"
                        />
                      </div>
                    </div>

                    {/* Travel type */}
                    <div>
                      <label
                        htmlFor="contact-travel-type"
                        className="mb-1.5 block font-body text-sm font-medium text-text"
                      >
                        Tipo de viaje
                      </label>
                      <div className="relative">
                        <Plane
                          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light"
                          aria-hidden="true"
                        />
                        <select
                          id="contact-travel-type"
                          value={form.travelType}
                          onChange={(e) =>
                            setForm({ ...form, travelType: e.target.value })
                          }
                          className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-border bg-background pl-10 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary"
                        >
                          <option value="">Selecciona una opción</option>
                          {TRAVEL_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1.5 block font-body text-sm font-medium text-text"
                      >
                        Mensaje *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        className={cn(
                          "w-full resize-none rounded-xl border bg-background p-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-1 focus:ring-secondary",
                          errors.message ? "border-error" : "border-border"
                        )}
                        placeholder="Cuéntanos sobre el viaje que sueñas..."
                      />
                      {errors.message && (
                        <p className="mt-1 font-body text-xs text-error">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent font-body text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-accent-dark hover:shadow-lg active:scale-[0.98]"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Enviar Mensaje
                    </button>
                  </form>
                </div>
              )}
            </AnimatedSection>

            {/* Contact Info + Map */}
            <AnimatedSection variant="slide-right" className="space-y-8">
              {/* Info cards */}
              <div className="space-y-4">
                {CONTACT_INFO.map((item) => {
                  const Wrapper = item.href ? "a" : "div";
                  return (
                    <Wrapper
                      key={item.label}
                      {...(item.href
                        ? {
                            href: item.href,
                            target: item.href.startsWith("http") ? "_blank" : undefined,
                            rel: item.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined,
                          }
                        : {})}
                      className={cn(
                        "flex items-start gap-4 rounded-xl bg-surface p-5 shadow-card transition-all duration-200",
                        item.href && "cursor-pointer hover:shadow-elevated"
                      )}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <item.icon
                          className="h-5 w-5 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                          {item.label}
                        </p>
                        <p className="mt-0.5 font-body text-sm leading-relaxed text-text">
                          {item.value}
                        </p>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>

              {/* Map placeholder */}
              <div className="overflow-hidden rounded-2xl bg-background-alt shadow-card">
                <div className="flex h-[260px] flex-col items-center justify-center gap-3 p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-heading text-lg font-semibold text-text">
                    León, Guanajuato
                  </p>
                  <p className="text-center font-body text-sm text-text-muted">
                    Nube #522, Col. Jardines del Moral
                    <br />
                    C.P. 37160
                  </p>
                  <a
                    href="https://maps.google.com/?q=Nube+522+Jardines+del+Moral+Leon+Guanajuato"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex cursor-pointer items-center gap-1 font-body text-sm font-semibold text-secondary transition-colors hover:text-primary"
                  >
                    Ver en Google Maps
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
