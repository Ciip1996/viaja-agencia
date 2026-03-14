import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // TODO: Add to Supabase newsletter_subscribers table
    // TODO: Integrate with email service (Mailchimp, Resend, etc.)
    console.log("Newsletter subscription:", email);

    return NextResponse.json({
      success: true,
      message: "¡Gracias por suscribirte! Te mantendremos informado.",
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Error al suscribirse" },
      { status: 500 }
    );
  }
}
