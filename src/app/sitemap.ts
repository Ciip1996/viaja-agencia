import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { createAdminClient } from "@/lib/supabase/admin-client";

const BASE_URL = "https://viajaagencia.com.mx";

const routes = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/destinos", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/paquetes", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/grupos", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/eventos", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/hoteles", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/tours", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/autos", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/nosotros", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/contacto", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/destinos-megatravel", changeFrequency: "weekly" as const, priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = routes.flatMap((route) =>
    routing.locales.map((locale) => {
      const localePath = `/${locale}${route.path}`;
      const alternates: Record<string, string> = {};
      for (const loc of routing.locales) {
        alternates[loc] = `${BASE_URL}/${loc}${route.path}`;
      }

      return {
        url: `${BASE_URL}${localePath}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: alternates,
        },
      };
    })
  );

  try {
    const supabase = createAdminClient();
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("slug, locale, published_at")
      .eq("is_published", true);

    if (blogPosts) {
      for (const post of blogPosts) {
        for (const locale of routing.locales) {
          entries.push({
            url: `${BASE_URL}/${locale}/blog/${post.slug}`,
            lastModified: post.published_at ? new Date(post.published_at) : now,
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      }
    }
  } catch {
    // Blog posts will be omitted from sitemap if fetch fails
  }

  return entries;
}
