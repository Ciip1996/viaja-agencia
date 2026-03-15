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
          locale: string;
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
          locale?: string;
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
          locale?: string;
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
          locale: string;
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
          locale?: string;
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
          locale?: string;
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
          locale: string;
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
          locale?: string;
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
          locale?: string;
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
          locale: string;
          created_at: string;
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
          locale?: string;
          created_at?: string;
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
          locale?: string;
          created_at?: string;
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
          locale: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          event_type: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          locale?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          event_type?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          locale?: string;
          created_at?: string;
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
          locale: string;
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
          locale?: string;
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
          locale?: string;
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
          locale: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          display_order?: number;
          is_active?: boolean;
          locale?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          display_order?: number;
          is_active?: boolean;
          locale?: string;
        };
      };
      site_settings: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
          category: string;
          label: string;
          field_type: string;
          locale: string;
        };
        Insert: {
          key: string;
          value: string;
          updated_at?: string;
          category?: string;
          label?: string;
          field_type?: string;
          locale?: string;
        };
        Update: {
          key?: string;
          value?: string;
          updated_at?: string;
          category?: string;
          label?: string;
          field_type?: string;
          locale?: string;
        };
      };
      quote_requests: {
        Row: {
          id: string;
          source: string;
          status: string;
          client_name: string;
          client_email: string;
          client_phone: string | null;
          destination: string;
          travel_type: string | null;
          check_in: string | null;
          check_out: string | null;
          adults: number | null;
          children: number | null;
          budget_range: string | null;
          notes: string | null;
          chat_history: Json | null;
          assigned_to: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source?: string;
          status?: string;
          client_name: string;
          client_email: string;
          client_phone?: string | null;
          destination: string;
          travel_type?: string | null;
          check_in?: string | null;
          check_out?: string | null;
          adults?: number | null;
          children?: number | null;
          budget_range?: string | null;
          notes?: string | null;
          chat_history?: Json | null;
          assigned_to?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          source?: string;
          status?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string | null;
          destination?: string;
          travel_type?: string | null;
          check_in?: string | null;
          check_out?: string | null;
          adults?: number | null;
          children?: number | null;
          budget_range?: string | null;
          notes?: string | null;
          chat_history?: Json | null;
          assigned_to?: string | null;
          created_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          locale: string | null;
          is_active: boolean;
          subscribed_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          locale?: string | null;
          is_active?: boolean;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          locale?: string | null;
          is_active?: boolean;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          travel_type: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          travel_type?: string | null;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          travel_type?: string | null;
          message?: string;
          is_read?: boolean;
          created_at?: string;
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
export type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];
export type NewsletterSubscriber = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];
export type ContactSubmission = Database["public"]["Tables"]["contact_submissions"]["Row"];
