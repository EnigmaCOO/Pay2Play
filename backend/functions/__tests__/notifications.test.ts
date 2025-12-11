import { notifications } from "../notifications/notifications.js";

describe("notifications helpers", () => {
  it("creates refundIssued payload", () => {
    const payload = notifications.refundIssued(500);
    expect(payload.title).toContain("Refund");
    expect(payload.body).toContain("500");
  });

  it("creates waitlistSpotOpen payload", () => {
    const payload = notifications.waitlistSpotOpen("game-123", "token-abc");
    expect(payload.body).toContain("game-123");
    expect(payload.body).toContain("token-abc");
  });
});

