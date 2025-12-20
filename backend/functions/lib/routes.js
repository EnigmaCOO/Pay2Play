"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const routes_js_1 = require("./auth-profiles/routes.js");
const routes_js_2 = require("./payments-discounts/routes.js");
const routes_js_3 = require("./booking/routes.js");
async function registerRoutes(app) {
    (0, routes_js_1.registerAuthRoutes)(app);
    (0, routes_js_2.registerPaymentsDiscountsRoutes)(app);
    (0, routes_js_3.registerBookingRoutes)(app);
    const httpServer = (0, http_1.createServer)(app);
    return httpServer;
}
//# sourceMappingURL=routes.js.map