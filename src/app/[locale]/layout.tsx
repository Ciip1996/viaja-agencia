import type { Metadata, Viewport } from "next";
import { Poppins, Outfit } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import "@/styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a2e",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://viajaagencia.com.mx"),
  title: {
    template: "%s | Viaja Agencia",
    default: "Viaja Agencia — Tu Agencia de Viajes en México",
  },
  icons: {
    icon: "/logo-viaja.png",
    apple: "/logo-viaja.png",
  },
  openGraph: {
    type: "website",
    url: "https://viajaagencia.com.mx",
    siteName: "Viaja Agencia",
    images: [{ url: "/logo-viaja.png", width: 512, height: 512, alt: "Viaja Agencia" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@viajaagencia",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${poppins.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
