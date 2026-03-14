import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, tripType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nombre, email y mensaje son obligatorios" },
        { status: 400 }
      );
    }

    // TODO: Send email notification (e.g., via Resend, SendGrid, or Supabase Edge Function)
    // TODO: Store in Supabase contacts table
    console.log("Contact form submission:", { name, email, phone, tripType, message });

    return NextResponse.json({
      success: true,
      message: "Mensaje recibido. Nos pondremos en contacto contigo pronto.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Error enviando mensaje" },
      { status: 500 }
    );
  }
}
