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
  // Optional Hotelbeds-specific fields — undefined for mock/CMS hotels
  hotelCode?: number;
  hotelRooms?: HotelbedsRoom[];
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

// ---------------------------------------------------------------------------
// Hotelbeds-specific types — isolated, only used by hotelbeds.ts and the
// /hoteles booking flow. No other part of the app depends on these.
// ---------------------------------------------------------------------------

export interface HotelbedsRate {
  rateKey: string;
  rateType: "BOOKABLE" | "RECHECK";
  net: number;
  boardCode: string;
  boardName: string;
  rooms: number;
  adults: number;
  children: number;
  cancellationPolicies: Array<{ amount: string; from: string }>;
}

export interface HotelbedsRoom {
  code: string;
  name: string;
  rates: HotelbedsRate[];
}

export interface HotelbedsHolder {
  name: string;
  surname: string;
}

export interface HotelbedsBookingPax {
  roomId: number;
  type: "AD" | "CH";
  name: string;
  surname: string;
  age?: number;
}

export interface HotelbedsBookingRoom {
  rateKey: string;
  paxes: HotelbedsBookingPax[];
}

export interface HotelbedsBookingRequest {
  holder: HotelbedsHolder;
  rooms: HotelbedsBookingRoom[];
  clientReference: string;
  remark?: string;
  tolerance?: number;
}

export interface HotelbedsBookingConfirmation {
  reference: string;
  status: "CONFIRMED" | "CANCELLED" | "ON_REQUEST";
  totalNet: number;
  currency: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  holder: HotelbedsHolder;
  cancellationAmount?: string;
  cancellationFrom?: string;
}

export interface JuniperConfig {
  apiKey: string;
  secret: string;
  baseUrl: string;
}
