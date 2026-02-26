import { Booking } from "../models/booking";

export const bookings: Booking[] = [
  { id: "b1", hotelId: "h1", clientId: "c1", totalPrice: 1200, createdAt: "2024-01-15" },
  { id: "b2", hotelId: "h2", clientId: "c2", totalPrice: 900, createdAt: "2024-02-20" },
  { id: "b3", hotelId: "h1", clientId: "c3", totalPrice: 1500, createdAt: "2024-03-10" },
  { id: "b4", hotelId: "h3", clientId: "c4", totalPrice: 700, createdAt: "2024-04-05" },
  { id: "b5", hotelId: "h1", clientId: "c2", totalPrice: 2000, createdAt: "2025-01-18" },
  { id: "b6", hotelId: "h2", clientId: "c3", totalPrice: 1300, createdAt: "2025-02-12" },
];