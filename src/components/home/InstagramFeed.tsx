"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Instagram, ExternalLink, Heart, MessageCircle, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Image from "next/image";

const INSTAGRAM_HANDLE = "viajaagencia";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

const placeholderPosts = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    likes: 124,
    comments: 18,
    caption: "Playas paradisíacas te esperan...",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80",
    likes: 256,
    comments: 32,
    caption: "Santorini al atardecer, un sueño hecho realidad",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80",
    likes: 189,
    comments: 24,
    caption: "Japón: donde la tradición se encuentra con el futuro",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
    likes: 312,
    comments: 45,
    caption: "París siempre es una buena idea",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80",
    likes: 278,
    comments: 38,
    caption: "Maldivas: el paraíso existe",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&q=80",
    likes: 167,
    comments: 21,
    caption: "Marruecos mágico: colores, aromas y aventura",
  },
  {
    id: "7",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80",
    likes: 203,
    comments: 29,
    caption: "Italia romántica, cada rincón es una postal",
  },
  {
    id: "8",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80",
    likes: 145,
    comments: 19,
    caption: "Safari en África: la aventura de tu vida",
  },
];

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

interface EmbeddedPost {
  url: string;
}

function InstagramEmbed({ url }: EmbeddedPost) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const blockquote = document.createElement("blockquote");
    blockquote.className = "instagram-media";
    blockquote.setAttribute("data-instgrm-captioned", "");
    blockquote.setAttribute("data-instgrm-permalink", url);
    blockquote.setAttribute("data-instgrm-version", "14");
    blockquote.style.maxWidth = "100%";
    blockquote.style.minWidth = "280px";
    blockquote.style.width = "100%";
    blockquote.style.margin = "0";
    blockquote.style.padding = "0";
    blockquote.style.borderRadius = "12px";

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(blockquote);

    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [url]);

  return <div ref={containerRef} className="w-full overflow-hidden rounded-xl" />;
}

export default function InstagramFeed() {
  const [embeddedUrls, setEmbeddedUrls] = useState<string[]>([]);
  const [showEmbeds, setShowEmbeds] = useState(false);

  useEffect(() => {
    // TODO: Fetch Instagram post URLs from Supabase site_settings
    // For now, if specific URLs are configured, use them
    const configuredUrls: string[] = [];
    if (configuredUrls.length > 0) {
      setEmbeddedUrls(configuredUrls);
      setShowEmbeds(true);
    }
  }, []);

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <AnimatedSection variant="fade-up" className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-lg font-semibold text-text hover:text-primary transition-colors cursor-pointer"
            >
              @{INSTAGRAM_HANDLE}
            </a>
          </div>
          <h2 className="text-text mb-3">
            Síguenos en <span className="text-gradient">Instagram</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-lg">
            Inspírate con destinos increíbles, tips de viaje y las mejores
            promociones. Únete a nuestra comunidad viajera.
          </p>
        </AnimatedSection>

        {showEmbeds && embeddedUrls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {embeddedUrls.slice(0, 6).map((url) => (
              <InstagramEmbed key={url} url={url} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
            {placeholderPosts.map((post, index) => (
              <AnimatedSection
                key={post.id}
                variant="scale-in"
                delay={index * 0.06}
              >
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square rounded-xl overflow-hidden cursor-pointer"
                >
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-5 text-white">
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        <Heart className="w-5 h-5 fill-white" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        <MessageCircle className="w-5 h-5 fill-white" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        )}

        <AnimatedSection variant="fade-up" className="text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer group"
          >
            <Instagram className="w-5 h-5" />
            Seguir en Instagram
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
