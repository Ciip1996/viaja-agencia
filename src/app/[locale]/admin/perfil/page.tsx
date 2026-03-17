"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Shield,
  Clock,
  KeyRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type PasswordForm = {
  current: string;
  new: string;
  confirm: string;
};

type Toast = {
  type: "success" | "error";
  message: string;
};

export default function PerfilPage() {
  const t = useTranslations("admin.profilePage");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [passwords, setPasswords] = useState<PasswordForm>({
    current: "",
    new: "",
    confirm: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const fetchUser = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const passwordStrength = useCallback((pw: string): number => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }, []);

  const strengthLabel = useCallback(
    (score: number) => {
      if (score <= 1) return { label: t("strengthWeak"), color: "bg-red-500" };
      if (score <= 2) return { label: t("strengthFair"), color: "bg-orange-500" };
      if (score <= 3) return { label: t("strengthGood"), color: "bg-yellow-500" };
      return { label: t("strengthStrong"), color: "bg-emerald-500" };
    },
    [t]
  );

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();

    if (passwords.new.length < 8) {
      setToast({ type: "error", message: t("errorMinLength") });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setToast({ type: "error", message: t("errorMismatch") });
      return;
    }
    if (passwords.current === passwords.new) {
      setToast({ type: "error", message: t("errorSamePassword") });
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email ?? "",
        password: passwords.current,
      });

      if (signInError) {
        setToast({ type: "error", message: t("errorCurrentPassword") });
        setSaving(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      });

      if (error) {
        setToast({ type: "error", message: error.message });
      } else {
        setToast({ type: "success", message: t("successPassword") });
        setPasswords({ current: "", new: "", confirm: "" });
      }
    } catch {
      setToast({ type: "error", message: t("errorGeneric") });
    } finally {
      setSaving(false);
    }
  };

  const strength = passwordStrength(passwords.new);
  const { label: strengthText, color: strengthColor } = strengthLabel(strength);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "AD";
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";
  const lastSignIn = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={cn(
              "fixed left-1/2 top-20 z-50 flex items-center gap-2 rounded-xl px-5 py-3 font-body text-sm font-medium shadow-elevated",
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            )}
          >
            {toast.type === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Page header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 font-body text-sm text-text-muted">
            {t("subtitle")}
          </p>
        </div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-border bg-surface p-6 shadow-card"
        >
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <span className="font-heading text-xl font-bold text-primary">
                {initials}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-lg font-semibold text-text">
                {user?.email ?? "—"}
              </h2>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  {t("roleAdmin")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {t("memberSince", { date: createdAt })}
                </span>
              </div>
              <div className="mt-1 text-xs text-text-light">
                {t("lastLogin", { date: lastSignIn })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl border border-border bg-surface p-6 shadow-card"
        >
          <div className="mb-5 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-lg font-semibold text-text">
              {t("accountInfo")}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block font-body text-xs font-medium uppercase tracking-wider text-text-muted">
                {t("emailLabel")}
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                <Mail className="h-4 w-4 text-text-muted" />
                <span className="font-body text-sm text-text">
                  {user?.email ?? "—"}
                </span>
              </div>
              <p className="mt-1 font-body text-xs text-text-light">
                {t("emailHint")}
              </p>
            </div>

            <div>
              <label className="mb-1.5 block font-body text-xs font-medium uppercase tracking-wider text-text-muted">
                {t("providerLabel")}
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
                <KeyRound className="h-4 w-4 text-text-muted" />
                <span className="font-body text-sm text-text capitalize">
                  {user?.app_metadata?.provider ?? "email"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Change password */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-2xl border border-border bg-surface p-6 shadow-card"
        >
          <div className="mb-5 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-lg font-semibold text-text">
              {t("changePassword")}
            </h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current password */}
            <div>
              <label
                htmlFor="current-password"
                className="mb-1.5 block font-body text-xs font-medium uppercase tracking-wider text-text-muted"
              >
                {t("currentPassword")}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, current: e.target.value }))
                  }
                  required
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-12 font-body text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-secondary focus:ring-1 focus:ring-secondary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-text-muted transition-colors hover:text-text cursor-pointer"
                  aria-label={showCurrent ? t("hidePassword") : t("showPassword")}
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label
                htmlFor="new-password"
                className="mb-1.5 block font-body text-xs font-medium uppercase tracking-wider text-text-muted"
              >
                {t("newPassword")}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, new: e.target.value }))
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-12 font-body text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-secondary focus:ring-1 focus:ring-secondary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-text-muted transition-colors hover:text-text cursor-pointer"
                  aria-label={showNew ? t("hidePassword") : t("showPassword")}
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Strength indicator */}
              {passwords.new.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-colors",
                          i < strength ? strengthColor : "bg-border"
                        )}
                      />
                    ))}
                  </div>
                  <p className="font-body text-xs text-text-muted">
                    {t("strengthLabel")}: {strengthText}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block font-body text-xs font-medium uppercase tracking-wider text-text-muted"
              >
                {t("confirmPassword")}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, confirm: e.target.value }))
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={cn(
                    "h-12 w-full rounded-xl border bg-background pl-10 pr-12 font-body text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:ring-1",
                    passwords.confirm.length > 0 && passwords.new !== passwords.confirm
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                      : "border-border focus:border-secondary focus:ring-secondary"
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-text-muted transition-colors hover:text-text cursor-pointer"
                  aria-label={showConfirm ? t("hidePassword") : t("showPassword")}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwords.confirm.length > 0 && passwords.new !== passwords.confirm && (
                <p className="mt-1 font-body text-xs text-red-500">
                  {t("errorMismatch")}
                </p>
              )}
            </div>

            {/* Requirements */}
            <div className="rounded-xl bg-background p-4">
              <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                {t("requirementsTitle")}
              </p>
              <ul className="space-y-1">
                {[
                  { check: passwords.new.length >= 8, text: t("req8chars") },
                  { check: /[A-Z]/.test(passwords.new), text: t("reqUppercase") },
                  { check: /[a-z]/.test(passwords.new), text: t("reqLowercase") },
                  { check: /\d/.test(passwords.new), text: t("reqNumber") },
                  { check: /[^A-Za-z0-9]/.test(passwords.new), text: t("reqSpecial") },
                ].map(({ check, text }) => (
                  <li
                    key={text}
                    className={cn(
                      "flex items-center gap-2 font-body text-xs transition-colors",
                      check ? "text-emerald-600" : "text-text-light"
                    )}
                  >
                    {check ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <span className="inline-block h-3.5 w-3.5 rounded-full border border-current" />
                    )}
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving || !passwords.current || !passwords.new || !passwords.confirm}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-body text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-light hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? t("saving") : t("savePassword")}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
