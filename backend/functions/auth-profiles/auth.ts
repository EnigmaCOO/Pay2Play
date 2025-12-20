import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";
import { Timestamp } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Cloud Function trigger that creates a user profile in Firestore
 * when a new Firebase Authentication user is created.
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  functions.logger.info(`New user created: ${user.uid}`, { email: user.email });

  const newUser = {
    id: user.uid,
    email: user.email || null,
    displayName: user.displayName || null,
    phoneNumber: user.phoneNumber || null,
    roles: ["player"], // Default role
    createdAt: Timestamp.now(),
    balancePkr: 0, // Default wallet balance
  };

  try {
    await db.collection("users").doc(user.uid).set(newUser);
    functions.logger.info(`Successfully created Firestore profile for user: ${user.uid}`);
  } catch (error) {
    functions.logger.error(`Error creating Firestore profile for user: ${user.uid}`, error);
  }
});

/**
 * Callable Cloud Function to allow users to update their own profile information.
 */
export const updateUserProfile = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const uid = context.auth.uid;
  const userProfileRef = db.collection("users").doc(uid);

  const allowedFields = ["displayName", "skillLevel", "expoPushToken"];
  const profileUpdateData: { [key: string]: any } = {};

  // Validate the incoming data to only allow specific fields to be updated.
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      profileUpdateData[field] = data[field];
    }
  }

  if (Object.keys(profileUpdateData).length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with at least one valid field to update."
    );
  }

  try {
    await userProfileRef.update(profileUpdateData);
    functions.logger.info(`User profile updated for UID: ${uid}`, profileUpdateData);
    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    functions.logger.error(`Error updating user profile for UID: ${uid}`, error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while updating the profile."
    );
  }
});


// Middleware to authenticate Firebase ID tokens
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided or invalid format" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    (req as any).user = decodedToken; // Attach user to request object
    return next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(403).json({ error: "Unauthorized" });
  }
};

// Function for user registration
export const registerUser = async (req: Request, res: Response) => {
  const { email, password, displayName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    return res.status(201).json({ uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName });
  } catch (error: any) {
    console.error("Error creating new user:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Function for user login (this typically happens on the client-side,
// but we can provide a custom token endpoint if needed for specific flows)
// For standard Firebase Auth, client-side SDKs handle login and token verification on the backend.
// This example assumes client-side login and token verification on the backend.
export const loginUser = async (req: Request, res: Response) => {
  // In a typical Firebase Auth flow, login happens on the client-side,
  // and the client sends the ID token to the backend for verification.
  // This endpoint could be used for custom token generation if a specific
  // backend-driven login flow is required, but for now, it's a placeholder
  // to illustrate where login-related backend logic would go.
  res.status(200).json({ message: "Login handled client-side. Send ID token for authenticated requests." });
};