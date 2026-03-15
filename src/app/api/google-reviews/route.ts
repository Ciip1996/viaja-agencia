import { NextRequest, NextResponse } from "next/server";
import {
  fetchGoogleReviews,
  type GoogleReviewsData,
} from "@/lib/services/google-places";
import { createAdminClient } from "@/lib/supabase/admin-client";

const CACHE_KEY = "google_reviews_cache";
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") || "es";

  try {
    const supabase = createAdminClient();
    const cacheKeyLocale = `${CACHE_KEY}_${locale}`;

    const { data: cached } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", cacheKeyLocale)
      .eq("locale", locale)
      .single();

    if (cached?.value) {
      try {
        const parsed: GoogleReviewsData = JSON.parse(cached.value);
        const fetchedAt = new Date(parsed.fetchedAt).getTime();
        if (Date.now() - fetchedAt < CACHE_DURATION_MS) {
          return NextResponse.json(parsed);
        }
      } catch {
        /* cache invalid, refetch */
      }
    }

    const fresh = await fetchGoogleReviews(undefined, locale);
    if (!fresh) {
      if (cached?.value) {
        return NextResponse.json(JSON.parse(cached.value));
      }
      return NextResponse.json({
        reviews: [],
        rating: 0,
        totalReviews: 0,
        googleMapsUrl: "",
      });
    }

    await supabase.from("site_settings").upsert(
      {
        key: cacheKeyLocale,
        value: JSON.stringify(fresh),
        category: "system",
        label: `Google Reviews Cache (${locale})`,
        field_type: "json",
        locale,
      },
      { onConflict: "key,locale" }
    );

    return NextResponse.json(fresh);
  } catch (error) {
    console.error("Google reviews error:", error);
    return NextResponse.json({
      reviews: [],
      rating: 0,
      totalReviews: 0,
      googleMapsUrl: "",
    });
  }
}
