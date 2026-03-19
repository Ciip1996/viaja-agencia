import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export type FeatureFlags = {
  feature_blog: boolean;
  feature_grupos: boolean;
  feature_eventos: boolean;
  feature_tours: boolean;
  feature_autos: boolean;
  feature_hoteles: boolean;
  feature_hotel_booking: boolean;
  feature_chatbot: boolean;
  feature_instagram: boolean;
  feature_newsletter: boolean;
  feature_testimonials: boolean;
  feature_faq: boolean;
  feature_megatravel: boolean;
};

const DEFAULTS: FeatureFlags = {
  feature_blog: true,
  feature_grupos: true,
  feature_eventos: true,
  feature_tours: false,
  feature_autos: false,
  feature_hoteles: false,
  feature_hotel_booking: false,
  feature_chatbot: false,
  feature_instagram: false,
  feature_newsletter: true,
  feature_testimonials: true,
  feature_faq: true,
  feature_megatravel: true,
};

let cache: { data: FeatureFlags; ts: number } | null = null;
const CACHE_TTL = 60_000;

function createReadClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll();
        },
        async setAll() {},
      },
    },
  );
}

export async function getFeatureFlags(): Promise<FeatureFlags> {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return cache.data;
  }

  try {
    const supabase = createReadClient();
    // Feature flags are locale-independent — read without locale filter
    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .eq("category", "feature_flags");

    const flags: FeatureFlags = { ...DEFAULTS };
    const seen = new Set<string>();
    (data ?? []).forEach((row: { key: string; value: string }) => {
      if (row.key in flags && !seen.has(row.key)) {
        seen.add(row.key);
        (flags as Record<string, boolean>)[row.key] = row.value === "true";
      }
    });

    cache = { data: flags, ts: Date.now() };
    return flags;
  } catch {
    return DEFAULTS;
  }
}

export async function getFeatureFlag(key: keyof FeatureFlags): Promise<boolean> {
  const flags = await getFeatureFlags();
  return flags[key] ?? false;
}
