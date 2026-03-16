import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendQuoteNotification } from "@/lib/services/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      destination,
      travelType,
      checkIn,
      checkOut,
      adults,
      children,
      budgetRange,
      notes,
      preferredLocale,
    } = body;

    if (!clientName || !clientEmail) {
      return NextResponse.json(
        { error: "Nombre y email son obligatorios" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        source: "wizard",
        status: "nueva",
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone || null,
        destination: destination || null,
        travel_type: travelType || null,
        check_in: checkIn || null,
        check_out: checkOut || null,
        adults: adults || 2,
        children: children || 0,
        budget_range: budgetRange || null,
        notes: notes || null,
        preferred_locale: preferredLocale || "es",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Quote insert error:", error);
      return NextResponse.json(
        { error: "Error al guardar cotización" },
        { status: 500 }
      );
    }

    await sendQuoteNotification({
      clientName,
      clientEmail,
      clientPhone,
      destination,
      travelType,
      checkIn,
      checkOut,
      adults,
      children,
      budgetRange,
      notes,
      source: "wizard",
    });

    return NextResponse.json({ success: true, quoteId: data?.id });
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json(
      { error: "Error al procesar cotización" },
      { status: 500 }
    );
  }
}
