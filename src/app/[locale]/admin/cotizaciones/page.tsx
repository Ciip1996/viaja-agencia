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
  status: string;
  assigned_to: string | null;
  chat_history: unknown;
  created_at: string;
}

type FilterTab = "todas" | "nueva" | "en_proceso" | "cotizada";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "nueva", label: "Nuevas" },
  { key: "en_proceso", label: "En Proceso" },
  { key: "cotizada", label: "Cotizadas" },
];

const STATUS_OPTIONS = [
  { value: "nueva", label: "Nueva" },
  { value: "en_proceso", label: "En Proceso" },
  { value: "cotizada", label: "Cotizada" },
  { value: "cerrada", label: "Cerrada" },
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

export default function CotizacionesPage() {
  const [items, setItems] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("todas");
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<QuoteRequest | null>(null);

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
      setError("Configura Supabase para gestionar datos");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
      setError("Error al actualizar estado");
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
      setError("Error al eliminar");
    }
  };

  const filtered = items
    .filter((i) => {
      if (filter !== "todas" && i.status !== filter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        i.client_name.toLowerCase().includes(q) ||
        i.destination.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text">
            Cotizaciones
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {items.length} solicitudes de cotización
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-border p-1 bg-surface w-fit">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
              filter === tab.key
                ? "bg-primary text-white shadow-sm"
                : "text-text-muted hover:bg-background-alt hover:text-text"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Buscar por cliente o destino..."
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
            <p className="font-medium">No hay cotizaciones</p>
            <p className="text-sm mt-1">
              {search || filter !== "todas"
                ? "Intenta con otros filtros"
                : "Las cotizaciones aparecerán aquí"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-alt/50">
                  <th className="text-left font-medium text-text-muted px-4 py-3">Cliente</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden sm:table-cell">Email</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden md:table-cell">Destino</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden lg:table-cell">Tipo</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden lg:table-cell">Fuente</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">Status</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden xl:table-cell">Fecha</th>
                  <th className="text-right font-medium text-text-muted px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-background-alt/30 transition-colors cursor-pointer"
                    onClick={() => setDetailItem(item)}
                  >
                    <td className="px-4 py-3 font-medium text-text max-w-[160px] truncate">
                      {item.client_name}
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden sm:table-cell max-w-[180px] truncate">
                      {item.client_email}
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden md:table-cell max-w-[140px] truncate">
                      {item.destination}
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden lg:table-cell">
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
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className={cn(
                          "px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/30",
                          STATUS_COLORS[item.status] ?? "bg-gray-100 text-gray-600"
                        )}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden xl:table-cell whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailItem(item)}
                          className="p-2 rounded-lg text-text-muted hover:bg-secondary/10 hover:text-secondary transition-colors cursor-pointer"
                          aria-label="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="p-2 rounded-lg text-text-muted hover:bg-error/10 hover:text-error transition-colors cursor-pointer"
                          aria-label="Eliminar"
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
                  Detalle de Cotización
                </h2>
                <button
                  onClick={() => setDetailItem(null)}
                  className="p-2 rounded-lg text-text-muted hover:bg-background-alt transition-colors cursor-pointer"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailField label="Cliente" value={detailItem.client_name} />
                  <DetailField label="Email" value={detailItem.client_email} />
                  <DetailField label="Teléfono" value={detailItem.client_phone ?? "—"} />
                  <DetailField label="Destino" value={detailItem.destination} />
                  <DetailField label="Tipo de viaje" value={detailItem.travel_type ?? "—"} />
                  <DetailField label="Adultos" value={detailItem.adults?.toString() ?? "—"} />
                  <DetailField label="Niños" value={detailItem.children?.toString() ?? "—"} />
                  <DetailField label="Check-in" value={detailItem.check_in ?? "—"} />
                  <DetailField label="Check-out" value={detailItem.check_out ?? "—"} />
                  <DetailField label="Presupuesto" value={detailItem.budget_range ?? "—"} />
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-1">Fuente</p>
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-md text-xs font-medium",
                        SOURCE_COLORS[detailItem.source] ?? "bg-gray-100 text-gray-600"
                      )}
                    >
                      {detailItem.source}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-1">Estado</p>
                    <select
                      value={detailItem.status}
                      onChange={(e) => updateStatus(detailItem.id, e.target.value)}
                      className={cn(
                        "px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/30",
                        STATUS_COLORS[detailItem.status] ?? "bg-gray-100 text-gray-600"
                      )}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <DetailField
                    label="Fecha"
                    value={new Date(detailItem.created_at).toLocaleString("es-MX")}
                  />
                </div>

                {detailItem.notes && (
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-1">Notas</p>
                    <p className="text-sm text-text bg-background-alt/50 rounded-xl p-3 whitespace-pre-wrap">
                      {detailItem.notes}
                    </p>
                  </div>
                )}

                {detailItem.chat_history ? (
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-1">Historial de Chat</p>
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
                  Eliminar
                </button>
                <button
                  onClick={() => setDetailItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-background-alt transition-colors cursor-pointer"
                >
                  Cerrar
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
                    Eliminar Cotización
                  </h3>
                  <p className="text-sm text-text-muted">
                    Esta acción no se puede deshacer
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-background-alt transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2.5 rounded-xl bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors cursor-pointer"
                >
                  Eliminar
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
