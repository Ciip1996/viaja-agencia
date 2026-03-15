export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      promotions: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          destination: string;
          price_usd: number;
          currency: string;
          image_url: string | null;
          badge: string | null;
          is_active: boolean;
          valid_from: string | null;
          valid_until: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          destination: string;
          price_usd: number;
          currency?: string;
          image_url?: string | null;
          badge?: string | null;
          is_active?: boolean;
          valid_from?: string | null;
          valid_until?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          destination?: string;
          price_usd?: number;
          currency?: string;
          image_url?: string | null;
          badge?: string | null;
          is_active?: boolean;
          valid_from?: string | null;
          valid_until?: string | null;
          created_at?: string;
        };
      };
      packages: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          destination: string;
          region: string;
          price_usd: number;
          duration_days: number;
          difficulty: string | null;
          includes: string | null;
          excludes: string | null;
          itinerary_summary: string | null;
          image_url: string | null;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          destination: string;
          region: string;
          price_usd: number;
          duration_days: number;
          difficulty?: string | null;
          includes?: string | null;
          excludes?: string | null;
          itinerary_summary?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          destination?: string;
          region?: string;
          price_usd?: number;
          duration_days?: number;
          difficulty?: string | null;
          includes?: string | null;
          excludes?: string | null;
          itinerary_summary?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
      };
      destinations: {
        Row: {
          id: string;
          name: string;
          region: string;
          description: string | null;
          hero_image_url: string | null;
          gallery: string[] | null;
          practical_info: string | null;
          display_order: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          region: string;
          description?: string | null;
          hero_image_url?: string | null;
          gallery?: string[] | null;
          practical_info?: string | null;
          display_order?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          region?: string;
          description?: string | null;
          hero_image_url?: string | null;
          gallery?: string[] | null;
          practical_info?: string | null;
          display_order?: number;
          is_active?: boolean;
        };
      };
      group_trips: {
        Row: {
          id: string;
          title: string;
          destination: string;
          description: string | null;
          departure_date: string;
          return_date: string;
          max_travelers: number;
          current_travelers: number;
          price_usd: number;
          image_url: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          destination: string;
          description?: string | null;
          departure_date: string;
          return_date: string;
          max_travelers: number;
          current_travelers?: number;
          price_usd: number;
          image_url?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          destination?: string;
          description?: string | null;
          departure_date?: string;
          return_date?: string;
          max_travelers?: number;
          current_travelers?: number;
          price_usd?: number;
          image_url?: string | null;
          is_active?: boolean;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          event_type: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          event_type: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          event_type?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          cover_image_url: string | null;
          author: string;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image_url?: string | null;
          author?: string;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image_url?: string | null;
          author?: string;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
        };
      };
      faq: {
        Row: {
          id: string;
          question: string;
          answer: string;
          display_order: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          display_order?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          display_order?: number;
          is_active?: boolean;
        };
      };
      site_settings: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Promotion = Database["public"]["Tables"]["promotions"]["Row"];
export type Package = Database["public"]["Tables"]["packages"]["Row"];
export type Destination = Database["public"]["Tables"]["destinations"]["Row"];
export type GroupTrip = Database["public"]["Tables"]["group_trips"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type FAQ = Database["public"]["Tables"]["faq"]["Row"];
export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];
