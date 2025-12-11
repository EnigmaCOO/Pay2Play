import { Request, Express } from "express";
import { authenticate, registerUser, loginUser } from "./auth.js";
import { storage } from "../storage.js";

export function registerAuthRoutes(app: Express) {
  // Authentication routes
  app.post("/api/register", registerUser);
  app.post("/api/login", loginUser);

  // ========== USERS ==========
  app.put("/api/users/:userId/skill-level", authenticate, async (req: Request, res) => {
    try {
      const { userId } = (req.params as any);
      const { skillLevel } = req.body as any;

      if (!skillLevel || !["beginner", "intermediate", "advanced"].includes(skillLevel)) {
        return res.status(400).json({ error: "Invalid skill level provided." });
      }

      await storage.updateUserSkillLevel(userId, skillLevel);
      return res.status(200).json({ message: "Skill level updated successfully." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== USER BLOCKING ==========
  app.post("/api/users/:userId/block", authenticate, async (req: Request, res) => {
    try {
      const { userId } = (req.params as any);
      const { blockedUserId } = req.body as any;

      if (!blockedUserId) {
        return res.status(400).json({ error: "blockedUserId is required" });
      }

      await storage.blockUser(userId, blockedUserId);
      return res.status(200).json({ message: "User blocked successfully." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/users/:userId/unblock", authenticate, async (req: Request, res) => {
    try {
      const { userId } = (req.params as any);
      const { blockedUserId } = req.body as any;

      if (!blockedUserId) {
        return res.status(400).json({ error: "blockedUserId is required" });
      }

      await storage.unblockUser(userId, blockedUserId);
      return res.status(200).json({ message: "User unblocked successfully." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/users/:userId/blocked", authenticate, async (req: Request, res) => {
    try {
      const { userId } = (req.params as any);
      const blockedUsers = await storage.getBlockedUsers(userId);
      return res.json(blockedUsers);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });
  
  // ========== USERS ==========
  app.post("/api/users/push-token", authenticate, async (req: Request, res) => {
    try {
      const { userId, expoPushToken } = req.body as any;
      
      if (!userId || !expoPushToken) {
        return res.status(400).json({ error: "userId and expoPushToken required" });
      }
      
      await storage.updateUserPushToken(userId, expoPushToken);
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });
}
