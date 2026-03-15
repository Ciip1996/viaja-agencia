import { createAdminClient } from "@/lib/supabase/admin-client";

const ENV_MAP: Record<string, string> = {
  openai_api_key: "OPENAI_API_KEY",
  hotelbeds_api_key: "HOTELBEDS_API_KEY",
  hotelbeds_secret: "HOTELBEDS_SECRET",
  hotelbeds_base_url: "HOTELBEDS_BASE_URL",
  resend_api_key: "RESEND_API_KEY",
  resend_from_email: "RESEND_FROM_EMAIL",
  google_places_api_key: "GOOGLE_PLACES_API_KEY",
};

const keyCache = new Map<string, { value: string; ts: number }>();
const CACHE_TTL = 120_000;

export async function getApiKey(key: string): Promise<string> {
  const envVar = ENV_MAP[key];
  if (envVar) {
    const envValue = process.env[envVar];
    if (envValue) return envValue;
  }

  const cached = keyCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.value;
  }

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .eq("category", "api_keys")
      .eq("locale", "es")
      .single();

    const value = data?.value ?? "";
    keyCache.set(key, { value, ts: Date.now() });
    return value;
  } catch {
    return "";
  }
}
