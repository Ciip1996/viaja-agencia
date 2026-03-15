const LOCALE_MAP: Record<string, string> = {
  es: "es-MX",
  en: "en-US",
};

function resolveLocale(locale?: string): string {
  return LOCALE_MAP[locale ?? "es"] ?? "es-MX";
}

export function formatPrice(amount: number, currency = "USD", locale?: string): string {
  return new Intl.NumberFormat(resolveLocale(locale), {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions, locale?: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(d);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
