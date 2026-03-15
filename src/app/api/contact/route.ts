import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendContactNotification } from "@/lib/services/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, travelType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nombre, email y mensaje son obligatorios" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      phone: phone || null,
      travel_type: travelType || null,
      message,
    });

    if (error) {
      console.error("Contact DB error:", error);
    }

    await sendContactNotification({ name, email, phone, travelType, message });

    return NextResponse.json({
      success: true,
      message: "Mensaje recibido. Nos pondremos en contacto contigo pronto.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Error enviando mensaje" }, { status: 500 });
  }
}
