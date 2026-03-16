"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  MessageSquareQuote,
  AlertTriangle,
  Trash2,
  X,
  Eye,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { cn } from "@/lib/utils/cn";

interface QuoteRequest {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  destination: string;
  travel_type: string | null;
  check_in: string | null;
  check_out: string | null;
  adults: number | null;
  children: number | null;
  budget_range: string | null;
  notes: string | null;
  source: string;
  preferred_locale: string;
  status: string;
  assigned_to: string | null;
  chat_history: unknown;
  created_at: string;
  read_at: string | null;
}

type FilterTab = "todas" | "nueva" | "en_proceso" | "cotizada";

const FILTER_TABS: { key: FilterTab; tKey: string }[] = [
  { key: "todas", tKey: "filterAll" },
  { key: "nueva", tKey: "filterNew" },
  { key: "en_proceso", tKey: "filterInProgress" },
  { key: "cotizada", tKey: "filterQuoted" },
];

const STATUS_OPTION_KEYS = [
  { value: "nueva", tKey: "statusNew" },
  { value: "en_proceso", tKey: "statusInProgress" },
  { value: "cotizada", tKey: "statusQuoted" },
  { value: "cerrada", tKey: "statusClosed" },
];

const STATUS_COLORS: Record<string, string> = {
  nueva: "bg-blue-100 text-blue-700",
  en_proceso: "bg-yellow-100 text-yellow-700",
  cotizada: "bg-green-100 text-green-700",
  cerrada: "bg-gray-100 text-gray-600",
};

const SOURCE_COLORS: Record<string, string> = {
  wizard: "bg-purple-100 text-purple-700",
  chatbot: "bg-indigo-100 text-indigo-700",
};

function getHoursAgo(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60);
}

type UrgencyLevel = "critical" | "high" | "normal" | "read";

function getUrgency(item: QuoteRequest): UrgencyLevel {
  if (item.read_at) return "read";
  if (item.status !== "nueva") return "normal";
  const hours = getHoursAgo(item.created_at);
  if (hours > 12) return "critical";
  return "high";
}

const URGENCY_ROW: Record<UrgencyLevel, string> = {
  critical:
    "bg-red-50/80 border-l-[3px] border-l-red-500 hover:bg-red-50",
  high:
    "bg-amber-50/50 border-l-[3px] border-l-amber-400 hover:bg-amber-50/70",
  normal: "hover:bg-background-alt/30",
  read: "hover:bg-background-alt/30",
};

