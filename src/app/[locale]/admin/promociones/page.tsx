"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Tag,
  ImageIcon,
  AlertTriangle,
  Search,
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
import type { Promotion } from "@/lib/supabase/types";
import { useTranslations } from "next-intl";

type FormData = {
  id?: string;
  title: string;
  description: string | null;
  destination: string;
  price_usd: number;
  currency: string;
  image_url: string | null;
  badge: string | null;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  translation_group_id?: string;
};

type FormEN = {
  title: string;
  description: string | null;
  badge: string | null;
};

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  destination: "",
  price_usd: 0,
  currency: "USD",
  image_url: null,
  badge: null,
  is_active: true,
  valid_from: null,
  valid_until: null,
};

const EMPTY_EN: FormEN = { title: "", description: null, badge: null };

const BADGE_OPTIONS = ["", "HOT", "Oferta", "Premium", "Nuevo"];

export default function PromocionesPage() {
  const t = useTranslations("admin.promocionesPage");
  const tc = useTranslations("admin.common");

  const [items, setItems] = useState<Promotion[]>([]);
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
      const { data } = await fetchWithLocale<Promotion>("promotions", activeLocale);
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

  const openEdit = async (item: Promotion) => {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      destination: item.destination,
      price_usd: item.price_usd,
      currency: item.currency,
      image_url: item.image_url,
      badge: item.badge,
      is_active: item.is_active,
      valid_from: item.valid_from,
      valid_until: item.valid_until,
      translation_group_id: (item as Record<string, unknown>)
        .translation_group_id as string | undefined,
    });
    setFormTab("es");

    const groupId = (item as Record<string, unknown>)
      .translation_group_id as string | undefined;
    if (groupId) {
      const en = await fetchTranslation<Promotion>("promotions", groupId, "en");
      setFormEN(
        en
          ? { title: en.title, description: en.description, badge: en.badge }
          : EMPTY_EN
      );
    } else {
      setFormEN(EMPTY_EN);
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.destination) return;
    setSaving(true);
    try {
      const esPayload = {
        title: form.title,
        description: form.description,
        destination: form.destination,
        price_usd: form.price_usd,
        currency: form.currency,
        image_url: form.image_url,
        badge: form.badge || null,
        is_active: form.is_active,
        valid_from: form.valid_from || null,
        valid_until: form.valid_until || null,
      };

      const enPayload =
        formEN.title || formEN.description || formEN.badge
          ? {
              title: formEN.title,
              description: formEN.description,
              badge: formEN.badge,
              destination: form.destination,
              price_usd: form.price_usd,
              currency: form.currency,
              image_url: form.image_url,
              is_active: form.is_active,
              valid_from: form.valid_from || null,
              valid_until: form.valid_until || null,
            }
          : null;

      await saveWithTranslation(
        "promotions",
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
      await deleteWithTranslation("promotions", deleteId, deleteGroupId);
      setDeleteId(null);
      setDeleteGroupId(undefined);
      fetchData();
    } catch {
      setError(tc("errorDelete"));
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const supabase = (await import("@/lib/supabase/admin-client")).createAdminClient();
      await supabase.from("promotions").update({ is_active: !current }).eq("id", id);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, is_active: !current } : i))
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
      {/* Header */}
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

      {/* Search + Locale Toggle */}
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

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-warning/10 border border-warning/20 text-sm text-warning">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-secondary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Tag className="w-10 h-10 mb-3 text-text-light" />
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
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden sm:table-cell">{tc("price")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden lg:table-cell">{tc("badge")}</th>
                  <th className="text-center font-medium text-text-muted px-4 py-3 w-20">
                    <Languages className="w-4 h-4 mx-auto" />
                  </th>
                  <th className="text-center font-medium text-text-muted px-4 py-3">{tc("active")}</th>
                  <th className="text-right font-medium text-text-muted px-4 py-3">{tc("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => {
                  const hasGroupId = !!(item as Record<string, unknown>)
                    .translation_group_id;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-background-alt/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {item.image_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-12 h-9 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-9 rounded-lg bg-background-alt flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-text-light" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-text max-w-[200px] truncate">
                        {item.title}
                      </td>
                      <td className="px-4 py-3 text-text-muted hidden md:table-cell">
                        {item.destination}
                      </td>
                      <td className="px-4 py-3 text-text hidden sm:table-cell">
                        ${item.price_usd.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {item.badge ? (
                          <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-accent/10 text-accent-dark">
                            {item.badge}
                          </span>
                        ) : (
                          <span className="text-text-light">—</span>
                        )}
                      </td>
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
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleActive(item.id, item.is_active)}
                          className={cn(
                            "relative w-9 h-5 rounded-full transition-colors cursor-pointer",
                            item.is_active ? "bg-success" : "bg-border"
                          )}
                          aria-label={tc("toggleActive")}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                              item.is_active && "translate-x-4"
                            )}
                          />
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
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-lg text-text-muted hover:bg-background-alt transition-colors cursor-pointer"
                  aria-label={tc("close")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                <TranslationTabs activeTab={formTab} onTabChange={setFormTab}>
                  {formTab === "es" ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-text mb-1.5">
                            {t("titleLabel")}
                          </label>
                          <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                            placeholder={t("titlePlaceholder")}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-text mb-1.5">
                            {tc("description")}
                          </label>
                          <textarea
                            value={form.description ?? ""}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none"
                            placeholder={t("descPlaceholder")}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1.5">
                            {t("destLabel")}
                          </label>
                          <input
                            type="text"
                            value={form.destination}
                            onChange={(e) => setForm({ ...form, destination: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                            placeholder={t("destPlaceholder")}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1.5">
                            {tc("priceUsd")}
                          </label>
                          <input
                            type="number"
                            value={form.price_usd}
                            onChange={(e) =>
                              setForm({ ...form, price_usd: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                            min={0}
                            step={0.01}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1.5">
                            {tc("currency")}
                          </label>
                          <input
                            type="text"
                            value={form.currency}
                            onChange={(e) => setForm({ ...form, currency: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                            placeholder="USD"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1.5">
                            {tc("badge")}
                          </label>
                          <select
                            value={form.badge ?? ""}
                            onChange={(e) => setForm({ ...form, badge: e.target.value || null })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors cursor-pointer"
                          >
                            {BADGE_OPTIONS.map((o) => (
                              <option key={o} value={o}>
                                {o || t("noBadge")}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1.5">
                            {tc("validFrom")}
                          </label>
                          <input
                            type="date"
                            value={form.valid_from ?? ""}
                            onChange={(e) =>
                              setForm({ ...form, valid_from: e.target.value || null })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text mb-1.5">
                            {tc("validUntil")}
                          </label>
                          <input
                            type="date"
                            value={form.valid_until ?? ""}
                            onChange={(e) =>
                              setForm({ ...form, valid_until: e.target.value || null })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-text mb-1.5">
                            {tc("image")}
                          </label>
                          <ImageUpload
                            value={form.image_url}
                            onChange={(url) => setForm({ ...form, image_url: url || null })}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.is_active}
                              onChange={(e) =>
                                setForm({ ...form, is_active: e.target.checked })
                              }
                              className="w-4 h-4 rounded border-border text-primary focus:ring-secondary/30 cursor-pointer"
                            />
                            <span className="text-sm font-medium text-text">{tc("active")}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-text-muted bg-background-alt/50 px-3 py-2 rounded-lg">
                        Only translatable fields are shown. Shared fields (destination, price, currency, dates, image, active) are copied from the Spanish version.
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1.5">Title (EN)</label>
                        <input
                          type="text"
                          value={formEN.title}
                          onChange={(e) => setFormEN({ ...formEN, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                          placeholder="Promotion title in English"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1.5">Description (EN)</label>
                        <textarea
                          value={formEN.description ?? ""}
                          onChange={(e) => setFormEN({ ...formEN, description: e.target.value || null })}
                          rows={3}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none"
                          placeholder="Description in English"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1.5">Badge (EN)</label>
                        <select
                          value={formEN.badge ?? ""}
                          onChange={(e) => setFormEN({ ...formEN, badge: e.target.value || null })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors cursor-pointer"
                        >
                          {["", "HOT", "Sale", "Premium", "New"].map((o) => (
                            <option key={o} value={o}>{o || "No badge"}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </TranslationTabs>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-background-alt transition-colors cursor-pointer"
                >
                  {tc("cancel")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title || !form.destination}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
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
                  <h3 className="font-heading text-lg font-semibold text-text">
                    {t("deleteTitle")}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {tc("deleteConfirm")}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-background-alt transition-colors cursor-pointer"
                >
                  {tc("cancel")}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2.5 rounded-xl bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors cursor-pointer"
                >
                  {tc("delete")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
