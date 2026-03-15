import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export type SiteSetting = {
  key: string;
  value: string;
  category: string;
  label: string;
  field_type: string;
  locale?: string;
};

function createCmsClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll();
        },
        async setAll() {
          // read-only in server components
        },
      },
    },
  );
}

const settingsCache = new Map<string, { data: Record<string, string>; ts: number }>();
const CACHE_TTL = 60_000; // 1 minute

export async function getContentByCategory(
  category: string,
  locale: string = "es",
): Promise<Record<string, string>> {
  const cacheKey = `${category}:${locale}`;
  const cached = settingsCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  try {
    const supabase = createCmsClient();
    let query = supabase
      .from("site_settings")
      .select("key, value")
      .eq("category", category);

    query = query.eq("locale", locale);

    const { data } = await query;

    const map: Record<string, string> = {};
    (data ?? []).forEach((row: { key: string; value: string }) => {
      map[row.key] = row.value;
    });

    settingsCache.set(cacheKey, { data: map, ts: Date.now() });
    return map;
  } catch {
    return {};
  }
}

export async function getAllContent(
  locale: string = "es",
): Promise<Record<string, Record<string, string>>> {
  try {
    const supabase = createCmsClient();
    const { data } = await supabase
      .from("site_settings")
      .select("key, value, category")
      .eq("locale", locale);

    const grouped: Record<string, Record<string, string>> = {};
    (data ?? []).forEach(
      (row: { key: string; value: string; category: string }) => {
        if (!grouped[row.category]) grouped[row.category] = {};
        grouped[row.category][row.key] = row.value;
      },
    );

    for (const [cat, map] of Object.entries(grouped)) {
      settingsCache.set(`${cat}:${locale}`, { data: map, ts: Date.now() });
    }

    return grouped;
  } catch {
    return {};
  }
}

export async function getAllSettingsRaw(locale?: string): Promise<SiteSetting[]> {
  try {
    const supabase = createCmsClient();
    let query = supabase
      .from("site_settings")
      .select("key, value, category, label, field_type, locale")
      .order("category")
      .order("key");

    if (locale) {
      query = query.eq("locale", locale);
    }

    return ((await query).data ?? []) as SiteSetting[];
  } catch {
    return [];
  }
}

export function parseJson<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
