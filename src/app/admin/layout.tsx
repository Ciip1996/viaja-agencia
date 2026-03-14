"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Tag,
  Package,
  MapPin,
  MessageSquare,
  Users,
  CalendarDays,
  FileText,
  HelpCircle,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Plane,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import type { User } from "@supabase/supabase-js";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Promociones", href: "/admin/promociones", icon: Tag },
  { label: "Paquetes", href: "/admin/paquetes", icon: Package },
  { label: "Destinos", href: "/admin/destinos", icon: MapPin },
  { label: "Testimonios", href: "/admin/testimonios", icon: MessageSquare },
  { label: "Viajes Grupales", href: "/admin/grupos", icon: Users },
  { label: "Eventos", href: "/admin/eventos", icon: CalendarDays },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings },
] as const;

function getBreadcrumb(pathname: string): string[] {
  const crumbs: string[] = ["Admin"];
  const item = NAV_ITEMS.find((n) =>
    n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
  );
  if (item && item.href !== "/admin") crumbs.push(item.label);
  return crumbs;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthChecked(true);
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (!currentUser) {
        router.push("/admin/login");
      } else {
        setUser(currentUser);
      }
      setAuthChecked(true);
    });
  }, [pathname, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }, [router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  const breadcrumbs = getBreadcrumb(pathname);
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "AD";

  return (
    <div className="min-h-screen bg-background-alt">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-surface border-r border-border flex flex-col",
          "transition-all duration-300 ease-in-out",
          "lg:translate-x-0",
          sidebarOpen ? "lg:w-64" : "lg:w-16",
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar header */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-border shrink-0",
            sidebarOpen ? "px-5 justify-between" : "px-0 justify-center"
          )}
        >
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-2.5 group cursor-pointer",
              !sidebarOpen && "lg:justify-center"
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Plane className="w-4 h-4 text-white" />
            </div>
            {(sidebarOpen || mobileOpen) && (
              <span className="font-heading text-lg font-semibold text-text whitespace-nowrap">
                Viaja
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-text-muted hover:bg-background-alt hover:text-text transition-colors lg:hidden cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.label : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                  sidebarOpen || mobileOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
                  isActive
                    ? "bg-primary/[0.08] text-primary"
                    : "text-text-muted hover:bg-background-alt hover:text-text"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-[18px] h-[18px] shrink-0", isActive && "text-primary")} />
                {(sidebarOpen || mobileOpen) && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer - user & logout */}
        <div
          className={cn(
            "border-t border-border p-2.5 shrink-0",
            !sidebarOpen && !mobileOpen && "flex justify-center"
          )}
        >
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className={cn(
              "flex items-center gap-3 w-full rounded-xl text-sm font-medium text-text-muted",
              "hover:bg-error/[0.08] hover:text-error transition-all duration-200 cursor-pointer",
              sidebarOpen || mobileOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
            )}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {(sidebarOpen || mobileOpen) && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen",
          sidebarOpen ? "lg:pl-64" : "lg:pl-16"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-lg border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-text-muted hover:bg-background-alt hover:text-text transition-colors lg:hidden cursor-pointer"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 rounded-lg text-text-muted hover:bg-background-alt hover:text-text transition-colors cursor-pointer"
              aria-label={sidebarOpen ? "Colapsar menú" : "Expandir menú"}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-light" />}
                  <span
                    className={cn(
                      i === breadcrumbs.length - 1
                        ? "font-medium text-text"
                        : "text-text-muted"
                    )}
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-text leading-tight truncate max-w-[180px]">
                {user?.email ?? "Administrador"}
              </p>
              <p className="text-xs text-text-muted">Admin</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">{initials}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
