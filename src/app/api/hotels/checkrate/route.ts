import { NextRequest, NextResponse } from "next/server";
import { checkRate } from "@/lib/services/hotelbeds";

export async function POST(request: NextRequest) {
  try {
    const { rateKey } = await request.json();

    if (!rateKey || typeof rateKey !== "string") {
      return NextResponse.json(
        { error: "rateKey is required" },
        { status: 400 }
      );
    }

    const rate = await checkRate(rateKey);

    if (!rate) {
      return NextResponse.json(
        { error: "Rate not found or no longer available" },
        { status: 404 }
      );
    }

    return NextResponse.json(rate, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("CheckRate error:", error);
    return NextResponse.json(
      { error: "Error validating rate" },
      { status: 500 }
    );
  }
}
