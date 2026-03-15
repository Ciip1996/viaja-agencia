"use client";

import { useState, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  Users,
  Mountain,
  Briefcase,
  Ship,
  Sparkles,
  Compass,
  MapPin,
  CalendarDays,
  Minus,
  Plus,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Plane,
} from "lucide-react";

/* ─── Types ───────────────────────────────────────────────── */

interface QuoteWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WizardData {
  travelType: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  budgetRange: string;
  notes: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

const INITIAL_DATA: WizardData = {
  travelType: "",
  destination: "",
  checkIn: "",
  checkOut: "",
  adults: 2,
  children: 0,
  budgetRange: "",
  notes: "",
  clientName: "",
  clientEmail: "",
  clientPhone: "",
};

/* ─── Travel Types ────────────────────────────────────────── */

const TRAVEL_TYPES = [
  { id: "luna-de-miel", label: "Luna de Miel", icon: Heart },
  { id: "familiar", label: "Familiar", icon: Users },
  { id: "aventura", label: "Aventura", icon: Mountain },
  { id: "grupos", label: "Grupos", icon: Users },
  { id: "corporativo", label: "Corporativo", icon: Briefcase },
  { id: "crucero", label: "Crucero", icon: Ship },
  { id: "todo-incluido", label: "Todo Incluido", icon: Sparkles },
  { id: "personalizado", label: "Personalizado", icon: Compass },
] as const;

const BUDGET_RANGES = [
  "$10K – $25K MXN",
  "$25K – $50K MXN",
  "$50K – $100K MXN",
  "$100K+ MXN",
] as const;

const STEP_LABELS = [
  "Tipo de viaje",
  "Destino y fechas",
  "Viajeros",
  "Presupuesto",
  "Contacto",
];

/* ─── Animation variants ──────────────────────────────────── */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 24,
    transition: { duration: 0.25 },
  },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 280 : -280,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -280 : 280,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/* ─── Main Component ──────────────────────────────────────── */

