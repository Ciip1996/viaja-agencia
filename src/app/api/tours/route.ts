import { NextRequest, NextResponse } from "next/server";
import { searchActivities } from "@/lib/services/hotelbeds";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params = {
    destination: searchParams.get("destination") || "",
    date: searchParams.get("date") || "",
    category: (searchParams.get("category") || undefined) as "cultura" | "aventura" | "gastronomia" | "naturaleza" | undefined,
    guests: parseInt(searchParams.get("guests") || "2"),
  };

  try {
    const results = await searchActivities(params);
    return NextResponse.json({ results, provider: "hotelbeds" });
  } catch (error) {
    console.error("Tours search error:", error);
    return NextResponse.json(
      { error: "Error buscando tours" },
      { status: 500 }
    );
  }
}
