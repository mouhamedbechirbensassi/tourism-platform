import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get("/", getDashboardStats);