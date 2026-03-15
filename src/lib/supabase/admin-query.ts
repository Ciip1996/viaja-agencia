import { createAdminClient } from "./admin-client";

/**
 * Fetches rows from a Supabase table, gracefully handling missing `locale` column.
 * If the query with `.eq("locale", ...)` fails with error 42703 (column not found),
 * it retries without the locale filter so the admin works even before migrations are run.
 */
export async function fetchWithLocale<T = Record<string, unknown>>(
  table: string,
  locale: string,
  options?: {
    orderBy?: string;
    ascending?: boolean;
    filters?: Record<string, unknown>;
    select?: string;
  }
): Promise<{ data: T[]; hasLocale: boolean }> {
  const supabase = createAdminClient();
  const sel = options?.select ?? "*";
  const orderCol = options?.orderBy ?? "created_at";
  const asc = options?.ascending ?? false;

  let query = supabase.from(table).select(sel);

  if (options?.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      query = query.eq(key, value);
    }
  }

  query = query.eq("locale", locale).order(orderCol, { ascending: asc });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await query as any;

  if (result.error?.code === "42703") {
    let fallback = supabase.from(table).select(sel);
    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        fallback = fallback.eq(key, value);
      }
    }
    fallback = fallback.order(orderCol, { ascending: asc });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fb = await fallback as any;
    if (fb.error) throw fb.error;
    return { data: fb.data ?? [], hasLocale: false };
  }

  if (result.error) throw result.error;
  return { data: result.data ?? [], hasLocale: true };
}

/**
 * Saves a row, omitting the `locale` field if the column doesn't exist.
 */
export async function saveWithLocale(
  table: string,
  row: Record<string, unknown>,
  locale: string,
  id?: string
): Promise<void> {
  const supabase = createAdminClient();
  const payload = { ...row, locale };

  if (id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await supabase.from(table).update(payload).eq("id", id) as any;
    if (result.error?.code === "42703") {
      const { locale: _l, ...noLocale } = payload;
      const fb = await supabase.from(table).update(noLocale).eq("id", id);
      if (fb.error) throw fb.error;
      return;
    }
    if (result.error) throw result.error;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await supabase.from(table).insert(payload) as any;
    if (result.error?.code === "42703") {
      const { locale: _l, ...noLocale } = payload;
      const fb = await supabase.from(table).insert(noLocale);
      if (fb.error) throw fb.error;
      return;
    }
    if (result.error) throw result.error;
  }
}

export async function deleteRow(table: string, id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}
