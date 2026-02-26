import { Request, Response } from "express";
import { hotels } from "../data/hotels.store";
import { CreateHotelDto, UpdateHotelDto, Hotel } from "../models/hotel";

function getNextHotelId(): string {
  let max = 0;
  for (const h of hotels) {
    const match = /^h(\d+)$/.exec(h.id);
    if (match) {
      max = Math.max(max, Number(match[1]));
    }
  }
  return `h${max + 1}`;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidStars(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

export function getAllHotels(_req: Request, res: Response) {
  return res.status(200).json(hotels);
}

export function createHotel(req: Request, res: Response) {
  const body = req.body as CreateHotelDto;

  if (
    !isNonEmptyString(body?.name) ||
    !isNonEmptyString(body?.city) ||
    !isValidStars(body?.stars)
  ) {
    return res.status(400).json({
      message: "Invalid payload. Required: name (string), city (string), stars (integer 1..5)",
    });
  }

  const newHotel: Hotel = {
    id: getNextHotelId(),
    name: body.name.trim(),
    city: body.city.trim(),
    stars: body.stars,
    createdAt: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
  };

  hotels.push(newHotel);
  return res.status(201).json(newHotel);
}

export function updateHotel(req: Request, res: Response) {
  const { id } = req.params;
  const body = req.body as UpdateHotelDto;

  const index = hotels.findIndex((h) => h.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Hotel not found" });
  }

  const existing = hotels[index];
  if (!existing) {
    // Defensive guard for strict TS
    return res.status(500).json({ message: "In-memory store corrupted" });
  }

  if (body.name !== undefined && !isNonEmptyString(body.name)) {
    return res.status(400).json({ message: "Invalid name" });
  }

  if (body.city !== undefined && !isNonEmptyString(body.city)) {
    return res.status(400).json({ message: "Invalid city" });
  }

  if (body.stars !== undefined && !isValidStars(body.stars)) {
    return res.status(400).json({ message: "Invalid stars (must be integer 1..5)" });
  }

  const updated: Hotel = {
    id: existing.id,
    createdAt: existing.createdAt,
    name: body.name !== undefined ? body.name.trim() : existing.name,
    city: body.city !== undefined ? body.city.trim() : existing.city,
    stars: body.stars !== undefined ? body.stars : existing.stars,
  };

  hotels[index] = updated;

  return res.status(200).json(updated);
}

export function deleteHotel(req: Request, res: Response) {
  const { id } = req.params;

  const index = hotels.findIndex((h) => h.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Hotel not found" });
  }

  const deleted = hotels.splice(index, 1)[0];
  return res.status(200).json(deleted);
}