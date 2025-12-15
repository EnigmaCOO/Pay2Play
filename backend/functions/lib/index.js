"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiscountPool = exports.fundDiscountPool = exports.deletePromotion = exports.updatePromotion = exports.getPromotions = exports.createPromotion = exports.aiChat = exports.onBookingConfirmed = exports.createPaymentIntent = exports.getAvailableSlots = exports.createBooking = exports.updateUserProfile = exports.onUserCreate = exports.api = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const express_1 = __importDefault(require("express"));
const routes_js_1 = require("./routes.js");
const auto_cancel_js_1 = require("./booking/auto-cancel.js");
const auth_js_1 = require("./auth-profiles/auth.js");
Object.defineProperty(exports, "onUserCreate", { enumerable: true, get: function () { return auth_js_1.onUserCreate; } });
Object.defineProperty(exports, "updateUserProfile", { enumerable: true, get: function () { return auth_js_1.updateUserProfile; } });
const booking_js_1 = require("./booking/booking.js");
Object.defineProperty(exports, "createBooking", { enumerable: true, get: function () { return booking_js_1.createBooking; } });
Object.defineProperty(exports, "getAvailableSlots", { enumerable: true, get: function () { return booking_js_1.getAvailableSlots; } });
const payments_js_1 = require("./payments-discounts/payments.js");
Object.defineProperty(exports, "createPaymentIntent", { enumerable: true, get: function () { return payments_js_1.createPaymentIntent; } });
const notifications_js_1 = require("./notifications/notifications.js");
Object.defineProperty(exports, "onBookingConfirmed", { enumerable: true, get: function () { return notifications_js_1.onBookingConfirmed; } });
const chat_js_1 = require("./ai/chat.js");
Object.defineProperty(exports, "aiChat", { enumerable: true, get: function () { return chat_js_1.aiChat; } });
const promotions_js_1 = require("./promotions/promotions.js");
Object.defineProperty(exports, "createPromotion", { enumerable: true, get: function () { return promotions_js_1.createPromotion; } });
Object.defineProperty(exports, "getPromotions", { enumerable: true, get: function () { return promotions_js_1.getPromotions; } });
Object.defineProperty(exports, "updatePromotion", { enumerable: true, get: function () { return promotions_js_1.updatePromotion; } });
Object.defineProperty(exports, "deletePromotion", { enumerable: true, get: function () { return promotions_js_1.deletePromotion; } });
const discount_pools_js_1 = require("./discount-pools/discount-pools.js");
Object.defineProperty(exports, "fundDiscountPool", { enumerable: true, get: function () { return discount_pools_js_1.fundDiscountPool; } });
Object.defineProperty(exports, "getDiscountPool", { enumerable: true, get: function () { return discount_pools_js_1.getDiscountPool; } });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse = undefined;
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
    await (0, routes_js_1.registerRoutes)(app);
    app.use((err, _req, res, _next) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        throw err;
    });
    (0, auto_cancel_js_1.startAutoCancelScheduler)();
})();
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map