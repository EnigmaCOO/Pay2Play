import * as functions from "firebase-functions";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { startAutoCancelScheduler } from "./booking/auto-cancel.js";
import { onUserCreate, updateUserProfile } from "./auth-profiles/auth.js";
import { createBooking, getAvailableSlots } from "./booking/booking.js";
import { createPaymentIntent } from "./payments-discounts/payments.js";
import { onBookingConfirmed } from "./notifications/notifications.js";
import { aiChat } from "./ai/chat.js";
import { createPromotion, getPromotions, updatePromotion, deletePromotion } from "./promotions/promotions.js";
import { fundDiscountPool, getDiscountPool } from "./discount-pools/discount-pools.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      functions.logger.info(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });
  
  startAutoCancelScheduler();
})();

export const api = functions.https.onRequest(app);
export { 
  onUserCreate, 
  updateUserProfile, 
  createBooking, 
  getAvailableSlots,
  createPaymentIntent,
  onBookingConfirmed,
  aiChat,
  createPromotion,
  getPromotions,
  updatePromotion,
  deletePromotion,
  fundDiscountPool,
  getDiscountPool
};