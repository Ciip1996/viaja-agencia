import { NextRequest, NextResponse } from "next/server";
import {
  createHotelbedsBooking,
  getHotelbedsBooking,
  cancelHotelbedsBooking,
} from "@/lib/services/hotelbeds";
import type { HotelbedsBookingRequest } from "@/lib/services/types";

export async function POST(request: NextRequest) {
  try {
    const body: HotelbedsBookingRequest = await request.json();

    if (!body.holder?.name || !body.holder?.surname) {
      return NextResponse.json(
        { error: "holder name and surname are required" },
        { status: 400 }
      );
    }

    if (!body.rooms?.length || !body.rooms[0]?.rateKey) {
      return NextResponse.json(
        { error: "at least one room with a rateKey is required" },
        { status: 400 }
      );
    }

    if (!body.clientReference) {
      body.clientReference = `VIAJA-${Date.now()}`;
    }

    const confirmation = await createHotelbedsBooking(body);
    return NextResponse.json(confirmation, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error creating booking";
    console.error("Booking error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { error: "reference query param is required" },
      { status: 400 }
    );
  }

  try {
    const booking = await getHotelbedsBooking(reference);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json(
      { error: "Error fetching booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { error: "reference query param is required" },
      { status: 400 }
    );
  }

  try {
    const result = await cancelHotelbedsBooking(reference);

    if (!result) {
      return NextResponse.json(
        { error: "Could not cancel booking" },
        { status: 500 }
      );
    }

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { error: "Error cancelling booking" },
      { status: 500 }
    );
  }
}
