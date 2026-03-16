"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Package,
  ImageIcon,
  AlertTriangle,
  Search,
  Star,
  Languages,
} from "lucide-react";
import {
  fetchWithLocale,
  saveWithTranslation,
  deleteWithTranslation,
  fetchTranslation,
} from "@/lib/supabase/admin-query";
import { cn } from "@/lib/utils/cn";
import ImageUpload from "@/components/admin/ImageUpload";
import TranslationTabs from "@/components/admin/TranslationTabs";
import type { Package as PackageType } from "@/lib/supabase/types";

type FormData = {
  id?: string;
  title: string;
  description: string | null;
  destination: string;
  region: string;
  price_usd: number;
  duration_days: number;
  difficulty: string | null;
  includes: string | null;
  excludes: string | null;
  itinerary_summary: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  translation_group_id?: string;
};

type FormEN = {
  title: string;
  description: string | null;
  includes: string | null;
  excludes: string | null;
  itinerary_summary: string | null;
};

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  destination: "",
  region: "",
  price_usd: 0,
  duration_days: 1,
  difficulty: null,
  includes: null,
  excludes: null,
  itinerary_summary: null,
  image_url: null,
  is_featured: false,
  is_active: true,
};

const EMPTY_EN: FormEN = {
  title: "",
  description: null,
  includes: null,
  excludes: null,
  itinerary_summary: null,
};

const REGIONS = [
  "Caribe",
  "Centroamérica",
  "Sudamérica",
  "Norteamérica",
  "Europa",
  "Asia",
  "África",
  "Oceanía",
  "Medio Oriente",
  "Antártida",
  "México",
  "Nacional",
];

const DIFFICULTY_KEYS = [
  { value: "", tKey: "diffNone" },
  { value: "Fácil", tKey: "diffEasy" },
  { value: "Moderado", tKey: "diffModerate" },
  { value: "Difícil", tKey: "diffHard" },
  { value: "Extremo", tKey: "diffExtreme" },
];

