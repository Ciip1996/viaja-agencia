"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  MessageSquare,
  ImageIcon,
  AlertTriangle,
  Search,
  Star,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { cn } from "@/lib/utils/cn";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Testimonial } from "@/lib/supabase/types";

type FormData = Omit<Testimonial, "id" | "created_at"> & { id?: string };

const EMPTY_FORM: FormData = {
  client_name: "",
  client_photo_url: null,
  trip_destination: "",
  review_text: "",
  rating: 5,
  is_active: true,
};

export default function TestimoniosPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const supabase = createAdminClient();
      const { data, error: err } = await supabase
        .from("testimonials")
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

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setForm({
      id: item.id,
      client_name: item.client_name,
      client_photo_url: item.client_photo_url,
      trip_destination: item.trip_destination,
      review_text: item.review_text,
      rating: item.rating,
      is_active: item.is_active,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.client_name || !form.trip_destination || !form.review_text) return;
    setSaving(true);
    try {
      const supabase = createAdminClient();
      const payload = {
        client_name: form.client_name,
        client_photo_url: form.client_photo_url,
        trip_destination: form.trip_destination,
        review_text: form.review_text,
        rating: form.rating,
        is_active: form.is_active,
      };

      if (form.id) {
        const { error: err } = await supabase.from("testimonials").update(payload).eq("id", form.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("testimonials").insert(payload);
        if (err) throw err;
      }

      setModalOpen(false);
      fetchData();
    } catch {
      setError("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const supabase = createAdminClient();
      const { error: err } = await supabase.from("testimonials").delete().eq("id", deleteId);
      if (err) throw err;
      setDeleteId(null);
      fetchData();
    } catch {
      setError("Error al eliminar");
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const supabase = createAdminClient();
      await supabase.from("testimonials").update({ is_active: !current }).eq("id", id);
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_active: !current } : i)));
    } catch {
      /* silent */
    }
  };

  const filtered = items.filter(
    (i) =>
      i.client_name.toLowerCase().includes(search.toLowerCase()) ||
      i.trip_destination.toLowerCase().includes(search.toLowerCase())
  );

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < rating ? "text-accent fill-accent" : "text-text-light"
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text">Testimonios</h1>
          <p className="text-sm text-text-muted mt-1">Gestiona las reseñas de clientes</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer self-start">
          <Plus className="w-4 h-4" />
          Nuevo Testimonio
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" placeholder="Buscar testimonios..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors" />
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
            <MessageSquare className="w-10 h-10 mb-3 text-text-light" />
            <p className="font-medium">No hay testimonios</p>
            <p className="text-sm mt-1">{search ? "Intenta con otro término" : "Crea el primer testimonio"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-alt/50">
                  <th className="text-left font-medium text-text-muted px-4 py-3">Foto</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">Nombre</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden md:table-cell">Destino</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden sm:table-cell">Rating</th>
                  <th className="text-center font-medium text-text-muted px-4 py-3">Activo</th>
                  <th className="text-right font-medium text-text-muted px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-background-alt/30 transition-colors">
                    <td className="px-4 py-3">
                      {item.client_photo_url ? (
                        <img src={item.client_photo_url} alt={item.client_name} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">{item.client_name.slice(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-text">{item.client_name}</td>
                    <td className="px-4 py-3 text-text-muted hidden md:table-cell">{item.trip_destination}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{renderStars(item.rating)}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleActive(item.id, item.is_active)} className={cn("relative w-9 h-5 rounded-full transition-colors cursor-pointer", item.is_active ? "bg-success" : "bg-border")} aria-label="Toggle activo">
                        <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform", item.is_active && "translate-x-4")} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-text-muted hover:bg-secondary/10 hover:text-secondary transition-colors cursor-pointer" aria-label="Editar">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(item.id)} className="p-2 rounded-lg text-text-muted hover:bg-error/10 hover:text-error transition-colors cursor-pointer" aria-label="Eliminar">
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

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] px-4 bg-black/40 backdrop-blur-sm overflow-y-auto" onClick={() => setModalOpen(false)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl bg-surface rounded-2xl border border-border shadow-elevated mb-10">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-heading text-xl font-semibold text-text">{form.id ? "Editar Testimonio" : "Nuevo Testimonio"}</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg text-text-muted hover:bg-background-alt transition-colors cursor-pointer" aria-label="Cerrar">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Nombre del cliente *</label>
                    <input type="text" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors" placeholder="Ej: María García" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Destino del viaje *</label>
                    <input type="text" value={form.trip_destination} onChange={(e) => setForm({ ...form, trip_destination: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors" placeholder="Ej: Cancún" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text mb-1.5">Reseña *</label>
                    <textarea value={form.review_text} onChange={(e) => setForm({ ...form, review_text: e.target.value })} rows={4} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none" placeholder="La experiencia del cliente..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Rating</label>
                    <select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors cursor-pointer">
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>{r} estrella{r !== 1 && "s"}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-border text-primary focus:ring-secondary/30 cursor-pointer" />
                      <span className="text-sm font-medium text-text">Activo</span>
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text mb-1.5">Foto del cliente</label>
                    <ImageUpload value={form.client_photo_url} onChange={(url) => setForm({ ...form, client_photo_url: url || null })} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-background-alt transition-colors cursor-pointer">Cancelar</button>
                <button onClick={handleSave} disabled={saving || !form.client_name || !form.trip_destination || !form.review_text} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {form.id ? "Guardar Cambios" : "Crear Testimonio"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm bg-surface rounded-2xl border border-border p-6 shadow-elevated">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-error" /></div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-text">Eliminar Testimonio</h3>
                  <p className="text-sm text-text-muted">Esta acción no se puede deshacer</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-background-alt transition-colors cursor-pointer">Cancelar</button>
                <button onClick={handleDelete} className="px-4 py-2.5 rounded-xl bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors cursor-pointer">Eliminar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