export default function CotizacionesPage() {
  const t = useTranslations("admin.cotizacionesPage");
  const tc = useTranslations("admin.common");
  const locale = useLocale();
  const dateLocale = locale === "es" ? "es-MX" : "en-US";

  const [items, setItems] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("todas");
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<QuoteRequest | null>(null);

  const markAsRead = useCallback(async (item: QuoteRequest) => {
    if (item.read_at) return;
    const now = new Date().toISOString();
    try {
      const supabase = createAdminClient();
      await supabase
        .from("quote_requests")
        .update({ read_at: now })
        .eq("id", item.id);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, read_at: now } : i))
      );
    } catch {
      /* silent */
    }
  }, []);

  const openDetail = useCallback(
    (item: QuoteRequest) => {
      setDetailItem(item.read_at ? item : { ...item, read_at: new Date().toISOString() });
      markAsRead(item);
    },
    [markAsRead]
  );

  const fetchData = useCallback(async () => {
    try {
      const supabase = createAdminClient();
      const { data, error: err } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;
      setItems(data ?? []);
      setError(null);
    } catch {
      setError(tc("errorSupabase"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [tc]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const supabase = createAdminClient();
      await supabase
        .from("quote_requests")
        .update({ status: newStatus })
        .eq("id", id);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
      if (detailItem?.id === id) {
        setDetailItem((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch {
      setError(tc("errorStatus"));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const supabase = createAdminClient();
      const { error: err } = await supabase
        .from("quote_requests")
        .delete()
        .eq("id", deleteId);
      if (err) throw err;
      setDeleteId(null);
      if (detailItem?.id === deleteId) setDetailItem(null);
      fetchData();
    } catch {
      setError(tc("errorDelete"));
    }
  };

  const unreadNewCount = items.filter(
    (i) => i.status === "nueva" && !i.read_at
  ).length;

  const tabCounts: Record<FilterTab, number> = {
    todas: items.length,
    nueva: items.filter((i) => i.status === "nueva").length,
    en_proceso: items.filter((i) => i.status === "en_proceso").length,
    cotizada: items.filter((i) => i.status === "cotizada").length,
  };

  const filtered = items
    .filter((i) => {
      if (filter !== "todas" && i.status !== filter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        i.client_name.toLowerCase().includes(q) ||
        i.destination?.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text">
              {t("pageTitle")}
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {items.length} {t("pageSubtitle")}
            </p>
          </div>
          {unreadNewCount > 0 && (
            <span className="relative flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/30 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              {unreadNewCount} {unreadNewCount === 1 ? "nueva" : "nuevas"}
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-border p-1 bg-surface w-fit">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5",
              filter === tab.key
                ? "bg-primary text-white shadow-sm"
                : "text-text-muted hover:bg-background-alt hover:text-text"
            )}
          >
            {t(tab.tKey)}
            {tabCounts[tab.key] > 0 && (
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1 tabular-nums",
                  filter === tab.key
                    ? "bg-white/25 text-white"
                    : tab.key === "nueva"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-500"
                )}
              >
                {tabCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
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
            <MessageSquareQuote className="w-10 h-10 mb-3 text-text-light" />
            <p className="font-medium">{t("emptyTitle")}</p>
            <p className="text-sm mt-1">
              {search || filter !== "todas"
                ? t("emptyFilterHint")
                : t("emptyHint")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-alt/50">
                  <th className="text-left font-medium text-text-muted px-4 py-3">{t("client")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden sm:table-cell">{tc("email")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden md:table-cell">{tc("destination")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden lg:table-cell">{tc("type")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden lg:table-cell">{tc("source")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden lg:table-cell">{t("preferredLang")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">{tc("status")}</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden xl:table-cell">{tc("date")}</th>
                  <th className="text-right font-medium text-text-muted px-4 py-3">{tc("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => {
                  const urgency = getUrgency(item);
                  const isUnread = !item.read_at;
                  const isCritical = urgency === "critical";
                  const isHigh = urgency === "high";
                  const hoursAgo = getHoursAgo(item.created_at);
                  const timeLabel = hoursAgo < 1
                    ? `${Math.round(hoursAgo * 60)}m`
                    : hoursAgo < 24
                      ? `${Math.round(hoursAgo)}h`
                      : `${Math.round(hoursAgo / 24)}d`;

                  return (
                    <tr
                      key={item.id}
                      className={cn(
                        "transition-colors cursor-pointer",
                        URGENCY_ROW[urgency]
                      )}
                      onClick={() => openDetail(item)}
                    >
                      <td className="px-4 py-3 max-w-[200px]">
                        <div className="flex items-center gap-2">
                          {isUnread && item.status === "nueva" && (
                            <span className="relative flex h-2.5 w-2.5 shrink-0">
                              <span
                                className={cn(
                                  "absolute inline-flex h-full w-full rounded-full opacity-75",
                                  isCritical ? "bg-red-500 animate-ping" : "bg-amber-400 animate-ping"
                                )}
                              />
                              <span
                                className={cn(
                                  "relative inline-flex h-2.5 w-2.5 rounded-full",
                                  isCritical ? "bg-red-500" : "bg-amber-400"
                                )}
                              />
                            </span>
                          )}
                          <div className="truncate">
                            <span
                              className={cn(
                                "truncate",
                                isUnread
                                  ? "font-bold text-text"
                                  : "font-medium text-text"
                              )}
                            >
                              {item.client_name}
                            </span>
                            {isCritical && (
                              <span className="ml-1.5 inline-flex items-center gap-0.5 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">
                                {timeLabel}
                              </span>
                            )}
                            {isHigh && !isCritical && (
                              <span className="ml-1.5 inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                                {timeLabel}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={cn(
                        "px-4 py-3 hidden sm:table-cell max-w-[180px] truncate",
                        isUnread ? "font-semibold text-text" : "text-text-muted"
                      )}>
                        {item.client_email}
                      </td>
                      <td className={cn(
                        "px-4 py-3 hidden md:table-cell max-w-[140px] truncate",
                        isUnread ? "font-semibold text-text" : "text-text-muted"
                      )}>
                        {item.destination}
                      </td>
                      <td className={cn(
                        "px-4 py-3 hidden lg:table-cell",
                        isUnread ? "font-semibold text-text" : "text-text-muted"
                      )}>
                        {item.travel_type ?? "—"}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span
                          className={cn(
                            "inline-flex px-2 py-0.5 rounded-md text-xs font-medium",
                            SOURCE_COLORS[item.source] ?? "bg-gray-100 text-gray-600"
                          )}
                        >
                          {item.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs font-medium">
                          {item.preferred_locale === "en" ? "EN" : "ES"}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item.id, e.target.value)}
                          className={cn(
                            "px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/30",
                            STATUS_COLORS[item.status] ?? "bg-gray-100 text-gray-600"
                          )}
                        >
                          {STATUS_OPTION_KEYS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {t(opt.tKey)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className={cn(
                        "px-4 py-3 hidden xl:table-cell whitespace-nowrap",
                        isUnread ? "font-semibold text-text" : "text-text-muted"
                      )}>
                        {new Date(item.created_at).toLocaleDateString(dateLocale, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openDetail(item)}
                            className="p-2 rounded-lg text-text-muted hover:bg-secondary/10 hover:text-secondary transition-colors cursor-pointer"
                            aria-label={t("viewDetail")}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] px-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
            onClick={() => setDetailItem(null)}
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
                  {t("detailTitle")}
                </h2>
                <button
                  onClick={() => setDetailItem(null)}
                  className="p-2 rounded-lg text-text-muted hover:bg-background-alt transition-colors cursor-pointer"
                  aria-label={tc("close")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailField label={t("client")} value={detailItem.client_name} />
                  <DetailField label={tc("email")} value={detailItem.client_email} />
                  <DetailField label={t("phone")} value={detailItem.client_phone ?? "—"} />
                  <DetailField label={tc("destination")} value={detailItem.destination} />
                  <DetailField label={t("travelType")} value={detailItem.travel_type ?? "—"} />
                  <DetailField label={t("adults")} value={detailItem.adults?.toString() ?? "—"} />
                  <DetailField label={t("children")} value={detailItem.children?.toString() ?? "—"} />
                  <DetailField label={t("checkIn")} value={detailItem.check_in ?? "—"} />
                  <DetailField label={t("checkOut")} value={detailItem.check_out ?? "—"} />
                  <DetailField label={t("budget")} value={detailItem.budget_range ?? "—"} />
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-1">{tc("source")}</p>
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-md text-xs font-medium",
                        SOURCE_COLORS[detailItem.source] ?? "bg-gray-100 text-gray-600"
                      )}
                    >
                      {detailItem.source}
                    </span>
                  </div>
                  <DetailField label={t("preferredLang")} value={detailItem.preferred_locale === "en" ? "🇺🇸 English" : "🇲🇽 Español"} />
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-1">{tc("status")}</p>
                    <select
                      value={detailItem.status}
                      onChange={(e) => updateStatus(detailItem.id, e.target.value)}
                      className={cn(
                        "px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/30",
                        STATUS_COLORS[detailItem.status] ?? "bg-gray-100 text-gray-600"
                      )}
                    >
                      {STATUS_OPTION_KEYS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t(opt.tKey)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <DetailField
                    label={tc("date")}
                    value={new Date(detailItem.created_at).toLocaleString(dateLocale)}
                  />
                </div>

                {detailItem.notes && (
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-1">{tc("notes")}</p>
                    <p className="text-sm text-text bg-background-alt/50 rounded-xl p-3 whitespace-pre-wrap">
                      {detailItem.notes}
                    </p>
                  </div>
                )}

                {detailItem.chat_history ? (
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-1">{t("chatHistory")}</p>
                    <pre className="text-xs text-text bg-background-alt/50 rounded-xl p-3 overflow-x-auto max-h-60 whitespace-pre-wrap">
                      {typeof detailItem.chat_history === "string"
                        ? detailItem.chat_history
                        : JSON.stringify(detailItem.chat_history as object, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                <button
                  onClick={() => {
                    setDeleteId(detailItem.id);
                    setDetailItem(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-error/10 text-error text-sm font-medium hover:bg-error/20 transition-colors cursor-pointer"
                >
                  {tc("delete")}
                </button>
                <button
                  onClick={() => setDetailItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-background-alt transition-colors cursor-pointer"
                >
                  {tc("close")}
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

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-muted mb-1">{label}</p>
      <p className="text-sm text-text">{value}</p>
    </div>
  );
}
