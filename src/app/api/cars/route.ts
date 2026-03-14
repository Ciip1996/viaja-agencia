import { NextRequest, NextResponse } from "next/server";
import { searchTransfers } from "@/lib/services/hotelbeds";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params = {
    pickupLocation: searchParams.get("pickup") || "",
    pickupDate: searchParams.get("pickupDate") || "",
    dropoffLocation: searchParams.get("dropoff") || "",
    dropoffDate: searchParams.get("dropoffDate") || "",
  };

  try {
    const results = await searchTransfers(params);
    return NextResponse.json({ results, provider: "hotelbeds" });
  } catch (error) {
    console.error("Car search error:", error);
    return NextResponse.json(
      { error: "Error buscando autos" },
      { status: 500 }
    );
  }
}
