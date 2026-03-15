import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type FooterProps = {
  settings?: Record<string, string>;
};

export default async function Footer({ settings = {} }: FooterProps) {
  const t = await getTranslations("footer");

  const phone = settings.phone || "477 779 0610 ext 102 al 115";
  const email = settings.email || "reservaciones@viajaagencia.com.mx";
  const address = settings.address || "Nube #522, Col. Jardines del Moral, C.P. 37160, León, Gto., México";
  const horario = settings.horario || "Lun — Vie: 9:00 — 19:00 · Sáb: 10:00 — 14:00";
  const facebook = settings.facebook || "https://www.facebook.com/viajaagencia/";
  const instagram = settings.instagram || "https://www.instagram.com/viajaagencia";
  const whatsapp = settings.whatsapp || "https://wa.me/524777790610?text=Hola%2C%20me%20interesa%20cotizar%20un%20viaje";
  const legalName = settings.legal_name || "Grupo Turístico del Centro-Occidente, S.A. de C.V.";
  const mapEmbed = settings.google_maps_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.041388161214!2d-101.69539441146757!3d21.15075113032543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bbf467929d2cf%3A0xf87c4906456d0a1f!2sViaja%20Agencia!5e0!3m2!1ses-419!2smx!4v1773523729356!5m2!1ses-419!2smx";
  const logoUrl = settings.logo_url || "/logo-viaja.png";

  const quickLinks = [
    { href: "/destinos", label: t("linkDestinations") },
    { href: "/paquetes", label: t("linkPackages") },
    { href: "/hoteles", label: t("linkHotels") },
    { href: "/tours", label: t("linkTours") },
    { href: "/grupos", label: t("linkGroupTrips") },
    { href: "/eventos", label: t("linkEvents") },
  ];

  const legalLinks = [
    { href: "/nosotros", label: t("linkAboutUs") },
    { href: "/contacto", label: t("linkContact") },
    { href: "#", label: t("linkPrivacy") },
    { href: "#", label: t("linkTerms") },
  ];

  return (
    <footer className="bg-primary text-white/90">
      <div className="container-custom section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 cursor-pointer group">
              <Image
                src={logoUrl}
                alt={t("brandName")}
                width={44}
                height={44}
                className="w-11 h-11 rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-heading text-2xl font-bold text-white">
                {t("brandName")}
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {t("brandDescription")}
              {" "}{t("brandCertification")}
            </p>
            <div className="flex gap-3">
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-200 cursor-pointer"
                aria-label={t("facebook")}
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-200 cursor-pointer"
                aria-label={t("instagram")}
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#25D366] transition-colors duration-200 cursor-pointer"
                aria-label={t("whatsappContact")}
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          <nav aria-label={t("quickLinks")}>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">
              {t("explore")}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("company")}>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">
              {t("company")}
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">
              {t("contactTitle")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="w-4 h-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="w-4 h-4 shrink-0 text-accent" aria-hidden="true" />
                <a href={`mailto:${email}`} className="hover:text-accent transition-colors cursor-pointer">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Clock className="w-4 h-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{horario}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl">
          <iframe
            src={mapEmbed}
            width="100%"
            height="220"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t("mapTitle")}
            className="w-full opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          />
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>
            &copy; {new Date().getFullYear()} {t("copyright", { legalName })}
          </p>
          <p className="flex items-center gap-1">
            {t("certification")} <span className="text-accent font-semibold">IATA</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
