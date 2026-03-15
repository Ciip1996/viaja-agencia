import { NextRequest, NextResponse } from "next/server";
import { searchHotels, createBooking } from "@/lib/services/hotelbeds";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params = {
    destination: searchParams.get("destination") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    rooms: parseInt(searchParams.get("rooms") || "1"),
    guests: parseInt(searchParams.get("guests") || "2"),
  };

  try {
    const results = await searchHotels(params);
    return NextResponse.json(
      { results, provider: "hotelbeds" },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Hotel search error:", error);
    return NextResponse.json(
      { error: "Error buscando hoteles", results: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createBooking(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Error creando reserva" },
      { status: 500 }
    );
  }
}
