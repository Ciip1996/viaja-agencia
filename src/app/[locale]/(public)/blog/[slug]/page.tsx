import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { formatDate } from "@/lib/utils/format";
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react";
import { buildAlternates, buildBreadcrumbJsonLd, BASE_URL } from "@/lib/utils/seo";

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

type Props = { params: Promise<{ locale: string; slug: string }> };

async function getPost(slug: string, locale: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("locale", locale)
      .eq("is_published", true)
      .single();
    return data as BlogPost | null;
  } catch {
    return null;
  }
}

async function getRelatedPosts(locale: string, excludeId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image_url, author, published_at")
      .eq("is_published", true)
      .eq("locale", locale)
      .neq("id", excludeId)
      .order("published_at", { ascending: false })
      .limit(3);
    return (data as Pick<BlogPost, "id" | "title" | "slug" | "excerpt" | "cover_image_url" | "author" | "published_at">[]) ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const alternates = buildAlternates(locale, `/blog/${post.slug}`);

  return {
    title: post.title,
    description: post.excerpt,
    alternates,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: alternates.canonical,
      type: "article" as const,
      publishedTime: post.published_at,
      authors: [post.author],
      ...(post.cover_image_url && {
        images: [{ url: post.cover_image_url, width: 1200, height: 630, alt: post.title }],
      }),
    },
    twitter: {
      card: "summary_large_image" as const,
      title: post.title,
      description: post.excerpt,
      ...(post.cover_image_url && { images: [post.cover_image_url] }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pageBlog");
  const post = await getPost(slug, locale);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(locale, post.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image_url,
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Viaja Agencia",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo-viaja.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}${locale === "es" ? "" : `/${locale}`}/blog/${post.slug}`,
    },
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: BASE_URL },
    { name: "Blog", url: `${BASE_URL}${locale === "es" ? "/blog" : `/${locale}/blog`}` },
    { name: post.title, url: `${BASE_URL}${locale === "es" ? "" : `/${locale}`}/blog/${post.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero cover */}
      <section className="relative w-full overflow-hidden">
        <div className="relative aspect-[21/9] min-h-[320px] w-full md:min-h-[400px]">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-primary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent" />
        </div>
      </section>

      {/* Article */}
      <section className="section-padding -mt-24 relative z-10 md:-mt-32">
        <div className="container-custom">
          <article className="mx-auto max-w-3xl">
            <AnimatedSection variant="fade-up">
              <Link
                href="/blog"
                className="mb-8 inline-flex items-center gap-2 font-body text-sm font-medium text-primary transition-colors duration-200 hover:text-accent"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("backToBlog")}
              </Link>

              <div className="mb-6 flex flex-wrap items-center gap-4 font-body text-sm text-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" aria-hidden="true" />
                  {post.author}
                </span>
                <span className="h-1 w-1 rounded-full bg-text-muted/40" />
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={post.published_at}>
                    {formatDate(post.published_at, undefined, locale)}
                  </time>
                </span>
              </div>

              <h1 className="mb-10 font-heading text-4xl font-bold leading-tight text-text md:text-5xl">
                {post.title}
              </h1>
            </AnimatedSection>

            <AnimatedSection variant="fade-up" delay={0.15}>
              <div className="mx-auto mb-4 h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

              <div
                className="prose prose-lg max-w-none font-body text-text prose-headings:font-heading prose-headings:text-text prose-p:text-text-muted prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:text-accent prose-strong:text-text prose-blockquote:border-l-accent prose-blockquote:text-text-muted prose-img:rounded-2xl prose-img:shadow-card"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </AnimatedSection>
          </article>
        </div>
      </section>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding aurora-section">
          <div className="container-custom">
            <AnimatedSection variant="fade-up" className="mb-12 text-center">
              <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                {t("relatedTag")}
              </p>
              <h2 className="font-heading text-text">
                {t("relatedHeading1")}
                <span className="text-gradient">{t("relatedHeading2")}</span>
              </h2>
              <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-accent to-transparent" />
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related, index) => (
                <AnimatedSection
                  key={related.id}
                  variant="fade-up"
                  delay={index * 0.1}
                  className="h-full"
                >
                  <Link
                    href={`/blog/${related.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {related.cover_image_url ? (
                        <Image
                          src={related.cover_image_url}
                          alt={related.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10">
                          <span className="font-heading text-4xl text-primary/30">
                            B
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="mb-2 font-body text-xs text-text-muted">
                        <time dateTime={related.published_at}>
                          {formatDate(related.published_at, undefined, locale)}
                        </time>
                        {" · "}
                        {related.author}
                      </p>
                      <h3 className="mb-2 font-heading text-lg font-semibold leading-snug text-text transition-colors duration-200 group-hover:text-primary">
                        {related.title}
                      </h3>
                      <p className="line-clamp-2 flex-1 font-body text-sm text-text-muted">
                        {related.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 font-body text-sm font-semibold text-primary">
                        {t("readMore")}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
