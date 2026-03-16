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
import { useTranslations } from "next-intl";

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
  { tKey: string; icon: typeof Building2; descKey: string }
> = {
  general: { tKey: "catGeneral", icon: Building2, descKey: "catGeneralDesc" },
  feature_flags: { tKey: "catModules", icon: ToggleRight, descKey: "catModulesDesc" },
  api_keys: { tKey: "catApiKeys", icon: KeyRound, descKey: "catApiKeysDesc" },
  homepage_hero: { tKey: "catHero", icon: Home, descKey: "catHeroDesc" },
  homepage_ofertas: { tKey: "catOffers", icon: Sparkles, descKey: "catOffersDesc" },
  homepage_porque: { tKey: "catWhy", icon: Star, descKey: "catWhyDesc" },
  homepage_destinos: { tKey: "catDestHome", icon: Map, descKey: "catDestHomeDesc" },
  homepage_testimonios: { tKey: "catTestimonials", icon: MessageSquare, descKey: "catTestimonialsDesc" },
  homepage_newsletter: { tKey: "catNewsletter", icon: Mail, descKey: "catNewsletterDesc" },
  homepage_faq: { tKey: "catFaq", icon: MessageSquare, descKey: "catFaqDesc" },
  homepage_instagram: { tKey: "catInstagram", icon: Instagram, descKey: "catInstagramDesc" },
  page_destinos: { tKey: "catPageDest", icon: Globe, descKey: "catPageDestDesc" },
  page_paquetes: { tKey: "catPagePkg", icon: Sparkles, descKey: "catPagePkgDesc" },
  page_grupos: { tKey: "catPageGroups", icon: Users, descKey: "catPageGroupsDesc" },
  page_eventos: { tKey: "catPageEvents", icon: CalendarHeart, descKey: "catPageEventsDesc" },
  page_nosotros: { tKey: "catPageAbout", icon: Building2, descKey: "catPageAboutDesc" },
  page_contacto: { tKey: "catPageContact", icon: MapPin, descKey: "catPageContactDesc" },
  page_hoteles: { tKey: "catPageHotels", icon: Compass, descKey: "catPageHotelsDesc" },
  page_tours: { tKey: "catPageTours", icon: Map, descKey: "catPageToursDesc" },
  page_autos: { tKey: "catPageCars", icon: Car, descKey: "catPageCarsDesc" },
};

const CATEGORY_ORDER = [
  "general",
  "feature_flags",
  "api_keys",
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
  const t = useTranslations("admin.configPage");
  const tc = useTranslations("admin.common");

  const [allSettings, setAllSettings] = useState<Setting[]>([]);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState("general");
  const [activeLocale, setActiveLocale] = useState("es");

  const fetchData = useCallback(async (locale: string) => {
    setLoading(true);
    const supabase = createAdminClient();

    try {
      let data: Record<string, unknown>[] | null = null;

      try {
        const res = await supabase
          .from("site_settings")
          .select("key, value, category, label, field_type, locale")
          .eq("locale", locale)
          .order("category", { ascending: true });
        if (res.error) throw res.error;
        data = res.data;
      } catch {
        const res = await supabase
          .from("site_settings")
          .select("key, value, category, label, field_type")
          .order("category", { ascending: true });
        if (res.error) throw res.error;
        data = res.data;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const settings = (data ?? []).map((r: any) => ({
        key: r.key,
        value: r.value,
        category: r.category || "general",
        label: r.label || r.key,
        field_type: r.field_type || "text",
        locale: r.locale,
      }));
      setAllSettings(settings);
      const vals: Record<string, string> = {};
      settings.forEach((s) => (vals[s.key] = s.value));
      setEditValues(vals);
      setError(null);
    } catch {
      setError(t("errorLoad"));
    } finally {
      setLoading(false);
    }
  }, [t]);

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

      const { error: upsertErr } = await supabase
        .from("site_settings")
        .upsert(upserts, { onConflict: "key,locale" });

      if (upsertErr) throw upsertErr;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError(t("errorSave"));
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
            {t("pageTitle")}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {t("pageSubtitle")}
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
          {saving ? tc("saving") : success ? tc("saved") : tc("save")}
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
            {t("savedSuccess")}
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
                  <span className="truncate">{t(meta.tKey)}</span>
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
                {CATEGORY_META[activeCategory] ? t(CATEGORY_META[activeCategory].tKey) : activeCategory}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                {CATEGORY_META[activeCategory] ? t(CATEGORY_META[activeCategory].descKey) : ""}
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
                  {t("noFields")}
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
              {saving ? tc("saving") : tc("save")}
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
