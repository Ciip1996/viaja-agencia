import { NextRequest, NextResponse } from "next/server";
import { searchHotels } from "@/lib/services/hotelbeds";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const REGION_MAP: Record<string, string[]> = {
  Europa: ["Europa", "Europe"],
  Europe: ["Europa", "Europe"],
  Asia: ["Asia"],
  "Medio Oriente": ["Medio Oriente", "Middle East"],
  "Middle East": ["Medio Oriente", "Middle East"],
  Africa: ["Africa", "África"],
  "Sudamérica": ["Sudamérica", "South America", "Sudamerica"],
  "South America": ["Sudamérica", "South America", "Sudamerica"],
  Centroamérica: ["Centroamérica", "Central America", "Centroamerica"],
  "Central America": ["Centroamérica", "Central America", "Centroamerica"],
  Caribe: ["Caribe", "Caribbean"],
  Caribbean: ["Caribe", "Caribbean"],
  "Estados Unidos": ["Estados Unidos", "United States"],
  "United States": ["Estados Unidos", "United States"],
  Canadá: ["Canadá", "Canada"],
  Canada: ["Canadá", "Canada"],
  México: ["México", "Mexico"],
  Mexico: ["México", "Mexico"],
  Pacífico: ["Pacífico", "Pacific", "Pacifico"],
  Pacific: ["Pacífico", "Pacific", "Pacifico"],
  Cruceros: ["Cruceros", "Cruises"],
  Cruises: ["Cruceros", "Cruises"],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const destination = searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const travelers = parseInt(searchParams.get("travelers") || "2");
  const locale = searchParams.get("locale") || "es";

  const [packages, hotels] = await Promise.all([
    fetchPackages(destination, locale),
    fetchHotels(destination, checkIn, checkOut, travelers),
  ]);

  return NextResponse.json(
    { packages, hotels },
    {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    }
  );
}

async function fetchPackages(destination: string, locale: string) {
  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .eq("locale", locale)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20);

    if (destination) {
      const regionVariants = REGION_MAP[destination];
      if (regionVariants) {
        query = query.in("region", regionVariants);
      } else {
        query = query.or(
          `region.ilike.%${destination}%,destination.ilike.%${destination}%,title.ilike.%${destination}%`
        );
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error("[Search] Packages query error:", error.message);
      return [];
    }
    return data ?? [];
  } catch (error) {
    console.error("[Search] Packages fetch failed:", error);
    return [];
  }
}

async function fetchHotels(
  destination: string,
  checkIn: string,
  checkOut: string,
  travelers: number
) {
  if (!checkIn || !checkOut) return [];

  try {
    const results = await searchHotels({
      destination,
      checkIn,
      checkOut,
      guests: travelers,
      rooms: 1,
    });
    return results;
  } catch (error) {
    console.error("[Search] Hotels fetch failed:", error);
    return [];
  }
}
