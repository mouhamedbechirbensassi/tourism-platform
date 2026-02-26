import { Router } from "express";
import { createHotel, deleteHotel, getAllHotels, updateHotel } from "../controllers/hotels.controller";

export const hotelsRouter = Router();

hotelsRouter.get("/", getAllHotels);
hotelsRouter.post("/", createHotel);
hotelsRouter.put("/:id", updateHotel);
hotelsRouter.delete("/:id", deleteHotel);