"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader2,
  AlertTriangle,
  Check,
  Building2,
  Globe,
  Home,
  Map,
  MapPin,
  MessageSquare,
  Sparkles,
  Users,
  CalendarHeart,
  Car,
  Compass,
  Star,
  Instagram,
  Mail,
  ToggleRight,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin-client";

type Setting = {
  key: string;
  value: string;
  category: string;
  label: string;
  field_type: string;
  locale?: string;
};

const LOCALE_OPTIONS = [
  { value: "es", label: "🇲🇽 Español" },
  { value: "en", label: "🇺🇸 English" },
];

const CATEGORY_META: Record<
  string,
  { label: string; icon: typeof Building2; description: string }
> = {
  feature_flags: {
    label: "Feature Flags",
    icon: ToggleRight,
    description: "Activa o desactiva funcionalidades del sitio",
  },
  api_keys: {
    label: "API Keys",
    icon: KeyRound,
    description: "Claves de acceso a servicios externos (OpenAI, Hotelbeds, etc.)",
  },
  general: {
    label: "General",
    icon: Building2,
    description: "Información de la empresa, contacto y redes sociales",
  },
  homepage_hero: {
    label: "Hero Principal",
    icon: Home,
    description: "Encabezado y video del hero de la página principal",
  },
  homepage_ofertas: {
    label: "Ofertas",
    icon: Sparkles,
    description: "Sección de ofertas destacadas en la página principal",
  },
  homepage_porque: {
    label: "Por qué Elegirnos",
    icon: Star,
    description: "Pilares de valor en la página principal",
  },
  homepage_destinos: {
    label: "Destinos (Home)",
    icon: Map,
    description: "Sección de destinos destacados en la página principal",
  },
  homepage_testimonios: {
    label: "Testimonios",
    icon: MessageSquare,
    description: "Encabezados de la sección de testimonios",
  },
  homepage_newsletter: {
    label: "Newsletter",
    icon: Mail,
    description: "Sección de suscripción al newsletter",
  },
  homepage_faq: {
    label: "FAQ",
    icon: MessageSquare,
    description: "Encabezados de la sección de preguntas frecuentes",
  },
  homepage_instagram: {
    label: "Instagram",
    icon: Instagram,
    description: "Sección de feed de Instagram",
  },
  page_destinos: {
    label: "Pág. Destinos",
    icon: Globe,
    description: "Contenido del hero de la página de destinos",
  },
  page_paquetes: {
    label: "Pág. Paquetes",
    icon: Sparkles,
    description: "Contenido de la página de paquetes",
  },
  page_grupos: {
    label: "Pág. Grupos",
    icon: Users,
    description: "Contenido del hero de viajes grupales",
  },
  page_eventos: {
    label: "Pág. Eventos",
    icon: CalendarHeart,
    description: "Contenido de la página de eventos especiales",
  },
  page_nosotros: {
    label: "Pág. Nosotros",
    icon: Building2,
    description: "Contenido de la página sobre nosotros",
  },
  page_contacto: {
    label: "Pág. Contacto",
    icon: MapPin,
    description: "Contenido del hero de contacto",
  },
  page_hoteles: {
    label: "Pág. Hoteles",
    icon: Compass,
    description: "Contenido del hero de hoteles",
  },
  page_tours: {
    label: "Pág. Tours",
    icon: Map,
    description: "Contenido del hero de tours",
  },
  page_autos: {
    label: "Pág. Autos",
    icon: Car,
    description: "Contenido del hero de renta de autos",
  },
};

const CATEGORY_ORDER = [
  "feature_flags",
  "api_keys",
  "general",
  "homepage_hero",
  "homepage_ofertas",
  "homepage_porque",
  "homepage_destinos",
  "homepage_testimonios",
  "homepage_newsletter",
  "homepage_faq",
  "homepage_instagram",
  "page_destinos",
  "page_paquetes",
  "page_grupos",
  "page_eventos",
  "page_nosotros",
  "page_contacto",
  "page_hoteles",
  "page_tours",
  "page_autos",
];