export default function PaquetesPage() {
  const t = useTranslations("admin.paquetesPage");
  const tc = useTranslations("admin.common");

  const [items, setItems] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteGroupId, setDeleteGroupId] = useState<string | undefined>();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [formEN, setFormEN] = useState<FormEN>(EMPTY_EN);
  const [formTab, setFormTab] = useState<"es" | "en">("es");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeLocale, setActiveLocale] = useState("es");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchWithLocale<PackageType>("packages", activeLocale);
      setItems(data);
      setError(null);
    } catch {
      setError(tc("errorSupabase"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeLocale, tc]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormEN(EMPTY_EN);
    setFormTab("es");
    setModalOpen(true);
  };

  const openEdit = async (item: PackageType) => {
    const groupId = (item as Record<string, unknown>)
      .translation_group_id as string | undefined;

    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      destination: item.destination,
      region: item.region,
      price_usd: item.price_usd,
      duration_days: item.duration_days,
      difficulty: item.difficulty,
      includes: item.includes,
      excludes: item.excludes,
      itinerary_summary: item.itinerary_summary,
      image_url: item.image_url,
      is_featured: item.is_featured,
      is_active: item.is_active,
      translation_group_id: groupId,
    });
    setFormTab("es");

    if (groupId) {
      const en = await fetchTranslation<PackageType>("packages", groupId, "en");
      setFormEN(
        en
          ? {
              title: en.title,
              description: en.description,
              includes: en.includes,
              excludes: en.excludes,
              itinerary_summary: en.itinerary_summary,
            }
          : EMPTY_EN
      );
    } else {
      setFormEN(EMPTY_EN);
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.destination || !form.region) return;
    setSaving(true);
    try {
      const esPayload = {
        title: form.title,
        description: form.description,
        destination: form.destination,
        region: form.region,
        price_usd: form.price_usd,
        duration_days: form.duration_days,
        difficulty: form.difficulty || null,
        includes: form.includes,
        excludes: form.excludes,
        itinerary_summary: form.itinerary_summary,
        image_url: form.image_url,
        is_featured: form.is_featured,
        is_active: form.is_active,
      };

      const enPayload =
        formEN.title || formEN.description || formEN.includes || formEN.excludes || formEN.itinerary_summary
          ? {
              title: formEN.title,
              description: formEN.description,
              includes: formEN.includes,
              excludes: formEN.excludes,
              itinerary_summary: formEN.itinerary_summary,
              destination: form.destination,
              region: form.region,
              price_usd: form.price_usd,
              duration_days: form.duration_days,
              difficulty: form.difficulty || null,
              image_url: form.image_url,
              is_featured: form.is_featured,
              is_active: form.is_active,
            }
          : null;

      await saveWithTranslation(
        "packages",
        esPayload,
        enPayload,
        form.id,
        form.translation_group_id
      );

      setModalOpen(false);
      fetchData();
    } catch {
      setError(tc("errorSave"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteWithTranslation("packages", deleteId, deleteGroupId);
      setDeleteId(null);
      setDeleteGroupId(undefined);
      fetchData();
    } catch {
      setError(tc("errorDelete"));
    }
  };

  const toggleField = async (
    id: string,
    field: "is_active" | "is_featured",
    current: boolean
  ) => {
    try {
      const supabase = (await import("@/lib/supabase/admin-client")).createAdminClient();
      await supabase.from("packages").update({ [field]: !current }).eq("id", id);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, [field]: !current } : i))
      );
    } catch {
      /* silent */
    }
  };

  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.destination.toLowerCase().includes(search.toLowerCase())
  );

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
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          {t("newItem")}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
          />
        </div>

        <div className="flex items-center rounded-xl border border-border overflow-hidden">
          {[
            { value: "es" as const, label: "🇲🇽 ES" },
            { value: "en" as const, label: "🇺🇸 EN" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveLocale(opt.value)}
              className={cn(
                "px-3 py-2 text-xs font-medium transition-colors cursor-pointer",
                activeLocale === opt.value
                  ? "bg-primary text-white"
                  : "bg-surface text-text-muted hover:bg-background-alt"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-warning/10 border border-warning/20 text-sm text-warning">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-secondary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Package className="w-10 h-10 mb-3 text-text-light" />
            <p className="font-medium">{t("emptyTitle")}</p>
            <p className="text-sm mt-1">
              {search ? tc("noResults") : t("emptyHint")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-alt/50">
                  <th className="text-left font-medium text-text-muted px-4 py-3">{tc("image")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">{tc("title")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden md:table-cell">{tc("destination")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden lg:table-cell">{tc("region")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden sm:table-cell">{tc("price")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden lg:table-cell">{t("duration")}</th>
                  <th className="text-center font-medium text-text-muted px-4 py-3 w-20">
                    <Languages className="w-4 h-4 mx-auto" />
                  </th>
                  <th className="text-center font-medium text-text-muted px-4 py-3 hidden md:table-cell">{tc("featured")}</th>
                  <th className="text-center font-medium text-text-muted px-4 py-3">{tc("active")}</th>
                  <th className="text-right font-medium text-text-muted px-4 py-3">{tc("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => {
                  const hasGroupId = !!(item as Record<string, unknown>)
                    .translation_group_id;
                  return (
                    <tr key={item.id} className="hover:bg-background-alt/30 transition-colors">
                      <td className="px-4 py-3">
                        {item.image_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={item.image_url} alt={item.title} className="w-12 h-9 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-9 rounded-lg bg-background-alt flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-text-light" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-text max-w-[180px] truncate">{item.title}</td>
                      <td className="px-4 py-3 text-text-muted hidden md:table-cell">{item.destination}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-secondary/10 text-secondary">
                          {item.region}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text hidden sm:table-cell">${item.price_usd.toLocaleString()}</td>
                      <td className="px-4 py-3 text-text-muted hidden lg:table-cell">{item.duration_days} {tc("days")}</td>
                      <td className="px-4 py-3 text-center">
                        {hasGroupId ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-secondary/10 text-secondary">
                            <Languages className="w-3 h-3" />
                            i18n
                          </span>
                        ) : (
                          <span className="text-text-light text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <button
                          onClick={() => toggleField(item.id, "is_featured", item.is_featured)}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors cursor-pointer",
                            item.is_featured
                              ? "text-accent bg-accent/10"
                              : "text-text-light hover:text-accent hover:bg-accent/5"
                          )}
                          aria-label={tc("toggleFeatured")}
                        >
                          <Star className={cn("w-4 h-4", item.is_featured && "fill-current")} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleField(item.id, "is_active", item.is_active)}
                          className={cn(
                            "relative w-9 h-5 rounded-full transition-colors cursor-pointer",
                            item.is_active ? "bg-success" : "bg-border"
                          )}
                          aria-label={tc("toggleActive")}
                        >
                          <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform", item.is_active && "translate-x-4")} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 rounded-lg text-text-muted hover:bg-secondary/10 hover:text-secondary transition-colors cursor-pointer"
                            aria-label={tc("edit")}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(item.id);
                              setDeleteGroupId(
                                (item as Record<string, unknown>)
                                  .translation_group_id as string | undefined
                              );
                            }}
                            className="p-2 rounded-lg text-text-muted hover:bg-error/10 hover:text-error transition-colors cursor-pointer"
                            aria-label={tc("delete")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] px-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-surface rounded-2xl border border-border shadow-elevated mb-10"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-heading text-xl font-semibold text-text">
                  {form.id ? t("editTitle") : t("createTitle")}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg text-text-muted hover:bg-background-alt transition-colors cursor-pointer" aria-label={tc("close")}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                <TranslationTabs activeTab={formTab} onTabChange={setFormTab}>
                  {formTab === "es" ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-text mb-1.5">{t("titleLabel")}</label>
                          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors" placeholder={t("titlePlaceholder")} />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-text mb-1.5">{tc("description")}</label>
                          <textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1.5">{t("destLabel")}</label>
                          <input type="text" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors" placeholder={t("destPlaceholder")} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1.5">{t("regionLabel")}</label>
                          <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors cursor-pointer">
                            <option value="">{tc("selectRegion")}</option>
                            {REGIONS.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1.5">{tc("priceUsd")}</label>
                          <input type="number" value={form.price_usd} onChange={(e) => setForm({ ...form, price_usd: parseFloat(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors" min={0} step={0.01} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1.5">{t("durationLabel")}</label>
                          <input type="number" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: parseInt(e.target.value) || 1 })} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors" min={1} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1.5">{t("difficultyLabel")}</label>
                          <select value={form.difficulty ?? ""} onChange={(e) => setForm({ ...form, difficulty: e.target.value || null })} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors cursor-pointer">
                            {DIFFICULTY_KEYS.map((d) => (
                              <option key={d.value} value={d.value}>{t(d.tKey)}</option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-text mb-1.5">{t("includesLabel")}</label>
                          <textarea value={form.includes ?? ""} onChange={(e) => setForm({ ...form, includes: e.target.value || null })} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none" placeholder={t("includesPlaceholder")} />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-text mb-1.5">{t("excludesLabel")}</label>
                          <textarea value={form.excludes ?? ""} onChange={(e) => setForm({ ...form, excludes: e.target.value || null })} rows={2} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none" placeholder={t("excludesPlaceholder")} />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-text mb-1.5">{t("itineraryLabel")}</label>
                          <textarea value={form.itinerary_summary ?? ""} onChange={(e) => setForm({ ...form, itinerary_summary: e.target.value || null })} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none" placeholder={t("itineraryPlaceholder")} />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-text mb-1.5">{tc("image")}</label>
                          <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url || null })} />
                        </div>

                        <div>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded border-border text-primary focus:ring-secondary/30 cursor-pointer" />
                            <span className="text-sm font-medium text-text">{tc("featured")}</span>
                          </label>
                        </div>

                        <div>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-border text-primary focus:ring-secondary/30 cursor-pointer" />
                            <span className="text-sm font-medium text-text">{tc("active")}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-text-muted bg-background-alt/50 px-3 py-2 rounded-lg">
                        Only translatable fields are shown. Shared fields (destination, region, price, duration, difficulty, image, featured, active) are copied from the Spanish version.
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1.5">Title (EN)</label>
                        <input type="text" value={formEN.title} onChange={(e) => setFormEN({ ...formEN, title: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors" placeholder="Package title in English" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1.5">Description (EN)</label>
                        <textarea value={formEN.description ?? ""} onChange={(e) => setFormEN({ ...formEN, description: e.target.value || null })} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1.5">Includes (EN)</label>
                        <textarea value={formEN.includes ?? ""} onChange={(e) => setFormEN({ ...formEN, includes: e.target.value || null })} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none" placeholder="What's included in English" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1.5">Excludes (EN)</label>
                        <textarea value={formEN.excludes ?? ""} onChange={(e) => setFormEN({ ...formEN, excludes: e.target.value || null })} rows={2} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none" placeholder="What's excluded in English" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1.5">Itinerary Summary (EN)</label>
                        <textarea value={formEN.itinerary_summary ?? ""} onChange={(e) => setFormEN({ ...formEN, itinerary_summary: e.target.value || null })} rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none" placeholder="Itinerary summary in English" />
                      </div>
                    </div>
                  )}
                </TranslationTabs>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-background-alt transition-colors cursor-pointer">
                  {tc("cancel")}
                </button>
                <button onClick={handleSave} disabled={saving || !form.title || !form.destination || !form.region} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {form.id ? tc("save") : t("createTitle")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-surface rounded-2xl border border-border p-6 shadow-elevated"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-error" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-text">{t("deleteTitle")}</h3>
                  <p className="text-sm text-text-muted">{tc("deleteConfirm")}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-background-alt transition-colors cursor-pointer">{tc("cancel")}</button>
                <button onClick={handleDelete} className="px-4 py-2.5 rounded-xl bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors cursor-pointer">{tc("delete")}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
