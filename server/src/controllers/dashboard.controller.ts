import { Request, Response } from "express";
import { hotels } from "../data/hotels.store";
import { clients } from "../data/clients.store";
import { bookings } from "../data/bookings.store";

export function getDashboardStats(req: Request, res: Response) {
  const yearParam = req.query.year as string;
  const selectedYear = yearParam ? Number(yearParam) : new Date().getFullYear();

  if (Number.isNaN(selectedYear)) {
    return res.status(400).json({ message: "Invalid year parameter" });
  }

  const filteredBookings = bookings.filter((b) => {
    const bookingYear = new Date(b.createdAt).getFullYear();
    return bookingYear === selectedYear;
  });

  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const monthlyRevenue = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthRevenue = filteredBookings
      .filter((b) => new Date(b.createdAt).getMonth() === monthIndex)
      .reduce((sum, b) => sum + b.totalPrice, 0);

    return {
      month: monthIndex + 1,
      revenue: monthRevenue,
    };
  });

  return res.status(200).json({
    totalHotels: hotels.length,
    totalClients: clients.length,
    totalBookings: bookings.length,
    totalRevenue,
    monthlyRevenue,
    year: selectedYear,
  });
}