"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plane, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Credenciales incorrectas. Verifica tu email y contraseña.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Tu email aún no ha sido confirmado.");
        } else {
          setError(authError.message);
        }
        return;
      }

      router.push("/admin");
    } catch {
      setError("Error de conexión. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary" />
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse at 20% 20%, rgba(14, 165, 233, 0.25) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 80%, rgba(212, 165, 116, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 50%, rgba(14, 111, 160, 0.2) 0%, transparent 60%)",
          ].join(", "),
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <Plane className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-heading text-3xl font-semibold text-white tracking-tight">
            Viaja Agencia
          </h1>
          <p className="mt-1 text-sm text-white/60 font-body tracking-wide uppercase">
            Panel Administrativo
          </p>
        </motion.div>

        {/* Card */}
        <div className="rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] shadow-[0_8px_40px_rgba(0,0,0,0.2)] p-8">
          <div className="mb-6">
            <h2 className="font-heading text-xl font-semibold text-white">
              Iniciar Sesión
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Accede a tu panel de administración
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-error/10 border border-error/20"
              >
                <AlertCircle className="w-4 h-4 text-error mt-0.5 shrink-0" />
                <p className="text-sm text-red-200 leading-snug">{error}</p>
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-white/70 uppercase tracking-wider"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@viajaagencia.com"
                  autoComplete="email"
                  disabled={loading}
                  className={cn(
                    "w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25",
                    "bg-white/[0.06] border border-white/[0.1]",
                    "focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/40",
                    "transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-white/70 uppercase tracking-wider"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  className={cn(
                    "w-full pl-11 pr-12 py-3 rounded-xl text-sm text-white placeholder:text-white/25",
                    "bg-white/[0.06] border border-white/[0.1]",
                    "focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary/40",
                    "transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-3 rounded-xl text-sm font-semibold tracking-wide cursor-pointer",
                "bg-gradient-to-r from-secondary to-secondary-light text-white",
                "hover:shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:brightness-110",
                "focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 focus:ring-offset-primary",
                "transition-all duration-200",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:brightness-100"
              )}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Ingresando...
                </span>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Viaja Agencia. Todos los derechos reservados.
        </p>
      </motion.div>
    </div>
  );
}
