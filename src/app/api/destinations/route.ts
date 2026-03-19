import { NextRequest, NextResponse } from "next/server";
import { searchDestinations } from "@/lib/data/destination-codes";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  if (q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const results = searchDestinations(q, 8);

  return NextResponse.json(results, {
    headers: {
      // Short cache — destinations don't change, but keep it fresh-ish
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
