"use client";

import { useEffect, useState, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import {
  Tag,
  Package,
  Users,
  FileText,
  TrendingUp,
  ArrowRight,
  Plus,
  Sparkles,
  MessageSquareQuote,
  Mail,
  Inbox,
  Loader2,
  Clock,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { cn } from "@/lib/utils/cn";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const Bar = dynamic(() => import("react-chartjs-2").then((m) => m.Bar), {
  ssr: false,
});

interface QuoteRequest {
  id: string;
  client_name: string;
  destination: string;
  source: string;
  status: string;
  created_at: string;
}

interface DashboardStats {
  promotions: number;
  packages: number;
  groupTrips: number;
  blogPosts: number;
  quoteRequests: number;
  newsletter: number;
  contacts: number;
}

const STAT_CARDS = [
  { key: "promotions" as const, label: "Promociones activas", icon: Tag, color: "text-secondary", bg: "bg-secondary/10" },
  { key: "packages" as const, label: "Paquetes activos", icon: Package, color: "text-primary", bg: "bg-primary/10" },
  { key: "groupTrips" as const, label: "Viajes grupales", icon: Users, color: "text-accent", bg: "bg-accent/10" },
  { key: "blogPosts" as const, label: "Posts publicados", icon: FileText, color: "text-success", bg: "bg-success/10" },
  { key: "quoteRequests" as const, label: "Cotizaciones", icon: MessageSquareQuote, color: "text-warning", bg: "bg-warning/10" },
  { key: "newsletter" as const, label: "Suscriptores", icon: Mail, color: "text-info", bg: "bg-info/10" },
  { key: "contacts" as const, label: "Contactos", icon: Inbox, color: "text-error", bg: "bg-error/10" },
] as const;

const QUICK_ACTION_ITEMS = [
  { key: "newPromotion", href: "/admin/promociones", icon: Tag, label: "Nueva Promoción" },
  { key: "newPackage", href: "/admin/paquetes", icon: Package, label: "Nuevo Paquete" },
  { key: "newPost", href: "/admin/blog", icon: FileText, label: "Nuevo Post" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  nueva: "bg-blue-100 text-blue-700",
  en_proceso: "bg-yellow-100 text-yellow-700",
  cotizada: "bg-green-100 text-green-700",
  cerrada: "bg-gray-100 text-gray-600",
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const [stats, setStats] = useState<DashboardStats>({
    promotions: 0,
    packages: 0,
    groupTrips: 0,
    blogPosts: 0,
    quoteRequests: 0,
    newsletter: 0,
    contacts: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<QuoteRequest[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    nueva: 0,
    en_proceso: 0,
    cotizada: 0,
    cerrada: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const supabase = createAdminClient();

      const [
        { count: promoCount },
        { count: pkgCount },
        { count: tripCount },
        { count: blogCount },
        { count: quoteCount },
        { count: nlCount },
        { count: contactCount },
        { data: recentData },
        { data: allQuotes },
      ] = await Promise.all([
        supabase.from("promotions").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("packages").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("group_trips").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("quote_requests").select("*", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
        supabase.from("quote_requests").select("id, client_name, destination, source, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("quote_requests").select("status"),
      ]);

      setStats({
        promotions: promoCount ?? 0,
        packages: pkgCount ?? 0,
        groupTrips: tripCount ?? 0,
        blogPosts: blogCount ?? 0,
        quoteRequests: quoteCount ?? 0,
        newsletter: nlCount ?? 0,
        contacts: contactCount ?? 0,
      });

      setRecentQuotes(recentData ?? []);

      const counts: Record<string, number> = { nueva: 0, en_proceso: 0, cotizada: 0, cerrada: 0 };
      (allQuotes ?? []).forEach((q: { status: string }) => {
        if (counts[q.status] !== undefined) counts[q.status]++;
      });
      setStatusCounts(counts);
    } catch {
      /* Supabase not configured */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const chartData = {
    labels: ["Nueva", "En Proceso", "Cotizada", "Cerrada"],
    datasets: [
      {
        label: "Cotizaciones",
        data: [statusCounts.nueva, statusCounts.en_proceso, statusCounts.cotizada, statusCounts.cerrada],
        backgroundColor: ["#3b82f6", "#eab308", "#22c55e", "#9ca3af"],
        borderRadius: 8,
        maxBarThickness: 48,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { title: { display: false }, tooltip: { enabled: true } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text">
              {t("welcomeTitle")}
            </h1>
            <p className="mt-1 text-text-muted">{t("welcomeSubtitle")}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 self-start">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-accent-dark">
              {new Date().toLocaleDateString("es-MX", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const value = loading ? null : stats[card.key];
          return (
            <motion.div
              key={card.key}
              variants={fadeUp}
              className={cn(
                "relative group rounded-2xl bg-surface border border-border p-5",
                "hover:shadow-card hover:-translate-y-0.5",
                "transition-all duration-300 cursor-default"
              )}
            >
              <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.bg)}>
                  <Icon className={cn("w-5 h-5", card.color)} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-success">
                  <TrendingUp className="w-3 h-3" />
                </div>
              </div>
              <div className="mt-4">
                {loading ? (
                  <Loader2 className="w-5 h-5 text-text-muted animate-spin" />
                ) : (
                  <p className="font-heading text-3xl font-bold text-text">{value}</p>
                )}
                <p className="mt-0.5 text-sm text-text-muted">{card.label}</p>
              </div>
              <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Chart + Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Bar Chart */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h2 className="font-heading text-lg font-semibold text-text mb-4">
            Cotizaciones por Estado
          </h2>
          <div className="h-56">
            {!loading && <Bar data={chartData} options={chartOptions} />}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-text">
              Actividad Reciente
            </h2>
            <Link
              href="/admin/cotizaciones"
              className="text-xs font-medium text-secondary hover:underline"
            >
              Ver todas
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 text-secondary animate-spin" />
            </div>
          ) : recentQuotes.length === 0 ? (
            <p className="text-sm text-text-muted py-6 text-center">
              Sin cotizaciones recientes
            </p>
          ) : (
            <div className="space-y-3">
              {recentQuotes.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background-alt/50 hover:bg-background-alt transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                    <MessageSquareQuote className="w-4 h-4 text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">
                      {q.client_name} — {q.destination}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn("inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium", STATUS_COLORS[q.status] ?? "bg-gray-100 text-gray-600")}>
                        {q.status}
                      </span>
                      <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface border border-border text-text-muted">
                        {q.source}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-text-light shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(q.created_at).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h2 className="font-heading text-xl font-semibold text-text mb-4">
          {t("quickActions")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_ACTION_ITEMS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "group relative flex items-center gap-4 rounded-2xl bg-surface border border-border p-5",
                "hover:border-secondary/30 hover:shadow-card hover:-translate-y-0.5",
                "transition-all duration-300 cursor-pointer"
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                <Plus className="w-4 h-4 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text group-hover:text-secondary transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{t("createNew")}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-text-light group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
