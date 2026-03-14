import type { Metadata } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import "@/styles/globals.css";

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Viaja Agencia | Agencia de Viajes en León, Guanajuato",
    template: "%s | Viaja Agencia",
  },
  description:
    "Más de 20 años creando experiencias de viaje inolvidables. Destinos exclusivos, paquetes personalizados y servicio 24/7. Certificación IATA. León, Guanajuato.",
  keywords: [
    "agencia de viajes",
    "León Guanajuato",
    "viajes de lujo",
    "paquetes vacacionales",
    "IATA",
    "Bajío",
    "destinos internacionales",
  ],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://viajaagencia.com.mx",
    siteName: "Viaja Agencia",
    title: "Viaja Agencia | Experiencias de Viaje Inolvidables",
    description:
      "Más de 20 años creando experiencias de viaje inolvidables. Destinos exclusivos, paquetes personalizados y servicio 24/7.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
