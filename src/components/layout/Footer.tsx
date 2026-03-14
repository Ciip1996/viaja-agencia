import Link from "next/link";
import { Plane, MapPin, Phone, Mail, Facebook, Instagram, Clock } from "lucide-react";

const quickLinks = [
  { href: "/destinos", label: "Destinos" },
  { href: "/paquetes", label: "Paquetes" },
  { href: "/hoteles", label: "Hoteles" },
  { href: "/tours", label: "Tours" },
  { href: "/grupos", label: "Viajes Grupales" },
  { href: "/eventos", label: "Eventos" },
];

const legalLinks = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
  { href: "#", label: "Política de Privacidad" },
  { href: "#", label: "Términos de Uso" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white/90">
      <div className="container-custom section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 cursor-pointer">
              <Plane className="w-6 h-6 text-accent" />
              <span className="font-heading text-2xl font-bold text-white">
                Viaja Agencia
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Más de 20 años creando experiencias de viaje inolvidables.
              Certificación IATA. León, Guanajuato.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/viajaagencia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-200 cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/viajaagencia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent transition-colors duration-200 cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">
              Explora
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
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">
              Empresa
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
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <span>
                  Nube #522, Col. Jardines del Moral,
                  <br />
                  C.P. 37160, León, Gto., México
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="w-4 h-4 shrink-0 text-accent" />
                <span>477 779 0610 ext 102-115</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="w-4 h-4 shrink-0 text-accent" />
                <a href="mailto:info@viajaagencia.com.mx" className="hover:text-accent transition-colors cursor-pointer">
                  info@viajaagencia.com.mx
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Clock className="w-4 h-4 shrink-0 text-accent" />
                <span>Lun - Vie: 9:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>
            &copy; {new Date().getFullYear()} Viaja Agencia. Grupo Turístico del
            Centro-Occidente, S.A. de C.V. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1">
            Certificación <span className="text-accent font-semibold">IATA</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
