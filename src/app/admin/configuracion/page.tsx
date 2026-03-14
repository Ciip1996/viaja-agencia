"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  Settings,
  AlertTriangle,
  Check,
  Building2,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { cn } from "@/lib/utils/cn";

const SETTING_KEYS = [
  "company_name",
  "legal_name",
  "address",
  "phone",
  "email",
  "whatsapp",
  "facebook",
  "instagram",
  "years_experience",
] as const;

type SettingKey = (typeof SETTING_KEYS)[number];

const FIELD_CONFIG: Record<
  SettingKey,
  { label: string; placeholder: string; icon: typeof Building2; type?: string }
> = {
  company_name: {
    label: "Nombre de la empresa",
    placeholder: "Ej: Viaja Agencia de Viajes",
    icon: Building2,
  },
  legal_name: {
    label: "Razón social",
    placeholder: "Ej: Viaja Tours S.A. de C.V.",
    icon: Building2,
  },
  address: {
    label: "Dirección",
    placeholder: "Ej: Av. Reforma 123, CDMX",
    icon: Building2,
  },
  phone: {
    label: "Teléfono",
    placeholder: "Ej: +52 55 1234 5678",
    icon: Phone,
  },
  email: {
    label: "Correo electrónico",
    placeholder: "Ej: info@viaja.com",
    icon: Mail,
    type: "email",
  },
  whatsapp: {
    label: "WhatsApp",
    placeholder: "Ej: +52 55 1234 5678",
    icon: Phone,
  },
  facebook: {
    label: "Facebook",
    placeholder: "Ej: https://facebook.com/viaja",
    icon: Globe,
    type: "url",
  },
  instagram: {
    label: "Instagram",
    placeholder: "Ej: https://instagram.com/viaja",
    icon: Globe,
    type: "url",
  },
  years_experience: {
    label: "Años de experiencia",
    placeholder: "Ej: 15",
    icon: Building2,
    type: "number",
  },
};

const SECTIONS = [
  {
    title: "Información de la empresa",
    keys: ["company_name", "legal_name", "address"] as SettingKey[],
  },
  {
    title: "Contacto",
    keys: ["phone", "email", "whatsapp"] as SettingKey[],
  },
  {
    title: "Redes sociales",
    keys: ["facebook", "instagram"] as SettingKey[],
  },
  {
    title: "Otros",
    keys: ["years_experience"] as SettingKey[],
  },
];

export default function ConfiguracionPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const supabase = createAdminClient();
      const { data, error: err } = await supabase
        .from("site_settings")
        .select("*");
      if (err) throw err;

      const map: Record<string, string> = {};
      (data ?? []).forEach((row) => {
        map[row.key] = row.value;
      });
      setSettings(map);
      setError(null);
    } catch {
      setError("Configura Supabase para gestionar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createAdminClient();

      const upserts = SETTING_KEYS.map((key) => ({
        key,
        value: settings[key] ?? "",
        updated_at: new Date().toISOString(),
      }));

      const { error: err } = await supabase
        .from("site_settings")
        .upsert(upserts, { onConflict: "key" });

      if (err) throw err;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text">
            Configuración
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Ajustes generales del sitio web
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer self-start"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : success ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Guardando..." : success ? "Guardado" : "Guardar Cambios"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-warning/10 border border-warning/20 text-sm text-warning">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-success/10 border border-success/20 text-sm text-success"
        >
          <Check className="w-4 h-4 shrink-0" />
          Configuración guardada correctamente
        </motion.div>
      )}

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            className="bg-surface border border-border rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-background-alt/30">
              <h2 className="font-heading text-lg font-semibold text-text">
                {section.title}
              </h2>
            </div>
            <div className="px-6 py-5 space-y-5">
              {section.keys.map((key) => {
                const config = FIELD_CONFIG[key];
                const Icon = config.icon;
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      {config.label}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                        <Icon className="w-4 h-4 text-text-light" />
                      </div>
                      <input
                        type={config.type ?? "text"}
                        value={settings[key] ?? ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={config.placeholder}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom save */}
      <div className="flex justify-end pt-2 pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
}
