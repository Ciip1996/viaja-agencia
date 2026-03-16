import { createAdminClient } from "./admin-client";

function isMissingColumn(code: string | undefined): boolean {
  return code === "42703" || code === "PGRST204";
}

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

  if (isMissingColumn(result.error?.code)) {
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
    if (isMissingColumn(result.error?.code)) {
      const { locale: _l, ...noLocale } = payload;
      const fb = await supabase.from(table).update(noLocale).eq("id", id);
      if (fb.error) throw fb.error;
      return;
    }
    if (result.error) throw result.error;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await supabase.from(table).insert(payload) as any;
    if (isMissingColumn(result.error?.code)) {
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

/**
 * Fetches the translation counterpart for a row via its translation_group_id.
 * Returns null if no translation exists or the column isn't present yet.
 */
export async function fetchTranslation<T = Record<string, unknown>>(
  table: string,
  translationGroupId: string,
  targetLocale: string
): Promise<T | null> {
  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await supabase
    .from(table)
    .select("*")
    .eq("translation_group_id", translationGroupId)
    .eq("locale", targetLocale)
    .maybeSingle() as any;

  if (isMissingColumn(result.error?.code)) return null;
  if (result.error) return null;
  return result.data as T | null;
}

/**
 * Saves a Spanish row and optionally an English translation, linked by translation_group_id.
 * - On create: generates a new translation_group_id shared by both rows.
 * - On edit: reuses the existing translation_group_id; upserts the EN row.
 */
export async function saveWithTranslation(
  table: string,
  esPayload: Record<string, unknown>,
  enPayload: Record<string, unknown> | null,
  existingId?: string,
  existingTranslationGroupId?: string
): Promise<void> {
  const supabase = createAdminClient();
  const groupId = existingTranslationGroupId || crypto.randomUUID();

  const esRow = { ...esPayload, locale: "es", translation_group_id: groupId };

  if (existingId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await supabase.from(table).update(esRow).eq("id", existingId) as any;
    if (isMissingColumn(res.error?.code)) {
      const { translation_group_id: _tg, ...noTg } = esRow;
      const fb = await supabase.from(table).update(noTg).eq("id", existingId);
      if (fb.error) throw fb.error;
    } else if (res.error) {
      throw res.error;
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await supabase.from(table).insert(esRow) as any;
    if (isMissingColumn(res.error?.code)) {
      const { translation_group_id: _tg, ...noTg } = esRow;
      const fb = await supabase.from(table).insert(noTg);
      if (fb.error) throw fb.error;
    } else if (res.error) {
      throw res.error;
    }
  }

  if (!enPayload) return;

  const hasContent = Object.values(enPayload).some(
    (v) => v !== null && v !== undefined && v !== ""
  );
  if (!hasContent) return;

  const enRow = { ...enPayload, locale: "en", translation_group_id: groupId };

  // Check if EN translation already exists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existing = await supabase
    .from(table)
    .select("id")
    .eq("translation_group_id", groupId)
    .eq("locale", "en")
    .maybeSingle() as any;

  if (isMissingColumn(existing.error?.code)) return;

  if (existing.data?.id) {
    const res = await supabase.from(table).update(enRow).eq("id", existing.data.id);
    if (res.error) throw res.error;
  } else {
    const res = await supabase.from(table).insert(enRow);
    if (res.error) throw res.error;
  }
}

/**
 * Deletes a row and its linked translation (if any).
 */
export async function deleteWithTranslation(
  table: string,
  id: string,
  translationGroupId?: string
): Promise<void> {
  const supabase = createAdminClient();

  if (translationGroupId) {
    // Delete all rows in the translation group
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await supabase
      .from(table)
      .delete()
      .eq("translation_group_id", translationGroupId) as any;
    if (isMissingColumn(res.error?.code)) {
      // Column doesn't exist, fall back to single delete
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    } else if (res.error) {
      throw res.error;
    }
  } else {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
  }
}
