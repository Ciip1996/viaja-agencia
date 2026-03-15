import { Resend } from "resend";
import { getApiKey } from "@/lib/cms/api-keys";

let _resend: Resend | null = null;

async function getResend(): Promise<Resend | null> {
  if (_resend) return _resend;
  const key = await getApiKey("resend_api_key");
  if (!key) return null;
  _resend = new Resend(key);
  return _resend;
}

async function getFromEmail(): Promise<string> {
  const email = await getApiKey("resend_from_email");
  return email || "noreply@viajaagencia.com.mx";
}

export async function sendWelcomeEmail(
  to: string,
  locale: string = "es"
): Promise<boolean> {
  const resend = await getResend();
  if (!resend) {
    console.log("[Email] Resend not configured, skipping welcome email to", to);
    return false;
  }
  const FROM_EMAIL = await getFromEmail();

  const subject =
    locale === "en"
      ? "Welcome to Viaja Agencia!"
      : "¡Bienvenido a Viaja Agencia!";

  const html =
    locale === "en"
      ? `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#062D97,#2667FF);padding:40px 20px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:#fff;margin:0;font-size:28px">Viaja Agencia</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Your next adventure starts here</p>
          </div>
          <div style="padding:30px 20px;background:#fff">
            <h2 style="color:#062D97;margin:0 0 16px">Thank you for subscribing!</h2>
            <p style="color:#35322C;line-height:1.6">You'll receive the best travel deals, exclusive packages, and tips for your next trip.</p>
            <a href="https://viajaagencia.com.mx" style="display:inline-block;margin:20px 0;padding:12px 32px;background:#1DCEC8;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Explore Destinations</a>
          </div>
          <div style="padding:20px;text-align:center;background:#f8f9fa;border-radius:0 0 12px 12px">
            <p style="color:#6B7280;font-size:12px;margin:0">Viaja Agencia | Leon, Guanajuato, Mexico</p>
          </div>
        </div>`
      : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#062D97,#2667FF);padding:40px 20px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:#fff;margin:0;font-size:28px">Viaja Agencia</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Tu próxima aventura empieza aquí</p>
          </div>
          <div style="padding:30px 20px;background:#fff">
            <h2 style="color:#062D97;margin:0 0 16px">¡Gracias por suscribirte!</h2>
            <p style="color:#35322C;line-height:1.6">Recibirás las mejores ofertas de viaje, paquetes exclusivos y tips para tu próximo destino.</p>
            <a href="https://viajaagencia.com.mx" style="display:inline-block;margin:20px 0;padding:12px 32px;background:#1DCEC8;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Explorar Destinos</a>
          </div>
          <div style="padding:20px;text-align:center;background:#f8f9fa;border-radius:0 0 12px 12px">
            <p style="color:#6B7280;font-size:12px;margin:0">Viaja Agencia | León, Guanajuato, México</p>
          </div>
        </div>`;

  try {
    await resend.emails.send({
      from: `Viaja Agencia <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("[Email] Failed to send welcome email:", error);
    return false;
  }
}

