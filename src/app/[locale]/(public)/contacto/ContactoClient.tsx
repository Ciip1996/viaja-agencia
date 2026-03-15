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
import { useTranslations } from "next-intl";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils/cn";

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

export default function ContactoClient({ cms = {} }: { cms?: Record<string, string> }) {
  const t = useTranslations("pageContacto");

  const heroImage = cms.contacto_hero_image || "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&q=80";
  const heroTag = cms.contacto_hero_tag || t("heroTag");
  const heroHeading = cms.contacto_hero_heading || t("heroHeading");

  const travelTypes = [
    { key: "honeymoon", label: t("travelTypes.honeymoon") },
    { key: "family", label: t("travelTypes.family") },
    { key: "adventure", label: t("travelTypes.adventure") },
    { key: "group", label: t("travelTypes.group") },
    { key: "corporate", label: t("travelTypes.corporate") },
    { key: "cruise", label: t("travelTypes.cruise") },
    { key: "allInclusive", label: t("travelTypes.allInclusive") },
    { key: "custom", label: t("travelTypes.custom") },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      label: t("infoAddress"),
      value: t("defaultAddress"),
      href: "https://www.google.com/maps/place/Viaja+Agencia/@21.1507511,-101.6953944,17z/data=!3m1!4b1!4m6!3m5!1s0x842bbf467929d2cf:0xf87c4906456d0a1f!8m2!3d21.1507512!4d-101.6905235!16s%2Fg%2F1tcvplgf",
    },
    {
      icon: Phone,
      label: t("infoPhone"),
      value: t("defaultPhone"),
      href: "tel:+524777790610",
    },
    {
      icon: Mail,
      label: t("infoEmail"),
      value: "reservaciones@viajaagencia.com.mx",
      href: "mailto:reservaciones@viajaagencia.com.mx",
    },
    {
      icon: Clock,
      label: t("infoSchedule"),
      value: t("defaultSchedule"),
      href: null,
    },
  ];

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    travelType: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = t("validation.nameRequired");
    if (!form.email.trim()) {
      errs.email = t("validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t("validation.emailInvalid");
    }
    if (!form.message.trim()) errs.message = t("validation.messageRequired");
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          travelType: form.travelType,
          message: form.message,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Error enviando mensaje");
        return;
      }

      setSubmitted(true);
    } catch {
      setApiError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <Image
          src={heroImage}
          alt={t("heroAlt")}
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
                {heroTag}
              </span>
            </div>
            <h1 className="mb-4 font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
              {heroHeading}
            </h1>
            <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-white/85">
              {t("heroDescription")}
            </p>
            <p className="mt-3 font-body text-sm text-white/50">
              {t("legalName")}
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
                    {t("successTitle")}
                  </h2>
                  <p className="mb-6 max-w-md font-body text-text-muted">
                    {t("successMessage")}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", travelType: "", message: "" });
                    }}
                    className="cursor-pointer rounded-xl bg-primary px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-primary-light"
                  >
                    {t("sendAnother")}
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl bg-surface p-8 shadow-card md:p-10">
                  <h2 className="mb-2 font-heading text-2xl font-semibold text-text">
                    {t("formTitle")}
                  </h2>
                  <p className="mb-8 font-body text-sm text-text-muted">
                    {t("formSubtitle")}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block font-body text-sm font-medium text-text"
                      >
                        {t("labelName")}
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
                          placeholder={t("placeholderName")}
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
                        {t("labelEmail")}
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
                        {t("labelPhone")}
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
                        {t("labelTravelType")}
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
                          <option value="">{t("selectOption")}</option>
                          {travelTypes.map((type) => (
                            <option key={type.key} value={type.key}>
                              {type.label}
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
                        {t("labelMessage")}
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
                        placeholder={t("placeholderMessage")}
                      />
                      {errors.message && (
                        <p className="mt-1 font-body text-xs text-error">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {apiError && (
                      <p className="text-sm text-error">{apiError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent font-body text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-accent-dark hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send className={cn("h-4 w-4", loading && "animate-pulse")} aria-hidden="true" />
                      {loading ? t("submitting") : t("submitButton")}
                    </button>
                  </form>
                </div>
              )}
            </AnimatedSection>

            {/* Contact Info + Map */}
            <AnimatedSection variant="slide-right" className="space-y-8">
              {/* Info cards */}
              <div className="space-y-4">
                {contactInfo.map((item) => {
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

              {/* Google Maps embed */}
              <div className="overflow-hidden rounded-2xl shadow-card">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.041388161214!2d-101.69539441146757!3d21.15075113032543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bbf467929d2cf%3A0xf87c4906456d0a1f!2sViaja%20Agencia!5e0!3m2!1ses-419!2smx!4v1773523729356!5m2!1ses-419!2smx"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t("mapTitle")}
                  className="w-full"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
