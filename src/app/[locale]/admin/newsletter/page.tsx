"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  Mail,
  AlertTriangle,
  Download,
  Trash2,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { cn } from "@/lib/utils/cn";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  locale: string | null;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export default function NewsletterPage() {
  const t = useTranslations("admin.newsletterPage");
  const tc = useTranslations("admin.common");
  const locale = useLocale();
  const dateLocale = locale === "es" ? "es-MX" : "en-US";

  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const supabase = createAdminClient();
      const { data, error: err } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (err) throw err;
      setItems(data ?? []);
      setError(null);
    } catch {
      setError(tc("errorSupabase"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const supabase = createAdminClient();
      await supabase
        .from("newsletter_subscribers")
        .update({ is_active: !current })
        .eq("id", id);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, is_active: !current } : i))
      );
    } catch {
      /* silent */
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const supabase = createAdminClient();
      const { error: err } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", deleteId);
      if (err) throw err;
      setDeleteId(null);
      fetchData();
    } catch {
      setError(tc("errorDelete"));
    }
  };

  const exportCSV = () => {
    const header = "Email,Name,Locale,Active,Subscribed Date\n";
    const rows = items
      .map(
        (s) =>
          `"${s.email}","${s.name ?? ""}","${s.locale ?? ""}","${s.is_active ? "Yes" : "No"}","${new Date(s.subscribed_at).toISOString()}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = items.filter((i) =>
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = items.filter((i) => i.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text">
            {t("pageTitle")}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {t("subscribersCount", { count: items.length, active: activeCount })}
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={items.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer self-start"
        >
          <Download className="w-4 h-4" />
          {t("exportCsv")}
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
        />
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
            <Mail className="w-10 h-10 mb-3 text-text-light" />
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
                  <th className="text-left font-medium text-text-muted px-4 py-3">{tc("email")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden sm:table-cell">{tc("locale")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden md:table-cell">{tc("date")}</th>
                  <th className="text-center font-medium text-text-muted px-4 py-3">{tc("active")}</th>
                  <th className="text-right font-medium text-text-muted px-4 py-3">{tc("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-background-alt/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-text max-w-[260px] truncate">
                      {item.email}
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden sm:table-cell">
                      {item.locale ? (
                        <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-background-alt text-text-muted">
                          {item.locale.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-text-light">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden md:table-cell">
                      {new Date(item.subscribed_at).toLocaleDateString(dateLocale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
                          onClick={() => setDeleteId(item.id)}
                          className="p-2 rounded-lg text-text-muted hover:bg-error/10 hover:text-error transition-colors cursor-pointer"
                          aria-label={tc("delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
