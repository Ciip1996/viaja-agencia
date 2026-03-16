import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { BookOpen, ArrowRight, ArrowLeft, Calendar, User } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { formatDate } from "@/lib/utils/format";
import { buildPageMetadata, buildBreadcrumbJsonLd, BASE_URL } from "@/lib/utils/seo";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  author: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  locale: string;
}

const POSTS_PER_PAGE = 12;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageBlog" });
  return buildPageMetadata(locale, "/blog", t("metaTitle"), t("metaDescription"));
}

async function getBlogPosts(locale: string, page: number) {
  try {
    const supabase = await createServerSupabaseClient();
    const from = (page - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    const { data, count } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact" })
      .eq("is_published", true)
      .eq("locale", locale)
      .order("published_at", { ascending: false })
      .range(from, to);

    return { posts: (data as BlogPost[]) ?? [], total: count ?? 0 };
  } catch {
    return { posts: [], total: 0 };
  }
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("pageBlog");
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const { posts, total } = await getBlogPosts(locale, currentPage);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: BASE_URL },
    { name: "Blog", url: `${BASE_URL}${locale === "es" ? "/blog" : `/${locale}/blog`}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent)_0%,_transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-primary-light)_0%,_transparent_50%)] opacity-30" />

        <div className="container-custom relative z-10 text-center">
          <AnimatedSection variant="fade-up">
            <div className="mb-4 flex items-center justify-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-body text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
                BLOG
              </span>
            </div>
            <h1 className="mb-4 font-heading text-5xl font-bold text-white sm:text-6xl md:text-7xl">
              {t("heroHeading1")}
              <span className="text-gradient-accent inline-block">
                {t("heroHeading2")}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-white/85">
              {t("heroDescription")}
            </p>
          </AnimatedSection>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Posts grid */}
      <section className="section-padding aurora-section">
        <div className="container-custom">
          {posts.length > 0 ? (
            <>
              <AnimatedSection variant="fade-up" className="mb-14 text-center">
                <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  {t("gridTag")}
                </p>
                <h2 className="font-heading text-text">
                  {t("gridHeading1")}
                  <span className="text-gradient">{t("gridHeading2")}</span>
                </h2>
                <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
              </AnimatedSection>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <AnimatedSection
                    key={post.id}
                    variant="fade-up"
                    delay={index * 0.07}
                    className="h-full"
                  >
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="relative block aspect-[16/9] overflow-hidden"
                      >
                        {post.cover_image_url ? (
                          <Image
                            src={post.cover_image_url}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/10">
                            <BookOpen className="h-12 w-12 text-primary/40" />
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </Link>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-3 flex items-center gap-4 font-body text-xs text-text-muted">
                          <span className="inline-flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" aria-hidden="true" />
                            {post.author}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            <time dateTime={post.published_at}>
                              {formatDate(post.published_at, undefined, locale)}
                            </time>
                          </span>
                        </div>

                        <h3 className="mb-2 font-heading text-xl font-semibold leading-snug text-text transition-colors duration-200 group-hover:text-primary">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="mb-5 line-clamp-3 flex-1 font-body text-sm leading-relaxed text-text-muted">
                          {post.excerpt}
                        </p>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-primary transition-colors duration-200 hover:text-accent"
                        >
                          {t("readMore")}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </article>
                  </AnimatedSection>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <AnimatedSection variant="fade-up" className="mt-16">
                  <nav
                    aria-label={t("paginationLabel")}
                    className="flex items-center justify-center gap-2"
                  >
                    {currentPage > 1 && (
                      <Link
                        href={`/blog?page=${currentPage - 1}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-2.5 font-body text-sm font-medium text-text shadow-card transition-colors duration-200 hover:bg-primary hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        {t("prev")}
                      </Link>
                    )}

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pg) => (
                          <Link
                            key={pg}
                            href={`/blog?page=${pg}`}
                            aria-current={pg === currentPage ? "page" : undefined}
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl font-body text-sm font-medium transition-colors duration-200 ${
                              pg === currentPage
                                ? "bg-primary text-white shadow-card"
                                : "bg-surface text-text-muted hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            {pg}
                          </Link>
                        ),
                      )}
                    </div>

                    {currentPage < totalPages && (
                      <Link
                        href={`/blog?page=${currentPage + 1}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-2.5 font-body text-sm font-medium text-text shadow-card transition-colors duration-200 hover:bg-primary hover:text-white"
                      >
                        {t("next")}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </nav>
                </AnimatedSection>
              )}
            </>
          ) : (
            <AnimatedSection variant="fade-up" className="py-20 text-center">
              <BookOpen
                className="mx-auto mb-6 h-16 w-16 text-text-muted/40"
                aria-hidden="true"
              />
              <h2 className="mb-3 font-heading text-2xl font-semibold text-text">
                {t("emptyTitle")}
              </h2>
              <p className="mx-auto max-w-md font-body text-text-muted">
                {t("emptyDescription")}
              </p>
            </AnimatedSection>
          )}
        </div>
      </section>
    </>
  );
}
