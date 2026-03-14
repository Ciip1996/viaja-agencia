"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Tag,
  Package,
  Users,
  FileText,
  TrendingUp,
  ArrowRight,
  Plus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const STATS = [
  {
    label: "Total Promociones",
    value: "—",
    icon: Tag,
    color: "text-secondary",
    bg: "bg-secondary/10",
    trend: "+12%",
  },
  {
    label: "Total Paquetes",
    value: "—",
    icon: Package,
    color: "text-primary",
    bg: "bg-primary/10",
    trend: "+8%",
  },
  {
    label: "Viajes Grupales Activos",
    value: "—",
    icon: Users,
    color: "text-accent",
    bg: "bg-accent/10",
    trend: "+5%",
  },
  {
    label: "Posts Publicados",
    value: "—",
    icon: FileText,
    color: "text-success",
    bg: "bg-success/10",
    trend: "+3%",
  },
] as const;

const QUICK_ACTIONS = [
  { label: "Nueva Promoción", href: "/admin/promociones/nueva", icon: Tag },
  { label: "Nuevo Paquete", href: "/admin/paquetes/nuevo", icon: Package },
  { label: "Nuevo Post", href: "/admin/blog/nuevo", icon: FileText },
] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function AdminDashboardPage() {
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
              Bienvenido al Panel de Administración
            </h1>
            <p className="mt-1 text-text-muted">
              Gestiona tu agencia de viajes desde aquí.
            </p>
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
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className={cn(
                "relative group rounded-2xl bg-surface border border-border p-5",
                "hover:shadow-card hover:-translate-y-0.5",
                "transition-all duration-300 cursor-default"
              )}
            >
              <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                  <Icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-success">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
              <div className="mt-4">
                <p className="font-heading text-3xl font-bold text-text">{stat.value}</p>
                <p className="mt-0.5 text-sm text-text-muted">{stat.label}</p>
              </div>
              <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h2 className="font-heading text-xl font-semibold text-text mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
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
                  <p className="text-xs text-text-muted mt-0.5">Crear nuevo</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-light group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
