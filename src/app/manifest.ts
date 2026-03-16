import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Viaja Agencia — Tu Agencia de Viajes en México",
    short_name: "Viaja Agencia",
    description:
      "Agencia de viajes en León, Guanajuato. Paquetes, destinos, grupos, eventos y más.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a1a2e",
    icons: [
      {
        src: "/logo-viaja.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
