import { getApiKey } from "@/lib/cms/api-keys";

const VIAJA_PLACE_QUERY = "Viaja Agencia Leon Guanajuato Mexico";

export interface GoogleReview {
  authorName: string;
  authorUri: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
}

export interface GoogleReviewsData {
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
  googleMapsUrl: string;
  fetchedAt: string;
}

async function findPlaceId(apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.id,places.displayName",
        },
        body: JSON.stringify({ textQuery: VIAJA_PLACE_QUERY }),
      }
    );
    const data = await res.json();
    return data.places?.[0]?.id ?? null;
  } catch (error) {
    console.error("[GooglePlaces] Error finding place ID:", error);
    return null;
  }
}

export async function fetchGoogleReviews(
  placeId?: string,
  locale: string = "es"
): Promise<GoogleReviewsData | null> {
  const API_KEY = await getApiKey("google_places_api_key");
  if (!API_KEY) {
    console.log("[GooglePlaces] API key not configured");
    return null;
  }

  let resolvedPlaceId = placeId || process.env.GOOGLE_PLACE_ID;

  if (!resolvedPlaceId) {
    resolvedPlaceId = (await findPlaceId(API_KEY)) ?? undefined;
    if (resolvedPlaceId) {
      console.log("[GooglePlaces] Found place ID:", resolvedPlaceId);
    }
  }

  if (!resolvedPlaceId) {
    console.error("[GooglePlaces] Could not resolve place ID");
    return null;
  }

  try {
    const langCode = locale === "en" ? "en" : "es";
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${resolvedPlaceId}?languageCode=${langCode}`,
      {
        headers: {
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask":
            "reviews,rating,userRatingCount,googleMapsUri",
        },
      }
    );

    if (!res.ok) {
      console.error(
        "[GooglePlaces] API error:",
        res.status,
        await res.text()
      );
      return null;
    }

    const data = await res.json();

    const reviews: GoogleReview[] = (data.reviews ?? []).map(
      (r: {
        authorAttribution?: { displayName?: string; uri?: string };
        rating?: number;
        text?: { text?: string };
        relativePublishTimeDescription?: string;
        publishTime?: string;
      }) => ({
        authorName: r.authorAttribution?.displayName ?? "Anonymous",
        authorUri: r.authorAttribution?.uri ?? "",
        rating: r.rating ?? 5,
        text: r.text?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
        publishTime: r.publishTime ?? "",
      })
    );

    return {
      rating: data.rating ?? 0,
      totalReviews: data.userRatingCount ?? 0,
      reviews,
      googleMapsUrl: data.googleMapsUri ?? "",
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[GooglePlaces] Error fetching reviews:", error);
    return null;
  }
}