export async function sendQuoteNotification(quoteData: {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  destination?: string;
  travelType?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  budgetRange?: string;
  notes?: string;
  source: string;
}): Promise<boolean> {
  const resend = await getResend();
  if (!resend) {
    console.log("[Email] Resend not configured, skipping quote notification");
    return false;
  }
  const FROM_EMAIL = await getFromEmail();

  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#062D97;padding:20px;border-radius:12px 12px 0 0">
      <h2 style="color:#fff;margin:0">Nueva Solicitud de Cotización</h2>
      <span style="color:rgba(255,255,255,0.7);font-size:13px">Fuente: ${quoteData.source}</span>
    </div>
    <div style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-top:none">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#6B7280;width:140px">Cliente</td><td style="padding:8px 0;color:#35322C;font-weight:600">${quoteData.clientName}</td></tr>
        <tr><td style="padding:8px 0;color:#6B7280">Email</td><td style="padding:8px 0"><a href="mailto:${quoteData.clientEmail}" style="color:#2667FF">${quoteData.clientEmail}</a></td></tr>
        ${quoteData.clientPhone ? `<tr><td style="padding:8px 0;color:#6B7280">Teléfono</td><td style="padding:8px 0;color:#35322C">${quoteData.clientPhone}</td></tr>` : ""}
        ${quoteData.destination ? `<tr><td style="padding:8px 0;color:#6B7280">Destino</td><td style="padding:8px 0;color:#35322C">${quoteData.destination}</td></tr>` : ""}
        ${quoteData.travelType ? `<tr><td style="padding:8px 0;color:#6B7280">Tipo de viaje</td><td style="padding:8px 0;color:#35322C">${quoteData.travelType}</td></tr>` : ""}
        ${quoteData.checkIn ? `<tr><td style="padding:8px 0;color:#6B7280">Check-in</td><td style="padding:8px 0;color:#35322C">${quoteData.checkIn}</td></tr>` : ""}
        ${quoteData.checkOut ? `<tr><td style="padding:8px 0;color:#6B7280">Check-out</td><td style="padding:8px 0;color:#35322C">${quoteData.checkOut}</td></tr>` : ""}
        ${quoteData.adults ? `<tr><td style="padding:8px 0;color:#6B7280">Viajeros</td><td style="padding:8px 0;color:#35322C">${quoteData.adults} adultos${quoteData.children ? `, ${quoteData.children} niños` : ""}</td></tr>` : ""}
        ${quoteData.budgetRange ? `<tr><td style="padding:8px 0;color:#6B7280">Presupuesto</td><td style="padding:8px 0;color:#35322C">${quoteData.budgetRange}</td></tr>` : ""}
        ${quoteData.notes ? `<tr><td style="padding:8px 0;color:#6B7280;vertical-align:top">Notas</td><td style="padding:8px 0;color:#35322C">${quoteData.notes}</td></tr>` : ""}
      </table>
    </div>
    <div style="padding:16px;background:#f8f9fa;border-radius:0 0 12px 12px;text-align:center">
      <a href="https://viajaagencia.com.mx/es/admin/cotizaciones" style="display:inline-block;padding:10px 24px;background:#062D97;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">Ver en Panel Admin</a>
    </div>
  </div>`;

  try {
    await resend.emails.send({
      from: `Viaja Agencia <${FROM_EMAIL}>`,
      to: "reservaciones@viajaagencia.com.mx",
      subject: `Nueva cotización: ${quoteData.clientName} - ${quoteData.destination || "Sin destino"}`,
      html,
      replyTo: quoteData.clientEmail,
    });
    return true;
  } catch (error) {
    console.error("[Email] Failed to send quote notification:", error);
    return false;
  }
}

export async function sendContactNotification(contactData: {
  name: string;
  email: string;
  phone?: string;
  travelType?: string;
  message: string;
}): Promise<boolean> {
  const resend = await getResend();
  if (!resend) {
    console.log("[Email] Resend not configured, skipping contact notification");
    return false;
  }
  const FROM_EMAIL = await getFromEmail();

  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#1DCEC8;padding:20px;border-radius:12px 12px 0 0">
      <h2 style="color:#fff;margin:0">Nuevo Mensaje de Contacto</h2>
    </div>
    <div style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-top:none">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#6B7280;width:140px">Nombre</td><td style="padding:8px 0;color:#35322C;font-weight:600">${contactData.name}</td></tr>
        <tr><td style="padding:8px 0;color:#6B7280">Email</td><td style="padding:8px 0"><a href="mailto:${contactData.email}" style="color:#2667FF">${contactData.email}</a></td></tr>
        ${contactData.phone ? `<tr><td style="padding:8px 0;color:#6B7280">Teléfono</td><td style="padding:8px 0;color:#35322C">${contactData.phone}</td></tr>` : ""}
        ${contactData.travelType ? `<tr><td style="padding:8px 0;color:#6B7280">Tipo de viaje</td><td style="padding:8px 0;color:#35322C">${contactData.travelType}</td></tr>` : ""}
        <tr><td style="padding:8px 0;color:#6B7280;vertical-align:top">Mensaje</td><td style="padding:8px 0;color:#35322C">${contactData.message}</td></tr>
      </table>
    </div>
  </div>`;

  try {
    await resend.emails.send({
      from: `Viaja Agencia <${FROM_EMAIL}>`,
      to: "reservaciones@viajaagencia.com.mx",
      subject: `Contacto: ${contactData.name}`,
      html,
      replyTo: contactData.email,
    });
    return true;
  } catch (error) {
    console.error("[Email] Failed to send contact notification:", error);
    return false;
  }
}
