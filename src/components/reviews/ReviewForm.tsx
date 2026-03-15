"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ReviewFormProps {
  googleMapsUrl?: string;
}

export default function ReviewForm({ googleMapsUrl }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [clientName, setClientName] = useState("");
  const [tripDestination, setTripDestination] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const displayRating = hoverRating || rating;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!rating) {
      setStatus("error");
      setMessage("Por favor selecciona una calificación.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, tripDestination, reviewText, rating }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Error al enviar reseña.");
        return;
      }

      setStatus("success");
      setMessage(data.message);
    } catch {
      setStatus("error");
      setMessage("Error de conexión. Intenta de nuevo.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-lg rounded-2xl border border-border bg-surface p-8 text-center shadow-sm"
      >
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h3 className="mb-2 font-heading text-xl font-semibold text-text">
          {message}
        </h3>
        {googleMapsUrl && (
          <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-4">
            <p className="mb-3 text-sm text-text-muted">
              ¿Te gustó tu experiencia? ¡Déjanos también tu reseña en Google Maps!
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
            >
              Reseñar en Google Maps
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-sm"
    >
      <h3 className="mb-6 font-heading text-xl font-semibold text-text">
        Cuéntanos tu experiencia
      </h3>

      {/* Star Rating */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-text-muted">
          Calificación *
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="cursor-pointer p-0.5 transition-transform hover:scale-110"
              aria-label={`${star} estrellas`}
            >
              <Star
                size={28}
                className={cn(
                  "transition-colors",
                  star <= displayRating
                    ? "fill-accent text-accent"
                    : "fill-transparent text-border"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label htmlFor="rf-name" className="mb-1.5 block text-sm font-medium text-text-muted">
          Nombre *
        </label>
        <input
          id="rf-name"
          type="text"
          required
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Tu nombre"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-text placeholder:text-text-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Destination */}
      <div className="mb-4">
        <label htmlFor="rf-dest" className="mb-1.5 block text-sm font-medium text-text-muted">
          Destino del viaje
        </label>
        <input
          id="rf-dest"
          type="text"
          value={tripDestination}
          onChange={(e) => setTripDestination(e.target.value)}
          placeholder="Ej: Cancún, Europa, Japón..."
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-text placeholder:text-text-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Review Text */}
      <div className="mb-6">
        <label htmlFor="rf-text" className="mb-1.5 block text-sm font-medium text-text-muted">
          Tu reseña *
        </label>
        <textarea
          id="rf-text"
          required
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Cuéntanos sobre tu experiencia..."
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-text placeholder:text-text-light focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            <AlertCircle size={16} className="shrink-0" />
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? (
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <>
            <Send size={16} />
            Enviar reseña
          </>
        )}
      </button>
    </form>
  );
}