export default function ConfiguracionPage() {
  const [allSettings, setAllSettings] = useState<Setting[]>([]);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState("feature_flags");
  const [activeLocale, setActiveLocale] = useState("es");

  const fetchData = useCallback(async (locale: string) => {
    setLoading(true);
    try {
      const supabase = createAdminClient();
      const { data, error: err } = await supabase
        .from("site_settings")
        .select("key, value, category, label, field_type, locale")
        .eq("locale", locale)
        .order("category")
        .order("key");
      if (err) throw err;

      const settings = (data ?? []) as Setting[];
      setAllSettings(settings);
      const vals: Record<string, string> = {};
      settings.forEach((s) => (vals[s.key] = s.value));
      setEditValues(vals);
      setError(null);
    } catch {
      setError("Error al cargar la configuración. Verifica tu conexión a Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(activeLocale);
  }, [fetchData, activeLocale]);

  const handleChange = (key: string, value: string) => {
    setEditValues((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createAdminClient();
      const categorySettings = allSettings.filter(
        (s) => s.category === activeCategory,
      );
      const upserts = categorySettings.map((s) => ({
        key: s.key,
        value: editValues[s.key] ?? s.value,
        category: s.category,
        label: s.label,
        field_type: s.field_type,
        locale: activeLocale,
        updated_at: new Date().toISOString(),
      }));

      const { error: err } = await supabase
        .from("site_settings")
        .upsert(upserts, { onConflict: "key,locale" });

      if (err) throw err;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const categories = CATEGORY_ORDER.filter((cat) =>
    allSettings.some((s) => s.category === cat),
  );
  const currentFields = allSettings.filter(
    (s) => s.category === activeCategory,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text">
            Gestión de Contenido
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Administra todo el contenido del sitio web desde aquí
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <div className="flex items-center rounded-xl border border-border overflow-hidden">
            {LOCALE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveLocale(opt.value)}
                className={`px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  activeLocale === opt.value
                    ? "bg-primary text-white"
                    : "bg-surface text-text-muted hover:bg-background-alt"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer self-start"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : success ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Guardando..." : success ? "Guardado" : "Guardar Cambios"}
        </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-warning/10 border border-warning/20 text-sm text-warning">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-success/10 border border-success/20 text-sm text-success"
          >
            <Check className="w-4 h-4 shrink-0" />
            Configuración guardada correctamente
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <nav className="space-y-1 lg:sticky lg:top-24">
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat];
              if (!meta) return null;
              const Icon = meta.icon;
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-text-muted hover:bg-background-alt/50 hover:text-text"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{meta.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-background-alt/30">
              <h2 className="font-heading text-lg font-semibold text-text">
                {CATEGORY_META[activeCategory]?.label ?? activeCategory}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                {CATEGORY_META[activeCategory]?.description}
              </p>
            </div>
            <div className="px-6 py-5 space-y-5">
              {currentFields.map((field) => (
                <FieldEditor
                  key={field.key}
                  field={field}
                  value={editValues[field.key] ?? ""}
                  onChange={(val) => handleChange(field.key, val)}
                />
              ))}
              {currentFields.length === 0 && (
                <p className="text-sm text-text-muted py-8 text-center">
                  No hay campos configurados para esta categoría.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 pb-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: Setting;
  value: string;
  onChange: (val: string) => void;
}) {
  const isJson = field.field_type === "json";
  const isTextarea = field.field_type === "textarea";
  const isImage = field.field_type === "image";
  const isUrl = field.field_type === "url";
  const isToggle = field.field_type === "toggle";
  const isSecret = field.field_type === "secret";

  if (isToggle) {
    const enabled = value === "true";
    return (
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-text">{field.label || field.key}</p>
          <p className="text-xs text-text-light">
            key: <code className="text-text-muted">{field.key}</code>
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange(enabled ? "false" : "true")}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
            enabled ? "bg-success" : "bg-border"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    );
  }

  if (isSecret) {
    return <SecretField field={field} value={value} onChange={onChange} />;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1.5">
        {field.label || field.key}
        {isJson && (
          <span className="ml-2 text-xs font-normal text-text-light">
            (JSON)
          </span>
        )}
      </label>

      {isImage && value && (
        <div className="mb-2 p-2 border border-border rounded-lg bg-background-alt/30 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="max-h-20 rounded object-contain"
          />
        </div>
      )}

      {isUrl && !isImage && value && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-secondary mb-1 truncate hover:underline"
        >
          {value}
        </a>
      )}

      {isJson ? (
        <textarea
          value={formatJsonForDisplay(value)}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-text font-mono placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-y"
          spellCheck={false}
        />
      ) : isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-y"
        />
      ) : (
        <input
          type={
            field.field_type === "email"
              ? "email"
              : field.field_type === "number"
                ? "number"
                : field.field_type === "tel"
                  ? "tel"
                  : "text"
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
        />
      )}
      <p className="mt-1 text-xs text-text-light">
        key: <code className="text-text-muted">{field.key}</code>
      </p>
    </div>
  );
}

function SecretField({
  field,
  value,
  onChange,
}: {
  field: Setting;
  value: string;
  onChange: (val: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1.5">
        {field.label || field.key}
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={visible ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Pega tu API key aquí"
            className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border bg-background text-sm text-text font-mono placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors cursor-pointer"
            aria-label={visible ? "Ocultar" : "Mostrar"}
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!value}
          className="shrink-0 px-3 py-2.5 rounded-xl border border-border bg-surface text-text-muted hover:bg-background-alt hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Copiar"
        >
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <p className="mt-1 text-xs text-text-light">
        key: <code className="text-text-muted">{field.key}</code>
        {value && (
          <span className="ml-2 text-success">Configurada</span>
        )}
        {!value && (
          <span className="ml-2 text-warning">No configurada</span>
        )}
      </p>
    </div>
  );
}

function formatJsonForDisplay(val: string): string {
  try {
    return JSON.stringify(JSON.parse(val), null, 2);
  } catch {
    return val;
  }
}