export default function QuoteWizard({ isOpen, onClose }: QuoteWizardProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 5;

  const update = useCallback(
    <K extends keyof WizardData>(key: K, value: WizardData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 0:
        return data.travelType !== "";
      case 1:
        return data.destination.trim() !== "";
      case 2:
        return data.adults >= 1;
      case 3:
        return true;
      case 4:
        return (
          data.clientName.trim() !== "" && data.clientEmail.trim() !== ""
        );
      default:
        return false;
    }
  }, [step, data]);

  const goNext = () => {
    if (step < totalSteps - 1 && canProceed()) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canProceed()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Error al enviar cotización");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al enviar cotización"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setDirection(1);
      setData(INITIAL_DATA);
      setSubmitted(false);
      setError("");
    }, 350);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-xl"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/30 bg-white/90 shadow-elevated backdrop-blur-2xl"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Cotizador de viaje"
          >
            {/* Header */}
            <div className="relative border-b border-border/50 bg-gradient-to-r from-primary to-secondary px-6 pb-6 pt-6 sm:px-8">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white/80 transition-colors hover:bg-white/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <Plane className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-semibold text-white sm:text-xl">
                    Cotiza tu viaje
                  </h2>
                  <p className="text-sm text-white/70">
                    Paso {step + 1} de {totalSteps} — {STEP_LABELS[step]}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              {!submitted && (
                <div className="mt-5 flex gap-1.5">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20"
                    >
                      <motion.div
                        className="h-full rounded-full bg-accent"
                        initial={false}
                        animate={{ width: i <= step ? "100%" : "0%" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="relative min-h-[380px] overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
              {submitted ? (
                <SuccessState onClose={handleClose} />
              ) : (
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    {step === 0 && (
                      <StepTravelType
                        selected={data.travelType}
                        onSelect={(v) => update("travelType", v)}
                      />
                    )}
                    {step === 1 && (
                      <StepDestination
                        data={data}
                        update={update}
                      />
                    )}
                    {step === 2 && (
                      <StepTravelers data={data} update={update} />
                    )}
                    {step === 3 && (
                      <StepBudget data={data} update={update} />
                    )}
                    {step === 4 && (
                      <StepContact
                        data={data}
                        update={update}
                        error={error}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Footer navigation */}
            {!submitted && (
              <div className="flex items-center justify-between border-t border-border/50 bg-background-alt/60 px-6 py-4 sm:px-8">
                <button
                  onClick={goBack}
                  disabled={step === 0}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2.5 font-body text-sm font-medium text-text-muted transition-colors hover:bg-border/50 hover:text-text disabled:cursor-not-allowed disabled:opacity-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Atrás
                </button>

                {step < totalSteps - 1 ? (
                  <button
                    onClick={goNext}
                    disabled={!canProceed()}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 font-body text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-light hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || submitting}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-6 py-2.5 font-body text-sm font-semibold text-white shadow-md transition-all hover:bg-accent-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando…
                      </>
                    ) : (
                      <>
                        Enviar cotización
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Step 1: Travel Type ─────────────────────────────────── */

function StepTravelType({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-1 font-heading text-lg font-semibold text-text">
        ¿Qué tipo de viaje deseas?
      </h3>
      <p className="mb-6 font-body text-sm text-text-muted">
        Selecciona la opción que mejor describa tu viaje ideal.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TRAVEL_TYPES.map(({ id, label, icon: Icon }) => {
          const isActive = selected === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`group flex cursor-pointer flex-col items-center gap-2.5 rounded-2xl border-2 p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 sm:p-5 ${
                isActive
                  ? "border-accent bg-accent/8 shadow-md"
                  : "border-border/60 bg-white hover:border-secondary/40 hover:bg-secondary/5 hover:shadow-sm"
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-accent/15 text-accent"
                    : "bg-background-alt text-text-muted group-hover:bg-secondary/10 group-hover:text-secondary"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`font-body text-xs font-medium leading-tight text-center sm:text-sm ${
                  isActive ? "text-text" : "text-text-muted"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 2: Destination & Dates ─────────────────────────── */

function StepDestination({
  data,
  update,
}: {
  data: WizardData;
  update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}) {
  return (
    <div>
      <h3 className="mb-1 font-heading text-lg font-semibold text-text">
        ¿A dónde quieres ir?
      </h3>
      <p className="mb-6 font-body text-sm text-text-muted">
        Indica tu destino soñado y las fechas de tu viaje.
      </p>

      <div className="space-y-4">
        <div className="relative">
          <label
            htmlFor="wiz-destination"
            className="mb-1.5 block font-body text-sm font-medium text-text"
          >
            Destino
          </label>
          <MapPin className="pointer-events-none absolute bottom-3 left-3.5 h-4.5 w-4.5 text-text-muted" />
          <input
            id="wiz-destination"
            type="text"
            value={data.destination}
            onChange={(e) => update("destination", e.target.value)}
            placeholder="Ej. Cancún, París, Tokio…"
            className="h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4 font-body text-sm text-text placeholder:text-text-light outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <label
              htmlFor="wiz-checkin"
              className="mb-1.5 block font-body text-sm font-medium text-text"
            >
              Check-in
            </label>
            <CalendarDays className="pointer-events-none absolute bottom-3 left-3.5 h-4.5 w-4.5 text-text-muted" />
            <input
              id="wiz-checkin"
              type="date"
              value={data.checkIn}
              onChange={(e) => update("checkIn", e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="wiz-checkout"
              className="mb-1.5 block font-body text-sm font-medium text-text"
            >
              Check-out
            </label>
            <CalendarDays className="pointer-events-none absolute bottom-3 left-3.5 h-4.5 w-4.5 text-text-muted" />
            <input
              id="wiz-checkout"
              type="date"
              value={data.checkOut}
              onChange={(e) => update("checkOut", e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4 font-body text-sm text-text outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Travelers ───────────────────────────────────── */

function StepTravelers({
  data,
  update,
}: {
  data: WizardData;
  update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}) {
  return (
    <div>
      <h3 className="mb-1 font-heading text-lg font-semibold text-text">
        ¿Cuántos viajeros?
      </h3>
      <p className="mb-8 font-body text-sm text-text-muted">
        Indica el número de adultos y niños para tu viaje.
      </p>

      <div className="mx-auto max-w-sm space-y-6">
        <CounterRow
          label="Adultos"
          sublabel="13 años o más"
          value={data.adults}
          min={1}
          max={20}
          onChange={(v) => update("adults", v)}
        />
        <div className="border-t border-border/50" />
        <CounterRow
          label="Niños"
          sublabel="0 – 12 años"
          value={data.children}
          min={0}
          max={10}
          onChange={(v) => update("children", v)}
        />
      </div>
    </div>
  );
}

function CounterRow({
  label,
  sublabel,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-body text-base font-medium text-text">{label}</p>
        <p className="font-body text-sm text-text-muted">{sublabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-text transition-all hover:border-secondary hover:bg-secondary/5 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Disminuir ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-heading text-xl font-semibold text-text tabular-nums">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-text transition-all hover:border-secondary hover:bg-secondary/5 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Aumentar ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 4: Budget & Notes ──────────────────────────────── */

function StepBudget({
  data,
  update,
}: {
  data: WizardData;
  update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}) {
  return (
    <div>
      <h3 className="mb-1 font-heading text-lg font-semibold text-text">
        Presupuesto y notas
      </h3>
      <p className="mb-6 font-body text-sm text-text-muted">
        Selecciona un rango aproximado y agrega detalles especiales.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {BUDGET_RANGES.map((range) => {
          const isActive = data.budgetRange === range;
          return (
            <button
              key={range}
              onClick={() =>
                update("budgetRange", isActive ? "" : range)
              }
              className={`cursor-pointer rounded-xl border-2 px-4 py-3.5 font-body text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 ${
                isActive
                  ? "border-accent bg-accent/8 text-text shadow-sm"
                  : "border-border/60 bg-white text-text-muted hover:border-secondary/40 hover:text-text"
              }`}
            >
              {range}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <label
          htmlFor="wiz-notes"
          className="mb-1.5 block font-body text-sm font-medium text-text"
        >
          Solicitudes especiales{" "}
          <span className="text-text-light">(opcional)</span>
        </label>
        <textarea
          id="wiz-notes"
          value={data.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Aniversario, alergias alimentarias, actividades preferidas…"
          rows={3}
          className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 font-body text-sm text-text placeholder:text-text-light outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20"
        />
      </div>
    </div>
  );
}

/* ─── Step 5: Contact + Summary ───────────────────────────── */

function StepContact({
  data,
  update,
  error,
}: {
  data: WizardData;
  update: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
  error: string;
}) {
  const travelLabel = TRAVEL_TYPES.find(
    (t) => t.id === data.travelType
  )?.label;

  return (
    <div>
      <h3 className="mb-1 font-heading text-lg font-semibold text-text">
        Datos de contacto
      </h3>
      <p className="mb-5 font-body text-sm text-text-muted">
        Te contactaremos con tu cotización personalizada.
      </p>

      <div className="space-y-3">
        <div className="relative">
          <label htmlFor="wiz-name" className="sr-only">
            Nombre
          </label>
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-text-muted" />
          <input
            id="wiz-name"
            type="text"
            value={data.clientName}
            onChange={(e) => update("clientName", e.target.value)}
            placeholder="Tu nombre completo"
            className="h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4 font-body text-sm text-text placeholder:text-text-light outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
        </div>

        <div className="relative">
          <label htmlFor="wiz-email" className="sr-only">
            Email
          </label>
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-text-muted" />
          <input
            id="wiz-email"
            type="email"
            value={data.clientEmail}
            onChange={(e) => update("clientEmail", e.target.value)}
            placeholder="tu@email.com"
            className="h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4 font-body text-sm text-text placeholder:text-text-light outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
        </div>

        <div className="relative">
          <label htmlFor="wiz-phone" className="sr-only">
            Teléfono (opcional)
          </label>
          <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-text-muted" />
          <input
            id="wiz-phone"
            type="tel"
            value={data.clientPhone}
            onChange={(e) => update("clientPhone", e.target.value)}
            placeholder="Teléfono (opcional)"
            className="h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4 font-body text-sm text-text placeholder:text-text-light outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
        </div>
      </div>

      {/* Summary card */}
      <div className="mt-5 rounded-xl border border-border/60 bg-background-alt/60 p-4">
        <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
          Resumen
        </p>
        <div className="space-y-1 font-body text-sm text-text">
          {travelLabel && (
            <p>
              <span className="text-text-muted">Tipo:</span> {travelLabel}
            </p>
          )}
          {data.destination && (
            <p>
              <span className="text-text-muted">Destino:</span>{" "}
              {data.destination}
            </p>
          )}
          {(data.checkIn || data.checkOut) && (
            <p>
              <span className="text-text-muted">Fechas:</span>{" "}
              {data.checkIn || "–"} → {data.checkOut || "–"}
            </p>
          )}
          <p>
            <span className="text-text-muted">Viajeros:</span>{" "}
            {data.adults} adulto{data.adults !== 1 ? "s" : ""}
            {data.children > 0 &&
              `, ${data.children} niño${data.children !== 1 ? "s" : ""}`}
          </p>
          {data.budgetRange && (
            <p>
              <span className="text-text-muted">Presupuesto:</span>{" "}
              {data.budgetRange}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-3 font-body text-sm font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Success State ───────────────────────────────────────── */

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      variants={successVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-8 text-center"
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-accent/12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
        >
          <Check className="h-10 w-10 text-accent" strokeWidth={2.5} />
        </motion.div>
      </div>

      <h3 className="mb-2 font-heading text-2xl font-bold text-text">
        ¡Cotización enviada!
      </h3>
      <p className="mx-auto max-w-sm font-body text-sm leading-relaxed text-text-muted">
        Nuestro equipo revisará tu solicitud y te contactará en menos de 24
        horas con una propuesta personalizada.
      </p>

      <button
        onClick={onClose}
        className="mt-8 cursor-pointer rounded-xl bg-primary px-8 py-3 font-body text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-light hover:shadow-lg"
      >
        Cerrar
      </button>
    </motion.div>
  );
}
