import { Express } from "express";
import { createServer, type Server } from "http";
import { registerAuthRoutes } from "./auth-profiles/routes.js";
import { registerPaymentsDiscountsRoutes } from "./payments-discounts/routes.js";
import { registerBookingRoutes } from "./booking/routes.js";

export async function registerRoutes(app: Express): Promise<Server> {
  registerAuthRoutes(app);
  registerPaymentsDiscountsRoutes(app);
  registerBookingRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}