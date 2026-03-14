export interface NormalizedHotel {
  id: string;
  name: string;
  location: string;
  price: number;
  currency: string;
  rating: number;
  imageUrl: string;
  amenities: string[];
  provider: "hotelbeds" | "juniper" | "mock";
}

export interface NormalizedTour {
  id: string;
  name: string;
  destination: string;
  duration: number;
  price: number;
  currency: string;
  difficulty: "facil" | "moderado" | "dificil";
  imageUrl: string;
  description: string;
  provider: "hotelbeds" | "juniper" | "mock";
}

export interface NormalizedCar {
  id: string;
  model: string;
  category: "economico" | "sedan" | "suv" | "luxury";
  pricePerDay: number;
  currency: string;
  features: string[];
  imageUrl: string;
  provider: "hotelbeds" | "juniper" | "mock";
}

export interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: number;
}

export interface TourSearchParams {
  destination: string;
  date: string;
  category?: "cultura" | "aventura" | "gastronomia" | "naturaleza";
  guests?: number;
}

export interface TransferSearchParams {
  pickupLocation: string;
  pickupDate: string;
  dropoffLocation: string;
  dropoffDate: string;
}

export interface BookingParams {
  serviceId: string;
  serviceType: "hotel" | "tour" | "transfer";
  customerName: string;
  customerEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms?: number;
  specialRequests?: string;
}

export interface BookingResult {
  confirmationId: string;
  status: "confirmed" | "pending" | "failed" | "cancelled";
  provider: "hotelbeds" | "juniper" | "mock";
  totalPrice?: number;
  currency?: string;
}

export interface HotelbedsConfig {
  apiKey: string;
  secret: string;
  baseUrl: string;
}

export interface JuniperConfig {
  apiKey: string;
  secret: string;
  baseUrl: string;
}
