"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Tag,
  Package,
  MapPin,
  MessageSquareQuote,
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
  Mail,
  UserCog,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { cn } from "@/lib/utils/cn";
import type { User } from "@supabase/supabase-js";

const NAV_ICONS = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "promotions", href: "/admin/promociones", icon: Tag },
  { key: "packages", href: "/admin/paquetes", icon: Package },
  { key: "destinations", href: "/admin/destinos", icon: MapPin },
  { key: "groupTrips", href: "/admin/grupos", icon: Users },
  { key: "events", href: "/admin/eventos", icon: CalendarDays },
  { key: "blog", href: "/admin/blog", icon: FileText },
  { key: "faq", href: "/admin/faq", icon: HelpCircle },
  { key: "cotizaciones", href: "/admin/cotizaciones", icon: MessageSquareQuote },
  { key: "newsletter", href: "/admin/newsletter", icon: Mail },
  { key: "settings", href: "/admin/configuracion", icon: Settings },
  { key: "profile", href: "/admin/perfil", icon: UserCog },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newQuoteCount, setNewQuoteCount] = useState(0);

  const fetchNewQuoteCount = useCallback(async () => {
    try {
      const supabase = createAdminClient();
      const { count } = await supabase
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "nueva")
        .is("read_at", null);
      setNewQuoteCount(count ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchNewQuoteCount();
    const interval = setInterval(fetchNewQuoteCount, 30_000);
    return () => clearInterval(interval);
  }, [user, fetchNewQuoteCount]);

  const navItems = useMemo(
    () =>
      NAV_ICONS.map((item) => ({
        ...item,
        label: t(item.key),
      })),
    [t]
  );

  function getBreadcrumb(currentPath: string): string[] {
    const crumbs: string[] = [t("breadcrumbAdmin")];
    const item = navItems.find((n) =>
      n.href === "/admin" ? currentPath === "/admin" : currentPath.startsWith(n.href)
    );
    if (item && item.href !== "/admin") crumbs.push(item.label);
    return crumbs;
  }

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
          <p className="text-sm text-text-muted">{tCommon("loading")}</p>
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
                {t("brandName")}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-text-muted hover:bg-background-alt hover:text-text transition-colors lg:hidden cursor-pointer"
            aria-label={t("closeMenu")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
          {navItems.map((item) => {
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
                  <span className="flex-1 whitespace-nowrap">{item.label}</span>
                )}
                {item.key === "cotizaciones" && newQuoteCount > 0 && (
                  <span
                    className={cn(
                      "relative flex items-center justify-center font-bold tabular-nums",
                      sidebarOpen || mobileOpen
                        ? "min-w-[22px] h-[22px] rounded-full bg-red-500 text-white text-[11px] px-1.5 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                        : "absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] px-1 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    )}
                  >
                    {newQuoteCount > 99 ? "99+" : newQuoteCount}
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
                  </span>
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
            title={t("logout")}
            className={cn(
              "flex items-center gap-3 w-full rounded-xl text-sm font-medium text-text-muted",
              "hover:bg-error/[0.08] hover:text-error transition-all duration-200 cursor-pointer",
              sidebarOpen || mobileOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
            )}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {(sidebarOpen || mobileOpen) && <span>{t("logout")}</span>}
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
              aria-label={t("openMenu")}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 rounded-lg text-text-muted hover:bg-background-alt hover:text-text transition-colors cursor-pointer"
              aria-label={sidebarOpen ? t("collapseMenu") : t("expandMenu")}
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
            <LanguageSwitcher scrolled />

            <Link
              href="/admin/perfil"
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-background-alt cursor-pointer"
              title={t("profile")}
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-text leading-tight truncate max-w-[180px]">
                  {user?.email ?? t("administrator")}
                </p>
                <p className="text-xs text-text-muted">{t("roleAdmin")}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">{initials}</span>
              </div>
            </Link>
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
