import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { sendWelcomeEmail } from "@/lib/services/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, locale = "es" } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email: email.toLowerCase().trim(), locale, is_active: true, subscribed_at: new Date().toISOString() },
        { onConflict: "email" }
      );

    if (error) {
      console.error("Newsletter DB error:", error);
      return NextResponse.json({ error: "Error al suscribirse" }, { status: 500 });
    }

    await sendWelcomeEmail(email, locale);

    return NextResponse.json({
      success: true,
      message: locale === "en"
        ? "Thanks for subscribing! We'll keep you informed."
        : "¡Gracias por suscribirte! Te mantendremos informado.",
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Error al suscribirse" }, { status: 500 });
  }
}
