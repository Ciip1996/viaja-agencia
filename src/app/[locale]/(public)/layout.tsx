import { Suspense, lazy } from "react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import QuoteButton from "@/components/quoter/QuoteButton";
import { getContentByCategory } from "@/lib/cms/content";
import { getFeatureFlags } from "@/lib/cms/feature-flags";
import { setRequestLocale } from "next-intl/server";

const ChatWidget = lazy(() => import("@/components/chat/ChatWidget"));

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [general, flags] = await Promise.all([
    getContentByCategory("general", locale),
    getFeatureFlags(),
  ]);

  return (
    <>
      <TopBar settings={general} />
      <Navbar featureFlags={flags} />
      <main id="main-content" className="min-h-screen">{children}</main>
      <Footer settings={general} />
      <WhatsAppButton whatsappUrl={general.whatsapp || "https://wa.me/524777790610?text=Hola%2C%20me%20interesa%20cotizar%20un%20viaje"} />
      <QuoteButton />
      {flags.feature_chatbot && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
    </>
  );
}
