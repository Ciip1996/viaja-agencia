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
  HelpCircle,
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
import TranslationTabs from "@/components/admin/TranslationTabs";
import type { FAQ } from "@/lib/supabase/types";

type FormData = {
  id?: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  translation_group_id?: string;
};

type FormEN = {
  question: string;
  answer: string;
};

const EMPTY_FORM: FormData = {
  question: "",
  answer: "",
  display_order: 0,
  is_active: true,
};

const EMPTY_EN: FormEN = { question: "", answer: "" };

export default function FAQPage() {
  const t = useTranslations("admin.faqPage");
  const tc = useTranslations("admin.common");

  const [items, setItems] = useState<FAQ[]>([]);
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
      const { data } = await fetchWithLocale<FAQ>("faq", activeLocale, {
        orderBy: "display_order",
        ascending: true,
      });
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
    setForm({
      ...EMPTY_FORM,
      display_order:
        items.length > 0
          ? Math.max(...items.map((i) => i.display_order)) + 1
          : 0,
    });
    setFormEN(EMPTY_EN);
    setFormTab("es");
    setModalOpen(true);
  };

  const openEdit = async (item: FAQ) => {
    setForm({
      id: item.id,
      question: item.question,
      answer: item.answer,
      display_order: item.display_order,
      is_active: item.is_active,
      translation_group_id: (item as Record<string, unknown>)
        .translation_group_id as string | undefined,
    });
    setFormTab("es");

    const groupId = (item as Record<string, unknown>)
      .translation_group_id as string | undefined;
    if (groupId) {
      const en = await fetchTranslation<FAQ>("faq", groupId, "en");
      setFormEN(
        en ? { question: en.question, answer: en.answer } : EMPTY_EN
      );
    } else {
      setFormEN(EMPTY_EN);
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.question || !form.answer) return;
    setSaving(true);
    try {
      const esPayload = {
        question: form.question,
        answer: form.answer,
        display_order: form.display_order,
        is_active: form.is_active,
      };

      const enPayload =
        formEN.question || formEN.answer
          ? {
              question: formEN.question,
              answer: formEN.answer,
              display_order: form.display_order,
              is_active: form.is_active,
            }
          : null;

      await saveWithTranslation(
        "faq",
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
      await deleteWithTranslation("faq", deleteId, deleteGroupId);
      setDeleteId(null);
      setDeleteGroupId(undefined);
      fetchData();
    } catch {
      setError(tc("errorDelete"));
    }
  };

  const toggleActive = async (item: FAQ) => {
    try {
      const supabase = (await import("@/lib/supabase/admin-client")).createAdminClient();
      await supabase.from("faq").update({ is_active: !item.is_active }).eq("id", item.id);
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, is_active: !item.is_active } : i
        )
      );
    } catch {
      /* silent */
    }
  };

  const filtered = items.filter((i) =>
    i.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text">
            {t("pageTitle")}
          </h1>
          <p className="text-sm text-text-muted mt-1">{t("pageSubtitle")}</p>
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
            <HelpCircle className="w-10 h-10 mb-3 text-text-light" />
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
                  <th className="text-left font-medium text-text-muted px-4 py-3">
                    {t("question")}
                  </th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 w-20">
                    {tc("order")}
                  </th>
                  <th className="text-center font-medium text-text-muted px-4 py-3 w-20">
                    <Languages className="w-4 h-4 mx-auto" />
                  </th>
                  <th className="text-center font-medium text-text-muted px-4 py-3 w-24">
                    {tc("active")}
                  </th>
                  <th className="text-right font-medium text-text-muted px-4 py-3 w-28">
                    {tc("actions")}
                  </th>
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
                      <td className="px-4 py-3 font-medium text-text max-w-[400px] truncate">
                        {item.question}
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-background-alt text-xs font-semibold text-text">
                          {item.display_order}
                        </span>
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
                          onClick={() => toggleActive(item)}
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
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text mb-1.5">
                          {t("questionLabel")}
                        </label>
                        <input
                          type="text"
                          value={form.question}
                          onChange={(e) =>
                            setForm({ ...form, question: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                          placeholder={t("questionPlaceholder")}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1.5">
                          {t("answerLabel")}
                        </label>
                        <textarea
                          value={form.answer}
                          onChange={(e) =>
                            setForm({ ...form, answer: e.target.value })
                          }
                          rows={5}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-y"
                          placeholder={t("answerPlaceholder")}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text mb-1.5">
                            {t("orderLabel")}
                          </label>
                          <input
                            type="number"
                            value={form.display_order}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                display_order: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                            min={0}
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.is_active}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  is_active: e.target.checked,
                                })
                              }
                              className="w-4 h-4 rounded border-border text-primary focus:ring-secondary/30 cursor-pointer"
                            />
                            <span className="text-sm font-medium text-text">
                              {tc("active")}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-text-muted bg-background-alt/50 px-3 py-2 rounded-lg">
                        Only translatable fields are shown. Shared fields (order,
                        active) are copied from the Spanish version.
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1.5">
                          Question (EN)
                        </label>
                        <input
                          type="text"
                          value={formEN.question}
                          onChange={(e) =>
                            setFormEN({ ...formEN, question: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                          placeholder="Question in English"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1.5">
                          Answer (EN)
                        </label>
                        <textarea
                          value={formEN.answer}
                          onChange={(e) =>
                            setFormEN({ ...formEN, answer: e.target.value })
                          }
                          rows={5}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-y"
                          placeholder="Answer in English"
                        />
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
                  disabled={saving || !form.question || !form.answer}
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
