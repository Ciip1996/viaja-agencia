"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  FileText,
  ImageIcon,
  AlertTriangle,
  Search,
} from "lucide-react";
import dynamic from "next/dynamic";
import { fetchWithLocale, saveWithLocale, deleteRow } from "@/lib/supabase/admin-query";
import { cn } from "@/lib/utils/cn";
import ImageUpload from "@/components/admin/ImageUpload";
import type { BlogPost } from "@/lib/supabase/types";

const TiptapEditor = dynamic(() => import("@/components/admin/TiptapEditor"), {
  ssr: false,
});

type FormData = Omit<BlogPost, "id" | "created_at" | "locale"> & { id?: string };

const EMPTY_FORM: FormData = {
  title: "",
  slug: "",
  excerpt: null,
  content: null,
  cover_image_url: null,
  author: "",
  is_published: false,
  published_at: null,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(true);
  const [activeLocale, setActiveLocale] = useState("es");

  const fetchData = useCallback(async () => {
    try {
      const { data } = await fetchWithLocale<BlogPost>("blog_posts", activeLocale);
      setItems(data);
      setError(null);
    } catch {
      setError("Configura Supabase para gestionar datos");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeLocale]);

  useEffect(() => {
    fetchData();
  }, [fetchData, activeLocale]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setAutoSlug(true);
    setModalOpen(true);
  };

  const openEdit = (item: BlogPost) => {
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      cover_image_url: item.cover_image_url,
      author: item.author,
      is_published: item.is_published,
      published_at: item.published_at,
    });
    setAutoSlug(false);
    setModalOpen(true);
  };

  const handleTitleChange = (value: string) => {
    const next: Partial<FormData> = { title: value };
    if (autoSlug) next.slug = slugify(value);
    setForm((prev) => ({ ...prev, ...next }));
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.author) return;
    setSaving(true);
    try {
      const wasPublished = form.id
        ? items.find((i) => i.id === form.id)?.is_published ?? false
        : false;

      const published_at =
        form.is_published && !wasPublished
          ? new Date().toISOString()
          : form.published_at;

      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        cover_image_url: form.cover_image_url,
        author: form.author,
        is_published: form.is_published,
        published_at: published_at as string | null,
      };

      await saveWithLocale("blog_posts", payload, activeLocale, form.id);

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
      await deleteRow("blog_posts", deleteId);
      setDeleteId(null);
      fetchData();
    } catch {
      setError("Error al eliminar");
    }
  };

  const togglePublished = async (id: string, current: boolean) => {
    try {
      const updates: Record<string, unknown> = { is_published: !current };
      if (!current) updates.published_at = new Date().toISOString();
      await saveWithLocale("blog_posts", updates, activeLocale, id);
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                is_published: !current,
                published_at: !current ? new Date().toISOString() : i.published_at,
              }
            : i
        )
      );
    } catch {
      /* silent */
    }
  };

  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text">Blog</h1>
          <p className="text-sm text-text-muted mt-1">Gestiona los artículos del blog</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer self-start">
          <Plus className="w-4 h-4" />
          Nuevo Artículo
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" placeholder="Buscar artículos..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors" />
      </div>

      <div className="flex items-center rounded-xl border border-border overflow-hidden">
        {[{ value: "es", label: "🇲🇽 ES" }, { value: "en", label: "🇺🇸 EN" }].map((opt) => (
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
            <FileText className="w-10 h-10 mb-3 text-text-light" />
            <p className="font-medium">No hay artículos</p>
            <p className="text-sm mt-1">{search ? "Intenta con otro término" : "Crea el primer artículo"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-alt/50">
                  <th className="text-left font-medium text-text-muted px-4 py-3">Portada</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3">Título</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden md:table-cell">Slug</th>
                  <th className="text-left font-medium text-text-muted px-4 py-3 hidden sm:table-cell">Autor</th>
                  <th className="text-center font-medium text-text-muted px-4 py-3">Publicado</th>
                  <th className="text-right font-medium text-text-muted px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-background-alt/30 transition-colors">
                    <td className="px-4 py-3">
                      {item.cover_image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.cover_image_url} alt={item.title} className="w-12 h-9 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-9 rounded-lg bg-background-alt flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-text-light" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-text max-w-[200px] truncate">{item.title}</td>
                    <td className="px-4 py-3 text-text-muted hidden md:table-cell font-mono text-xs max-w-[160px] truncate">{item.slug}</td>
                    <td className="px-4 py-3 text-text-muted hidden sm:table-cell">{item.author}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => togglePublished(item.id, item.is_published)} className={cn("relative w-9 h-5 rounded-full transition-colors cursor-pointer", item.is_published ? "bg-success" : "bg-border")} aria-label="Toggle publicado">
                        <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform", item.is_published && "translate-x-4")} />
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
                <h2 className="font-heading text-xl font-semibold text-text">{form.id ? "Editar Artículo" : "Nuevo Artículo"}</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg text-text-muted hover:bg-background-alt transition-colors cursor-pointer" aria-label="Cerrar">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text mb-1.5">Título *</label>
                    <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors" placeholder="Ej: 10 destinos imperdibles" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text mb-1.5">Slug *</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => {
                        setAutoSlug(false);
                        setForm({ ...form, slug: e.target.value });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text font-mono focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                      placeholder="10-destinos-imperdibles"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text mb-1.5">Extracto</label>
                    <textarea value={form.excerpt ?? ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value || null })} rows={2} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors resize-none" placeholder="Resumen breve del artículo..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text mb-1.5">Contenido</label>
                    <TiptapEditor
                      content={form.content ?? ""}
                      onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Autor *</label>
                    <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors" placeholder="Nombre del autor" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 rounded border-border text-primary focus:ring-secondary/30 cursor-pointer" />
                      <span className="text-sm font-medium text-text">Publicar ahora</span>
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text mb-1.5">Imagen de portada</label>
                    <ImageUpload value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url || null })} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-background-alt transition-colors cursor-pointer">Cancelar</button>
                <button onClick={handleSave} disabled={saving || !form.title || !form.slug || !form.author} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {form.id ? "Guardar Cambios" : "Crear Artículo"}
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
                  <h3 className="font-heading text-lg font-semibold text-text">Eliminar Artículo</h3>
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
