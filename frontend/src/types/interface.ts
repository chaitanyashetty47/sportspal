// Interface for DayType Enum
export enum DayType {
  WEEKDAY = "WEEKDAY",
  WEEKEND = "WEEKEND",
}

// Interface for TurfTiming
export interface TurfTiming {
  id: string;
  turfId: string;
  day: DayType;
  startTime: string; // Consider using Date or a time format if needed
  endTime: string;   // Consider using Date or a time format if needed
  hourlyRate: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

// Interface for Turf
export interface Turf {
  id: string;
  name: string;
  type: TurfType; // Enum for turf types
  playgroundId: string;
  playground: Playground; // Assuming Playground is populated
  bookings: Booking[]; // Assuming Booking[] is populated
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  timing: TurfTiming[]; // Array of TurfTiming objects
}

// Interface for TurfType Enum
export enum TurfType {
  BADMINTON = "BADMINTON",
  CRICKET = "CRICKET",
  FOOTBALL = "FOOTBALL",
}

// Interface for Playground (simplified)
export interface Playground {
  id: string;
  name: string;
  address: string;
  city: City;
  turfs: Turf[]
  // Other fields as necessary
}

export interface City {
  id: string;
  name: string;
  playgrounds: Playground[]; 
}

// Interface for Booking (simplified)
export interface Booking {
  id: string;
  userId: string;
  turfId: string;
  startTime: string; // ISO Date string
  endTime: string;   // ISO Date string
  totalCost: number;
  stripePaymentId?: string;
  status: BookingStatus; // Enum for booking status
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

// Interface for BookingStatus Enum
export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}
